import { useLayoutEffect, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** One animation language across the whole site: slow, weighted, never bouncy. */
export const EASE = {
  out: 'power3.out',
  strong: 'power4.out',
  expo: 'expo.out',
} as const;

export const DUR = { sm: 0.8, md: 1.0, lg: 1.2 } as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Scoped GSAP with automatic teardown. Everything created inside `setup`
 * (tweens, timelines, ScrollTriggers) is reverted when the component unmounts
 * or deps change, so nothing leaks between renders.
 */
export function useGsap(
  setup: (ctx: gsap.Context) => void,
  scope?: RefObject<HTMLElement | null>,
  deps: unknown[] = [],
): void {
  useLayoutEffect(() => {
    const ctx = gsap.context(setup, scope?.current ?? undefined);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Refresh ScrollTrigger once late-loading images have settled the layout. */
export function refreshOnLoad(): () => void {
  const refresh = () => ScrollTrigger.refresh();
  window.addEventListener('load', refresh);
  return () => window.removeEventListener('load', refresh);
}

export { gsap, ScrollTrigger };
