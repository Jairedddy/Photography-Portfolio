import { MutableRefObject, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

interface ParallaxReturn<T extends HTMLElement> {
  ref: MutableRefObject<T | null>;
  offset: number;
  style: CSSProperties;
}

/**
 * Provides a translateY offset for an element based on its distance from the viewport center.
 * Uses IntersectionObserver + scroll listeners for smooth, scroll-linked parallax motion.
 */
export const useParallax = <T extends HTMLElement>(speed = 0.15): ParallaxReturn<T> => {
  const targetRef = useRef<T | null>(null);
  const [offset, setOffset] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const element = targetRef.current;
    if (!element || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting);
        if (!entry.isIntersecting) {
          setOffset(0);
        }
      },
      {
        rootMargin: '150px 0px',
        threshold: 0.05,
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isActive || typeof window === 'undefined') {
      return;
    }

    let frameId: number | null = null;

    const updateOffset = () => {
      const element = targetRef.current;
      if (!element) {
        return;
      }

      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = viewportHeight / 2;
      const distanceFromCenter = elementCenter - viewportCenter;
      const normalizedDistance = clamp(distanceFromCenter / viewportHeight, -1.5, 1.5);
      const offsetPx = normalizedDistance * speed * 220;
      setOffset(offsetPx);
    };

    const requestUpdate = () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      frameId = requestAnimationFrame(updateOffset);
    };

    requestUpdate();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, [isActive, speed]);

  return {
    ref: targetRef,
    offset,
    style: {
      transform: `translate3d(0, ${offset.toFixed(2)}px, 0)`,
      willChange: 'transform',
    },
  };
};

export default useParallax;
