import { useRef, type ReactNode } from 'react';
import { gsap, useGsap, prefersReducedMotion, EASE } from '../../animations/gsap';

interface AnimatedContentProps {
  children: ReactNode;
  className?: string;
  distance?: number;
  direction?: 'vertical' | 'horizontal';
  reverse?: boolean;
  duration?: number;
  initialOpacity?: number;
  scale?: number;
  delay?: number;
  /** stagger direct children instead of moving the wrapper as one block */
  stagger?: number;
  as?: 'div' | 'ul' | 'ol' | 'section';
}

/** Generic entrance for blocks, cards and list items. */
export function AnimatedContent({
  children,
  className,
  distance = 40,
  direction = 'vertical',
  reverse = false,
  duration = 1,
  initialOpacity = 0,
  scale = 1,
  delay = 0,
  stagger,
  as: Tag = 'div',
}: AnimatedContentProps) {
  const root = useRef<HTMLElement>(null);

  useGsap(() => {
    if (prefersReducedMotion() || !root.current) return;
    const axis = direction === 'vertical' ? 'y' : 'x';
    const offset = reverse ? -distance : distance;
    const targets = stagger ? Array.from(root.current.children) : root.current;

    gsap.from(targets, {
      [axis]: offset,
      opacity: initialOpacity,
      scale,
      duration,
      delay,
      ease: EASE.out,
      stagger: stagger ?? 0,
      scrollTrigger: { trigger: root.current, start: 'top 88%', once: true },
    });
  }, root, [distance, direction, reverse, duration, initialOpacity, scale, delay, stagger]);

  return (
    <Tag ref={root as never} className={className}>
      {children}
    </Tag>
  );
}
