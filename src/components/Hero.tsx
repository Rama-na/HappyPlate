import { useRef } from 'react';
import { gsap, useGsap, prefersReducedMotion, EASE } from '../animations/gsap';
import { scrollToId } from '../animations/lenis';
import { Picture } from './Picture';
import { IMAGES } from '../assets/images';

const TITLE = ['An invitation', 'to slow down.'];

/**
 * The hero holds the whole promise of the site, so it gets its own entrance
 * timeline rather than a scroll trigger — it runs the moment the intro clears.
 */
export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);

  useGsap(() => {
    if (!ready || !root.current) return;

    if (!prefersReducedMotion()) {
      const tl = gsap.timeline({ defaults: { ease: EASE.strong } });
      tl.from('[data-hero-line]', { yPercent: 118, duration: 1.25, stagger: 0.1 })
        .from('.hero__eyebrow', { opacity: 0, y: 14, duration: 0.9, ease: EASE.out }, '-=1.0')
        .from('.hero__meta > *', { opacity: 0, y: 16, duration: 0.9, stagger: 0.09, ease: EASE.out }, '-=0.75')
        .from('.hero__actions > *', { opacity: 0, y: 16, duration: 0.8, stagger: 0.09, ease: EASE.out }, '-=0.65')
        .from('.hero__cue', { opacity: 0, duration: 0.8, ease: EASE.out }, '-=0.5');
    }

    // the room drifts closer as you leave it
    const img = media.current?.querySelector('img');
    if (img && !prefersReducedMotion()) {
      gsap.to(img, {
        scale: 1.12,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to('.hero__content', {
        yPercent: -14,
        opacity: 0.15,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      });
    }
  }, root, [ready]);

  return (
    <section className="hero" ref={root} id="top">
      <div className="hero__media" ref={media}>
        <Picture image={IMAGES.hero} sizes="100vw" priority />
      </div>
      <div className="hero__scrim" aria-hidden="true" />

      <div className="hero__content">
        <p className="eyebrow hero__eyebrow">Happy Plate Supper Club</p>

        <h1 className="display display--xl hero__title">
          {TITLE.map((line) => (
            <span key={line} style={{ display: 'block', overflow: 'hidden' }}>
              <span data-hero-line style={{ display: 'block' }}>{line}</span>
            </span>
          ))}
        </h1>

        <div className="hero__meta">
          <span>One table.</span>
          <span>A set menu.</span>
          <span>People you haven&rsquo;t met yet.</span>
        </div>

        <div className="hero__actions">
          <button type="button" className="btn btn--gold" onClick={() => scrollToId('reserve')}>
            Join the Table
            <span className="btn__arrow" aria-hidden="true">→</span>
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => scrollToId('about')}>
            Discover Happy Plate
          </button>
        </div>
      </div>

      <div className="hero__cue" aria-hidden="true">
        <span className="hero__cueLine" />
        <span>Scroll to enter</span>
      </div>
    </section>
  );
}
