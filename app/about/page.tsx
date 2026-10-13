import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "About Us | Al Haramain Luxury Fleet",
  description: "Learn about Al Haramain's personal chauffeur and luxury travel service across the UAE.",
};

export default function AboutPage() {
  return (
    <main className="site subpage">
      <SiteHeader />
      <section className="about-hero">
        <div>
          <span className="eyebrow eyebrow--dark">A MORE PERSONAL STANDARD</span>
          <h1>More than a ride.<br /><em>It’s a way of arriving.</em></h1>
          <p>Al Haramain brings thoughtful service and a considered fleet to every journey across the UAE.</p>
          <Link className="button button--gold" href="/enquire">Plan your journey <ArrowRight size={15} /></Link>
        </div>
        <Image src="/luxuryhome.png" alt="Luxury vehicles in Dubai at sunset" width={1280} height={725} priority />
      </section>
      <section className="about-copy">
        <div><span className="eyebrow eyebrow--dark">OUR APPROACH</span><h2>The details between destinations <em>matter.</em></h2></div>
        <p>With more than six years of UAE luxury transport experience, we believe a great journey is shaped by the care around it: the welcome, the timing, the right vehicle and one reliable point of contact. Our concierge team pairs local knowledge with personal attention from the first enquiry through the return trip.</p>
      </section>
      <section className="about-experience">
        <strong>6+</strong><div><span className="eyebrow eyebrow--dark">YEARS OF UAE EXPERIENCE</span><p>Local understanding, refined service, and dependable journeys across the Emirates.</p></div>
      </section>
      <section className="about-values">
        <article><Sparkles /><h2>Our vision</h2><p>Make every journey across the UAE feel effortless, welcoming and worthy of the occasion.</p></article>
        <article><UsersRound /><h2>Luxury standards</h2><p>Well-presented vehicles, professional chauffeurs, thoughtful care and clear details at every step.</p></article>
        <article><ShieldCheck /><h2>Personal service</h2><p>One attentive concierge to understand your plans and preferences from enquiry to arrival.</p></article>
      </section>
      <section className="leadership">
        <div className="leadership__heading"><span className="eyebrow eyebrow--dark">THE PEOPLE BEHIND THE JOURNEY</span><h2>Leadership with <em>purpose.</em></h2><p>Personal attention begins with the people who set our standards.</p></div>
        <div className="leadership__grid">
          <article className="leader-card"><div className="leader-card__monogram" aria-hidden="true">AHB</div><span>CEO &amp; FOUNDER</span><h3>Ali Hassan Butt</h3><p>Leads the company’s direction and commitment to thoughtful luxury transport throughout the UAE.</p></article>
          <article className="leader-card"><div className="leader-card__monogram" aria-hidden="true">HSB</div><span>CO-FOUNDER &amp; DIRECTOR</span><h3>Hunza Saleem Butt</h3><p>Helps shape the service experience and the care that goes into every client journey.</p></article>
        </div>
      </section>
      <section className="about-destinations" id="destinations">
        <div><span className="eyebrow">ACROSS THE EMIRATES</span><h2>One point of contact.<br /><em>UAE wide.</em></h2></div>
        <p><MapPin size={17} /> Dubai · Abu Dhabi · Sharjah · Ras Al Khaimah · Ajman · Umm Al Quwain · Fujairah</p>
      </section>
      <SiteFooter />
    </main>
  );
}
