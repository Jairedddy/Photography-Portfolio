import React, { useEffect, useState } from 'react';
import { Theme } from '../types';

interface ScrollProgressBarProps {
  theme: Theme;
}

const ScrollProgressBar: React.FC<ScrollProgressBarProps> = ({ theme }) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollableHeight = documentHeight - windowHeight;
      const progress = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 right-0 h-1 z-[10000] pointer-events-none"
      style={{
        background: theme === Theme.VIBRANT
          ? 'linear-gradient(90deg, rgba(147, 51, 234, 0.2), rgba(236, 72, 153, 0.2), rgba(249, 115, 22, 0.2), rgba(59, 130, 246, 0.2), rgba(16, 185, 129, 0.2), rgba(234, 179, 8, 0.2))'
          : 'rgba(255, 255, 255, 0.1)'
      }}
    >
      <div
        className="h-full transition-all duration-150 ease-out"
        style={{
          width: `${scrollProgress}%`,
          background: theme === Theme.VIBRANT
            ? 'linear-gradient(90deg, #9333ea, #ec4899, #f97316, #3b82f6, #10b981, #eab308)'
            : 'linear-gradient(90deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4))',
          boxShadow: theme === Theme.VIBRANT
            ? '0 0 10px rgba(147, 51, 234, 0.5), 0 0 20px rgba(236, 72, 153, 0.3)'
            : '0 0 10px rgba(255, 255, 255, 0.3)'
        }}
      />
    </div>
  );
};

export default ScrollProgressBar;

