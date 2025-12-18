import React, { useRef, useEffect, useState } from 'react';
import { Theme } from '../types';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface HorizontalScrollCarouselProps {
  theme: Theme;
}

// Stock portrait photos - square aspect ratio
const PORTRAIT_PHOTOS = [
  { id: '1', url: 'https://picsum.photos/500/500?random=101', title: 'Portrait 1' },
  { id: '2', url: 'https://picsum.photos/500/500?random=102', title: 'Portrait 2' },
  { id: '3', url: 'https://picsum.photos/500/500?random=103', title: 'Portrait 3' },
  { id: '4', url: 'https://picsum.photos/500/500?random=104', title: 'Portrait 4' },
  { id: '5', url: 'https://picsum.photos/500/500?random=105', title: 'Portrait 5' },
  { id: '6', url: 'https://picsum.photos/500/500?random=106', title: 'Portrait 6' },
  { id: '7', url: 'https://picsum.photos/500/500?random=107', title: 'Portrait 7' },
  { id: '8', url: 'https://picsum.photos/500/500?random=108', title: 'Portrait 8' },
  { id: '9', url: 'https://picsum.photos/500/500?random=109', title: 'Portrait 9' },
  { id: '10', url: 'https://picsum.photos/500/500?random=110', title: 'Portrait 10' },
  { id: '11', url: 'https://picsum.photos/500/500?random=111', title: 'Portrait 11' },
  { id: '12', url: 'https://picsum.photos/500/500?random=112', title: 'Portrait 12' },
  { id: '13', url: 'https://picsum.photos/500/500?random=113', title: 'Portrait 13' },
  { id: '14', url: 'https://picsum.photos/500/500?random=114', title: 'Portrait 14' },
  { id: '15', url: 'https://picsum.photos/500/500?random=115', title: 'Portrait 15' },
];

const PHOTO_SPACING = 550; // Spacing between images (photos are 500px wide)

const HorizontalScrollCarousel: React.FC<HorizontalScrollCarouselProps> = ({ theme }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sectionHeight, setSectionHeight] = useState(0);

  // Motion values for smooth animations
  const scrollX = useMotionValue(0);
  const smoothScrollX = useSpring(scrollX, {
    stiffness: 150,
    damping: 40,
    mass: 0.8,
  });

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate section height dynamically based on viewport and horizontal scroll distance
  useEffect(() => {
    if (isMobile || !containerRef.current) return;

    const calculateHeight = () => {
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const containerWidth = PORTRAIT_PHOTOS.length * PHOTO_SPACING;
      const maxHorizontalScroll = Math.max(0, containerWidth - viewportWidth);
      
      // Section height = viewport height (for locking) + horizontal scroll distance (for scrolling)
      const requiredHeight = viewportHeight + maxHorizontalScroll;
      setSectionHeight(requiredHeight);
    };

    calculateHeight();
    window.addEventListener('resize', calculateHeight);
    return () => window.removeEventListener('resize', calculateHeight);
  }, [isMobile]);

  // Handle scroll and sticky positioning
  useEffect(() => {
    if (!sectionRef.current || isMobile || !containerRef.current) return;

    const updateScroll = (virtualScrollY?: number) => {
      const section = sectionRef.current;
      const container = containerRef.current;
      if (!section || !container) return;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const sectionTop = rect.top;
      const sectionBottom = rect.bottom;
      const sectionStart = section.offsetTop;
      
      // Calculate horizontal scroll distance needed
      const containerWidth = PORTRAIT_PHOTOS.length * PHOTO_SPACING;
      const maxHorizontalScroll = Math.max(0, containerWidth - viewportWidth);
      
      const currentScrollY = typeof virtualScrollY === 'number' ? virtualScrollY : window.scrollY;
      
      // Lock point: Section is fully locked when:
      // 1. Section top has reached viewport top (sectionTop <= 0)
      // 2. Section bottom is still at or above viewport bottom (sectionBottom >= viewportHeight)
      // This ensures the section is 100% in viewport before scrolling starts
      const isFullyLocked = sectionTop <= 0 && sectionBottom >= viewportHeight;
      
      // Calculate progress only when fully locked
      let progress = 0;
      let shouldBeSticky = false;
      
      if (isFullyLocked) {
        shouldBeSticky = true;
        // Calculate how much we've scrolled past the lock point
        const scrollPastLock = Math.max(0, currentScrollY - sectionStart);
        // Progress is based on how much we've scrolled relative to the horizontal distance needed
        progress = Math.min(1, scrollPastLock / maxHorizontalScroll);
      } else if (sectionTop < 0 && sectionBottom < viewportHeight) {
        // Section is past the viewport - maintain sticky state and max progress
        shouldBeSticky = true;
        progress = 1;
      }

      if (shouldBeSticky !== isSticky) {
        setIsSticky(shouldBeSticky);
      }

      if (shouldBeSticky) {
        // Map vertical scroll progress to horizontal position
        const targetX = progress * maxHorizontalScroll;
        scrollX.set(targetX);
      } else {
        // Reset when not locked
        scrollX.set(0);
      }
    };

    const lenis = (window as Window & { __lenis?: { on?: (event: string, cb: (e: any) => void) => void; off?: (event: string, cb: (e: any) => void) => void; } }).__lenis;
    const handleLenisScroll = (e: { scroll?: number }) => updateScroll(e?.scroll);
    const handleWindowScroll = () => updateScroll();
    const handleResize = () => updateScroll();

    updateScroll();

    if (lenis?.on) {
      lenis.on('scroll', handleLenisScroll);
    } else {
      window.addEventListener('scroll', handleWindowScroll, { passive: true });
    }

    window.addEventListener('resize', handleResize);

    return () => {
      if (lenis?.off) {
        lenis.off('scroll', handleLenisScroll);
      } else {
        window.removeEventListener('scroll', handleWindowScroll);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile, isSticky, scrollX, sectionHeight]);

  // Theme-aware styles
  const isMonochrome = theme === Theme.MONOCHROME;
  const photoFilter = isMonochrome ? 'grayscale' : '';

  if (isMobile) {
    // Mobile: Vertical stacking
    return (
      <section
        ref={sectionRef}
        className="relative py-20 px-6"
      >
        <div className="max-w-2xl mx-auto">
          <div className="space-y-8">
            {PORTRAIT_PHOTOS.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                <div className="relative overflow-hidden rounded-sm shadow-lg">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className={`w-full h-auto object-cover ${photoFilter} transition-all duration-500`}
                    style={{ aspectRatio: '1/1' }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ 
        height: sectionHeight > 0 ? `${sectionHeight}px` : '100vh',
        minHeight: '100vh',
      }}
    >
      
      <div
        className={`sticky top-20 flex items-center overflow-hidden ${
          isSticky ? 'transition-all duration-500 ease-out' : ''
        }`}
        style={{
          height: 'calc(90vh - 5rem)',
          paddingLeft: '5%',
          paddingRight: '5%',
          paddingTop: '2rem',
        }}
      >
        {/* Horizontal scroll container */}
        <div
          ref={containerRef}
          className="relative w-full flex items-center"
          style={{
            height: '100%',
            minWidth: `${PORTRAIT_PHOTOS.length * PHOTO_SPACING}px`,
          }}
        >
          {/* Render all photos */}
          {PORTRAIT_PHOTOS.map((photo, index) => {
            return (
              <motion.div
                key={photo.id}
                className="absolute flex items-center"
                style={{
                  x: useTransform(smoothScrollX, (x) => -x),
                  left: `${index * PHOTO_SPACING}px`,
                  zIndex: 10,
                  height: '100%',
                }}
              >
                <motion.div
                  className="relative flex-shrink-0"
                  style={{
                    width: '500px',
                    height: '500px',
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <div
                    className="relative w-full h-full overflow-hidden rounded-sm shadow-2xl"
                    style={{
                      boxShadow: isMonochrome
                        ? `0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)`
                        : `0 20px 60px rgba(139,92,246,0.3), 0 0 0 1px rgba(139,92,246,0.1)`,
                    }}
                  >
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className={`w-full h-full object-cover ${photoFilter} transition-all duration-500`}
                      style={{ aspectRatio: '1/1' }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HorizontalScrollCarousel;
