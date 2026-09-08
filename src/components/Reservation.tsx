import { useRef, useState, type KeyboardEvent } from 'react';
import { COURSES, OTHER, type Field } from '../data/courses';
import {
  buildPayload, isFilled, isVisible, submitReservation, NotConnectedError,
  type Answers, type Others,
} from '../lib/reservation';
import { asset } from '../lib/asset';
import { prefersReducedMotion } from '../animations/gsap';
import { SplitText } from './motion/SplitText';

const RING_LEN = 94.25;
const pad = (n: number) => String(n).padStart(2, '0');

export function Reservation() {
  const [at, setAt] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [others, setOthers] = useState<Others>({});
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [firstName, setFirstName] = useState<string | null>(null);

  const panel = useRef<HTMLDivElement>(null);
  const honey = useRef<HTMLInputElement>(null);

  const course = COURSES[at];
  const last = at === COURSES.length - 1;

  const clearError = (key: string) =>
    setErrors((prev) => {
      if (!prev.has(key)) return prev;
      const next = new Set(prev);
      next.delete(key);
      return next;
    });

  const setAnswer = (key: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    clearError(key);
  };

  const toGrid = () => {
    panel.current?.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  const validate = (): boolean => {
    const bad = new Set<string>();
    course.fields.forEach((f) => {
      if (!isFilled(f, answers, others)) bad.add(f.key);
    });
    setErrors(bad);
    if (bad.size) {
      const first = panel.current?.querySelector(`[data-key="${[...bad][0]}"]`);
      first?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });
      return false;
    }
    return true;
  };

  const advance = async () => {
    if (busy || !validate()) return;
    if (!last) {
      setAt(at + 1);
      setStatus('');
      toGrid();
      return;
    }

    setBusy(true);
    setStatus('');
    const payload = buildPayload(answers, others, honey.current?.value ?? '');
    try {
      await submitReservation(payload);
      setFirstName((payload.fullName ?? '').trim().split(/\s+/)[0] ?? '');
    } catch (err) {
      setStatus(
        err instanceof NotConnectedError
          ? "This form isn't connected yet — add your Apps Script URL in src/lib/reservation.ts."
          : "That didn't go through. Check your connection and try once more.",
      );
    } finally {
      setBusy(false);
    }
  };

  const back = () => {
    if (at === 0) return;
    setAt(at - 1);
    setStatus('');
    toGrid();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      void advance();
    }
  };

  /* ── confirmation ─────────────────────────────────────────────── */
  if (firstName !== null) {
    return (
      <section className="section reserve" id="reserve">
        <div className="reserve__panel">
          <div className="done" aria-live="polite">
            <div className="done__seal" aria-hidden="true">
              <svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" /></svg>
              <img src={asset('logo.png')} alt="" width={120} height={120} />
            </div>
            <h2 className="done__title">
              {firstName ? `Your seat is on hold, ${firstName}` : 'Your seat is on hold'}
            </h2>
            <p className="done__body">
              We read every registration ourselves. You&rsquo;ll hear from us on WhatsApp or email
              once your spot is confirmed — and if this dinner fills up first, we&rsquo;ll tell you
              where you stand on the waitlist.
            </p>
            <p className="done__micro">See you at the table.</p>
          </div>
        </div>
      </section>
    );
  }

  /* ── the form ─────────────────────────────────────────────────── */
  return (
    <section className="section reserve" id="reserve">
      <div className="shell reserve__head">
        <p className="eyebrow">Reserve</p>
        <SplitText as="h2" className="display display--lg" lines={['Your seat is waiting.']} />
        <p className="lede">Tell us a little about yourself. We&rsquo;ll take care of the rest.</p>
      </div>

      <div className="reserve__panel" ref={panel}>
        <div className="rsvp__bar" style={{ ['--p' as string]: `${(at / COURSES.length) * 100}%` }}>
          <svg className="rsvp__ring" viewBox="0 0 36 36" aria-hidden="true">
            <circle className="track" cx="18" cy="18" r="15" />
            <circle
              className="fill" cx="18" cy="18" r="15"
              style={{ strokeDashoffset: RING_LEN * (1 - at / COURSES.length) }}
            />
          </svg>
          <div className="rsvp__meta">
            <span className="rsvp__step">Course {pad(at + 1)} of {pad(COURSES.length)}</span>
            <span className="rsvp__name">{course.name}</span>
          </div>
        </div>

        <div className="course">
          <div className="course__head">
            <div className="course__no">Course {pad(at + 1)}</div>
            <h3 className="course__title">{course.name}</h3>
            {course.note && <p className="course__note">{course.note}</p>}
          </div>

          {course.fields.map((f) => (
            <FieldView
              key={f.key}
              field={f}
              answers={answers}
              others={others}
              hasError={errors.has(f.key)}
              onAnswer={setAnswer}
              onOther={(key, val) => {
                setOthers((p) => ({ ...p, [key]: val }));
                clearError(key);
              }}
              onEnter={onKeyDown}
            />
          ))}
        </div>

        <input ref={honey} className="honey" type="text" tabIndex={-1}
               autoComplete="off" aria-hidden="true" name="website" />

        {status && <p className="status" role="status">{status}</p>}

        <div className="controls">
          {at > 0 && (
            <button type="button" className="btn btn--ghost" onClick={back} disabled={busy}>
              Back
            </button>
          )}
          <span className="spacer" />
          <button type="button" className="btn btn--gold" onClick={() => void advance()} disabled={busy}>
            {busy ? 'Holding your seat…' : last ? 'Reserve my seat' : 'Next'}
            {!busy && <span className="btn__arrow" aria-hidden="true">→</span>}
          </button>
        </div>
      </div>
    </section>
  );
}

/* ── one field ──────────────────────────────────────────────────── */
interface FieldViewProps {
  field: Field;
  answers: Answers;
  others: Others;
  hasError: boolean;
  onAnswer: (key: string, value: string | string[]) => void;
  onOther: (key: string, value: string) => void;
  onEnter: (e: KeyboardEvent<HTMLInputElement>) => void;
}

function FieldView({ field, answers, others, hasError, onAnswer, onOther, onEnter }: FieldViewProps) {
  const visible = isVisible(field, answers);
  const chips = field.type === 'single' || field.type === 'multi';
  const cls = `field${hasError ? ' has-error' : ''}`;
  const id = `i_${field.key}`;

  if (chips) {
    const value = answers[field.key];
    const picked = (opt: string) =>
      field.type === 'multi'
        ? Array.isArray(value) && value.includes(opt)
        : value === opt;

    const choose = (opt: string) => {
      if (field.type === 'multi') {
        const list = Array.isArray(value) ? value : [];
        onAnswer(field.key, list.includes(opt) ? list.filter((v) => v !== opt) : [...list, opt]);
      } else {
        onAnswer(field.key, opt);
      }
    };

    const otherOpen = field.other && picked(OTHER);

    return (
      <fieldset className={cls} data-key={field.key} hidden={!visible}>
        <legend className="f-label">{field.label}</legend>
        {field.help && <span className="f-help">{field.help}</span>}

        <div className="chips">
          {field.options?.map((opt) => (
            <button key={opt} type="button" className="chip"
                    aria-pressed={picked(opt)} onClick={() => choose(opt)}>
              {opt}
            </button>
          ))}
          {field.other && (
            <button type="button" className="chip"
                    aria-pressed={picked(OTHER)} onClick={() => choose(OTHER)}>
              Something else
            </button>
          )}
        </div>

        {field.other && (
          <div className={`other-slot${otherOpen ? ' is-open' : ''}`}>
            <div>
              <input
                className="f-input" type="text" placeholder="Tell us"
                aria-label={`${field.label} — something else`}
                value={others[field.key] ?? ''}
                onChange={(e) => onOther(field.key, e.target.value)}
              />
            </div>
          </div>
        )}

        <span className="f-error">{field.error}</span>
      </fieldset>
    );
  }

  const value = (answers[field.key] as string) ?? '';

  return (
    <div className={cls} data-key={field.key} hidden={!visible}>
      <label className="f-label" htmlFor={id}>{field.label}</label>
      {field.help && <span className="f-help">{field.help}</span>}

      {field.type === 'textarea' ? (
        <textarea
          id={id} className="f-area" rows={2} value={value}
          placeholder={field.placeholder}
          onChange={(e) => {
            onAnswer(field.key, e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
        />
      ) : (
        <input
          id={id} className="f-input" type={field.type} value={value}
          placeholder={field.placeholder} autoComplete={field.autocomplete}
          onChange={(e) => onAnswer(field.key, e.target.value)}
          onKeyDown={onEnter}
        />
      )}

      <span className="f-error">{field.error}</span>
    </div>
  );
}
