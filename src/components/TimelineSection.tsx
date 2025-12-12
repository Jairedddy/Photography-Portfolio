import React from 'react';
import { Theme } from '../types';
import { motion } from 'framer-motion';
import { useTypographyAnimation } from '../hooks/useTypographyAnimation';

interface TimelineSectionProps {
  theme: Theme;
}

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    year: '2018',
    title: 'First Camera',
    description: 'Discovered the art of capturing moments through a lens, beginning a journey into visual storytelling.',
  },
  {
    year: '2020',
    title: 'Monochrome Exploration',
    description: 'Fell in love with black and white photography, realizing that absence of color reveals true essence.',
  },
  {
    year: '2022',
    title: 'Professional Recognition',
    description: 'Work featured in several exhibitions, marking a milestone in artistic expression and recognition.',
  },
  {
    year: '2024',
    title: 'Digital Portfolio',
    description: 'Launched this digital space to share the journey, the vision, and the stories behind each frame.',
  },
];

const TimelineSection: React.FC<TimelineSectionProps> = ({ theme }) => {
  const isMonochrome = theme === Theme.MONOCHROME;
  const headingAnimation = useTypographyAnimation<HTMLHeadingElement>({
    intensity: 0.08,
    letterSpacingRange: 0.03,
  });

  return (
    <section className={`relative py-32 px-6 ${isMonochrome ? 'bg-neutral-950' : 'bg-[#fafafa]'}`}>
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span
            className={`inline-block text-xs font-bold tracking-[0.3em] uppercase py-2 border-b ${
              isMonochrome ? 'text-gray-500 border-neutral-800' : 'text-gray-400 border-gray-200'
            }`}
          >
            Journey
          </span>
          <h2
            ref={headingAnimation.ref}
            style={headingAnimation.style}
            className={`text-4xl md:text-6xl serif leading-tight mt-8 ${
              isMonochrome ? 'text-white' : 'text-black'
            }`}
          >
            A Timeline of Growth
          </h2>
          <p
            className={`text-lg md:text-xl leading-relaxed font-light max-w-3xl mx-auto mt-6 ${
              isMonochrome ? 'text-neutral-400' : 'text-gray-600'
            }`}
          >
            Every milestone, every moment of discovery, every frame that shaped the artist within.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className={`absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 transform md:-translate-x-1/2 ${
              isMonochrome ? 'bg-neutral-800' : 'bg-gray-200'
            }`}
          />

          {/* Timeline Events */}
          <div className="space-y-16 md:space-y-24">
            {TIMELINE_EVENTS.map((event, index) => {
              const isEven = index % 2 === 0;
              const isLeft = isEven;

              return (
                <motion.div
                  key={event.year}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative flex items-center ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline Dot */}
                  <div
                    className={`absolute left-8 md:left-1/2 w-4 h-4 rounded-full transform md:-translate-x-1/2 z-10 ${
                      isMonochrome
                        ? 'bg-white border-2 border-neutral-800'
                        : 'bg-purple-500 border-2 border-white'
                    }`}
                    style={{
                      boxShadow: isMonochrome
                        ? '0 0 0 4px rgba(255,255,255,0.1)'
                        : '0 0 0 4px rgba(139,92,246,0.1)',
                    }}
                  />

                  {/* Content Card */}
                  <div
                    className={`ml-16 md:ml-0 md:w-5/12 ${
                      isLeft ? 'md:pr-12' : 'md:pl-12'
                    }`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      className={`p-8 rounded-lg backdrop-blur-sm ${
                        isMonochrome
                          ? 'bg-neutral-900/50 border border-neutral-800'
                          : 'bg-white/80 border border-gray-200 shadow-lg'
                      }`}
                    >
                      <div
                        className={`text-sm font-bold tracking-wider uppercase mb-2 ${
                          isMonochrome ? 'text-purple-400' : 'text-purple-600'
                        }`}
                      >
                        {event.year}
                      </div>
                      <h3
                        className={`text-2xl md:text-3xl serif mb-4 ${
                          isMonochrome ? 'text-white' : 'text-black'
                        }`}
                      >
                        {event.title}
                      </h3>
                      <p
                        className={`text-base leading-relaxed ${
                          isMonochrome ? 'text-neutral-400' : 'text-gray-600'
                        }`}
                      >
                        {event.description}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;

