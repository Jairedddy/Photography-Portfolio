export type EasingName = 'easeInOutCubic' | 'easeOutExpo';

export type SmoothScrollTarget = HTMLElement | string | number | null;

export interface SmoothScrollOptions {
  duration?: number;
  easing?: EasingName | ((t: number) => number);
  offset?: number;
  context?: HTMLElement | Window;
  onUpdate?: (progress: number) => void;
  onComplete?: () => void;
  cancelPrevious?: boolean;
}

type ScrollState = {
  rafId: number | null;
};

const easingFns: Record<EasingName, (t: number) => number> = {
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  easeOutExpo: (t: number) =>
    t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
};

const activeScrollState: ScrollState = { rafId: null };

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const resolveTargetY = (target: SmoothScrollTarget, offset = 0): number | null => {
  if (typeof window === 'undefined') return null;

  if (target === null) {
    return null;
  }

  if (typeof target === 'number') {
    return target + offset;
  }

  if (typeof target === 'string') {
    const el = document.querySelector<HTMLElement>(target);
    if (!el) return null;
    return el.getBoundingClientRect().top + window.pageYOffset + offset;
  }

  return target.getBoundingClientRect().top + window.pageYOffset + offset;
};

export const smoothScroll = (
  target: SmoothScrollTarget,
  {
    duration = 900,
    easing = 'easeInOutCubic',
    offset = 0,
    context = window,
    onUpdate,
    onComplete,
    cancelPrevious = true,
  }: SmoothScrollOptions = {}
) => {
  if (typeof window === 'undefined') return;

  const destination = resolveTargetY(target, offset);
  if (destination === null) return;

  const easingFn =
    typeof easing === 'function' ? easing : easingFns[easing] ?? easingFns.easeInOutCubic;

  const useWindowScroll = typeof Window !== 'undefined' && context instanceof Window;
  const rootElement = useWindowScroll
    ? (document.scrollingElement as HTMLElement | null) ?? document.documentElement
    : (context as HTMLElement);

  if (!rootElement) return;

  const start = useWindowScroll ? window.scrollY : rootElement.scrollTop;
  const distance = destination - start;

  if (prefersReducedMotion()) {
    if (useWindowScroll) {
      window.scrollTo(0, destination);
    } else {
      rootElement.scrollTop = destination;
    }
    onUpdate?.(1);
    onComplete?.();
    return;
  }

  const startTime = performance.now();

  const step = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(1, elapsed / duration);
    const eased = easingFn(progress);
    const next = start + distance * eased;

    if (useWindowScroll) {
      window.scrollTo(0, next);
    } else {
      rootElement.scrollTop = next;
    }

    onUpdate?.(progress);

    if (progress < 1) {
      activeScrollState.rafId = requestAnimationFrame(step);
    } else {
      onComplete?.();
      activeScrollState.rafId = null;
    }
  };

  if (cancelPrevious && activeScrollState.rafId) {
    cancelAnimationFrame(activeScrollState.rafId);
    activeScrollState.rafId = null;
  }

  activeScrollState.rafId = requestAnimationFrame(step);
};

export const scrollToSection = (
  selector: string,
  options?: Omit<SmoothScrollOptions, 'context'>
) => smoothScroll(selector, options);
