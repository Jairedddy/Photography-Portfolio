import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Photo, Theme, LicenseType } from '../types';
import { useParallax } from '../hooks/useParallax';
import { AnimatedWordFlip } from './ui/animated-word-flip';
import { useTypographyAnimation } from '../hooks/useTypographyAnimation';
import { useSwipeGesture } from '../hooks/useSwipeGesture';
import { smoothScroll } from '../utils/smoothScroll';

interface HeroWorksProps {
  theme: Theme;
}

export const PHOTOS: Photo[] = [
  // Page 1 — [P, L, L, P, P, L, P, P, P]
  { id: '1',  url: '/images/1.jpg',  title: 'Omniscience',       category: 'Street',   description: "Two lenses, no blind spots. The station watches itself watch you.", aspectRatio: 0.542, licenseType: LicenseType.RIGHTS_MANAGED },
  { id: '2',  url: '/images/7.jpg',  title: 'Surrender Grips',   category: 'Street',   description: "Reaching up just to hold on. The train decides where you go.", aspectRatio: 1.778, licenseType: LicenseType.ROYALTY_FREE },
  { id: '3',  url: '/images/8.jpg',  title: 'First Light',       category: 'Portrait', description: "A small flame in the dark. The smoke knows where it's going. He doesn't.", aspectRatio: 1.779, licenseType: LicenseType.EDITORIAL_ONLY },
  { id: '4',  url: '/images/2.jpg',  title: 'The Threshold',     category: 'Street',   description: "It opens for everyone. It closes just the same.", aspectRatio: 0.563, licenseType: LicenseType.RIGHTS_MANAGED },
  { id: '5',  url: '/images/3.jpg',  title: 'Stakeout',          category: 'Street',   description: "Watching through things that don't know they're watching.", aspectRatio: 0.562, licenseType: LicenseType.ROYALTY_FREE },
  { id: '6',  url: '/images/9.jpg',  title: 'Crimson Ceiling',   category: 'Portrait', description: "The eyes don't blink. The red doesn't stop. Something up there has all the answers.", aspectRatio: 1.776, licenseType: LicenseType.EDITORIAL_ONLY },
  { id: '7',  url: '/images/5.jpg',  title: 'Ownership',         category: 'Street',   description: "Two chairs. One man. The whole floor held in quiet contempt.", aspectRatio: 0.562, licenseType: LicenseType.RIGHTS_MANAGED },
  { id: '8',  url: '/images/6.jpg',  title: 'Contraband Light',  category: 'Abstract', description: "The room wanted darkness. The window disagreed. The shoes just waited.", aspectRatio: 0.562, licenseType: LicenseType.ROYALTY_FREE },
  { id: '9',  url: '/images/20.jpg', title: 'Attached',          category: 'Abstract', description: "Every departure starts here. A small metal loop holding the only key to motion.", aspectRatio: 0.562, licenseType: LicenseType.EDITORIAL_ONLY },
  // Page 2 — [P, L, L, P, P, L, P, P, P]
  { id: '10', url: '/images/10.jpg', title: 'The Fourth Minaret',    category: 'Architecture', description: "One of four. It doesn't need the others to hold up the sky.", aspectRatio: 0.562, licenseType: LicenseType.RIGHTS_MANAGED },
  { id: '11', url: '/images/13.jpg', title: 'The Unguarded Moment',  category: 'Street',       description: "She doesn't know she's being watched. The world doesn't care. The coffee's going cold.", aspectRatio: 1.778, licenseType: LicenseType.ROYALTY_FREE },
  { id: '12', url: '/images/14.jpg', title: 'The Whole Picture',     category: 'Street',       description: "Pull back far enough and the story changes. Everyone is someone else's background.", aspectRatio: 1.778, licenseType: LicenseType.EDITORIAL_ONLY },
  { id: '13', url: '/images/11.jpg', title: 'No Way Out',            category: 'Architecture', description: "The sign says exit. The feeling says otherwise.", aspectRatio: 0.562, licenseType: LicenseType.RIGHTS_MANAGED },
  { id: '14', url: '/images/12.jpg', title: 'Ward Stairwell',        category: 'Architecture', description: "Every floor looks the same. The railing keeps you honest. Nobody takes the stairs by choice.", aspectRatio: 0.562, licenseType: LicenseType.ROYALTY_FREE },
  { id: '15', url: '/images/15.jpg', title: 'Table Nine',            category: 'Abstract',     description: "Order number 09. Two cold lattes. Whatever was said here has already been forgotten.", aspectRatio: 1.777, licenseType: LicenseType.PERSONAL_USE },
  { id: '16', url: '/images/38.jpg', title: 'After Hours Shack',     category: 'Street',       description: "No ocean in sight. Just light that shouldn't be this warm, grain that shouldn't feel this alive.", aspectRatio: 0.563, licenseType: LicenseType.RIGHTS_MANAGED },
  { id: '17', url: '/images/40.jpg', title: 'False Idols',           category: 'Abstract',     description: "The knobs are analog. The song is a warning. Nobody turned it off.", aspectRatio: 0.563, licenseType: LicenseType.ROYALTY_FREE },
  { id: '18', url: '/images/41.jpg', title: 'Crowned',               category: 'Portrait',     description: "His back to the camera, the cliffs behind him, and a country floating above his head like a benediction.", aspectRatio: 0.563, licenseType: LicenseType.EDITORIAL_ONLY },
  // Page 3 — [P, L, L, P, P, L, P, P, P]
  { id: '19', url: '/images/16.jpg', title: 'Dawn Wader',        category: 'Portrait',     description: "The sun just cleared the horizon. He's already in the water. Neither of them is in a hurry.", aspectRatio: 0.562, licenseType: LicenseType.RIGHTS_MANAGED },
  { id: '20', url: '/images/17.jpg', title: 'Knot Theory',       category: 'Abstract',     description: "No beginning. No end. Just rope, pressing into rope, holding everything together by sheer persistence.", aspectRatio: 1.776, licenseType: LicenseType.ROYALTY_FREE },
  { id: '21', url: '/images/21.jpg', title: 'Specimen 911',      category: 'Automotive',   description: "Behind glass, it can't be touched. That was always the point.", aspectRatio: 1.778, licenseType: LicenseType.EDITORIAL_ONLY },
  { id: '22', url: '/images/18.jpg', title: 'Circle of Warmth',  category: 'Street',       description: "The fire is the only honest thing here. Everything else fades into the dark.", aspectRatio: 0.563, licenseType: LicenseType.RIGHTS_MANAGED },
  { id: '23', url: '/images/19.jpg', title: 'The Only Way Up',   category: 'Landscape',    description: "The light is real. The exit isn't close. The cave doesn't care which way you think is out.", aspectRatio: 0.563, licenseType: LicenseType.ROYALTY_FREE },
  { id: '24', url: '/images/22.jpg', title: 'Display Model',     category: 'Automotive',   description: "It breathes, but just barely. The glass keeps it perfect and perfectly unreachable.", aspectRatio: 1.777, licenseType: LicenseType.CUSTOM },
  { id: '25', url: '/images/43.jpg', title: 'Lone Pedestrian',   category: 'Street',       description: "Dead center. Umbrella up. The road is symmetrical. Only the person is not.", aspectRatio: 0.563, licenseType: LicenseType.RIGHTS_MANAGED },
  { id: '26', url: '/images/44.jpg', title: 'Last Round',        category: 'Street',       description: "Two glasses. One year ending. The grain remembers what the mind won't.", aspectRatio: 0.563, licenseType: LicenseType.ROYALTY_FREE },
  { id: '27', url: '/images/45.jpg', title: 'The Ritual',        category: 'Portrait',     description: "The light found his shoulder before he found the chord. His face doesn't matter. The music does.", aspectRatio: 0.563, licenseType: LicenseType.EDITORIAL_ONLY },
  // Page 4 — [L, L, P, P, P, P, P, P]  (2L + 6P = 14 units, 1 trailing gap filled by dense)
  { id: '28', url: '/images/4.jpg',   title: 'Frosticks',        category: 'Street',    description: "The sign glows like it means it. Everything below it is dark. Cold has never looked this inviting.", aspectRatio: 2.165, licenseType: LicenseType.RIGHTS_MANAGED },
  { id: '29', url: '/images/47.jpg',  title: 'Collective Noise', category: 'Street',    description: "The stage is the only thing with a plan. The crowd just showed up and became one thing.", aspectRatio: 1.778, licenseType: LicenseType.ROYALTY_FREE },
  { id: '30', url: '/images/42.jpg',  title: 'Unannounced',      category: 'Street',    description: "The engine was already running. The night had no warning. Neither did whoever was inside.", aspectRatio: 0.563, licenseType: LicenseType.EDITORIAL_ONLY },
  { id: '31', url: '/images/39.webp', title: 'The Backlit Shelf', category: 'Abstract',  description: "The bottles glow. The bar doesn't. You're already on the wrong side of the counter.", aspectRatio: 0.563, licenseType: LicenseType.RIGHTS_MANAGED },
  { id: '32', url: '/images/46.jpg',  title: 'One Light Left',   category: 'Abstract',  description: "The playground emptied hours ago. One streetlight stayed. The bars cast shadows like they're counting.", aspectRatio: 0.563, licenseType: LicenseType.ROYALTY_FREE },
  { id: '33', url: '/images/48.png',  title: 'High Tide, Raised Hands', category: 'Portrait', description: "Two of them reaching for something. One just standing. The ocean doesn't ask which is which.", aspectRatio: 0.750, licenseType: LicenseType.PERSONAL_USE },
  { id: '34', url: '/images/49.png',  title: 'Walking Into Gold', category: 'Portrait', description: "Sunset at his back. The sea at his feet. He didn't look back, and the light didn't ask him to.", aspectRatio: 0.750, licenseType: LicenseType.RIGHTS_MANAGED },
  { id: '35', url: '/images/50.jpg',  title: 'Campus Dusk',      category: 'Street',    description: "The sky was the whole point. Everyone walking underneath it had no idea.", aspectRatio: 0.563, licenseType: LicenseType.ROYALTY_FREE },
];

const ITEMS_PER_PAGE = 9;

interface GalleryItemProps {
  photo: Photo;
  theme: Theme;
  parallaxSpeed: number;
}

const GalleryItem: React.FC<GalleryItemProps> = ({ photo, theme, parallaxSpeed }) => {
  const navigate = useNavigate();
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const parallax = useParallax<HTMLDivElement>(parallaxSpeed);

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
      className="h-full w-full group relative overflow-hidden rounded-sm transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        ref={parallax.ref}
        style={parallax.style}
        className="relative h-full w-full transition-transform duration-[600ms] ease-[cubic-bezier(0.2,1,0.3,1)]"
      >
        {/* Background Placeholder */}
        <div className={`absolute inset-0 transition-colors duration-500 ${theme === Theme.VIBRANT ? 'bg-gray-200' : 'bg-neutral-900'}`} />

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
            className={`relative z-20 w-full h-full object-cover transition-all duration-700 ease-out transform will-change-transform rounded-sm ${
              theme === Theme.MONOCHROME ? 'grayscale' : ''
            }`}
            style={{ objectFit: 'cover' }}
          />
        )}

        {/* Hover Overlay */}
        <div className={`absolute inset-0 z-30 transition-all duration-500 flex flex-col p-6 justify-end bg-gradient-to-t from-black/90 via-black/50 to-transparent ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className={`transform transition-all duration-500 ease-out ${isHovered ? 'translate-y-0' : 'translate-y-4'}`}>
            {/* Title */}
            <p className="serif italic tracking-wide text-white text-2xl md:text-3xl mb-3">
              {photo.title}
            </p>
            
            {/* Category */}
            <div className="flex items-center gap-3 mb-4">
              <span className="h-[1px] w-8 bg-white/60"></span>
              <p className="text-white/90 text-xs uppercase tracking-[0.2em]">{photo.category}</p>
            </div>

            {/* Description */}
            {photo.description && (
              <p className="text-white/80 text-sm leading-relaxed mb-4">
                {photo.description}
              </p>
            )}

            {/* License Request Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/contact?photoId=${photo.id}`);
              }}
              className={`mt-2 py-2.5 px-4 text-xs tracking-widest font-light transition-all duration-300 border ${
                theme === Theme.VIBRANT
                  ? 'border-white/30 text-white hover:bg-white/10 hover:border-white/50'
                  : 'border-white/20 text-white hover:bg-white/10 hover:border-white/40'
              }`}
            >
              REQUEST LICENSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const HeroWorks: React.FC<HeroWorksProps> = ({ theme }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isGestureEnabled, setIsGestureEnabled] = useState(false);
  const [gridColumns, setGridColumns] = useState(3);
  const [gridRowHeight, setGridRowHeight] = useState(280);
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

  // Calculate optimal grid columns and row height based on viewport
  useEffect(() => {
    const updateGrid = () => {
      const width = window.innerWidth;
      if (width < 700) {
        setGridColumns(1);
        setGridRowHeight(220);
      } else if (width < 1100) {
        setGridColumns(2);
        setGridRowHeight(250);
      } else {
        setGridColumns(3);
        setGridRowHeight(280);
      }
    };

    updateGrid();
    window.addEventListener('resize', updateGrid);
    return () => window.removeEventListener('resize', updateGrid);
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

  // Uniform masonry grid: all items 1 column wide.
  // Portrait images (ratio < 0.85) get rowSpan=2 for a tall cell;
  // landscape images get rowSpan=1 for a shorter wide cell.
  // Dense auto-placement fills every gap automatically.
  const calculateGridLayout = (photos: Photo[], _columns: number) => {
    return photos.map((photo) => ({
      photo,
      colSpan: 1,
      rowSpan: photo.aspectRatio < 0.85 ? 2 : 1,
    }));
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
    setCurrentPage(page);
    scrollToWorks();
  };

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
        <h1 className={`text-[5rem] sm:text-[9rem] md:text-[15rem] xl:text-[25rem] leading-none font-bold serif tracking-tighter ${theme === Theme.VIBRANT ? 'text-black' : 'text-white'}`}>
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
              className={`text-5xl sm:text-7xl md:text-9xl font-light serif ${
                theme === Theme.VIBRANT ? 'leading-[1.12] pb-[2px]' : 'leading-tight'
              } animate-[slideUpReveal_1.5s_cubic-bezier(0.2,1,0.3,1)_0.5s_forwards] translate-y-full opacity-0 inline-flex items-center justify-center gap-2 ${
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
                  ? 'bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent leading-[1.12] pb-[2px]'
                  : ''
                }
              />
              <span className={theme === Theme.VIBRANT 
                ? 'bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent leading-[1.12] pb-[2px]' 
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
        className="relative py-10 md:py-20 px-4 md:px-8 overflow-hidden z-10 snap-section"
        {...worksSwipe.bind}
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-10 md:mb-20 flex flex-col md:flex-row justify-between items-center md:items-end gap-4 md:gap-8">
            <h2
              ref={worksHeadingAnimation.ref}
              style={worksHeadingAnimation.style}
              className={`text-3xl sm:text-4xl md:text-6xl serif text-center md:text-left ${
              theme === Theme.VIBRANT
                ? 'bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent'
                : 'text-white'
            }`}
            >
              Selected Works
            </h2>
          </div>

          {/* Uniform masonry grid — dense auto-placement fills all gaps */}
          <div
            ref={containerRef}
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
              gridAutoRows: `${gridRowHeight}px`,
              gridAutoFlow: 'dense',
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
                    parallaxSpeed={parallaxSpeed}
                  />
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
              <div className={`mt-12 md:mt-24 flex justify-center items-center gap-4 md:gap-8 ${theme === Theme.VIBRANT ? 'text-black' : 'text-white'}`}>
                  <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="disabled:opacity-20 hover:opacity-50 transition-opacity uppercase tracking-widest text-[10px] font-bold min-w-[44px] min-h-[44px] flex items-center justify-center"
                  >
                      Prev
                  </button>

                  <div className="flex gap-2 md:gap-4">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                          <button
                              key={number}
                              onClick={() => handlePageChange(number)}
                              className={`w-11 h-11 flex items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
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
                      className="disabled:opacity-20 hover:opacity-50 transition-opacity uppercase tracking-widest text-[10px] font-bold min-w-[44px] min-h-[44px] flex items-center justify-center"
                  >
                      Next
                  </button>
              </div>
          )}
        </div>
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
