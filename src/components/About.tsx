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
        <span className={`inline-block text-xs font-bold tracking-[0.3em] uppercase py-2 border-b ${theme === Theme.LIGHT ? 'text-gray-400 border-gray-200' : 'text-gray-500 border-neutral-800'}`}>
          The Artist
        </span>
        
        <div className="space-y-8">
          <h2 className={`text-4xl md:text-6xl serif leading-tight ${theme === Theme.LIGHT ? 'text-black' : 'text-white'}`}>
            "Color describes an object. Black and white describes the subject."
          </h2>
          
          <p className={`text-lg md:text-xl leading-relaxed font-light max-w-3xl mx-auto ${theme === Theme.LIGHT ? 'text-gray-600' : 'text-neutral-400'}`}>
            Jai Reddy is a digital exploration of light and void. By removing color, we remove distraction, 
            forcing the eye to recognize the fundamental truths of shape, texture, and emotion.
          </p>

          <div className="pt-8 space-y-6">
            <p className={`text-base leading-relaxed ${theme === Theme.LIGHT ? 'text-gray-600' : 'text-neutral-400'}`}>
              Through the lens of monochrome photography, each frame becomes a study in contrast, 
              a meditation on the spaces between light and shadow. Every image tells a story 
              stripped of the noise of color, revealing the essence of the moment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

