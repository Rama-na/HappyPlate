import { AnimatedContent } from './motion/AnimatedContent';
import { SplitText } from './motion/SplitText';

const PRINCIPLES = [
  { no: '01', title: 'One table', copy: ['A small group, seated together all evening.'] },
  { no: '02', title: 'A set menu', copy: ['Food designed around the people at the table.'] },
  { no: '03', title: 'Real connection', copy: ['No networking.', 'No awkward small talk.', 'Just dinner.'] },
];

export function Principles() {
  return (
    <section className="section principles">
      <div className="shell">
        <div className="principles__head">
          <p className="eyebrow">How it works</p>
          <SplitText as="h2" className="display display--md" lines={['Three things we hold to.']} />
        </div>

        <AnimatedContent as="ul" className="principles__list" stagger={0.12} distance={34}>
          {PRINCIPLES.map((p) => (
            <li className="principle" key={p.no}>
              <span className="principle__no">{p.no}</span>
              <h3 className="principle__title">{p.title}</h3>
              <p className="principle__copy">
                {p.copy.map((line) => <span key={line}>{line}</span>)}
              </p>
            </li>
          ))}
        </AnimatedContent>
      </div>
    </section>
  );
}
