import React, { useEffect, useRef, useState } from 'react';
import { Theme } from '../types';

interface ParallaxLayer {
  id: string;
  translateZ: number; // Depth position (closer = higher value, moves faster)
  speed: number; // Scroll speed multiplier (closer = faster)
  rotation: number; // Rotation in degrees
  blur: number; // Blur amount (farther = more blur)
  opacity: number;
  content?: React.ReactNode;
}

interface ParallaxLayersProps {
  theme: Theme;
  layers?: ParallaxLayer[];
  className?: string;
  children?: React.ReactNode;
}

const DEFAULT_LAYERS: ParallaxLayer[] = [
  {
    id: 'layer-1',
    translateZ: 200, // Closest - fastest
    speed: 0.8,
    rotation: 2,
    blur: 0,
    opacity: 1,
    content: (
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-teal-500/10 rounded-full scale-150" />
    ),
  },
  {
    id: 'layer-2',
    translateZ: 100,
    speed: 0.5,
    rotation: -1.5,
    blur: 0.5,
    opacity: 0.95,
    content: (
      <div className="absolute inset-0 bg-gradient-to-tl from-blue-500/8 via-transparent to-purple-500/8 rounded-full scale-125" />
    ),
  },
  {
    id: 'layer-3',
    translateZ: 0, // Middle
    speed: 0.3,
    rotation: 1,
    blur: 1,
    opacity: 0.9,
    content: (
      <div className="absolute inset-0 bg-gradient-to-b from-teal-500/6 via-transparent to-transparent rounded-full" />
    ),
  },
  {
    id: 'layer-4',
    translateZ: -100,
    speed: 0.2,
    rotation: -0.5,
    blur: 2,
    opacity: 0.85,
    content: (
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-cyan-500/5 rounded-full scale-75" />
    ),
  },
  {
    id: 'layer-5',
    translateZ: -200, // Farthest - slowest
    speed: 0.1,
    rotation: 0.5,
    blur: 3,
    opacity: 0.8,
    content: (
      <div className="absolute inset-0 bg-gradient-to-t from-purple-500/4 via-transparent to-teal-500/4 rounded-full scale-50" />
    ),
  },
];

const ParallaxLayers: React.FC<ParallaxLayersProps> = ({
  theme,
  layers: customLayers,
  className = '',
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  // Generate theme-aware layers if custom layers not provided
  const layers = React.useMemo(() => {
    if (customLayers) return customLayers;
    
    // For VIBRANT theme, use colorful gradients; for MONOCHROME, use subtle grays
    return DEFAULT_LAYERS.map((layer) => ({
      ...layer,
      content: theme === Theme.VIBRANT ? layer.content : (
        <div 
          className={`absolute inset-0 ${
            layer.translateZ > 0
              ? 'bg-gradient-to-br from-white/5 via-neutral-800/5 to-transparent'
              : 'bg-gradient-to-t from-white/3 via-transparent to-neutral-800/3'
          } rounded-full`} 
          style={{ 
            transform: `scale(${1 + Math.abs(layer.translateZ) / 200})` 
          }} 
        />
      ),
    }));
  }, [customLayers, theme]);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track mouse position for subtle 3D tilt effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      setMouseX((e.clientX - centerX) / centerX);
      setMouseY((e.clientY - centerY) / centerY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Calculate transform for each layer based on scroll and mouse position
  const getLayerTransform = (layer: ParallaxLayer) => {
    // Scroll-based parallax movement
    const scrollOffset = scrollY * layer.speed;
    
    // Mouse-based subtle tilt (reduced for farther layers)
    const mouseTiltX = mouseX * (layer.translateZ / 200) * 5;
    const mouseTiltY = mouseY * (layer.translateZ / 200) * 5;
    
    // Base rotation + scroll-based rotation
    const rotationX = layer.rotation + mouseTiltY * 0.1;
    const rotationY = layer.rotation + mouseTiltX * 0.1;
    
    return {
      transform: `
        translateZ(${layer.translateZ}px)
        translateY(${scrollOffset}px)
        rotateX(${rotationX}deg)
        rotateY(${rotationY}deg)
      `,
      filter: `blur(${layer.blur}px)`,
      opacity: layer.opacity,
    };
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full ${className}`}
      style={{
        perspective: '1000px',
        perspectiveOrigin: '50% 50%',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* 3D Container */}
      <div
        className="relative w-full h-full"
        style={{
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {/* Render each layer */}
        {layers.map((layer, index) => (
          <div
            key={layer.id}
            className="absolute inset-0 w-full h-full"
            style={{
              transformStyle: 'preserve-3d',
              willChange: 'transform, filter, opacity',
              ...getLayerTransform(layer),
              zIndex: layers.length - index, // Closer layers on top
            }}
          >
            {layer.content || (
              <div
                className={`w-full h-full ${
                  theme === Theme.VIBRANT
                    ? 'bg-gradient-to-br from-purple-100/20 via-teal-100/20 to-transparent'
                    : 'bg-gradient-to-br from-white/5 via-neutral-800/10 to-transparent'
                }`}
              />
            )}
          </div>
        ))}

        {/* Main content layer (typically children) */}
        {children && (
          <div
            className="relative w-full h-full"
            style={{
              transformStyle: 'preserve-3d',
              willChange: 'transform',
              transform: `
                translateZ(50px)
                translateY(${scrollY * 0.4}px)
              `,
              zIndex: layers.length + 1,
            }}
          >
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParallaxLayers;

