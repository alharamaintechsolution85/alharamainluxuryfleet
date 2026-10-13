import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { VehicleCatalog } from "@/components/vehicle-catalog";

export const metadata: Metadata = {
  title: "Luxury Vehicle Collection | Al Haramain Luxury Fleet",
  description: "Browse supercars, luxury sedans, SUVs and VIP vans with indicative daily and monthly AED rates. Search by make, model or feature.",
};

export default function FleetPage() {
  return (
    <main className="site subpage">
      <SiteHeader />
      <section className="page-intro">
        <span className="eyebrow eyebrow--dark">THE COLLECTION</span>
        <h1>Our luxury <em>vehicles.</em></h1>
        <p>Browse supercars, executive sedans, luxury SUVs and VIP vans with indicative AED rates. Search by make, model, feature or category.</p>
      </section>
      <VehicleCatalog />
      <SiteFooter />
    </main>
  );
}
