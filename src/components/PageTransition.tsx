import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * PageTransition
 *
 * Provides smooth page transitions with fade effect.
 * The noise/grain overlay is handled separately by TransitionGrain component.
 */
const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.5,
        ease: [0.22, 0.61, 0.36, 1],
      }}
      style={{
        width: '100%',
        minHeight: '100vh',
        position: 'relative',
        willChange: 'opacity',
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
