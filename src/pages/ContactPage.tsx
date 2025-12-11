import React from 'react';
import { Theme } from '../types';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CustomCursor from '../components/CustomCursor';
import { useTypographyAnimation } from '../hooks/useTypographyAnimation';

interface ContactPageProps {
  theme: Theme;
  toggleTheme: () => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ theme, toggleTheme }) => {
  const contactHeadingAnimation = useTypographyAnimation<HTMLHeadingElement>({
    intensity: 0.11,
    letterSpacingRange: 0.06,
  });

  return (
    <div className={`min-h-screen transition-colors duration-700 ${theme === Theme.VIBRANT ? 'bg-[#fafafa]' : 'bg-neutral-950'}`}>
      <CustomCursor theme={theme} />
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      
      <section 
        className="relative min-h-screen flex flex-col justify-center items-center py-32 px-6"
      >
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-10 text-center">
          <h2
            ref={contactHeadingAnimation.ref}
            style={contactHeadingAnimation.style}
            className={`text-5xl md:text-7xl serif italic ${theme === Theme.VIBRANT ? 'text-black' : 'text-white'}`}
          >
            Let's Create
          </h2>
          
          <p className={`text-lg md:text-xl leading-relaxed font-light max-w-2xl ${theme === Theme.VIBRANT ? 'text-gray-600' : 'text-neutral-400'}`}>
            Interested in collaborating or commissioning a project? 
            Let's discuss how we can bring your vision to life through the art of monochrome photography.
          </p>
          
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center pt-8">
            <a 
              href="mailto:jaishukreddy7@gmail.com" 
              className={`text-xl md:text-2xl border-b pb-2 hover:pb-4 transition-all duration-300 tracking-widest ${theme === Theme.VIBRANT ? 'border-black text-black' : 'border-white text-white'}`}
            >
              jaishukreddy7@gmail.com
            </a>
          </div>

          <div className="pt-12 flex gap-8 text-sm opacity-60">
            <a 
              href="#" 
              className={`hover:opacity-100 transition-opacity ${theme === Theme.VIBRANT ? 'text-black' : 'text-white'}`}
            >
              Instagram
            </a>
            <a 
              href="#" 
              className={`hover:opacity-100 transition-opacity ${theme === Theme.VIBRANT ? 'text-black' : 'text-white'}`}
            >
              Twitter
            </a>
            <a 
              href="#" 
              className={`hover:opacity-100 transition-opacity ${theme === Theme.VIBRANT ? 'text-black' : 'text-white'}`}
            >
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      <Footer theme={theme} />
    </div>
  );
};

export default ContactPage;
