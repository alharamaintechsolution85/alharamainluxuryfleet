import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Our Story | Al Haramain Luxury Fleet",
  description: "Discover the people, purpose and UAE experience behind Al Haramain Luxury Fleet.",
};

export default function OurStoryPage() {
  return (
    <main className="site subpage">
      <SiteHeader />
      <section className="story-hero">
        <div>
          <span className="eyebrow eyebrow--dark">OUR STORY</span>
          <h1>Every journey begins<br />with <em>care.</em></h1>
          <p>Built around a simple belief: luxury is not only the vehicle. It is how considered, comfortable and at ease a guest feels from the first hello to the final arrival.</p>
          <Link className="button button--gold" href="/fleet">Explore the collection <ArrowRight size={15} /></Link>
        </div>
        <Image src="/luxuryhome.png" alt="Luxury travel in the UAE" width={1280} height={725} priority />
      </section>
      <section className="story-years">
        <strong>6+</strong>
        <div><span className="eyebrow eyebrow--dark">YEARS IN UAE LUXURY TRANSPORT</span><p>Experience shaped by the people, pace and places of the Emirates.</p></div>
      </section>
      <section className="story-principles">
        <article><span>01</span><Sparkles /><h2>Thoughtful by design</h2><p>We take time to understand the occasion, the schedule and the small preferences that make travel feel personal.</p></article>
        <article><span>02</span><MapPin /><h2>Rooted in the UAE</h2><p>From city meetings to airport arrivals and longer trips, our service is built for journeys across all seven Emirates.</p></article>
        <article><span>03</span><Sparkles /><h2>Quietly exceptional</h2><p>Professional chauffeurs, well-presented vehicles and clear communication are the standard, not the extra.</p></article>
      </section>
      <section className="story-vision">
        <span className="eyebrow">OUR VISION</span>
        <h2>To make every arrival<br /><em>feel effortless.</em></h2>
        <p>We keep the experience straightforward: attentive people, considered vehicles, and a dependable point of contact wherever the road takes you in the UAE.</p>
        <Link className="button button--gold" href="/about">Meet our leadership <ArrowRight size={15} /></Link>
      </section>
      <SiteFooter />
    </main>
  );
}
