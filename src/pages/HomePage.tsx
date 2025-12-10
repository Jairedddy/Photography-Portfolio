import React from 'react';
import { Theme } from '../types';
import Navbar from '../components/Navbar';
import HeroWorks from '../components/HeroWorks';
import Footer from '../components/Footer';
import CustomCursor from '../components/CustomCursor';

interface HomePageProps {
  theme: Theme;
  toggleTheme: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ theme, toggleTheme }) => {
  return (
    <div className={`min-h-screen transition-colors duration-700 ${theme === Theme.LIGHT ? 'bg-[#fafafa]' : 'bg-neutral-950'}`}>
      <CustomCursor theme={theme} />
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      
      <main>
        <HeroWorks theme={theme} />
      </main>

      <Footer theme={theme} />
    </div>
  );
};

export default HomePage;

