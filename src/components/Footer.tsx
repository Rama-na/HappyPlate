import { asset } from '../lib/asset';
import { scrollToId } from '../animations/lenis';
import { SITE } from '../data/site';

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer__inner">
        <div className="footer__brand">
          <img src={asset('logo.png')} alt="" width={44} height={44} />
          <span className="footer__name">{SITE.fullName}</span>
        </div>

        <nav className="footer__links" aria-label="Footer">
          {SITE.instagram && (
            <a className="link" href={SITE.instagram} target="_blank" rel="noreferrer noopener">
              Instagram
            </a>
          )}
          <button type="button" className="link" onClick={() => scrollToId('reserve')}>
            Join the Table
          </button>
          {SITE.email ? (
            <a className="link" href={`mailto:${SITE.email}`}>Contact</a>
          ) : (
            <button type="button" className="link" onClick={() => scrollToId('reserve')}>
              Contact
            </button>
          )}
        </nav>

        <p className="footer__fine">© {new Date().getFullYear()} {SITE.fullName}</p>
      </div>
    </footer>
  );
}
