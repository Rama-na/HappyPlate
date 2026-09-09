import { useRef } from 'react';
import { gsap, useGsap, prefersReducedMotion } from '../animations/gsap';
import { SplitText } from './motion/SplitText';
import { ScrollReveal } from './motion/ScrollReveal';
import { BlurText } from './motion/BlurText';

export function About() {
  const root = useRef<HTMLElement>(null);

  useGsap(() => {
    if (prefersReducedMotion() || !root.current) return;
    // the statement lifts a little as you pass it, so the words carry over the
    // section edge instead of sitting still inside a box
    gsap.fromTo('.about__statement',
      { y: 34 },
      {
        y: -34,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top 70%', end: 'bottom top', scrub: 1.2 },
      });
  }, root, []);

  return (
    <section className="section about" id="about" ref={root}>
      <div className="shell">
        <BlurText className="eyebrow" text="What this is" as="p" />

        <SplitText
          as="h2"
          className="display display--lg about__lines"
          lines={[
            'Not quite a restaurant.',
            <span className="about__muted" key="b">Not quite a dinner party.</span>,
          ]}
        />

        <p className="display display--md about__statement">Something in between.</p>

        <div className="about__body">
          <ScrollReveal>
            Happy Plate is a supper club built around one simple idea: good food tastes better when there are people worth meeting across the table.
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
