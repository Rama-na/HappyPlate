import { useRef, type ReactNode } from 'react';
import { gsap, useGsap, prefersReducedMotion, EASE } from '../../animations/gsap';

interface SplitTextProps {
  /** each entry is a line; lines rise out of their own mask */
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  duration?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p';
}

/**
 * Display type that rises line-by-line from behind a mask — the workhorse for
 * the big editorial headlines.
 */
export function SplitText({
  lines,
  className,
  lineClassName,
  delay = 0,
  duration = 1.15,
  as: Tag = 'h2',
}: SplitTextProps) {
  const root = useRef<HTMLElement>(null);

  useGsap(() => {
    if (prefersReducedMotion() || !root.current) return;
    const inner = root.current.querySelectorAll('[data-line-inner]');
    gsap.from(inner, {
      yPercent: 115,
      duration,
      ease: EASE.strong,
      stagger: 0.1,
      delay,
      scrollTrigger: { trigger: root.current, start: 'top 85%', once: true },
    });
  }, root, [lines.length, delay, duration]);

  return (
    <Tag ref={root as never} className={className}>
      {lines.map((line, i) => (
        <span key={i} className={lineClassName} style={{ display: 'block', overflow: 'hidden' }}>
          <span data-line-inner style={{ display: 'block', willChange: 'transform' }}>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
