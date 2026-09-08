import { useRef, useState } from 'react';
import { gsap, useGsap, prefersReducedMotion, EASE } from '../animations/gsap';
import { asset } from '../lib/asset';

const SEEN_KEY = 'hp-intro-seen';

function alreadySeen(): boolean {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false; // private mode etc. — just play it
  }
}

/**
 * A short cinematic open: the mark settles, the name arrives, a gold rule draws.
 * Plays once per session — a returning visitor goes straight to the hero.
 */
export function IntroLoader({ onDone }: { onDone: () => void }) {
  // decided once, before first paint, so we never flash the overlay
  const [skip] = useState(() => alreadySeen() || prefersReducedMotion());
  const root = useRef<HTMLDivElement>(null);

  useGsap(() => {
    if (skip) {
      onDone();
      return;
    }
    document.body.style.overflow = 'hidden';

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = '';
        try { sessionStorage.setItem(SEEN_KEY, '1'); } catch { /* non-fatal */ }
        onDone();
      },
    });

    tl.fromTo('.intro__mark',
        { opacity: 0, scale: 0.86, filter: 'blur(6px)' },
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.95, ease: EASE.out })
      .fromTo('.intro__word', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, ease: EASE.out }, '-=0.42')
      .fromTo('.intro__sub', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.55, ease: EASE.out }, '-=0.34')
      .to('.intro__rule', { width: '4.5rem', duration: 0.7, ease: EASE.expo }, '-=0.4')
      .to(root.current, { autoAlpha: 0, duration: 0.7, ease: EASE.out }, '+=0.28');

    return () => { document.body.style.overflow = ''; };
  }, root, []);

  if (skip) return null;

  return (
    <div className="intro" ref={root} role="status" aria-label="Happy Plate is loading">
      <div className="intro__inner">
        <img className="intro__mark" src={asset('logo.png')} alt="" width={96} height={96} />
        <p className="intro__word">Happy Plate</p>
        <span className="intro__rule" aria-hidden="true" />
        <p className="intro__sub">A Supper Club</p>
      </div>
    </div>
  );
}
