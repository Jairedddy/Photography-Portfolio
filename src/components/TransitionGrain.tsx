import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

// Noise/grain SVG pattern
const grainPattern = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E`;

/**
 * TransitionGrain
 * 
 * A noise/grain overlay that appears during page transitions.
 * Fades in when navigation starts and fades out when the new page loads.
 */
const TransitionGrain: React.FC = () => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  React.useEffect(() => {
    // Show grain when route changes
    setIsTransitioning(true);
    
    // Hide grain after transition completes
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          key="grain-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="fixed inset-0 pointer-events-none z-[10000]"
          style={{
            backgroundImage: `url("${grainPattern}")`,
            backgroundSize: '200px 200px',
            mixBlendMode: 'overlay',
          }}
        />
      )}
    </AnimatePresence>
  );
};

export default TransitionGrain;

