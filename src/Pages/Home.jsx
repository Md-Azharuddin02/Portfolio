import React from 'react';
import HomePageHero from '../Components/Home/HomePageHero';
import Skills from '../Components/Home/Skills';
import About from '../Components/Home/About';
import Project from '../Components/Home/Project';
import Testimonial from '../Components/Home/Testimonial';
import ContactMe from '../Components/Home/ContactMe';
import ClosingCTA from '../Components/Home/ClosingCTA';

function Home() {
  return (
    <>
      <HomePageHero />
      <About />
      <Skills />
      <Project />
      <Testimonial />
      <ClosingCTA />
      <ContactMe />
    </>
  );
}

export default Home;
