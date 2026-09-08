import Lenis from 'lenis';
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap';

/**
 * Smooth scrolling, driven by GSAP's ticker so Lenis and ScrollTrigger share a
 * single clock instead of fighting over rAF.
 *
 * `syncTouch` stays off deliberately: hijacking touch momentum makes phones feel
 * broken, so mobile keeps its native scroll and only pointer devices get easing.
 */
export function initSmoothScroll(): () => void {
  if (prefersReducedMotion()) return () => {};

  const lenis = new Lenis({
    duration: 1.15,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false,
    touchMultiplier: 1.6,
  });

  lenis.on('scroll', ScrollTrigger.update);

  const raf = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(raf);
    lenis.destroy();
  };
}

/** Smoothly scroll to an element, with a native fallback when Lenis is off. */
export function scrollToId(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    block: 'start',
  });
}
