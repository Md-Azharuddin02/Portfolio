import React from 'react';
import HomePageHero from '../Components/Home/HomePageHero';
import Skills from '../Components/Home/Skills';
import About from '../Components/Home/About';
import Automation from '../Components/Home/Automation';
import Project from '../Components/Home/Project';
import Testimonial from '../Components/Home/Testimonial';
import ContactMe from '../Components/Home/ContactMe';

function Home() {
  return (
    <>
      <HomePageHero />
      <Skills />
      <About />
      <Automation />
      <Project />
      <Testimonial />
      <ContactMe />
    </>
  );
}

export default Home; 
