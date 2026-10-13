import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <>
      <div className="announcement">
        <span>PRIVATE CHAUFFEUR &amp; LUXURY CAR HIRE</span>
        <span> DUBAI · ABU DHABI · ACROSS THE UAE</span>
      </div>
      <header className="header">
        <Link href="/" className="brand" aria-label="Al Haramain Luxury Fleet home">
          <Image src="/luxurylogo.png" alt="Al Haramain Luxury Fleet" width={445} height={170} className="brand__mark" unoptimized priority />
          <span className="brand__name">AL HARAMAIN<small>LUXURY FLEET</small></span>
        </Link>
        <nav aria-label="Main navigation">
          <Link href="/fleet">Our fleet</Link>
          <Link href="/about">About</Link>
          <Link href="/our-story">Our story</Link>
        </nav>
        <div className="header__actions">
          <Link className="header__account" href="/login">Sign in</Link>
          <Link className="button button--gold button--small" href="/signup">Create account</Link>
        </div>
        <Link className="mobile-menu" href="/fleet" aria-label="View our fleet">Fleet</Link>
      </header>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer__main">
        <div className="footer__brand">
          <Link href="/" className="brand" aria-label="Al Haramain Luxury Fleet home">
            <Image src="/luxurylogo.png" alt="Al Haramain Luxury Fleet" width={445} height={170} className="brand__mark" unoptimized />
            <span className="brand__name">AL HARAMAIN<small>LUXURY FLEET</small></span>
          </Link>
          <p>A considered way to travel.<br />Rooted in the UAE, ready for anywhere.</p>
          <div className="socials">
            <a href="https://www.instagram.com/al_haramai_tech_solutions/" aria-label="Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" /></svg>
            </a>
            <a href="https://www.tiktok.com/@al_haram_ain_techsolution" aria-label="TikTok">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 3v11.2a4.2 4.2 0 1 1-3.4-4.1v3.2a1.2 1.2 0 1 0 .4.9V3h3c.3 2.4 1.7 3.8 4 4.1v3.1A8.5 8.5 0 0 1 15 8.7" /></svg>
            </a>
            <a href="https://www.linkedin.com/" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm3.2 6.4V18m0-11.6v.1M11 18v-4.7c0-2.6 5.8-2.8 5.8 0V18M11 9.4V18" /></svg>
            </a>
          </div>
        </div>
        <div className="footer__column">
          <b>EXPLORE</b>
          <Link href="/fleet">Our collection</Link>
          <Link href="/our-story">Our story</Link>
          <Link href="/about#destinations">Destinations</Link>
          <Link href="/enquire">Plan a journey</Link>
        </div>
        <div className="footer__column footer__contact">
          <b>AT YOUR SERVICE</b>
          <a href="tel:+971557162816">+971 55 716 2816</a>
          <a href="mailto:alharamainluxuryfleet@gmail.com">alharamainluxuryfleet@gmail.com</a>
          <span>Available 24 hours, every day</span>
        </div>
      </div>
      <div className="footer__bottom">
        <span>© 2026 AL HARAMAIN LUXURY FLEET</span>
        <span>UNITED ARAB EMIRATES</span>
      </div>
    </footer>
  );
}
