import { useEffect } from 'react';
import { Theme } from '../types';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const THEME_MULTIPLIER: Record<Theme, number> = {
  [Theme.MONOCHROME]: 1.25,
  [Theme.VIBRANT]: 0.85,
};

const computeOpacity = (theme: Theme) => {
  const scrollY = window.scrollY;
  const viewportHeight = window.innerHeight || 1;
  const scrollFactor = clamp(scrollY / viewportHeight, 0, 1);
  const baseOpacity = 0.03 + scrollFactor * 0.02;
  const themedOpacity = baseOpacity * THEME_MULTIPLIER[theme];
  return clamp(themedOpacity, 0.02, 0.12);
};

/**
 * Keeps the global grain overlay opacity in sync with scroll position + theme.
 */
export const useScrollGrain = (theme: Theme) => {
  useEffect(() => {
    const overlay = document.querySelector<HTMLElement>('.grain-overlay');
    if (!overlay) {
      return;
    }

    overlay.style.transition = overlay.style.transition || 'opacity 400ms ease-out';

    const updateOpacity = () => {
      const opacity = computeOpacity(theme);
      overlay.style.opacity = opacity.toFixed(3);
    };

    updateOpacity();

    window.addEventListener('scroll', updateOpacity, { passive: true });
    window.addEventListener('resize', updateOpacity);

    return () => {
      window.removeEventListener('scroll', updateOpacity);
      window.removeEventListener('resize', updateOpacity);
    };
  }, [theme]);
};

export default useScrollGrain;
