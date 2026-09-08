import { scrollToId } from '../animations/lenis';
import { SplitText } from './motion/SplitText';

export function FinalCTA() {
  return (
    <section className="section final">
      <div className="shell final__inner">
        <SplitText
          as="h2"
          className="display display--lg"
          lineClassName="final__line"
          lines={['Come as strangers.', <em key="e">Leave as friends.</em>]}
        />

        <hr className="rule rule--gold" style={{ width: '4.5rem' }} />

        <p className="final__word">Happy Plate</p>

        <p className="final__copy">
          A supper club for people who like to eat, talk,<br />and stay a little longer.
        </p>

        <button type="button" className="btn btn--gold" onClick={() => scrollToId('reserve')}>
          Reserve your seat
          <span className="btn__arrow" aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}
