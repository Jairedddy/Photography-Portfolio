import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSwipeable, SwipeEventData } from 'react-swipeable';

type Axis = 'horizontal' | 'vertical' | 'both';

type Vector2 = {
  x: number;
  y: number;
};

export interface UseSwipeGestureOptions {
  axis?: Axis;
  threshold?: number;
  maxOffset?: number;
  momentum?: boolean;
  momentumDecay?: number;
  preventDefault?: boolean;
  trackMouse?: boolean;
  enabled?: boolean;
  onSwipeStart?: (event: SwipeEventData) => void;
  onSwipeEnd?: (event: SwipeEventData) => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export interface UseSwipeGestureReturn {
  bind: ReturnType<typeof useSwipeable>;
  offset: Vector2;
  velocity: Vector2;
  direction: SwipeEventData['dir'] | null;
  isSwiping: boolean;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const getSignedDelta = (event: SwipeEventData, axis: 'horizontal' | 'vertical') => {
  if (axis === 'horizontal') {
    if (event.dir === 'Left') return -event.absX;
    if (event.dir === 'Right') return event.absX;
    return event.deltaX ?? 0;
  }

  if (event.dir === 'Up') return -event.absY;
  if (event.dir === 'Down') return event.absY;
  return event.deltaY ?? 0;
};

export const useSwipeGesture = (
  options: UseSwipeGestureOptions = {}
): UseSwipeGestureReturn => {
  const {
    axis = 'both',
    threshold = 35,
    maxOffset = 160,
    momentum = true,
    momentumDecay = 0.9,
    preventDefault = true,
    trackMouse = false,
    enabled = true,
    onSwipeStart,
    onSwipeEnd,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
  } = options;

  const allowHorizontal = axis === 'horizontal' || axis === 'both';
  const allowVertical = axis === 'vertical' || axis === 'both';

  const [state, setState] = useState({
    offset: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    direction: null as SwipeEventData['dir'] | null,
    isSwiping: false,
  });

  const offsetRef = useRef(state.offset);
  const velocityRef = useRef(state.velocity);
  const lastMoveRef = useRef<{ time: number; offset: Vector2 }>({
    time: performance.now(),
    offset: { x: 0, y: 0 },
  });
  const animationRef = useRef<number | null>(null);
  const startedRef = useRef(false);

  const setOffset = useCallback(
    (next: Vector2) => {
      const constrained: Vector2 = {
        x: allowHorizontal ? clamp(next.x, -maxOffset, maxOffset) : 0,
        y: allowVertical ? clamp(next.y, -maxOffset, maxOffset) : 0,
      };
      offsetRef.current = constrained;
      setState((prev) => ({ ...prev, offset: constrained }));
    },
    [allowHorizontal, allowVertical, maxOffset]
  );

  const setVelocity = useCallback((next: Vector2) => {
    velocityRef.current = next;
    setState((prev) => ({ ...prev, velocity: next }));
  }, []);

  const stopMomentum = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  const startMomentum = useCallback(() => {
    if (!momentum) {
      setOffset({ x: 0, y: 0 });
      setState((prev) => ({ ...prev, isSwiping: false }));
      return;
    }

    stopMomentum();

    const step = () => {
      const next: Vector2 = {
        x: offsetRef.current.x + velocityRef.current.x,
        y: offsetRef.current.y + velocityRef.current.y,
      };

      setOffset(next);

      const nextVelocity: Vector2 = {
        x: velocityRef.current.x * momentumDecay,
        y: velocityRef.current.y * momentumDecay,
      };
      setVelocity(nextVelocity);

      const hasVelocity =
        Math.abs(nextVelocity.x) > 0.1 || Math.abs(nextVelocity.y) > 0.1;

      if (!hasVelocity && Math.abs(next.x) < 0.5 && Math.abs(next.y) < 0.5) {
        setOffset({ x: 0, y: 0 });
        setState((prev) => ({ ...prev, isSwiping: false }));
        animationRef.current = null;
        return;
      }

      animationRef.current = requestAnimationFrame(step);
    };

    animationRef.current = requestAnimationFrame(step);
  }, [momentum, momentumDecay, setOffset, setVelocity, stopMomentum]);

  useEffect(() => stopMomentum, [stopMomentum]);

  const handleSwiping = useCallback(
    (event: SwipeEventData) => {
      if (!enabled) return;

      if (event.first) {
        stopMomentum();
        startedRef.current = true;
        lastMoveRef.current = { time: performance.now(), offset: offsetRef.current };
        setState((prev) => ({ ...prev, isSwiping: true }));
        onSwipeStart?.(event);
      }

      const horizontalDelta = allowHorizontal ? getSignedDelta(event, 'horizontal') : 0;
      const verticalDelta = allowVertical ? getSignedDelta(event, 'vertical') : 0;
      const nextOffset = { x: horizontalDelta, y: verticalDelta };
      setOffset(nextOffset);

      const now = performance.now();
      const timeDelta = Math.max(1, now - lastMoveRef.current.time);
      const deltaDiff: Vector2 = {
        x: nextOffset.x - lastMoveRef.current.offset.x,
        y: nextOffset.y - lastMoveRef.current.offset.y,
      };
      const velocityPerFrame: Vector2 = {
        x: (deltaDiff.x / timeDelta) * 16,
        y: (deltaDiff.y / timeDelta) * 16,
      };

      setVelocity(velocityPerFrame);
      lastMoveRef.current = { time: now, offset: nextOffset };

      setState((prev) => ({ ...prev, direction: event.dir }));
    },
    [
      allowHorizontal,
      allowVertical,
      enabled,
      onSwipeStart,
      setOffset,
      setVelocity,
      stopMomentum,
    ]
  );

  const handleSwiped = useCallback(
    (event: SwipeEventData) => {
      if (!enabled || !startedRef.current) return;
      startedRef.current = false;
      onSwipeEnd?.(event);
      startMomentum();
    },
    [enabled, onSwipeEnd, startMomentum]
  );

  const handlers = useSwipeable({
    onSwiping: handleSwiping,
    onSwiped: handleSwiped,
    onSwipedLeft: () => {
      if (enabled) onSwipeLeft?.();
    },
    onSwipedRight: () => {
      if (enabled) onSwipeRight?.();
    },
    onSwipedUp: () => {
      if (enabled) onSwipeUp?.();
    },
    onSwipedDown: () => {
      if (enabled) onSwipeDown?.();
    },
    trackMouse,
    trackTouch: true,
    preventScrollOnSwipe: preventDefault,
    delta: threshold,
    touchEventOptions: { passive: !preventDefault },
  });

  const memoizedHandlers = useMemo(
    () => ({
      ...handlers,
    }),
    [handlers]
  );

  return {
    bind: memoizedHandlers,
    offset: state.offset,
    velocity: state.velocity,
    direction: state.direction,
    isSwiping: state.isSwiping,
  };
};
