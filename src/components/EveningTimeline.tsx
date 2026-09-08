import { useRef } from 'react';
import { useGsap, ScrollTrigger, prefersReducedMotion } from '../animations/gsap';
import { SplitText } from './motion/SplitText';

const BEATS = [
  { time: '7:30 PM', title: 'Arrive', copy: ['Leave the outside world at the door.'] },
  { time: '8:00 PM', title: 'First course', copy: ['The first conversation usually starts here.'] },
  { time: '8:30 PM', title: 'The table', copy: ['Stories start travelling around the room.'] },
  { time: '9:30 PM', title: 'Dessert', copy: ['Nobody checks the time.'] },
  { time: '10:00 PM', title: 'Leave', copy: ['Come as strangers.', 'Leave as friends.'] },
];

export function EveningTimeline() {
  const root = useRef<HTMLElement>(null);
  const spine = useRef<HTMLSpanElement>(null);

  useGsap(() => {
    if (prefersReducedMotion() || !root.current) return;
    const list = root.current.querySelector('.evening__list');
    if (!list) return;

    // gold thread tracks how far into the night you've read
    ScrollTrigger.create({
      trigger: list,
      start: 'top 72%',
      end: 'bottom 72%',
      onUpdate: (self) => {
        spine.current?.style.setProperty('--fill', `${self.progress * 100}%`);
      },
    });

    root.current.querySelectorAll<HTMLElement>('.beat').forEach((beat) => {
      ScrollTrigger.create({
        trigger: beat,
        start: 'top 72%',
        onEnter: () => beat.classList.add('is-on'),
        onLeaveBack: () => beat.classList.remove('is-on'),
      });
    });
  }, root, []);

  return (
    <section className="section evening" id="the-evening" ref={root}>
      <div className="shell">
        <div className="evening__head">
          <p className="eyebrow">The Evening</p>
          <SplitText as="h2" className="display display--md" lines={['How the night unfolds.']} />
        </div>

        <ol className="evening__list">
          <span className="evening__spine" ref={spine} aria-hidden="true" />
          {BEATS.map((b) => (
            <li className="beat" key={b.time}>
              <span className="beat__time">{b.time}</span>
              <h3 className="beat__title">{b.title}</h3>
              <p className="beat__copy">
                {b.copy.map((line) => <span key={line}>{line}</span>)}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
