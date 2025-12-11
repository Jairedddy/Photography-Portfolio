import React, { useEffect, useRef, useLayoutEffect, useState } from 'react';
import { Photo, Theme } from '../types';
import { X, ExternalLink } from 'lucide-react';

interface PhotoModalProps {
  photo: Photo;
  theme: Theme;
  originRect: DOMRect | null;
  onClose: () => void;
}

const PhotoModal: React.FC<PhotoModalProps> = ({ photo, theme, originRect, onClose }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

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

  const handleClose = () => {
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
  };

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
        <div className="flex-1 bg-black flex items-center justify-center relative overflow-hidden group">
          <img 
            src={photo.url} 
            alt={photo.title}
            className={`max-h-[60vh] md:max-h-[90vh] w-auto object-contain transition-transform duration-700 hover:scale-[1.02] ${theme === Theme.MONOCHROME ? 'grayscale' : ''}`}
          />
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
              <p className="text-xs tracking-widest uppercase opacity-50 mb-2">{photo.category}</p>
              <h3 className="text-3xl md:text-4xl serif font-light">{photo.title}</h3>
            </div>
            
            <div className="w-12 h-[1px] bg-current opacity-20" />
            
            <p className={`text-sm leading-relaxed ${theme === Theme.VIBRANT ? 'text-gray-600' : 'text-gray-400'}`}>
              {photo.description || "A study in contrast and light. This piece explores the subtle gradients between absolute black and blinding white, capturing a moment of stillness in a chaotic world."}
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