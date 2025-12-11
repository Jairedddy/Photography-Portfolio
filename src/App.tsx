import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Theme } from './types';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import { useScrollGrain } from './hooks/useScrollGrain';
import ScrollProgressBar from './components/ScrollProgressBar';

const App: React.FC = () => {
  // Default theme set to MONOCHROME as requested
  const [theme, setTheme] = useState<Theme>(Theme.MONOCHROME);

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
      <Routes>
        <Route path="/" element={<HomePage theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/about" element={<AboutPage theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/contact" element={<ContactPage theme={theme} toggleTheme={toggleTheme} />} />
      </Routes>
    </Router>
  );
};

export default App;
