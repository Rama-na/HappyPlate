import { useRef } from 'react';
import { gsap, useGsap, prefersReducedMotion } from '../../animations/gsap';

interface CharRevealProps {
  text: string;
  className?: string;
  /**
   * `reveal` — letters surface out of nothing, left to right.
   * `settle`  — letters drop the last of the way into their line.
   */
  mode?: 'reveal' | 'settle';
  as?: 'span' | 'h2' | 'p';
}

/**
 * Letter-by-letter, tied to scroll position rather than a timer — reserved for
 * the two lines the whole page is walking toward.
 */
export function CharReveal({ text, className, mode = 'reveal', as: Tag = 'span' }: CharRevealProps) {
  const root = useRef<HTMLElement>(null);

  useGsap(() => {
    if (prefersReducedMotion() || !root.current) return;
    const chars = root.current.querySelectorAll('[data-char]');

    const from = mode === 'reveal'
      ? { opacity: 0.06, filter: 'blur(6px)', yPercent: 0 }
      : { opacity: 0.1, yPercent: 46, filter: 'blur(0px)' };

    gsap.fromTo(chars, from, {
      opacity: 1,
      filter: 'blur(0px)',
      yPercent: 0,
      ease: 'none',
      stagger: 0.06,
      scrollTrigger: {
        trigger: root.current,
        start: 'top 88%',
        end: 'bottom 58%',
        scrub: 0.9,
      },
    });
  }, root, [text, mode]);

  return (
    <Tag ref={root as never} className={className} aria-label={text}>
      {Array.from(text).map((ch, i) => (
        <span
          key={`${ch}-${i}`}
          data-char
          aria-hidden="true"
          style={{ display: 'inline-block', whiteSpace: 'pre', willChange: 'opacity, transform, filter' }}
        >
          {ch}
        </span>
      ))}
    </Tag>
  );
}
