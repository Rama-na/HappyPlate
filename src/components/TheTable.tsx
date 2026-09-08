import { useRef } from 'react';
import { gsap, useGsap, prefersReducedMotion, EASE } from '../animations/gsap';
import { Picture } from './Picture';
import { IMAGES } from '../assets/images';
import { SplitText } from './motion/SplitText';

const LINES = ['One long table.', 'A small group.', 'One evening.', 'Everyone arrives knowing nobody.'];

export function TheTable() {
  const root = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);

  useGsap(() => {
    if (prefersReducedMotion() || !root.current) return;

    // the photograph drifts against the sticky column
    const img = media.current?.querySelector('img');
    if (img) {
      gsap.set(img, { scale: 1.14 });
      gsap.fromTo(img,
        { yPercent: -5 },
        {
          yPercent: 5,
          ease: 'none',
          scrollTrigger: { trigger: media.current, start: 'top bottom', end: 'bottom top', scrub: true },
        });
    }

    gsap.from('.table__line', {
      opacity: 0, y: 22, duration: 0.9, stagger: 0.14, ease: EASE.out,
      scrollTrigger: { trigger: '.table__lines', start: 'top 82%', once: true },
    });

    gsap.from('.table__turn', {
      opacity: 0, y: 20, duration: 1.1, ease: EASE.out,
      scrollTrigger: { trigger: '.table__turn', start: 'top 88%', once: true },
    });
  }, root, []);

  return (
    <section className="section table" id="the-table" ref={root}>
      <div className="shell table__grid">
        <div className="table__text">
          <p className="eyebrow">The Table</p>
          <SplitText as="h2" className="display display--lg" lines={['The Table.']} />

          <div className="table__lines">
            {LINES.map((line) => (
              <p className="table__line" key={line}>{line}</p>
            ))}
          </div>

          <p className="table__turn">Everyone leaves knowing someone.</p>
        </div>

        <div className="table__media" ref={media}>
          <div className="table__frame frame">
            <Picture image={IMAGES.table} sizes="(min-width: 62rem) 44vw, 92vw" />
          </div>
        </div>
      </div>
    </section>
  );
}
