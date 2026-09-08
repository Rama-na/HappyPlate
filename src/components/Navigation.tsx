import { useEffect, useState } from 'react';
import { asset } from '../lib/asset';
import { scrollToId } from '../animations/lenis';

const LINKS = [
  { id: 'the-table', label: 'The Table' },
  { id: 'the-evening', label: 'The Evening' },
  { id: 'dinners', label: 'Dinners' },
] as const;

export function Navigation() {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // the overlay owns the viewport while it's open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    // let the overlay release scroll before we move
    requestAnimationFrame(() => scrollToId(id));
  };

  return (
    <>
      <header className={`nav${stuck ? ' is-stuck' : ''}`}>
        <a
          className="nav__brand"
          href="#top"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        >
          <img src={asset('logo.png')} alt="" width={32} height={32} />
          <span className="nav__brandText">Happy Plate</span>
        </a>

        <nav className="nav__links" aria-label="Sections">
          {LINKS.map((l) => (
            <button key={l.id} type="button" className="nav__link link" onClick={() => go(l.id)}>
              {l.label}
            </button>
          ))}
        </nav>

        <div className="nav__cta">
          <button type="button" className="btn btn--light" onClick={() => go('reserve')}>
            Join the Table
            <span className="btn__arrow" aria-hidden="true">→</span>
          </button>
        </div>

        <button
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="nav-menu"
          onClick={() => setOpen(true)}
        >
          Menu
        </button>
      </header>

      {open && (
        <div className="navMenu" id="nav-menu">
          <div className="navMenu__top">
            <span className="nav__brandText">Happy Plate</span>
            <button type="button" className="nav__toggle" onClick={() => setOpen(false)} autoFocus>
              Close
            </button>
          </div>

          <nav className="navMenu__list" aria-label="Sections">
            {LINKS.map((l) => (
              <button key={l.id} type="button" className="navMenu__item" onClick={() => go(l.id)}>
                {l.label}
              </button>
            ))}
          </nav>

          <div className="navMenu__foot">
            <button type="button" className="btn btn--gold" onClick={() => go('reserve')}>
              Join the Table
              <span className="btn__arrow" aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
