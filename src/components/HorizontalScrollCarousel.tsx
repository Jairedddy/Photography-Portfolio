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
  const [scrollProgress, setScrollProgress] = useState(0);

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

  // Handle scroll and sticky positioning
  useEffect(() => {
    if (!sectionRef.current || isMobile) return;

    const updateScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top;
      const viewportHeight = window.innerHeight;
      const sectionStart = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const currentScrollY = window.scrollY;
      
      // Section becomes sticky when its top reaches the viewport top
      // Trigger sticky when section top is at or above viewport top
      const stickyTriggerPoint = sectionStart;
      // Use the full section height minus viewport for scrollable area
      const scrollableHeight = Math.max(1, sectionHeight - viewportHeight);
      
      // Calculate progress (0 to 1) based on scroll position
      let progress = 0;
      let shouldBeSticky = false;
      
      // Check if section top has reached or passed viewport top
      if (sectionTop <= 0 && sectionTop + sectionHeight > 0) {
        shouldBeSticky = true;
        // Calculate progress based on how much we've scrolled past the trigger
        const scrolledPastTrigger = Math.max(0, currentScrollY - stickyTriggerPoint);
        progress = Math.min(1, scrolledPastTrigger / scrollableHeight);
      } else if (currentScrollY > stickyTriggerPoint + scrollableHeight) {
        // Section is fully scrolled past
        shouldBeSticky = true;
        progress = 1;
      }

      if (shouldBeSticky !== isSticky) {
        setIsSticky(shouldBeSticky);
      }

      if (shouldBeSticky && progress >= 0) {
        const container = containerRef.current;
        if (container) {
          const containerWidth = PORTRAIT_PHOTOS.length * PHOTO_SPACING;
          const viewportWidth = window.innerWidth;
          const maxScroll = Math.max(0, containerWidth - viewportWidth);
          
          // Map vertical scroll progress to horizontal position (1:1 ratio)
          const targetX = progress * maxScroll;
          
          // Use spring animation for smooth movement
          scrollX.set(targetX);
          setScrollProgress(progress);
        }
      } else if (progress === 0) {
        scrollX.set(0);
        setScrollProgress(0);
      }
    };

    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll);

    return () => {
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
    };
  }, [isSticky, isMobile, scrollX]);

  // Calculate which photo is in focus (closest to center of viewport)
  const getFocusIndex = (): number => {
    const container = containerRef.current;
    if (!container) return 0;
    
    const viewportWidth = window.innerWidth;
    const viewportCenter = viewportWidth / 2;
    const currentX = scrollX.get();
    
    // Find which photo is closest to viewport center
    let closestIndex = 0;
    let minDistance = Infinity;
    
    PORTRAIT_PHOTOS.forEach((_, index) => {
      const photoLeft = index * PHOTO_SPACING - currentX;
      const photoCenter = photoLeft + 250; // 500px / 2
      const distance = Math.abs(viewportCenter - photoCenter);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });
    
    return closestIndex;
  };

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
          <h2 className={`text-3xl md:text-4xl serif mb-12 text-center ${isMonochrome ? 'text-white' : 'text-black'}`}>
            Personal Gallery
          </h2>
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

  // Calculate section height - need enough height for horizontal scroll
  // 7 photos × 400px spacing = 2800px, minus viewport width
  // With 1:1 scroll ratio, we need roughly that much vertical scroll
  const containerWidth = PORTRAIT_PHOTOS.length * PHOTO_SPACING;
  const estimatedViewportWidth = 1920; // Estimate for calculation
  const horizontalScrollDistance = Math.max(0, containerWidth - estimatedViewportWidth);
  const sectionHeightVh = Math.max(200, (horizontalScrollDistance / 1080) * 100 + 100);

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ 
        height: `${sectionHeightVh}vh`,
        minHeight: '90vh',
      }}
    >
      
      <div
        className={`sticky top-0 flex items-center overflow-hidden ${
          isSticky ? 'transition-all duration-500 ease-out' : ''
        }`}
        style={{
          height: '90vh',
          paddingLeft: '5%',
          paddingRight: '5%',
        }}
      >

        {/* Title */}
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-10">
          <h2 className={`text-3xl md:text-4xl serif ${isMonochrome ? 'text-white' : 'text-black'}`}>
            Personal Gallery
          </h2>
        </div>

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
