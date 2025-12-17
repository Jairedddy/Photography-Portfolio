import React from 'react';
import { Theme } from '../types';

interface AboutProps {
  theme: Theme;
}

const About: React.FC<AboutProps> = ({ theme }) => {
  return (
    <section 
      id="about" 
      className="relative min-h-screen flex flex-col justify-center items-center py-32 px-6 overflow-hidden"
    >
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-12">
        <span className={`inline-block text-xs font-bold tracking-[0.3em] uppercase py-2 border-b ${theme === Theme.VIBRANT ? 'text-gray-400 border-gray-200' : 'text-gray-500 border-neutral-800'}`}>
          The Artist
        </span>
        
        <div className="space-y-8">
          <h2 className={`text-4xl md:text-6xl serif leading-tight ${theme === Theme.VIBRANT ? 'text-black' : 'text-white'}`}>
            {theme === Theme.VIBRANT 
              ? "Colour captures the subject"
              : "Monochrome captures the soul"
            }
          </h2>
          
          <p className={`text-lg md:text-xl leading-relaxed font-light max-w-3xl mx-auto ${theme === Theme.VIBRANT ? 'text-gray-600' : 'text-neutral-400'}`}>
            {theme === Theme.VIBRANT 
              ? "By embracing color, we celebrate life, inviting the eye to discover the vibrant truths of hue, saturation, and emotion."
              : "By removing color, we remove distraction, forcing the eye to recognize the fundamental truths of shape, texture, and emotion."
            }
          </p>

          <div className="pt-8 space-y-6">
            <p className={`text-base leading-relaxed ${theme === Theme.VIBRANT ? 'text-gray-600' : 'text-neutral-400'}`}>
              {theme === Theme.VIBRANT
                ? "Through the lens of color photography, each frame becomes a celebration of vibrancy, a dance between complementary hues and saturated moments. Every image tells a story enriched by the language of color, revealing the full spectrum of life's beauty."
                : "Through the lens of monochrome photography, each frame becomes a study in contrast, a meditation on the spaces between light and shadow. Every image tells a story stripped of the noise of color, revealing the essence of the moment."
              }
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

