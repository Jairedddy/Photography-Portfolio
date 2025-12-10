import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Theme } from './types';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

const App: React.FC = () => {
  // Default theme set to DARK as requested
  const [theme, setTheme] = useState<Theme>(Theme.DARK);

  const toggleTheme = () => {
    setTheme(prev => prev === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
  };

  useEffect(() => {
    // Set background color of body based on theme for overscroll areas
    document.body.style.backgroundColor = theme === Theme.LIGHT ? '#fafafa' : '#0c0c0c';
    
    // Add theme class for text selection colors
    if (theme === Theme.LIGHT) {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
    } else {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
    }
    
    // Update favicon based on theme
    const favicon = document.getElementById('favicon') as HTMLLinkElement;
    if (favicon) {
      favicon.href = theme === Theme.LIGHT ? '/favicon-light.svg' : '/favicon-dark.svg';
    }
  }, [theme]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/about" element={<AboutPage theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/contact" element={<ContactPage theme={theme} toggleTheme={toggleTheme} />} />
      </Routes>
    </Router>
  );
};

export default App;
