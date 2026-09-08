import { SplitText } from './motion/SplitText';
import { ScrollReveal } from './motion/ScrollReveal';
import { BlurText } from './motion/BlurText';

export function About() {
  return (
    <section className="section about" id="about">
      <div className="shell">
        <BlurText className="eyebrow" text="What this is" as="p" />

        <SplitText
          as="h2"
          className="display display--lg about__lines"
          lines={[
            'Not quite a restaurant.',
            <span className="about__muted" key="b">Not quite a dinner party.</span>,
          ]}
        />

        <p className="display display--md about__statement">Something in between.</p>

        <div className="about__body">
          <ScrollReveal>
            Happy Plate is a supper club built around one simple idea: good food tastes better when there are people worth meeting across the table.
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
