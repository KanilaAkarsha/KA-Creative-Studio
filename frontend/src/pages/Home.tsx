import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/sections/Hero';
import Services from '../components/sections/Services';
import Portfolio from '../components/sections/Portfolio';
import Shop from '../components/sections/Shop';
import About from '../components/sections/About';
import Stats from '../components/sections/Stats';
import Testimonials from '../components/sections/Testimonials';
import CTA from '../components/sections/CTA';
import Contact from '../components/sections/Contact';

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace('#', '');
    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    return () => clearTimeout(timer);
  }, [location.hash]);

  return (
    <main>
      <Hero />
      <Services />
      <Portfolio />
      <Shop />
      <About />
      <Stats />
      <Testimonials />
      <CTA />
      <Contact />
    </main>
  );
}
