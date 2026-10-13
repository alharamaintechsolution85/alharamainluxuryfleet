"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, MapPin, ShieldCheck, Sparkles, UsersRound, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { VehicleCatalog } from "@/components/vehicle-catalog";

export default function Home() {
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  async function askConcierge(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = question.trim();
    if (!message) return;
    setQuestion("");
    setAnswer("One moment while I check with our concierge team...");
    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      setAnswer(response.ok ? data.answer : data.error || "Please call +971 55 716 2816 for assistance.");
    } catch {
      setAnswer("Our digital concierge is offline. Call +971 55 716 2816 and we’ll help right away.");
    }
  }

  return (
    <main className="site">
      <SiteHeader />
      <section className="hero" id="home">
        <div className="hero__image" />
        <div className="hero__wash" />
        <div className="hero__content">
          <div className="eyebrow"><i /> THE ART OF ARRIVING</div>
          <h1>Travel in comfort.<br /><em>Arrive in style.</em></h1>
          <p>Exceptional vehicles. Thoughtful service. A more considered way to move through the UAE.</p>
          <div className="hero__buttons">
            <Link href="/fleet" className="button button--gold">Explore our fleet <ArrowRight size={16} /></Link>
            <a href="tel:+971557162816" className="button button--outline">Speak to a concierge <ArrowUpRight size={15} /></a>
          </div>
        </div>
        <span className="hero__index">DUBAI <i /> UAE</span>
      </section>

      <section className="trust">
        <div><Sparkles /><span><strong>A considered fleet</strong><small>Selected for every journey</small></span></div>
        <div><UsersRound /><span><strong>Professional chauffeurs</strong><small>Discreet, courteous, on time</small></span></div>
        <div><ShieldCheck /><span><strong>Peace of mind</strong><small>Clear details before you travel</small></span></div>
        <div><MapPin /><span><strong>Across the Emirates</strong><small>One point of contact, UAE wide</small></span></div>
      </section>

      <VehicleCatalog featured />

      <section className="home-story section-pad">
        <Image src="/luxuryhome.png" alt="Luxury vehicles in Dubai at sunset" width={1280} height={725} />
        <div><div className="eyebrow"><i /> A MORE PERSONAL STANDARD</div><h2>More than a ride.<br /><em>It’s a way of arriving.</em></h2><p>Local knowledge, gracious service and considered details from the first hello to the final destination.</p><Link className="button button--gold" href="/our-story">Our story <ArrowRight size={15} /></Link></div>
      </section>

      <section className="home-enquire">
        <div><span className="eyebrow"><i /> YOUR NEXT JOURNEY, CONSIDERED</span><h2>Let us take care<br /><em>of the details.</em></h2><p>Tell us what you have in mind. Our concierge will shape the right journey around you.</p></div>
        <Link className="button button--gold" href="/enquire">Plan a journey <ArrowRight size={15} /></Link>
      </section>
      <SiteFooter />

      <a className="whatsapp" href={`https://wa.me/971557162816?text=${encodeURIComponent("Hello, I’m interested in a luxury vehicle in the UAE.")}`} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 11.6a8.4 8.4 0 0 1-12.4 7.3L3 20l1.2-4.9a8.4 8.4 0 1 1 16.3-3.5Z" /><path d="M8.2 7.5c.2-.5.4-.5.7-.5h.5c.2 0 .4.1.5.4l.7 1.7c.1.2.1.4 0 .5l-.5.7c-.2.2-.2.4 0 .6.4.7 1.1 1.4 1.8 1.8.2.1.4.1.6-.1l.7-.8c.2-.2.4-.2.6-.1l1.6.8c.2.1.3.3.3.5 0 .4-.2 1-.6 1.3-.4.4-1 .6-1.5.6-.4 0-1.1-.1-2-.5-1-.4-2.1-1.3-3-2.3-.7-.8-1.2-1.7-1.4-2.5-.2-.9.1-1.7.5-2.1Z" /></svg>
      </a>
      <button className="assistant-trigger" onClick={() => setAssistantOpen((open) => !open)} aria-label="Open digital concierge"><Sparkles size={18} /></button>
      <AnimatePresence>{assistantOpen && <motion.aside className="assistant-panel" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}>
        <div className="assistant-panel__head"><span><Sparkles size={16} /> AL HARAMAIN CONCIERGE</span><button onClick={() => setAssistantOpen(false)} aria-label="Close assistant"><X size={17} /></button></div>
        <p>{answer || "Marhaba. How can I help with your journey across the UAE?"}</p>
        <form onSubmit={askConcierge}><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask about our fleet..." aria-label="Ask the concierge" /><button aria-label="Send message"><ArrowRight size={16} /></button></form>
        <small>For immediate assistance call +971 55 716 2816.</small>
      </motion.aside>}</AnimatePresence>
    </main>
  );
}
