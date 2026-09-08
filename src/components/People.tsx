import { SplitText } from './motion/SplitText';
import { AnimatedContent } from './motion/AnimatedContent';
import { ScrollReveal } from './motion/ScrollReveal';

const STEPS = ['You arrive alone.', "You sit beside someone you’ve never met.", 'You share a meal.'];

export function People() {
  return (
    <section className="section people">
      <div className="shell">
        <p className="eyebrow">The People</p>

        <SplitText
          as="h2"
          className="display display--lg people__lead"
          lines={[
            "You don’t need to know anyone.",
            <span className="people__point" key="p">That&rsquo;s the point.</span>,
          ]}
        />

        <AnimatedContent className="people__steps" stagger={0.14} distance={30}>
          {STEPS.map((s) => <p className="people__step" key={s}>{s}</p>)}
        </AnimatedContent>

        <div className="people__last">
          <ScrollReveal baseOpacity={0.18}>
            Somewhere between the second course and dessert, the room starts feeling different.
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
