import { useRef } from 'react';
import { gsap, useGsap, prefersReducedMotion, EASE } from '../../animations/gsap';

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
  /** stagger unit */
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
  as?: 'p' | 'h1' | 'h2' | 'span';
}

/** Text that resolves out of a soft blur, one word (or letter) at a time. */
export function BlurText({
  text,
  className,
  delay = 0,
  animateBy = 'words',
  direction = 'bottom',
  as: Tag = 'p',
}: BlurTextProps) {
  const root = useRef<HTMLElement>(null);
  const units = animateBy === 'words' ? text.split(' ') : Array.from(text);

  useGsap(() => {
    if (prefersReducedMotion() || !root.current) return;
    const parts = root.current.querySelectorAll('[data-blur-unit]');
    gsap.from(parts, {
      opacity: 0,
      filter: 'blur(10px)',
      y: direction === 'bottom' ? 18 : -18,
      duration: 1.1,
      ease: EASE.out,
      stagger: animateBy === 'words' ? 0.07 : 0.02,
      delay,
      scrollTrigger: { trigger: root.current, start: 'top 85%', once: true },
    });
  }, root, [text, animateBy, direction, delay]);

  return (
    <Tag ref={root as never} className={className}>
      {units.map((unit, i) => (
        <span
          key={`${unit}-${i}`}
          data-blur-unit
          style={{ display: 'inline-block', willChange: 'filter, transform, opacity' }}
        >
          {unit === ' ' ? ' ' : unit}
          {animateBy === 'words' && i < units.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
}
