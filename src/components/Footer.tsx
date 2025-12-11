import React, { useState } from 'react';
import { Theme } from '../types';

interface FooterProps {
  theme: Theme;
}

const Footer: React.FC<FooterProps> = ({ theme }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { currentTarget, clientX, clientY } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    
    // Calculate normalized position (-1 to 1) from the center of the footer
    const x = (clientX - (left + width / 2)) / (width / 2);
    const y = (clientY - (top + height / 2)) / (height / 2);

    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    // Reset to center when mouse leaves
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <footer 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="py-12 border-t transition-colors duration-500 overflow-hidden relative"
    >
      
      <div className={`relative z-10 ${theme === Theme.VIBRANT ? 'border-gray-200 text-black' : 'border-neutral-900 text-white'}`}>
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div 
          className="text-center md:text-left transition-transform duration-500 ease-out will-change-transform"
          style={{ transform: `translate(${mousePos.x * -10}px, ${mousePos.y * -10}px)` }}
        >
          <h4 className="serif text-2xl">Jai Reddy</h4>
          <p className="text-xs uppercase tracking-widest opacity-50 mt-1">Monochrome Portfolio</p>
        </div>
        
        <div 
          className="flex gap-6 text-sm opacity-60 transition-transform duration-500 ease-out will-change-transform"
          style={{ transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)` }}
        >
          <a href="#" className="hover:opacity-100 transition-opacity">Instagram</a>
          <a href="#" className="hover:opacity-100 transition-opacity">Twitter</a>
          <a href="#" className="hover:opacity-100 transition-opacity">Email</a>
        </div>

        <div 
          className="text-xs opacity-30 transition-transform duration-500 ease-out will-change-transform"
          style={{ transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 10}px)` }}
        >
          &copy; {new Date().getFullYear()} Jai. All rights reserved.
        </div>
      </div>
      </div>
    </footer>
  );
};

export default Footer;