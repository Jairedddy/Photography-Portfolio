import { useEffect, useRef } from 'react';
import Lenis, { LenisOptions } from 'lenis';

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Sets up a global Lenis instance for smooth scrolling.
 * The instance is stored on window.__lenis so other components
 * (like horizontal scroll sections) can listen to the virtual scroll value.
 */
export const useLenis = (options?: LenisOptions) => {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Avoid duplicate instances (React StrictMode double-invoke)
    if (window.__lenis) {
      lenisRef.current = window.__lenis;
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true, // Disable smooth scrolling for better performance and immediate scroll updates
      lerp: 0.1,
      ...options,
    });

    lenisRef.current = lenis;
    window.__lenis = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };

    rafRef.current = requestAnimationFrame(raf);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lenis.destroy();
      lenisRef.current = null;
      delete window.__lenis;
    };
  }, [options]);

  return lenisRef;
};

