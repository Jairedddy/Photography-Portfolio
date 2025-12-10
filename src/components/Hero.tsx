import React, { useEffect, useState } from 'react';
import { Theme } from '../types';

interface HeroProps {
  theme: Theme;
}

const Hero: React.FC<HeroProps> = ({ theme }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative h-screen flex flex-col justify-center items-center overflow-hidden perspective-1000">
      {/* Parallax Background Text */}
      <div 
        className="absolute w-full text-center select-none pointer-events-none opacity-[0.03]"
        style={{ transform: `translateY(${scrollY * 0.4}px) scale(${1 + scrollY * 0.0005})` }}
      >
        <h1 className={`text-[15rem] md:text-[25rem] leading-none font-bold serif tracking-tighter ${theme === Theme.LIGHT ? 'text-black' : 'text-white'}`}>
          JAI REDDY
        </h1>
      </div>

      <div className="z-10 text-center space-y-8 px-4 mix-blend-difference">
        <p className="text-sm md:text-base tracking-[0.5em] uppercase text-white animate-[fadeIn_1.5s_ease-out_0.2s_forwards] opacity-0">
          World Through My Eyes (and Camera)
        </p>
        
        <div className="overflow-hidden">
          <h2 className="text-6xl md:text-9xl font-light serif text-white animate-[slideUpReveal_1.5s_cubic-bezier(0.2,1,0.3,1)_0.5s_forwards] translate-y-full opacity-0">
            Capturing Silence
          </h2>
        </div>
        
        <div className="w-px h-24 bg-white mx-auto opacity-0 animate-[growHeight_1s_ease-out_1.5s_forwards]" />
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; filter: blur(10px); }
          to { opacity: 0.7; filter: blur(0); }
        }
        @keyframes slideUpReveal {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes growHeight {
          from { height: 0; opacity: 0; }
          to { height: 6rem; opacity: 0.4; }
        }
      `}</style>
    </section>
  );
};

export default Hero;