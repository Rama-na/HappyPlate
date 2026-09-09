import { useEffect, useState } from 'react';
import { initSmoothScroll, scrollToId } from './animations/lenis';
import { ScrollTrigger, refreshOnLoad } from './animations/gsap';

import { IntroLoader } from './components/IntroLoader';
import { TravelingPlate } from './components/TravelingPlate';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { TheTable } from './components/TheTable';
import { Principles } from './components/Principles';
import { EveningTimeline } from './components/EveningTimeline';
import { Food } from './components/Food';
import { Atmosphere } from './components/Atmosphere';
import { People } from './components/People';
import { Dinners } from './components/Dinners';
import { FinalCTA } from './components/FinalCTA';
import { Reservation } from './components/Reservation';
import { Footer } from './components/Footer';

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stopScroll = initSmoothScroll();
    const stopRefresh = refreshOnLoad();
    return () => { stopScroll(); stopRefresh(); };
  }, []);

  // the intro overlay changes layout height; measure again once it's gone
  useEffect(() => {
    if (ready) ScrollTrigger.refresh();
  }, [ready]);

  return (
    <>
      <IntroLoader onDone={() => setReady(true)} />
      <TravelingPlate />
      <div className="grain" aria-hidden="true" />

      <a
        className="skip-link"
        href="#reserve"
        onClick={(e) => { e.preventDefault(); scrollToId('reserve'); }}
      >
        Skip to reservation
      </a>

      <Navigation />

      <main id="main">
        <Hero ready={ready} />
        <About />
        <TheTable />
        <Principles />
        <EveningTimeline />
        <Food />
        <Atmosphere />
        <People />
        <Dinners />
        <FinalCTA />
        <Reservation />
      </main>

      <Footer />
    </>
  );
}
