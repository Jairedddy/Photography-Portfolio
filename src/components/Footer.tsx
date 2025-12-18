import React from 'react';
import { Theme } from '../types';

interface FooterProps {
  theme: Theme;
}

const Footer: React.FC<FooterProps> = ({ theme }) => {
  return (
    <footer 
      id="footer"
      data-scroll-section="footer"
      data-scroll-label="Contact"
      className="snap-section py-12 border-t transition-colors duration-500 overflow-hidden relative"
      style={{
        backgroundColor: 'transparent',
      }}
    >
      
      <div className={`relative z-10 ${theme === Theme.VIBRANT ? 'border-gray-200 text-black' : 'border-neutral-900 text-white'}`}>
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h4 className="serif text-2xl">Jai Reddy</h4>
        </div>
        
        <div className="flex gap-6 text-sm opacity-60">
          <a href="https://instagram.com/jai_redddy" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity">Instagram</a>
          <a href="#" className="hover:opacity-100 transition-opacity">Twitter</a>
          <a href="mailto:jaishukreddy7@gmail.com" className="hover:opacity-100 transition-opacity">Email</a>
        </div>

        <div className="text-xs opacity-30">
          &copy; {new Date().getFullYear()} Jai. All rights reserved.
        </div>
      </div>
      </div>
    </footer>
  );
};

export default Footer;
