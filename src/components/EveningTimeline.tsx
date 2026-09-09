import { useRef } from 'react';
import { gsap, useGsap, ScrollTrigger, prefersReducedMotion, EASE } from '../animations/gsap';
import { Picture } from './Picture';
import { IMAGES } from '../assets/images';
import { SplitText } from './motion/SplitText';
import { Fork } from './motifs/Fork';

const BEATS = [
  { time: '7:30 PM', title: 'Arrive',       image: 'mirror' as const,     copy: ['Leave the outside world at the door.'] },
  { time: '8:00 PM', title: 'First course', image: 'setting' as const,    copy: ['The first conversation usually starts here.'] },
  { time: '8:30 PM', title: 'The table',    image: 'atmosphere' as const, copy: ['Stories start travelling around the room.'] },
  { time: '9:30 PM', title: 'Dessert',      image: 'flowers' as const,    copy: ['Nobody checks the time.'] },
  { time: '10:00 PM', title: 'Leave',       image: 'arch' as const,       copy: ['Come as strangers.', 'Leave as friends.'] },
];

/**
 * THE EVENING — the one horizontal passage.
 *
 * On a wide screen the section pins and the night travels sideways while the
 * reader scrolls down: one continuous move through five moments rather than a
 * carousel you click. The fork — lifted from the logo's rim — rides the rail as
 * the progress marker, and the gold thread fills behind it.
 *
 * On a phone none of that applies. Pinning a tall section on touch is miserable,
 * so the same five moments stack vertically and the fork travels down instead.
 * The narrative is identical; only the axis changes.
 */
export function EveningTimeline() {
  const root = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const fork = useRef<HTMLSpanElement>(null);
  const fill = useRef<HTMLSpanElement>(null);

  useGsap(() => {
    if (prefersReducedMotion() || !root.current) return;
    const mm = gsap.matchMedia();
    const moments = () => gsap.utils.toArray<HTMLElement>('.moment', root.current!);

    /* ── wide: pin and travel sideways ── */
    mm.add('(min-width: 62rem)', () => {
      const vp = viewport.current, tk = track.current;
      const fk = fork.current, fl = fill.current, rl = rail.current;
      if (!vp || !tk || !fk || !fl || !rl) return;

      const distance = () => Math.max(0, tk.scrollWidth - vp.clientWidth);
      const railTravel = () => Math.max(0, rl.clientWidth - fk.offsetWidth);

      const setForkX = gsap.quickSetter(fk, 'x', 'px');
      const setFill = gsap.quickSetter(fl, 'scaleX');

      const travel = gsap.to(tk, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: vp,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // fork and thread read straight off scroll progress, so they can
            // never drift out of step with the moments passing behind them
            setForkX(self.progress * railTravel());
            setFill(self.progress);
          },
        },
      });

      // light each moment as it reaches the middle of the frame
      moments().forEach((m) => {
        ScrollTrigger.create({
          trigger: m,
          containerAnimation: travel,
          start: 'left 72%',
          end: 'right 28%',
          onToggle: (self) => m.classList.toggle('is-on', self.isActive),
        });
      });
    });

    /* ── narrow: the same night, read downwards ── */
    mm.add('(max-width: 61.99rem)', () => {
      const tk = track.current, fk = fork.current, fl = fill.current, rl = rail.current;
      if (!tk || !fk || !fl || !rl) return;

      const setForkY = gsap.quickSetter(fk, 'y', 'px');
      const setFill = gsap.quickSetter(fl, 'scaleY');

      ScrollTrigger.create({
        trigger: tk,
        start: 'top 72%',
        end: 'bottom 72%',
        onUpdate: (self) => {
          setForkY(self.progress * Math.max(0, rl.clientHeight - fk.offsetHeight));
          setFill(self.progress);
        },
      });

      moments().forEach((m) => {
        gsap.from(m, {
          opacity: 0, y: 30, duration: 0.9, ease: EASE.out,
          scrollTrigger: { trigger: m, start: 'top 86%', once: true },
        });
        ScrollTrigger.create({
          trigger: m,
          start: 'top 70%',
          end: 'bottom 55%',
          onToggle: (self) => m.classList.toggle('is-on', self.isActive),
        });
      });
    });

    return () => mm.revert();
  }, root, []);

  return (
    <section className="evening" id="the-evening" ref={root}>
      <div className="shell evening__head">
        <p className="eyebrow">The Evening</p>
        <SplitText as="h2" className="display display--md" lines={['How the night unfolds.']} />
      </div>

      <div className="evening__viewport" ref={viewport}>
        <div className="evening__track" ref={track}>
          {BEATS.map((b) => (
            <article className="moment" key={b.time}>
              <div className="moment__media frame">
                <Picture image={IMAGES[b.image]} sizes="(min-width: 62rem) 34rem, 78vw" />
              </div>
              <div className="moment__text">
                <span className="moment__time">{b.time}</span>
                <h3 className="moment__title">{b.title}</h3>
                <p className="moment__copy">
                  {b.copy.map((line) => <span key={line}>{line}</span>)}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="evening__rail" ref={rail} aria-hidden="true">
          <span className="evening__thread" />
          <span className="evening__fill" ref={fill} />
          <span className="evening__fork" ref={fork}><Fork /></span>
        </div>
      </div>
    </section>
  );
}
