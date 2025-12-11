import { useState, useCallback, useRef, useEffect } from "react";
import { Theme } from "@/types";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";

interface TextScrambleProps {
  text: string;
  className?: string;
  theme: Theme;
  isActive?: boolean;
}

export function TextScramble({ text, className = "", theme, isActive = false }: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const frameRef = useRef(0);

  const scramble = useCallback(() => {
    setIsScrambling(true);
    frameRef.current = 0;
    const duration = text.length * 3;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      frameRef.current++;

      const progress = frameRef.current / duration;
      const revealedLength = Math.floor(progress * text.length);

      const newText = text
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          if (i < revealedLength) return text[i];
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");

      setDisplayText(newText);

      if (frameRef.current >= duration) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
        setIsScrambling(false);
      }
    }, 30);
  }, [text]);

  const handleMouseEnter = () => {
    setIsHovering(true);
    scramble();
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Theme-based colors
  const textColor = theme === Theme.VIBRANT ? 'text-black' : 'text-neutral-300';
  const activeTextColor = theme === Theme.VIBRANT ? 'text-black' : 'text-white';
  const borderColor = theme === Theme.VIBRANT ? 'bg-gray-300' : 'bg-neutral-700';
  const underlineColor = theme === Theme.VIBRANT ? 'bg-black' : 'bg-white';
  const glowColor = theme === Theme.VIBRANT ? 'bg-black/5' : 'bg-white/5';
  const scrambleColor = theme === Theme.VIBRANT ? 'text-black' : 'text-white';

  return (
    <div
      className={`group relative inline-flex flex-col cursor-pointer select-none ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className={`relative text-sm tracking-widest uppercase ${isActive ? activeTextColor : textColor}`}>
        {displayText.split("").map((char, i) => {
          const isScrambled = isScrambling && char !== text[i];
          const colorIndex = i % 6;
          const vibrantColors = [
            'text-purple-500',
            'text-pink-500',
            'text-orange-500',
            'text-blue-500',
            'text-green-500',
            'text-yellow-500'
          ];
          
          return (
            <span
              key={i}
              className={`inline-block transition-all duration-150 ${
                isScrambled 
                  ? `${theme === Theme.VIBRANT ? vibrantColors[colorIndex] : scrambleColor} scale-110 font-bold` 
                  : ""
              }`}
              style={{
                transitionDelay: `${i * 10}ms`,
              }}
            >
              {char}
            </span>
          );
        })}
      </span>

      {/* Animated underline */}
      <span className="relative h-px w-full mt-2 overflow-hidden">
        <span
          className={`absolute inset-0 ${underlineColor} transition-transform duration-500 ease-out origin-left ${
            isHovering || isActive ? "scale-x-100" : "scale-x-0"
          }`}
        />
        <span className={`absolute inset-0 ${borderColor}`} />
      </span>

      {/* Subtle glow on hover */}
      <span
        className={`absolute -inset-4 rounded-lg ${glowColor} transition-opacity duration-300 -z-10 ${
          isHovering ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

