import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import Navbar from '../Header/Navbar';
import Footer from '../Footer/Footer';
import { CustomCursor } from '../interactive/CustomCursor';
import { ScrollProgress } from '../interactive/ScrollProgress';
import { SmoothScroll } from '../interactive/SmoothScroll';
import { CommandPalette } from '../interactive/CommandPalette';
import { markReady } from '../../lib/preloader';
import { ChapterRail } from '../interactive/ChapterRail';
import { LayoutGrid } from '../interactive/LayoutGrid';

function Layout() {
  useEffect(() => markReady('app'), []);

  return (
    // reducedMotion="user" makes every framer-motion transform/loop honour the OS setting.
    <MotionConfig reducedMotion="user">
      <main className="min-h-screen bg-canvas text-ink">
        <SmoothScroll />
        <ScrollProgress />
        <CustomCursor />
        <Navbar />
        <ChapterRail />
        <Outlet />
        <Footer />
        <CommandPalette />
        <LayoutGrid />
      </main>
    </MotionConfig>
  );
}

export default Layout;
