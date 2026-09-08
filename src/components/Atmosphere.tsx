import { useRef } from 'react';
import { gsap, useGsap, prefersReducedMotion } from '../animations/gsap';
import { Picture } from './Picture';
import { IMAGES } from '../assets/images';
import { SplitText } from './motion/SplitText';

const LINES = ['Warm light.', 'A long table.', "Flowers that don’t try too hard.", 'Music low enough to talk over.'];

export function Atmosphere() {
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);

  useGsap(() => {
    if (prefersReducedMotion() || !frame.current || !root.current) return;

    // the room opens up: a narrow window widens to full bleed as it passes.
    // clip-path + scale keeps this on the compositor instead of relayouting.
    gsap.fromTo(frame.current,
      { clipPath: 'inset(8% 24% 8% 24%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top 72%', end: 'center 42%', scrub: 0.6 },
      });

    const img = frame.current.querySelector('img');
    if (img) {
      gsap.fromTo(img, { scale: 1.16 }, {
        scale: 1,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top 72%', end: 'center 42%', scrub: 0.6 },
      });
    }

    gsap.from('.atmos__lines > *', {
      opacity: 0, y: 18, duration: 0.9, stagger: 0.12,
      scrollTrigger: { trigger: '.atmos__lines', start: 'top 86%', once: true },
    });
  }, root, []);

  return (
    <section className="section atmos" ref={root}>
      <div className="shell">
        <div className="atmos__head">
          <p className="eyebrow">The Space</p>
          <SplitText as="h2" className="display display--md" lines={['Where the room matters.']} />
        </div>
      </div>

      <div className="shell atmos__stage">
        <div className="atmos__frame" ref={frame}>
          <Picture image={IMAGES.atmosphere} sizes="(min-width: 78rem) 78rem, 100vw" />
        </div>

        <div className="atmos__lines">
          {LINES.map((l) => <p key={l}>{l}</p>)}
        </div>
      </div>
    </section>
  );
}
