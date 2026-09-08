import { useRef } from 'react';
import { gsap, useGsap, prefersReducedMotion, EASE } from '../../animations/gsap';

interface ScrollRevealProps {
  children: string;
  className?: string;
  /** opacity the words start from before the scrub brings them up */
  baseOpacity?: number;
  enableBlur?: boolean;
  blurStrength?: number;
}

/**
 * Paragraph copy that resolves word by word as it crosses the viewport, tied to
 * scroll position rather than a timer so reading pace drives the reveal.
 */
export function ScrollReveal({
  children,
  className,
  baseOpacity = 0.14,
  enableBlur = true,
  blurStrength = 5,
}: ScrollRevealProps) {
  const root = useRef<HTMLParagraphElement>(null);
  const words = children.split(' ');

  useGsap(() => {
    if (prefersReducedMotion() || !root.current) return;
    const parts = root.current.querySelectorAll('[data-reveal-word]');
    gsap.fromTo(
      parts,
      { opacity: baseOpacity, filter: enableBlur ? `blur(${blurStrength}px)` : 'none' },
      {
        opacity: 1,
        filter: 'blur(0px)',
        ease: EASE.out,
        stagger: 0.12,
        scrollTrigger: {
          trigger: root.current,
          start: 'top 80%',
          end: 'bottom 62%',
          scrub: 0.8,
        },
      },
    );
  }, root, [children, baseOpacity, enableBlur, blurStrength]);

  return (
    <p ref={root} className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} data-reveal-word style={{ display: 'inline-block' }}>
          {word}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </p>
  );
}
