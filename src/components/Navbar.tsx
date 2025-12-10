import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Theme } from '../types';
import { Sun, Moon } from 'lucide-react';

interface NavbarProps {
  theme: Theme;
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();
  
  useEffect(() => {
    const handleScrollListener = () => {
      const scrollY = window.scrollY;
      const scrollThreshold = 50;
      const maxScroll = 200; // Maximum scroll for full effect
      
      setIsScrolled(scrollY > scrollThreshold);
      
      // Calculate scroll progress (0 to 1)
      const progress = Math.min(scrollY / maxScroll, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScrollListener, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollListener);
  }, []);

  // Calculate dynamic styles based on scroll progress
  const backdropOpacity = isScrolled ? Math.min(0.9, 0.5 + scrollProgress * 0.4) : 0;
  const blurAmount = isScrolled ? Math.min(12, 8 + scrollProgress * 4) : 0;
  const borderOpacity = isScrolled ? Math.min(1, scrollProgress) : 0;
  const paddingY = isScrolled ? 0 : 16;
  const shadowOpacity = isScrolled ? Math.min(0.15, scrollProgress * 0.15) : 0;

  return (
    <nav 
      className="fixed top-0 left-0 w-full z-50 transition-all duration-700 ease-out"
      style={{
        paddingTop: `${paddingY}px`,
        paddingBottom: `${paddingY}px`,
        backdropFilter: `blur(${blurAmount}px)`,
        WebkitBackdropFilter: `blur(${blurAmount}px)`,
        backgroundColor: isScrolled 
          ? (theme === Theme.LIGHT 
              ? `rgba(250, 250, 250, ${backdropOpacity})` 
              : `rgba(0, 0, 0, ${backdropOpacity})`)
          : 'transparent',
        borderBottom: isScrolled 
          ? `1px solid ${theme === Theme.LIGHT 
              ? `rgba(229, 231, 235, ${borderOpacity})` 
              : `rgba(23, 23, 23, ${borderOpacity})`}`
          : '1px solid transparent',
        boxShadow: shadowOpacity > 0 
          ? `0 1px 3px 0 rgba(0, 0, 0, ${shadowOpacity})`
          : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link 
          to="/"
          className="flex items-center gap-3 group cursor-pointer"
        >
          <span className={`text-xl tracking-widest font-bold uppercase transition-all duration-300 group-hover:tracking-[0.3em] ${theme === Theme.LIGHT ? 'text-black' : 'text-white'}`}>
            JR
          </span>
        </Link>

        <div className="flex items-center gap-8">
          <ul className="hidden md:flex items-center gap-8">
            <li className="relative group">
              <Link 
                to="/"
                className={`block text-sm tracking-widest uppercase hover:opacity-50 transition-opacity ${theme === Theme.LIGHT ? 'text-black' : 'text-neutral-300'} ${location.pathname === '/' ? 'opacity-100' : 'opacity-70'}`}
              >
                Works
              </Link>
              <span className={`
                absolute left-1/2 -translate-x-1/2 top-full mt-5
                opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out
                translate-y-2 group-hover:translate-y-0
                pointer-events-none whitespace-nowrap
                px-3 py-1.5 text-[9px] font-bold tracking-[0.2em] uppercase
                ${theme === Theme.LIGHT ? 'bg-black text-white' : 'bg-white text-black'}
              `}>
                Portfolio
                <span className={`absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent ${theme === Theme.LIGHT ? 'border-b-black' : 'border-b-white'}`}></span>
              </span>
            </li>
            <li className="relative group">
              <Link 
                to="/about"
                className={`block text-sm tracking-widest uppercase hover:opacity-50 transition-opacity ${theme === Theme.LIGHT ? 'text-black' : 'text-neutral-300'} ${location.pathname === '/about' ? 'opacity-100' : 'opacity-70'}`}
              >
                About
              </Link>
              <span className={`
                absolute left-1/2 -translate-x-1/2 top-full mt-5
                opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out
                translate-y-2 group-hover:translate-y-0
                pointer-events-none whitespace-nowrap
                px-3 py-1.5 text-[9px] font-bold tracking-[0.2em] uppercase
                ${theme === Theme.LIGHT ? 'bg-black text-white' : 'bg-white text-black'}
              `}>
                The Artist
                <span className={`absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent ${theme === Theme.LIGHT ? 'border-b-black' : 'border-b-white'}`}></span>
              </span>
            </li>
            <li className="relative group">
              <Link 
                to="/contact"
                className={`block text-sm tracking-widest uppercase hover:opacity-50 transition-opacity ${theme === Theme.LIGHT ? 'text-black' : 'text-neutral-300'} ${location.pathname === '/contact' ? 'opacity-100' : 'opacity-70'}`}
              >
                Contact
              </Link>
              <span className={`
                absolute left-1/2 -translate-x-1/2 top-full mt-5
                opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out
                translate-y-2 group-hover:translate-y-0
                pointer-events-none whitespace-nowrap
                px-3 py-1.5 text-[9px] font-bold tracking-[0.2em] uppercase
                ${theme === Theme.LIGHT ? 'bg-black text-white' : 'bg-white text-black'}
              `}>
                Say Hello
                <span className={`absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent ${theme === Theme.LIGHT ? 'border-b-black' : 'border-b-white'}`}></span>
              </span>
            </li>
          </ul>
          
          {/* Theme Toggle Wrapper */}
          <div className="relative group">
            <button 
              onClick={toggleTheme}
              className={`
                relative p-2 rounded-full overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
                hover:scale-110 active:scale-95
                ${theme === Theme.LIGHT 
                  ? 'bg-gray-100 text-black hover:shadow-[0_0_20px_-5px_rgba(0,0,0,0.15)] ring-1 ring-black/5' 
                  : 'bg-neutral-800 text-white hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.25)] ring-1 ring-white/10'
                }
              `}
              aria-label="Toggle Theme"
            >
              <div className="relative w-5 h-5">
                  {/* Moon (Shows when Light, to switch to Dark) */}
                  <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 transform ${
                      theme === Theme.LIGHT ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
                  }`}>
                      <Moon size={18} className="fill-current opacity-80" />
                  </div>

                  {/* Sun (Shows when Dark, to switch to Light) */}
                  <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 transform ${
                      theme === Theme.DARK ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'
                  }`}>
                      <Sun size={18} className="fill-current opacity-80" />
                  </div>
              </div>
            </button>

            {/* Tooltip */}
            <span className={`
              absolute top-full mt-4 right-0
              opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out
              translate-y-2 group-hover:translate-y-0
              pointer-events-none whitespace-nowrap
              px-3 py-1.5 text-[9px] font-bold tracking-[0.2em] uppercase
              ${theme === Theme.LIGHT ? 'bg-black text-white' : 'bg-white text-black'}
            `}>
              {theme === Theme.LIGHT ? 'Dark Mode' : 'Light Mode'}
              {/* Arrow */}
              <span className={`absolute bottom-full right-3 border-4 border-transparent ${theme === Theme.LIGHT ? 'border-b-black' : 'border-b-white'}`}></span>
            </span>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;