import { useRef } from 'react';
import { gsap, ScrollTrigger, useGsap, prefersReducedMotion } from '../animations/gsap';
import { Plate } from './motifs/Plate';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * THE TRAVELLING PLATE
 * ─────────────────────────────────────────────────────────────────────────────
 * One plate crosses the whole page. It is a single fixed element — not a copy
 * per section — so the evening genuinely travels with the reader.
 *
 * The journey is a list of legs, each anchored to a real section. The gaps
 * between legs matter as much as the legs: where no leg is active the plate
 * simply holds still, which is what keeps the movement from feeling restless.
 *
 *   hero      it sits behind the headline, large and half out of frame
 *   about     it drifts behind "Not quite a restaurant."
 *   table     it arrives at the table and frames the photograph
 *   —         stillness through the principles
 *   evening   it shrinks and travels with the timeline
 *   food      it crosses the plates
 *   people    it slips between the type and the room
 *   —         stillness through the dinners
 *   final     it settles beside the wordmark
 *   reserve   it withdraws, leaving the form alone
 *
 * Ranges are measured here rather than handed to ScrollTrigger as start/end
 * strings. A single writer reading one scroll value is predictable; a trigger
 * per leg each writing its own pose is not — every refresh re-fires their
 * callbacks, and the pinned evening forces a refresh as it initialises, which
 * left the plate wherever the last callback happened to land.
 */

interface Pose {
  x: string;
  y: string;
  scale: number;
  rotate: number;
  opacity: number;
}

/** "when this edge of the section reaches this fraction down the viewport" */
interface Mark {
  edge: 'top' | 'center' | 'bottom';
  vp: number;
}

interface Leg {
  sel: string;
  /** index into the pose list: the leg runs poses[from] -> poses[from + 1] */
  from: number;
  s: Mark;
  e: Mark;
}

const DESKTOP_POSES: Pose[] = [
  { x: '25vw',  y: '-7vh',  scale: 1.55, rotate: -12, opacity: 0.42 }, // behind the headline
  { x: '-15vw', y: '9vh',   scale: 1.05, rotate: 4,   opacity: 0.30 }, // leaving the hero
  { x: '11vw',  y: '-3vh',  scale: 0.86, rotate: 14,  opacity: 0.26 }, // behind "Not quite a restaurant."
  { x: '19vw',  y: '3vh',   scale: 1.28, rotate: 22,  opacity: 0.40 }, // arrives at the table
  { x: '-29vw', y: '-15vh', scale: 0.42, rotate: 34,  opacity: 0.34 }, // small, travelling the timeline
  { x: '21vw',  y: '7vh',   scale: 0.80, rotate: 44,  opacity: 0.28 }, // crossing the plates
  { x: '-18vw', y: '-5vh',  scale: 1.02, rotate: 52,  opacity: 0.26 }, // between the type and the room
  { x: '0vw',   y: '5vh',   scale: 0.72, rotate: 60,  opacity: 0.50 }, // settles by the wordmark
  { x: '0vw',   y: '2vh',   scale: 0.66, rotate: 62,  opacity: 0    }, // withdraws from the form
];

const DESKTOP_LEGS: Leg[] = [
  { sel: '.hero',    from: 0, s: { edge: 'top', vp: 0 },    e: { edge: 'bottom', vp: 0 } },
  { sel: '.about',   from: 1, s: { edge: 'top', vp: 0.82 }, e: { edge: 'bottom', vp: 0.45 } },
  { sel: '.table',   from: 2, s: { edge: 'top', vp: 0.78 }, e: { edge: 'center', vp: 0.42 } },
  // stillness through the principles
  { sel: '.evening', from: 3, s: { edge: 'top', vp: 0.85 }, e: { edge: 'top', vp: 0.25 } },
  { sel: '.food',    from: 4, s: { edge: 'top', vp: 0.80 }, e: { edge: 'center', vp: 0.45 } },
  { sel: '.people',  from: 5, s: { edge: 'top', vp: 0.80 }, e: { edge: 'center', vp: 0.45 } },
  // stillness through the dinners
  { sel: '.final',   from: 6, s: { edge: 'top', vp: 0.88 }, e: { edge: 'center', vp: 0.58 } },
  { sel: '.reserve', from: 7, s: { edge: 'top', vp: 0.75 }, e: { edge: 'top', vp: 0.35 } },
];

/** Mobile: shorter travel, smaller, fainter — the narrative without the sweep. */
const MOBILE_POSES: Pose[] = [
  { x: '16vw',  y: '-5vh', scale: 1.15, rotate: -8, opacity: 0.30 },
  { x: '-10vw', y: '6vh',  scale: 0.90, rotate: 4,  opacity: 0.24 },
  { x: '12vw',  y: '2vh',  scale: 1.00, rotate: 16, opacity: 0.28 },
  { x: '-14vw', y: '-8vh', scale: 0.46, rotate: 28, opacity: 0.26 },
  { x: '10vw',  y: '4vh',  scale: 0.86, rotate: 40, opacity: 0.22 },
  { x: '0vw',   y: '4vh',  scale: 0.62, rotate: 48, opacity: 0.40 },
  { x: '0vw',   y: '2vh',  scale: 0.58, rotate: 50, opacity: 0    },
];

const MOBILE_LEGS: Leg[] = [
  { sel: '.hero',    from: 0, s: { edge: 'top', vp: 0 },    e: { edge: 'bottom', vp: 0 } },
  { sel: '.table',   from: 1, s: { edge: 'top', vp: 0.80 }, e: { edge: 'center', vp: 0.45 } },
  { sel: '.evening', from: 2, s: { edge: 'top', vp: 0.85 }, e: { edge: 'top', vp: 0.30 } },
  { sel: '.people',  from: 3, s: { edge: 'top', vp: 0.80 }, e: { edge: 'center', vp: 0.45 } },
  { sel: '.final',   from: 4, s: { edge: 'top', vp: 0.88 }, e: { edge: 'center', vp: 0.58 } },
  { sel: '.reserve', from: 5, s: { edge: 'top', vp: 0.75 }, e: { edge: 'top', vp: 0.35 } },
];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const val = (v: string) => parseFloat(v);
const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);

function applyPose(el: Element, a: Pose, b: Pose, t: number) {
  gsap.set(el, {
    x: `${lerp(val(a.x), val(b.x), t)}vw`,
    y: `${lerp(val(a.y), val(b.y), t)}vh`,
    scale: lerp(a.scale, b.scale, t),
    rotate: lerp(a.rotate, b.rotate, t),
    opacity: lerp(a.opacity, b.opacity, t),
  });
}

export function TravelingPlate() {
  const root = useRef<HTMLDivElement>(null);

  useGsap(() => {
    if (!root.current) return;
    const el = root.current;
    const mm = gsap.matchMedia();

    const journey = (poses: Pose[], legs: Leg[]) => () => {
      let ranges: ({ start: number; end: number } | null)[] = [];

      const measure = () => {
        const vh = window.innerHeight;
        ranges = legs.map((leg) => {
          const node = document.querySelector(leg.sel);
          if (!node) return null;
          const r = node.getBoundingClientRect();
          const top = r.top + window.scrollY;
          const at = (m: Mark) => {
            const base = m.edge === 'top' ? top : m.edge === 'bottom' ? top + r.height : top + r.height / 2;
            return base - vh * m.vp;
          };
          return { start: at(leg.s), end: at(leg.e) };
        });
      };

      const write = () => {
        const y = window.scrollY;
        let from = poses[0];
        let to = poses[0];
        let t = 0;

        for (let i = 0; i < legs.length; i++) {
          const r = ranges[i];
          if (!r) continue;
          if (y >= r.end) {
            // behind us — hold this leg's finish and keep looking forward
            from = to = poses[legs[i].from + 1];
            t = 0;
          } else if (y >= r.start) {
            from = poses[legs[i].from];
            to = poses[legs[i].from + 1];
            t = clamp01((y - r.start) / Math.max(1, r.end - r.start));
            break;
          } else {
            break; // not reached yet; hold the last finished pose
          }
        }
        applyPose(el, from, to, t);
      };

      const remeasure = () => { measure(); write(); };

      measure();
      write();
      ScrollTrigger.addEventListener('refresh', remeasure);

      const master = ScrollTrigger.create({
        trigger: document.documentElement,
        start: 0,
        end: 'max',
        onUpdate: write,
      });

      return () => {
        ScrollTrigger.removeEventListener('refresh', remeasure);
        master.kill();
      };
    };

    mm.add('(min-width: 62rem)', journey(DESKTOP_POSES, DESKTOP_LEGS));
    mm.add('(max-width: 61.99rem)', journey(MOBILE_POSES, MOBILE_LEGS));

    return () => mm.revert();
  }, root, []);

  // purely decorative, and motion is the whole point of it
  if (prefersReducedMotion()) return null;

  return (
    <div className="plate" ref={root} aria-hidden="true">
      <Plate className="plate__svg" />
    </div>
  );
}
