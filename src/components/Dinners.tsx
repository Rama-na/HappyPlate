import { dinners } from '../data/dinners';
import { scrollToId } from '../animations/lenis';
import { AnimatedContent } from './motion/AnimatedContent';
import { SplitText } from './motion/SplitText';

export function Dinners() {
  return (
    <section className="section dinners" id="dinners">
      <div className="shell">
        <div className="dinners__head">
          <p className="eyebrow">Upcoming</p>
          <SplitText as="h2" className="display display--lg" lines={['Pull up a chair.']} />
        </div>

        <AnimatedContent as="ul" className="dinners__list" stagger={0.1} distance={30}>
          {dinners.map((d) => (
            <li className={`dinner${d.open ? '' : ' dinner--full'}`} key={d.id}>
              <div className="dinner__when">
                <span className="dinner__day">{d.day}</span>
                <span className="dinner__date">{d.date}</span>
              </div>

              <div>
                <h3 className="dinner__title">{d.title}</h3>
                <p className="dinner__note">{d.note}</p>
                <p className="dinner__meta">
                  <span>{d.location}</span>
                  <span>{d.time}</span>
                  <span>{d.seats}</span>
                  <b>{d.price}</b>
                </p>
              </div>

              <div className="dinner__action">
                {d.open ? (
                  <button type="button" className="btn btn--ghost" onClick={() => scrollToId('reserve')}>
                    Reserve a seat
                    <span className="btn__arrow" aria-hidden="true">→</span>
                  </button>
                ) : (
                  <>
                    <span className="dinner__full">Fully booked</span>
                    <button type="button" className="btn btn--ghost" onClick={() => scrollToId('reserve')}>
                      Join the waitlist
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </AnimatedContent>
      </div>
    </section>
  );
}
