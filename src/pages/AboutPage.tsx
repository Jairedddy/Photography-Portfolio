import React from 'react';
import { Theme } from '../types';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CustomCursor from '../components/CustomCursor';
import { AnimatedTestimonials } from '../components/ui/animated-testimonials';
import { useTypographyAnimation } from '../hooks/useTypographyAnimation';

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
          <span className={`inline-block text-xs font-bold tracking-[0.3em] uppercase py-2 border-b ${theme === Theme.VIBRANT ? 'text-gray-400 border-gray-200' : 'text-gray-500 border-neutral-800'}`}>
            The Artist
          </span>
          
          <div className="space-y-8">
            <h2
              ref={quoteHeadingAnimation.ref}
              style={quoteHeadingAnimation.style}
              className={`text-4xl md:text-6xl serif leading-tight ${theme === Theme.VIBRANT ? 'text-black' : 'text-white'}`}
            >
              "Color describes an object. Black and white describes the subject."
            </h2>
            
            <p className={`text-lg md:text-xl leading-relaxed font-light max-w-3xl mx-auto ${theme === Theme.VIBRANT ? 'text-gray-600' : 'text-neutral-400'}`}>
              Jai Reddy is a digital exploration of light and void. By removing color, we remove distraction, 
              forcing the eye to recognize the fundamental truths of shape, texture, and emotion.
            </p>

            <div className="pt-8 space-y-6">
              <p className={`text-base leading-relaxed ${theme === Theme.VIBRANT ? 'text-gray-600' : 'text-neutral-400'}`}>
                Through the lens of monochrome photography, each frame becomes a study in contrast, 
                a meditation on the spaces between light and shadow. Every image tells a story 
                stripped of the noise of color, revealing the essence of the moment.
              </p>
            </div>
          </div>
        </div>

        {/* Portrait Carousel */}
        <div className="w-full">
          <AnimatedTestimonials 
            testimonials={[
              {
                quote: "Capturing moments in monochrome allows me to focus on the essence of composition, light, and emotion without the distraction of color.",
                name: "Jai Reddy",
                designation: "Photographer & Visual Artist",
                src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3"
              },
              {
                quote: "Every photograph tells a story. In black and white, that story becomes universal, timeless, and deeply personal.",
                name: "Jai Reddy",
                designation: "Photographer & Visual Artist",
                src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3"
              },
              {
                quote: "The absence of color forces the viewer to see beyond the surface, to understand the geometry, texture, and emotion that truly define a moment.",
                name: "Jai Reddy",
                designation: "Photographer & Visual Artist",
                src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3"
              },
            ]}
            theme={theme}
            autoplay={false}
          />
        </div>
      </section>

      <Footer theme={theme} />
    </div>
  );
};

export default AboutPage;
