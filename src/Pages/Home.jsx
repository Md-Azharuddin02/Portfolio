import React from 'react';
import HomePageHero from '../Components/Home/HomePageHero';
import Skills from '../Components/Home/Skills';
import About from '../Components/Home/About';
import Project from '../Components/Home/Project';
import Testimonial from '../Components/Home/Testimonial';
import ContactMe from '../Components/Home/ContactMe';

function Home() {
  return (
    <>
      <HomePageHero />
      <Skills />
      <About />
      <Project />
      <Testimonial />
      <ContactMe />
    </>
  );
}

export default Home; 
