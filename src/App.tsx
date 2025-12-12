import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Theme } from './types';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import { useScrollGrain } from './hooks/useScrollGrain';
import { useLenis } from './hooks/useLenis';
import ScrollProgressBar from './components/ScrollProgressBar';
import PageTransition from './components/PageTransition';
import TransitionGrain from './components/TransitionGrain';

const App: React.FC = () => {
  // Default theme set to MONOCHROME as requested
  const [theme, setTheme] = useState<Theme>(Theme.MONOCHROME);

  useLenis();
  const toggleTheme = () => {
    setTheme(prev => prev === Theme.VIBRANT ? Theme.MONOCHROME : Theme.VIBRANT);
  };

  useScrollGrain(theme);

  useEffect(() => {
    // Set background color of body based on theme for overscroll areas
    // MONOCHROME = dark background, VIBRANT = light background
    document.body.style.backgroundColor = theme === Theme.VIBRANT ? '#fafafa' : '#0c0c0c';
    
    // Add theme class for text selection colors
    if (theme === Theme.VIBRANT) {
      document.documentElement.classList.add('vibrant-theme');
      document.documentElement.classList.remove('monochrome-theme');
    } else {
      document.documentElement.classList.add('monochrome-theme');
      document.documentElement.classList.remove('vibrant-theme');
    }
    
    // Update favicon based on theme
    const favicon = document.getElementById('favicon') as HTMLLinkElement;
    if (favicon) {
      favicon.href = theme === Theme.VIBRANT ? '/favicon-light.svg' : '/favicon-dark.svg';
    }
  }, [theme]);

  return (
    <Router>
      <ScrollProgressBar theme={theme} />
      <TransitionGrain />
      <AnimatedRoutes theme={theme} toggleTheme={toggleTheme} />
    </Router>
  );
};

// Separate component to use useLocation hook
const AnimatedRoutes: React.FC<{ theme: Theme; toggleTheme: () => void }> = ({ theme, toggleTheme }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <HomePage theme={theme} toggleTheme={toggleTheme} />
            </PageTransition>
          }
        />
        <Route
          path="/about"
          element={
            <PageTransition>
              <AboutPage theme={theme} toggleTheme={toggleTheme} />
            </PageTransition>
          }
        />
        <Route
          path="/contact"
          element={
            <PageTransition>
              <ContactPage theme={theme} toggleTheme={toggleTheme} />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

export default App;
