import React, { useRef, useEffect, useState } from 'react';
import { Theme } from '../types';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface HorizontalScrollCarouselProps {
  theme: Theme;
}

// Portfolio photos for the About page carousel
const PORTRAIT_PHOTOS = [
  { id: '1',  url: '/images/23.jpg', title: 'Photo 23' },
  { id: '2',  url: '/images/24.jpg', title: 'Photo 24' },
  { id: '3',  url: '/images/25.jpg', title: 'Photo 25' },
  { id: '4',  url: '/images/26.jpg', title: 'Photo 26' },
  { id: '5',  url: '/images/27.jpg', title: 'Photo 27' },
  { id: '6',  url: '/images/28.jpg', title: 'Photo 28' },
  { id: '7',  url: '/images/29.jpg', title: 'Photo 29' },
  { id: '8',  url: '/images/30.jpg', title: 'Photo 30' },
  { id: '9',  url: '/images/31.jpg', title: 'Photo 31' },
  { id: '10', url: '/images/32.jpg', title: 'Photo 32' },
  { id: '11', url: '/images/33.jpg', title: 'Photo 33' },
  { id: '12', url: '/images/34.jpg', title: 'Photo 34' },
  { id: '13', url: '/images/35.jpg', title: 'Photo 35' },
  { id: '14', url: '/images/36.jpg', title: 'Photo 36' },
  { id: '15', url: '/images/37.jpg', title: 'Photo 37' },
];

const PHOTO_SPACING = 550; // Spacing between images (photos are 500px wide)

const HorizontalScrollCarousel: React.FC<HorizontalScrollCarouselProps> = ({ theme }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [sectionHeight, setSectionHeight] = useState(0);

  // Tight spring — tracks scroll closely without lag or bounce
  const scrollX = useMotionValue(0);
  const smoothScrollX = useSpring(scrollX, {
    stiffness: 500,
    damping: 60,
    mass: 0.6,
  });

  // Single transform applied to the whole strip — avoids 15 separate animated values
  const translateX = useTransform(smoothScrollX, (x) => -x);

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
  }, [isMobile, scrollX, sectionHeight]);

  // Theme-aware styles
  const isMonochrome = theme === Theme.MONOCHROME;
  const photoFilter = isMonochrome ? 'grayscale' : '';

  if (isMobile) {
    // Mobile: Vertical stacking
    return (
      <section
        ref={sectionRef}
        className="relative py-10 px-4"
      >
        <div className="max-w-2xl mx-auto">
          <div className="space-y-5">
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
        className="sticky top-20 flex items-center overflow-hidden"
        style={{
          height: 'calc(90vh - 5rem)',
          paddingLeft: '5%',
          paddingRight: '5%',
          paddingTop: '2rem',
        }}
      >
        {/* Single translated strip — one motion value drives all photos */}
        <motion.div
          ref={containerRef}
          className="relative flex items-center flex-shrink-0"
          style={{
            x: translateX,
            height: '100%',
            width: `${PORTRAIT_PHOTOS.length * PHOTO_SPACING}px`,
            willChange: 'transform',
          }}
        >
          {/* Render all photos */}
          {PORTRAIT_PHOTOS.map((photo, index) => {
            return (
              <div
                key={photo.id}
                className="absolute flex items-center"
                style={{
                  left: `${index * PHOTO_SPACING}px`,
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
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default HorizontalScrollCarousel;
