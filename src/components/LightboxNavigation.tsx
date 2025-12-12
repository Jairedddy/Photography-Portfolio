import React, { useEffect, useRef } from 'react';
import { Photo, Theme } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxNavigationProps {
  photos: Photo[];
  currentIndex: number;
  theme: Theme;
  onPrevious: () => void;
  onNext: () => void;
  onThumbnailClick: (index: number) => void;
}

const LightboxNavigation: React.FC<LightboxNavigationProps> = ({
  photos,
  currentIndex,
  theme,
  onPrevious,
  onNext,
  onThumbnailClick,
}) => {
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < photos.length - 1;
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll active thumbnail to center
  useEffect(() => {
    const activeThumbnail = thumbnailRefs.current[currentIndex];
    if (activeThumbnail && containerRef.current) {
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const thumbnailRect = activeThumbnail.getBoundingClientRect();
      
      // Calculate scroll position to center the thumbnail
      const scrollLeft = activeThumbnail.offsetLeft - (containerRect.width / 2) + (thumbnailRect.width / 2);
      
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  }, [currentIndex]);

  return (
    <>
      {/* Navigation Arrows */}
      {hasPrevious && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrevious();
          }}
          className={`absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 ${
            theme === Theme.VIBRANT
              ? 'bg-white/20 hover:bg-white/30 text-black'
              : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
          aria-label="Previous photo"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {hasNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className={`absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 ${
            theme === Theme.VIBRANT
              ? 'bg-white/20 hover:bg-white/30 text-black'
              : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
          aria-label="Next photo"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Photo Counter */}
      <div
        className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full backdrop-blur-sm text-sm font-medium transition-all duration-300 ${
          theme === Theme.VIBRANT
            ? 'bg-white/20 text-black'
            : 'bg-white/10 text-white'
        }`}
      >
        {currentIndex + 1} of {photos.length}
      </div>

      {/* Thumbnail Strip */}
      {photos.length > 1 && (
        <>
          <style>{`
            .thumbnail-strip::-webkit-scrollbar {
              display: none;
            }
            .thumbnail-strip {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
          <div
            ref={containerRef}
            className="thumbnail-strip absolute bottom-6 left-1/2 -translate-x-1/2 z-50 overflow-x-auto max-w-[90%] md:max-w-[80%]"
            onClick={(e) => e.stopPropagation()}
          >
          {/* Gradient fade on sides */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/60 to-transparent pointer-events-none z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/60 to-transparent pointer-events-none z-10" />
            
            <div className="flex gap-3 justify-start px-8 py-2">
              {photos.map((photo, index) => (
                <button
                  key={photo.id}
                  ref={(el) => {
                    thumbnailRefs.current[index] = el;
                  }}
                  onClick={() => onThumbnailClick(index)}
                  className={`relative flex-shrink-0 w-14 h-14 md:w-20 md:h-20 rounded-sm overflow-hidden transition-all duration-300 ${
                    index === currentIndex
                      ? 'ring-2 ring-offset-2 ring-offset-black/50 scale-110 shadow-xl'
                      : 'opacity-50 hover:opacity-90 hover:scale-105'
                  } ${
                    index === currentIndex
                      ? theme === Theme.VIBRANT
                        ? 'ring-white'
                        : 'ring-white'
                      : ''
                  }`}
                  aria-label={`Go to photo ${index + 1}`}
                >
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className={`w-full h-full object-cover transition-all duration-300 ${
                      theme === Theme.MONOCHROME ? 'grayscale' : ''
                    } ${
                      index === currentIndex ? 'brightness-110' : 'brightness-90'
                    }`}
                    loading="lazy"
                  />
                  {/* Active indicator */}
                  {index === currentIndex && (
                    <div className="absolute inset-0 border-2 border-white/80" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
        </>
      )}
    </>
  );
};

export default LightboxNavigation;

