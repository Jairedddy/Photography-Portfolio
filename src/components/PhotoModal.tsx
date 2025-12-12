import React, { useEffect, useRef, useLayoutEffect, useState, useCallback } from 'react';
import { Photo, Theme } from '../types';
import { X } from 'lucide-react';
import LightboxNavigation from './LightboxNavigation';

interface PhotoModalProps {
  photo: Photo;
  photos?: Photo[]; // Optional: if provided, enables lightbox navigation
  currentIndex?: number; // Optional: current photo index in photos array
  theme: Theme;
  originRect: DOMRect | null;
  onClose: () => void;
}

const PhotoModal: React.FC<PhotoModalProps> = ({ 
  photo, 
  photos, 
  currentIndex = 0, 
  theme, 
  originRect, 
  onClose 
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(currentIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  
  // Use photos array if provided, otherwise use single photo
  const photosArray = photos && photos.length > 0 ? photos : [photo];
  const currentPhoto = photosArray[activeIndex] || photo;
  
  // Update activeIndex when currentIndex prop changes
  useEffect(() => {
    if (currentIndex >= 0 && currentIndex < photosArray.length) {
      setActiveIndex(currentIndex);
    }
  }, [currentIndex, photosArray.length]);
  
  // Preload adjacent images
  useEffect(() => {
    const preloadImages = () => {
      const indicesToPreload = [
        activeIndex - 1,
        activeIndex + 1,
      ].filter(index => index >= 0 && index < photosArray.length);
      
      indicesToPreload.forEach(index => {
        const img = new Image();
        img.src = photosArray[index].url;
      });
    };
    
    preloadImages();
  }, [activeIndex, photosArray]);
  
  // Update URL hash when photo changes
  useEffect(() => {
    if (photos && photos.length > 0) {
      const photoId = photosArray[activeIndex]?.id;
      if (photoId) {
        window.history.replaceState(null, '', `#photo-${photoId}`);
      }
    }
  }, [activeIndex, photosArray, photos]);
  
  // Handle initial hash on mount
  useEffect(() => {
    if (photos && photos.length > 0) {
      const hash = window.location.hash;
      if (hash.startsWith('#photo-')) {
        const photoId = hash.replace('#photo-', '');
        const index = photos.findIndex(p => p.id === photoId);
        if (index !== -1) {
          setActiveIndex(index);
        }
      }
    }
  }, [photos]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { 
      document.body.style.overflow = 'auto';
      // Clear hash on close
      if (window.location.hash.startsWith('#photo-')) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    };
  }, []);
  
  const handlePrevious = useCallback(() => {
    if (activeIndex > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setActiveIndex(prev => prev - 1);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  }, [activeIndex, isTransitioning]);
  
  const handleNext = useCallback(() => {
    if (activeIndex < photosArray.length - 1 && !isTransitioning) {
      setIsTransitioning(true);
      setActiveIndex(prev => prev + 1);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  }, [activeIndex, photosArray.length, isTransitioning]);
  
  const handleThumbnailClick = useCallback((index: number) => {
    if (index !== activeIndex && !isTransitioning) {
      setIsTransitioning(true);
      setActiveIndex(index);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  }, [activeIndex, isTransitioning]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    
    if (contentRef.current && originRect) {
      const el = contentRef.current;
      const destRect = el.getBoundingClientRect();

      // Reverse calculations
      const deltaX = originRect.left - destRect.left;
      const deltaY = originRect.top - destRect.top;
      const scaleX = originRect.width / destRect.width;
      const scaleY = originRect.height / destRect.height;

      // Animate back to origin
      el.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease-in';
      el.style.transformOrigin = 'top left';
      el.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`;
      el.style.opacity = '0';
      
      // Delay unmount until animation finishes
      setTimeout(onClose, 500);
    } else {
      onClose();
    }
  }, [originRect, onClose]);
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isClosing || isTransitioning) return;
      
      switch (e.key) {
        case 'Escape':
          handleClose();
          break;
        case 'ArrowLeft':
          if (photos && photos.length > 1) {
            e.preventDefault();
            handlePrevious();
          }
          break;
        case 'ArrowRight':
          if (photos && photos.length > 1) {
            e.preventDefault();
            handleNext();
          }
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isClosing, isTransitioning, photos, handleClose, handlePrevious, handleNext]);
  
  // Touch event handlers for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!photos || photos.length <= 1) return;
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!photos || photos.length <= 1) return;
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };
  
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd || !photos || photos.length <= 1) return;
    
    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isLeftSwipe = distanceX > 50;
    const isRightSwipe = distanceX < -50;
    const isVerticalSwipe = Math.abs(distanceY) > Math.abs(distanceX);
    
    // Only handle horizontal swipes
    if (!isVerticalSwipe) {
      if (isLeftSwipe && activeIndex < photos.length - 1) {
        handleNext();
      } else if (isRightSwipe && activeIndex > 0) {
        handlePrevious();
      }
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };
  
  // FLIP Open Animation
  useLayoutEffect(() => {
    if (contentRef.current && originRect) {
      const el = contentRef.current;
      
      // 1. Measure the final state (centered)
      const destRect = el.getBoundingClientRect();
      
      // 2. Calculate transform delta
      // Origin left - Destination left
      const deltaX = originRect.left - destRect.left;
      const deltaY = originRect.top - destRect.top;
      
      // Calculate Scale
      const scaleX = originRect.width / destRect.width;
      const scaleY = originRect.height / destRect.height;

      // 3. Set Initial State (Inverted)
      el.style.transformOrigin = 'top left';
      el.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`;
      el.style.opacity = '0.8'; // Slight transparency to mimic the thumb overlay feel

      // 4. Force reflow
      el.getBoundingClientRect();

      // 5. Play to Final State
      requestAnimationFrame(() => {
        el.style.transition = 'transform 0.6s cubic-bezier(0.2, 1, 0.3, 1), opacity 0.6s ease-out';
        el.style.transform = 'translate(0, 0) scale(1, 1)';
        el.style.opacity = '1';
      });
    }
  }, [originRect]);


  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity duration-500 ${isClosing ? 'opacity-0' : 'opacity-100 animate-[fadeIn_0.5s_ease-out]'}`}
        onClick={handleClose}
      />
      
      {/* Content */}
      <div 
        ref={contentRef}
        className={`relative w-full max-w-6xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden shadow-2xl ${theme === Theme.VIBRANT ? 'bg-[#fafafa]' : 'bg-neutral-900'}`}
      >
        
        {/* Image Container */}
        <div 
          ref={imageContainerRef}
          className="flex-1 bg-black flex items-center justify-center relative overflow-hidden group"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <img 
              key={currentPhoto.id}
              src={currentPhoto.url} 
              alt={currentPhoto.title}
              className={`max-h-[60vh] md:max-h-[90vh] w-auto object-contain transition-opacity duration-300 ${
                isTransitioning ? 'opacity-0' : 'opacity-100'
              } ${theme === Theme.MONOCHROME ? 'grayscale' : ''}`}
            />
          </div>
          
          {/* Lightbox Navigation */}
          {photos && photos.length > 1 && (
            <LightboxNavigation
              photos={photos}
              currentIndex={activeIndex}
              theme={theme}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onThumbnailClick={handleThumbnailClick}
            />
          )}
        </div>

        {/* Details Panel - Fade in text slightly delayed */}
        <div className={`w-full md:w-96 flex flex-col p-8 md:p-12 shrink-0 transition-opacity duration-700 delay-200 ${isClosing ? 'opacity-0' : 'opacity-100'} ${theme === Theme.VIBRANT ? 'text-black' : 'text-white'}`}>
          <button 
            onClick={handleClose}
            className={`self-end mb-8 p-2 rounded-full hover:bg-opacity-10 transition-colors ${theme === Theme.VIBRANT ? 'hover:bg-black' : 'hover:bg-white'}`}
          >
            <X className="w-6 h-6" />
          </button>

          <div className="space-y-6 mt-auto md:mt-0">
            <div>
              <p className="text-xs tracking-widest uppercase opacity-50 mb-2">{currentPhoto.category}</p>
              <h3 className="text-3xl md:text-4xl serif font-light">{currentPhoto.title}</h3>
            </div>
            
            <div className="w-12 h-[1px] bg-current opacity-20" />
            
            <p className={`text-sm leading-relaxed ${theme === Theme.VIBRANT ? 'text-gray-600' : 'text-gray-400'}`}>
              {currentPhoto.description || "A study in contrast and light. This piece explores the subtle gradients between absolute black and blinding white, capturing a moment of stillness in a chaotic world."}
            </p>

            <div className="pt-8 mt-auto flex items-center justify-between text-xs tracking-widest uppercase opacity-50">
              <span>ISO 400</span>
              <span>35mm</span>
              <span>f/2.8</span>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default PhotoModal;