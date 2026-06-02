import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Header/Navbar';
import Footer from '../Footer/Footer';
import { ThemeContext } from '../../Store/ThemeContext ';
import { CustomCursor } from '../../components/interactive/CustomCursor';
import { ScrollProgress } from '../../components/interactive/ScrollProgress';
import { SmoothScroll } from '../../components/interactive/SmoothScroll';

function Layout() {
  const { isDark, theme } = useContext(ThemeContext);

  return (
    <main className={`min-h-screen ${isDark ? 'bg-[#070A12]' : 'bg-[#F7F7F2]'} ${theme.themeColor}`}>
      <SmoothScroll />
      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      <Outlet />
      <Footer/>
    </main>
  );
}

export default Layout; 
