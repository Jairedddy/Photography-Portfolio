import { MutableRefObject, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

interface TypographyAnimationOptions {
  intensity?: number;
  letterSpacingRange?: number;
  scrollStart?: number;
  scrollEnd?: number;
  easing?: (value: number) => number;
  disabled?: boolean;
}

interface TypographyAnimationReturn<T extends HTMLElement> {
  ref: MutableRefObject<T | null>;
  style: CSSProperties;
  progress: number;
}

/**
 * Adds a subtle breathing effect to typography by scaling and adjusting letter spacing
 * as the element travels through a configurable scroll range in the viewport.
 */
export const useTypographyAnimation = <T extends HTMLElement>(
  options: TypographyAnimationOptions = {}
): TypographyAnimationReturn<T> => {
  const {
    intensity = 0.1,
    letterSpacingRange = 0.08,
    scrollStart = 0.15,
    scrollEnd = 0.85,
    easing = easeOutCubic,
    disabled = false,
  } = options;

  const targetRef = useRef<T | null>(null);
  const [style, setStyle] = useState<CSSProperties>({
    transform: 'scale(1)',
    letterSpacing: '0em',
    willChange: 'transform, letter-spacing',
  });
  const [progress, setProgress] = useState(0);
  const reduceMotionRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reduceMotionRef.current = mediaQuery.matches;

    const handleChange = (event: MediaQueryListEvent) => {
      reduceMotionRef.current = event.matches;
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const element = targetRef.current;
    if (!element) {
      return;
    }

    let frameId: number | null = null;

    const updateStyles = () => {
      const el = targetRef.current;
      if (!el) {
        return;
      }

      if (reduceMotionRef.current || disabled) {
        setStyle({
          transform: 'scale(1)',
          letterSpacing: '0em',
          willChange: 'auto',
        });
        setProgress(0);
        return;
      }

      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
      const elementCenter = rect.top + rect.height / 2;
      const start = viewportHeight * scrollStart;
      const end = viewportHeight * scrollEnd;
      const denominator = Math.max(end - start, 1);
      const rawProgress = (elementCenter - start) / denominator;
      const clampedProgress = clamp(rawProgress, 0, 1);
      const easedProgress = clamp(easing(clampedProgress), 0, 1);
      const scale = 1 + Math.sin(clampedProgress * Math.PI) * intensity;
      const letterSpacing = (1 - easedProgress) * letterSpacingRange;

      setProgress(clampedProgress);
      setStyle({
        transform: `scale(${scale.toFixed(4)})`,
        letterSpacing: `${letterSpacing.toFixed(3)}em`,
        transition: 'transform 180ms ease-out, letter-spacing 180ms ease-out',
        willChange: 'transform, letter-spacing',
      });
    };

    const handleScroll = () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      frameId = window.requestAnimationFrame(updateStyles);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [disabled, easing, intensity, letterSpacingRange, scrollEnd, scrollStart]);

  return {
    ref: targetRef,
    style,
    progress,
  };
};

export default useTypographyAnimation;
