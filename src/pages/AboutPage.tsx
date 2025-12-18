import React from 'react';
import { Theme } from '../types';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CustomCursor from '../components/CustomCursor';
import { AnimatedTestimonials } from '../components/ui/animated-testimonials';
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

  return (
    <div className={`min-h-screen transition-colors duration-700 ${theme === Theme.VIBRANT ? 'bg-[#fafafa]' : 'bg-neutral-950'}`}>
      <CustomCursor theme={theme} />
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      
      <section 
        className="relative min-h-screen flex flex-col justify-center items-center py-32 px-6"
      >
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-12 mb-20">
          <span className={`inline-block text-xs font-bold tracking-[0.3em] uppercase py-2 border-b ${
            theme === Theme.VIBRANT 
              ? 'bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent border-gray-200' 
              : 'text-gray-500 border-neutral-800'
          }`}>
            The Artist
          </span>
          
          <div className="space-y-8">
            <h2
              ref={quoteHeadingAnimation.ref}
              style={quoteHeadingAnimation.style}
              className={`text-4xl md:text-6xl serif leading-tight ${
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

        {/* Portrait Carousel */}
        <div className="w-full">
          <AnimatedTestimonials 
            testimonials={
              theme === Theme.VIBRANT
                ? [
                    {
                      quote: "Color breathes life into every frame, transforming ordinary moments into vibrant narratives that celebrate the richness of our visual world.",
                      name: "Jai Reddy",
                      designation: "Photographer & Visual Artist",
                      src: "https://picsum.photos/1000/1000?random=201"
                    },
                    {
                      quote: "Through the lens of color, I capture the emotional spectrum of human experience—from the warm embrace of golden hour to the cool serenity of twilight.",
                      name: "Jai Reddy",
                      designation: "Photographer & Visual Artist",
                      src: "https://picsum.photos/1000/1000?random=202"
                    },
                    {
                      quote: "Every hue tells a story. Color photography allows me to paint with light, creating compositions that resonate with the vibrant energy of life itself.",
                      name: "Jai Reddy",
                      designation: "Photographer & Visual Artist",
                      src: "https://picsum.photos/1000/1000?random=203"
                    },
                  ]
                : [
                    {
                      quote: "Capturing moments in monochrome allows me to focus on the essence of composition, light, and emotion without the distraction of color.",
                      name: "Jai Reddy",
                      designation: "Photographer & Visual Artist",
                      src: "https://picsum.photos/1000/1000?random=201"
                    },
                    {
                      quote: "Every photograph tells a story. In black and white, that story becomes universal, timeless, and deeply personal.",
                      name: "Jai Reddy",
                      designation: "Photographer & Visual Artist",
                      src: "https://picsum.photos/1000/1000?random=202"
                    },
                    {
                      quote: "The absence of color forces the viewer to see beyond the surface, to understand the geometry, texture, and emotion that truly define a moment.",
                      name: "Jai Reddy",
                      designation: "Photographer & Visual Artist",
                      src: "https://picsum.photos/1000/1000?random=203"
                    },
                  ]
            }
            theme={theme}
            autoplay={false}
          />
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
