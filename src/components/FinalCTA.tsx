import { scrollToId } from '../animations/lenis';
import { CharReveal } from './motion/CharReveal';

/**
 * The line the whole page has been walking toward, so it gets the one
 * letter-level moment: the first half surfaces, the second half drops into
 * place under it.
 */
export function FinalCTA() {
  return (
    <section className="section final">
      <div className="shell final__inner">
        <h2 className="display display--lg final__lines">
          <span className="final__line">
            <CharReveal text="Come as strangers." mode="reveal" />
          </span>
          <span className="final__line final__line--em">
            <CharReveal text="Leave as friends." mode="settle" />
          </span>
        </h2>

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
