import React, { useEffect } from 'react';
import { motion, Variants } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  variant?: 'fade' | 'slide' | 'scale';
}

// Core variants for enter/exit animations
const variants: Record<'fade' | 'slide' | 'scale', Variants> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { x: '-100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '100%', opacity: 0 },
  },
  scale: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
  },
};

/**
 * PageTransition
 *
 * Wrap individual route page content with this component
 * to get smooth fade/slide/scale transitions between pages.
 */
const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  variant = 'fade',
}) => {
  // Scroll to top on mount (i.e., when route content appears)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const selectedVariant = variants[variant];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={selectedVariant}
      transition={{
        duration: 0.45,
        ease: [0.22, 0.61, 0.36, 1],
      }}
      style={{
        width: '100%',
        minHeight: '100vh',
        position: 'relative',
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;

