import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Photo, Theme } from '../types';
import PhotoModal from './PhotoModal';
import { ArrowRight } from 'lucide-react';
import { useParallax } from '../hooks/useParallax';
import { AnimatedWordFlip } from './ui/animated-word-flip';
import { useTypographyAnimation } from '../hooks/useTypographyAnimation';
import { useSwipeGesture } from '../hooks/useSwipeGesture';
import { smoothScroll } from '../utils/smoothScroll';

interface HeroWorksProps {
  theme: Theme;
}

// Mock Data - Expanded for pagination
const PHOTOS: Photo[] = [
  { id: '1', url: 'https://picsum.photos/800/1200?random=1', title: 'Urban Solitude', category: 'Street', aspectRatio: 0.67 },
  { id: '2', url: 'https://picsum.photos/1200/800?random=2', title: 'Mist & Stone', category: 'Landscape', aspectRatio: 1.5 },
  { id: '3', url: 'https://picsum.photos/800/800?random=3', title: 'Geometric Shadows', category: 'Abstract', aspectRatio: 1 },
  { id: '4', url: 'https://picsum.photos/800/1000?random=4', title: 'The Wait', category: 'Portrait', aspectRatio: 0.8 },
  { id: '5', url: 'https://picsum.photos/900/1200?random=5', title: 'Concrete Waves', category: 'Architecture', aspectRatio: 0.75 },
  { id: '6', url: 'https://picsum.photos/1200/900?random=6', title: 'Silent Forest', category: 'Nature', aspectRatio: 1.33 },
  { id: '7', url: 'https://picsum.photos/800/1200?random=7', title: 'Reflections', category: 'Street', aspectRatio: 0.67 },
  { id: '8', url: 'https://picsum.photos/1000/1000?random=8', title: 'Void', category: 'Abstract', aspectRatio: 1 },
  { id: '9', url: 'https://picsum.photos/1200/800?random=9', title: 'Horizons', category: 'Landscape', aspectRatio: 1.5 },
  { id: '10', url: 'https://picsum.photos/800/1100?random=10', title: 'Glass & Steel', category: 'Architecture', aspectRatio: 0.73 },
  { id: '11', url: 'https://picsum.photos/1000/700?random=11', title: 'Morning Fog', category: 'Nature', aspectRatio: 1.43 },
  { id: '12', url: 'https://picsum.photos/800/1200?random=12', title: 'Night Walk', category: 'Street', aspectRatio: 0.67 },
  { id: '13', url: 'https://picsum.photos/1200/800?random=13', title: 'Distant Peaks', category: 'Landscape', aspectRatio: 1.5 },
  { id: '14', url: 'https://picsum.photos/800/800?random=14', title: 'Spiral', category: 'Abstract', aspectRatio: 1 },
  { id: '15', url: 'https://picsum.photos/800/1000?random=15', title: 'Gaze', category: 'Portrait', aspectRatio: 0.8 },
  { id: '16', url: 'https://picsum.photos/900/1200?random=16', title: 'Brutalist', category: 'Architecture', aspectRatio: 0.75 },
  { id: '17', url: 'https://picsum.photos/1200/900?random=17', title: 'Deep Woods', category: 'Nature', aspectRatio: 1.33 },
  { id: '18', url: 'https://picsum.photos/800/1200?random=18', title: 'Puddle', category: 'Street', aspectRatio: 0.67 },
];

const ITEMS_PER_PAGE = 6;

interface GalleryItemProps {
  photo: Photo;
  theme: Theme;
  isFocused: boolean;
  isExiting: boolean;
  isAnyFocused: boolean;
  parallaxSpeed: number;
  onClick: (photo: Photo, rect: DOMRect) => void;
  onViewDetails: (photo: Photo, rect: DOMRect) => void;
}

const GalleryItem: React.FC<GalleryItemProps> = ({ photo, theme, isFocused, isExiting, isAnyFocused, parallaxSpeed, onClick, onViewDetails }) => {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const parallax = useParallax<HTMLDivElement>(parallaxSpeed);

  // Determine if this specific item should fade into background
  const isBackground = isAnyFocused && !isFocused;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px',
        threshold: 0.01
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`h-full w-full group relative cursor-pointer overflow-hidden rounded-sm transition-all duration-700 ease-[cubic-bezier(0.2,1,0.3,1)] ${
        (isFocused || isExiting) ? 'z-50' : ''
      } ${
        isFocused 
          ? 'scale-[1.03]' 
          : isBackground
            ? 'scale-95 opacity-20 blur-[2px] grayscale pointer-events-none'
            : ''
      }`}
      onClick={(e) => {
        e.stopPropagation();
        if (!isBackground) {
            onClick(photo, e.currentTarget.getBoundingClientRect());
        }
      }}
    >
      <div
        ref={parallax.ref}
        style={parallax.style}
        className="relative h-full w-full transition-transform duration-[600ms] ease-[cubic-bezier(0.2,1,0.3,1)]"
      >
        {/* Background Placeholder */}
        <div className={`absolute inset-0 transition-colors duration-500 ${theme === Theme.VIBRANT ? 'bg-gray-200' : 'bg-neutral-900'}`} style={{ aspectRatio: `${photo.aspectRatio}` }} />

        {/* Skeleton Shimmer Effect */}
        {!isLoaded && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
            <div className={`w-full h-full absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r ${
              theme === Theme.VIBRANT 
                ? 'from-transparent via-white/40 to-transparent' 
                : 'from-transparent via-white/5 to-transparent'
            }`} />
          </div>
        )}

        {isInView && (
          <img 
            src={photo.url} 
            alt={photo.title}
            onLoad={() => setIsLoaded(true)}
            className={`relative z-20 w-full h-full object-cover transition-all duration-1000 ease-out transform will-change-transform rounded-sm ${
              isFocused 
                ? `scale-105 blur-[2px] opacity-60 ${theme === Theme.MONOCHROME ? 'grayscale sepia-[.2] hue-rotate-[200deg]' : ''}` 
                : isBackground 
                  ? `scale-100 ${theme === Theme.MONOCHROME ? 'grayscale' : ''}` 
                  : `${theme === Theme.MONOCHROME ? 'grayscale' : ''}`
            }`}
            style={{ objectFit: 'cover' }}
          />
        )}
        
        {/* Overlay */}
        <div className={`absolute inset-0 z-30 transition-all duration-500 flex flex-col p-6 ${
          isFocused 
            ? 'opacity-100 bg-black/50 justify-center items-center' 
            : isBackground 
              ? 'opacity-0'
              : 'opacity-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent justify-end'
        }`}>
          <div className={`transform transition-all duration-500 ease-out w-full flex flex-col ${
            isFocused 
              ? 'translate-y-0 items-center' 
              : 'translate-y-4 items-start'
          }`}>
            
            <p className={`serif italic tracking-wide text-white transition-all duration-500 text-center ${
              isFocused ? 'text-3xl mb-3 scale-105' : 'text-xl md:text-2xl text-left'
            }`}>
              {photo.title}
            </p>
            
            <div className={`flex items-center gap-3 mt-2 transition-all duration-500 ${isFocused ? 'justify-center opacity-80' : 'justify-start'}`}>
              <span className={`h-[1px] bg-white/60 transition-all duration-500 ${isFocused ? 'w-12' : 'w-6'}`}></span>
              <p className="text-white/90 text-[10px] md:text-xs uppercase tracking-[0.2em]">{photo.category}</p>
              {isFocused && <span className="h-[1px] w-12 bg-white/60"></span>}
            </div>

            {/* View Project Button */}
            <div className={`overflow-hidden transition-all duration-700 delay-100 ${isFocused ? 'max-h-20 opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (containerRef.current) {
                    onViewDetails(photo, containerRef.current.getBoundingClientRect());
                  }
                }}
                className="flex items-center gap-3 text-white text-[10px] font-bold tracking-[0.3em] uppercase border border-white/30 px-5 py-2 rounded-full bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/50 transition-all cursor-pointer"
              >
                <span>View</span>
                <ArrowRight size={12} />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const HeroWorks: React.FC<HeroWorksProps> = ({ theme }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [focusedPhotoId, setFocusedPhotoId] = useState<string | null>(null);
  const [exitingPhotoId, setExitingPhotoId] = useState<string | null>(null);
  const [originRect, setOriginRect] = useState<DOMRect | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isGestureEnabled, setIsGestureEnabled] = useState(false);
  const [gridColumns, setGridColumns] = useState(3);
  const [scrollY, setScrollY] = useState(0);
  const [jaiReddyOffset, setJaiReddyOffset] = useState(80);
  const [jaiReddyTop, setJaiReddyTop] = useState('50vh');
  const heroHeadingAnimation = useTypographyAnimation<HTMLHeadingElement>({
    intensity: 0.12,
    letterSpacingRange: 0.05,
    scrollStart: 0.1,
    scrollEnd: 0.8,
  });
  const worksHeadingAnimation = useTypographyAnimation<HTMLHeadingElement>({
    intensity: 0.08,
    letterSpacingRange: 0.03,
  });

  // Track scroll for continuous parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Adjust JAI REDDY offset and top position based on screen size
  useEffect(() => {
    const updateOffset = () => {
      // For screens smaller than 1536px (laptops), use negative offset to move up
      // and adjust top position to account for navbar
      if (window.innerWidth < 1536) {
        setJaiReddyOffset(-40);
        // Move top position up to account for navbar (h-20 = 80px) and add some margin
        setJaiReddyTop('calc(50vh - 40px)');
      } else {
        // For larger screens (monitors), use original values
        setJaiReddyOffset(80);
        setJaiReddyTop('50vh');
      }
    };

    updateOffset();
    window.addEventListener('resize', updateOffset);
    return () => window.removeEventListener('resize', updateOffset);
  }, []);

  // Calculate optimal grid columns based on viewport
  useEffect(() => {
    const updateGridColumns = () => {
      const width = window.innerWidth;
      if (width < 700) {
        setGridColumns(1);
      } else if (width < 1100) {
        setGridColumns(2);
      } else {
        setGridColumns(3);
      }
    };

    updateGridColumns();
    window.addEventListener('resize', updateGridColumns);
    return () => window.removeEventListener('resize', updateGridColumns);
  }, []);

  useEffect(() => {
    const updateGestureState = () => {
      setIsGestureEnabled(window.innerWidth < 1024);
    };
    updateGestureState();
    window.addEventListener('resize', updateGestureState);
    return () => window.removeEventListener('resize', updateGestureState);
  }, []);

  const scrollToHero = useCallback(() => {
    smoothScroll('#hero', { duration: 900, easing: 'easeOutExpo', offset: -80 });
  }, []);

  const scrollToWorks = useCallback(() => {
    smoothScroll('#works', { duration: 1100, easing: 'easeInOutCubic', offset: -40 });
  }, []);

  const heroSwipe = useSwipeGesture({
    axis: 'vertical',
    threshold: 28,
    preventDefault: true,
    enabled: isGestureEnabled,
    onSwipeUp: scrollToWorks,
    onSwipeDown: scrollToHero,
  });

  const worksSwipe = useSwipeGesture({
    axis: 'vertical',
    threshold: 28,
    preventDefault: false,
    enabled: isGestureEnabled,
    onSwipeDown: () => {
      const worksSection = document.getElementById('works');
      if (!worksSection) return;
      const { top } = worksSection.getBoundingClientRect();
      if (top >= -40) {
        scrollToHero();
      }
    },
  });

  // Advanced grid layout algorithm
  const calculateGridLayout = (photos: Photo[], columns: number) => {
    const layout: Array<{ photo: Photo; rowSpan: number; colSpan: number }> = [];
    const baseRowHeight = 300;
    const gap = 32;

    photos.forEach((photo) => {
      const aspectRatio = photo.aspectRatio;
      
      let colSpan = 1;
      if (aspectRatio > 1.3) {
        colSpan = columns;
      } else if (aspectRatio > 1.1) {
        colSpan = Math.min(2, columns);
      } else {
        colSpan = 1;
      }
      
      const containerWidth = containerRef.current?.clientWidth || 1200;
      const availableWidth = containerWidth - (gap * (columns - 1));
      const itemWidth = (availableWidth / columns) * colSpan + (gap * (colSpan - 1));
      const itemHeight = itemWidth / aspectRatio;
      const rowSpan = Math.max(1, Math.round(itemHeight / baseRowHeight));

      layout.push({
        photo,
        rowSpan: Math.min(Math.max(rowSpan, 1), 5),
        colSpan: Math.min(colSpan, columns),
      });
    });

    return layout;
  };

  // Pagination Logic
  const totalPages = Math.ceil(PHOTOS.length / ITEMS_PER_PAGE);
  const indexOfLastPhoto = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstPhoto = indexOfLastPhoto - ITEMS_PER_PAGE;
  const currentPhotos = PHOTOS.slice(indexOfFirstPhoto, indexOfLastPhoto);

  // Calculate grid layout for current photos
  const gridLayout = useMemo(() => {
    return calculateGridLayout(currentPhotos, gridColumns);
  }, [currentPhotos, gridColumns]);
  const speedPattern = useMemo(() => [0.12, 0.16, 0.2, 0.24, 0.3], []);

  const handlePageChange = (page: number) => {
    clearFocus();
    setCurrentPage(page);
    scrollToWorks();
  };

  const clearFocus = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (focusedPhotoId) {
      setExitingPhotoId(focusedPhotoId);
      setFocusedPhotoId(null);
      setOriginRect(null);
      
      setTimeout(() => {
        setExitingPhotoId(null);
      }, 700);
    } else {
        setFocusedPhotoId(null);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (focusedPhotoId) {
        clearFocus();
      }
    };

    if (focusedPhotoId) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [focusedPhotoId]);

  const handlePhotoClick = (photo: Photo, rect: DOMRect) => {
    if (focusedPhotoId === photo.id) {
      clearFocus();
      return;
    }
    
    clearFocus();
    setFocusedPhotoId(photo.id);
    setOriginRect(rect);
    setExitingPhotoId(null);
  };

  const handleViewDetails = (photo: Photo, rect: DOMRect) => {
    setSelectedPhoto(photo);
    setOriginRect(rect);
    setFocusedPhotoId(null);
    clearFocus();
  };
  
  // Find current photo index in all photos
  const getCurrentPhotoIndex = (): number => {
    if (!selectedPhoto) return 0;
    const index = PHOTOS.findIndex(p => p.id === selectedPhoto.id);
    return index >= 0 ? index : 0;
  };

  const handleBackgroundClick = () => {
    if (focusedPhotoId) clearFocus();
  };

  const isAnyFocused = !!focusedPhotoId;

  return (
    <section 
      ref={sectionRef}
      className="relative w-full"
    >
      {/* Parallax Background Text - Spans entire component (Hero + Works) */}
      {/* Using fixed positioning so it's not clipped by section overflow */}
      <div 
        className="fixed w-full text-center select-none pointer-events-none"
        style={{ 
          transform: `translate(-50%, calc(-50% + ${scrollY * 0.6}px + ${jaiReddyOffset}px)) scale(${Math.min(3, 0.7 + scrollY * 0.0015)})`,
          opacity: Math.max(0, 0.03 - scrollY * 0.00004),
          top: jaiReddyTop,
          left: '50%',
          transformOrigin: 'center center',
          zIndex: 0,
          willChange: 'transform, opacity'
        }}
      >
        <h1 className={`text-[15rem] md:text-[25rem] leading-none font-bold serif tracking-tighter ${theme === Theme.VIBRANT ? 'text-black' : 'text-white'}`}>
          JAI REDDY
        </h1>
      </div>

      {/* Hero Section */}
      <div 
        id="hero"
        data-scroll-section="hero"
        data-scroll-label="Intro"
        className="relative h-screen flex flex-col justify-center items-center z-10 overflow-hidden snap-section"
        {...heroSwipe.bind}
      >
        <div className="relative z-10 text-center space-y-8 px-4 mix-blend-difference" style={{ transform: 'translateY(0)' }}>
          <p className={`text-sm md:text-base tracking-[0.5em] uppercase animate-[fadeIn_1.5s_ease-out_0.2s_forwards] opacity-0 ${
              theme === Theme.VIBRANT 
                ? 'bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent' 
                : 'text-white'
            }`}>
            World Through My Eyes (and Camera)
          </p>
          
          <div className="overflow-visible flex items-center justify-center">
            <h2
              ref={heroHeadingAnimation.ref}
              style={heroHeadingAnimation.style}
              className={`text-6xl md:text-9xl font-light serif leading-tight animate-[slideUpReveal_1.5s_cubic-bezier(0.2,1,0.3,1)_0.5s_forwards] translate-y-full opacity-0 inline-flex items-center justify-center gap-2 ${
              theme === Theme.VIBRANT
                ? ''
                : 'text-white'
            }`}
            >
              <AnimatedWordFlip
                words={theme === Theme.VIBRANT
                  ? ['Capturing ', 'Freezing ', 'Framing ', 'Revealing ', 'Illuminating ', 'Preserving ']
                  : ['Capturing ', 'Freezing ', 'Framing ', 'Revealing ', 'Preserving ', 'Documenting ']
                }
                interval={2500}
                wordClassName={theme === Theme.VIBRANT 
                  ? 'bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent' 
                  : ''
                }
              />
              <span className={theme === Theme.VIBRANT 
                ? 'bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent' 
                : ''}>{theme === Theme.VIBRANT ? 'Color' : 'Silence'}</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Works Section */}
      <div 
        id="works"
        data-scroll-section="works"
        data-scroll-label="Gallery"
        className="relative py-20 px-4 md:px-8 overflow-hidden z-10 snap-section"
        {...worksSwipe.bind}
        onClick={handleBackgroundClick}
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-20 flex flex-col md:flex-row justify-between items-end gap-8">
            <h2
              ref={worksHeadingAnimation.ref}
              style={worksHeadingAnimation.style}
              className={`text-4xl md:text-6xl serif ${
              theme === Theme.VIBRANT
                ? 'bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent'
                : 'text-white'
            }`}
            >
              Selected Works
            </h2>
          </div>

          {/* Advanced Grid Layout */}
          <div 
            ref={containerRef}
            className="grid gap-8"
            style={{
              gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
              gridAutoRows: '300px',
            }}
          >
            {gridLayout.map(({ photo, rowSpan, colSpan }, index) => {
              const parallaxSpeed = speedPattern[index % speedPattern.length];
              return (
                <div
                  key={photo.id}
                  style={{
                    gridRow: `span ${rowSpan}`,
                    gridColumn: `span ${colSpan}`,
                  }}
                >
                  <GalleryItem
                    photo={photo}
                    theme={theme}
                    isFocused={focusedPhotoId === photo.id}
                    isExiting={exitingPhotoId === photo.id}
                    isAnyFocused={isAnyFocused}
                    parallaxSpeed={parallaxSpeed}
                    onClick={handlePhotoClick}
                    onViewDetails={handleViewDetails}
                  />
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
              <div className={`mt-24 flex justify-center items-center gap-8 ${theme === Theme.VIBRANT ? 'text-black' : 'text-white'}`}>
                  <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="disabled:opacity-20 hover:opacity-50 transition-opacity uppercase tracking-widest text-[10px] font-bold"
                  >
                      Prev
                  </button>

                  <div className="flex gap-4">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                          <button
                              key={number}
                              onClick={() => handlePageChange(number)}
                              className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                                  currentPage === number
                                      ? (theme === Theme.VIBRANT ? 'bg-black text-[#fafafa]' : 'bg-white text-black')
                                      : (theme === Theme.VIBRANT ? 'hover:bg-gray-200' : 'hover:bg-neutral-800')
                              }`}
                          >
                              {number}
                          </button>
                      ))}
                  </div>

                  <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="disabled:opacity-20 hover:opacity-50 transition-opacity uppercase tracking-widest text-[10px] font-bold"
                  >
                      Next
                  </button>
              </div>
          )}
        </div>
      </div>

      {selectedPhoto && (
        <PhotoModal 
          photo={selectedPhoto}
          photos={PHOTOS}
          currentIndex={getCurrentPhotoIndex()}
          theme={theme} 
          originRect={originRect}
          onClose={() => setSelectedPhoto(null)} 
        />
      )}
      
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
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </section>
  );
};

export default HeroWorks;
