import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface AnimatedWordFlipProps {
  words: string[];
  interval?: number;
  className?: string;
  wordClassName?: string;
}

export function AnimatedWordFlip({ 
  words, 
  interval = 2000,
  className = "",
  wordClassName = ""
}: AnimatedWordFlipProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentIndex === words.length - 1) {
        setCurrentIndex(0);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    }, interval);
    return () => clearTimeout(timeoutId);
  }, [currentIndex, words.length, interval]);

  return (
    <span className={`relative inline-block ${className}`} style={{ verticalAlign: 'baseline' }}>
      {/* Invisible spacer to maintain width */}
      <span className="invisible whitespace-nowrap">{words[currentIndex]}</span>
      {words.map((word, index) => (
        <motion.span
          key={index}
          className={`absolute left-0 top-0 whitespace-nowrap ${wordClassName}`}
          initial={{ opacity: 0, y: "150%" }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
          animate={
            currentIndex === index
              ? {
                  y: 0,
                  opacity: 1,
                }
              : {
                  y: "150%",
                  opacity: 0,
                }
          }
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

