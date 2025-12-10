import React, { useEffect, useState } from 'react';
import { Theme } from '../types';

interface CustomCursorProps {
  theme: Theme;
}

const CustomCursor: React.FC<CustomCursorProps> = ({ theme }) => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if target is clickable (button, link, input) or has specific class
      const isClickable = 
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.cursor-pointer') ||
        window.getComputedStyle(target).cursor === 'pointer';

      setIsHovering(!!isClickable);
    };

    // Hide default cursor
    document.documentElement.style.cursor = 'none';

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);

    return () => {
      document.documentElement.style.cursor = 'auto';
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
    };
  }, [isVisible]);

  // Determine colors based on theme and hover state
  const dotColor = isHovering 
    ? (theme === Theme.DARK ? 'black' : 'white')
    : (theme === Theme.DARK ? 'white' : 'black');
  
  const ringColor = theme === Theme.DARK ? 'white' : 'black';

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Small dot - precise pointer */}
      <div
        className={`absolute w-2 h-2 rounded-full will-change-transform transition-colors duration-300`}
        style={{
          backgroundColor: dotColor,
          left: 0,
          top: 0,
          transform: `translate(${position.x - 4}px, ${position.y - 4}px)`,
          opacity: isVisible ? 1 : 0,
        }}
      />
      
      {/* Larger circle - follows with lag/smoothness and reacts to hover */}
      <div 
        className={`absolute w-10 h-10 rounded-full transition-all duration-300 ease-out will-change-transform flex items-center justify-center`}
        style={{
           borderColor: ringColor,
           borderWidth: '1px',
           borderStyle: 'solid',
           left: 0,
           top: 0,
           transform: `translate(${position.x - 20}px, ${position.y - 20}px) scale(${isHovering ? 1.8 : 1})`,
           opacity: isVisible ? (isHovering ? 1 : 0.5) : 0,
           backgroundColor: 'transparent',
        }}
      />
    </div>
  );
};

export default CustomCursor;