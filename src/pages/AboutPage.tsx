import React from 'react';
import { Theme } from '../types';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CustomCursor from '../components/CustomCursor';
import { useTypographyAnimation } from '../hooks/useTypographyAnimation';
import HorizontalScrollCarousel from '../components/HorizontalScrollCarousel';

interface AboutPageProps {
  theme: Theme;
  toggleTheme: () => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ theme, toggleTheme }) => {
  const quoteHeadingAnimation = useTypographyAnimation<HTMLHeadingElement>({
    intensity: 0.09,
    letterSpacingRange: 0.04,
  });

  const introHeadingAnimation = useTypographyAnimation<HTMLHeadingElement>({
    intensity: 0.09,
    letterSpacingRange: 0.04,
  });

  return (
    <div className={`min-h-screen transition-colors duration-700 ${theme === Theme.VIBRANT ? 'bg-[#fafafa]' : 'bg-neutral-950'}`}>
      <CustomCursor theme={theme} />
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      
      <section 
        className="relative flex flex-col justify-center items-center py-24 px-6"
      >
        <div className="relative z-10 max-w-4xl mx-auto space-y-16 mb-16">
          {/* Personal Introduction Section */}
          <div className="text-center space-y-6">
            <span className={`inline-block text-xs font-bold tracking-[0.3em] uppercase py-2 border-b ${
              theme === Theme.VIBRANT 
                ? 'bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent border-gray-200' 
                : 'text-gray-500 border-neutral-800'
            }`}>
              About Me
            </span>
            
            <div className="space-y-6 text-left max-w-3xl mx-auto">
              <div className="space-y-4 text-center">
                <h2
                  ref={introHeadingAnimation.ref}
                  style={introHeadingAnimation.style}
                  className={`text-4xl md:text-6xl serif ${
                    theme === Theme.VIBRANT ? 'leading-[1.12] pb-[2px]' : 'leading-tight'
                  } ${
                    theme === Theme.VIBRANT 
                      ? 'bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent'
                      : 'text-white'
                  }`}
                >
                  I'm Jai Reddy
                </h2>
                <p className={`text-lg md:text-xl italic font-light ${theme === Theme.VIBRANT ? 'text-gray-600' : 'text-neutral-400'}`}>
                  I don't live off photography, I live with it.
                </p>
              </div>
              
              <p className={`text-lg md:text-xl leading-relaxed font-light ${theme === Theme.VIBRANT ? 'text-gray-700' : 'text-neutral-300'}`}>
                I don't chase shots. I wait for moments that don't announce themselves. Faces mid-thought, streets mid-story, places caught between noise and stillness.
              </p>
              
              <p className={`text-lg md:text-xl leading-relaxed font-light ${theme === Theme.VIBRANT ? 'text-gray-700' : 'text-neutral-300'}`}>
                This work is personal, occasional, and intentional, driven by patience, instinct, and a refusal to over-explain.
              </p>
              
              <p className={`text-lg md:text-xl leading-relaxed font-light ${theme === Theme.VIBRANT ? 'text-gray-700' : 'text-neutral-300'}`}>
                If it feels quiet, look closer.
              </p>
            </div>
          </div>

          {/* Philosophy Section */}
          <div className="text-center space-y-8 pt-8 border-t border-opacity-20" style={{
            borderColor: theme === Theme.VIBRANT ? '#e5e7eb' : '#404040'
          }}>
            <span className={`inline-block text-xs font-bold tracking-[0.3em] uppercase py-2 border-b ${
              theme === Theme.VIBRANT 
                ? 'bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent border-gray-200' 
                : 'text-gray-500 border-neutral-800'
            }`}>
              About The Art
            </span>
            
            <div className="space-y-8">
              <h2
                ref={quoteHeadingAnimation.ref}
                style={quoteHeadingAnimation.style}
                className={`text-4xl md:text-6xl serif ${
                  theme === Theme.VIBRANT ? 'leading-[1.12] pb-[2px]' : 'leading-tight'
                } ${
                  theme === Theme.VIBRANT 
                    ? 'bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent'
                    : 'text-white'
                }`}
              >
                {theme === Theme.VIBRANT 
                  ? "Colour captures the subject"
                  : "Monochrome captures the soul"
                }
              </h2>
              
              <p className={`text-lg md:text-xl leading-relaxed font-light max-w-3xl mx-auto ${theme === Theme.VIBRANT ? 'text-gray-600' : 'text-neutral-400'}`}>
                {theme === Theme.VIBRANT 
                  ? "By embracing color, we celebrate life, inviting the eye to discover the vibrant truths of hue, saturation, and emotion."
                  : "By removing color, we remove distraction, forcing the eye to recognize the fundamental truths of shape, texture, and stoic silence."
                }
              </p>
            </div>
          </div>
        </div>

      </section>

      {/* Horizontal Scroll Carousel Section with extended background */}
      <div className="relative">
        {/* Extended background that covers carousel and footer area */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            background: theme === Theme.MONOCHROME
              ? 'radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, transparent 70%)'
              : 'radial-gradient(circle at center, rgba(139,92,246,0.1) 0%, transparent 70%)',
            opacity: 1,
            transition: 'opacity 0.7s ease-out',
          }}
        />
        <HorizontalScrollCarousel theme={theme} />
        <Footer theme={theme} />
      </div>
    </div>
  );
};

export default AboutPage;
