import { Picture } from './Picture';
import { IMAGES } from '../assets/images';
import { AnimatedContent } from './motion/AnimatedContent';
import { SplitText } from './motion/SplitText';
import { ScrollReveal } from './motion/ScrollReveal';

/**
 * Photography note: these are real photographs of the room and the table as it
 * is laid, not of the dishes — the club has no food photography yet, and
 * inventing it (or dropping in stock plates) would misrepresent the menu.
 * When real course photography exists, add it to the manifest and extend this
 * grid; the copy deliberately talks about the menu without describing dishes.
 */
const PLATES = [
  { key: 'flowers' as const, span: 'food__item--tall', caption: 'The centre of the table' },
  { key: 'setting' as const, span: 'food__item--wide', caption: 'Laid before anyone arrives' },
  { key: 'arch' as const, span: 'food__item--half', caption: 'The light we cook under' },
  { key: 'mirror' as const, span: 'food__item--half', caption: 'The room that holds it' },
];

export function Food() {
  return (
    <section className="section food" id="the-food">
      <div className="shell">
        <div className="food__head">
          <p className="eyebrow">The Food</p>
          <SplitText as="h2" className="display display--md" lines={['The food is part', 'of the story.']} />
          <ScrollReveal className="lede">
            Every table gets a thoughtfully curated menu. The menu changes. The people change. The evening changes.
          </ScrollReveal>
        </div>

        <AnimatedContent className="food__grid" stagger={0.1} distance={38}>
          {PLATES.map((p) => (
            <figure className={`food__item ${p.span}`} key={p.key}>
              <div className="frame">
                <Picture image={IMAGES[p.key]} sizes="(min-width: 52rem) 45vw, 92vw" />
              </div>
              <figcaption className="food__caption">{p.caption}</figcaption>
            </figure>
          ))}
        </AnimatedContent>

        <p className="food__note">
          We cook around the table, not the other way round — what you tell us when you
          reserve is what ends up on it.
        </p>
      </div>
    </section>
  );
}
