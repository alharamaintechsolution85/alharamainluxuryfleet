import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { QuoteForm } from "@/components/quote-form";
import { SiteFooter, SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Plan a Journey | Al Haramain Luxury Fleet",
  description: "Send a private chauffeur or luxury vehicle enquiry to our UAE concierge team.",
};

export default async function EnquirePage({ searchParams }: { searchParams: Promise<{ vehicle?: string }> }) {
  const { vehicle } = await searchParams;
  const requestedVehicle = typeof vehicle === "string" ? vehicle.slice(0, 100) : "";

  return (
    <main className="site subpage">
      <SiteHeader />
      <section className="account-page">
        <div className="account-card account-card--wide">
          <span className="eyebrow eyebrow--dark">YOUR NEXT JOURNEY, CONSIDERED</span>
          <h1>Tell us what <em>you need.</em></h1>
          <p>{requestedVehicle ? `Enquiry for ${requestedVehicle}.` : "Share a few details and our concierge will be in touch."}</p>
          <QuoteForm vehicle={requestedVehicle} />
          <p className="privacy-note">No payment details are collected through this website.</p>
        </div>
        <a className="account-phone" href="tel:+971557162816">Prefer to speak with us? +971 55 716 2816 <ArrowRight size={14} /></a>
      </section>
      <SiteFooter />
    </main>
  );
}
