import type { Metadata } from "next";
import { AccountDashboard } from "@/components/account-dashboard";
import { SiteFooter, SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Your Account | Al Haramain Luxury Fleet",
  description: "Manage your saved Al Haramain journey enquiries.",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return (
    <main className="site subpage">
      <SiteHeader />
      <section className="account-page">
        <AccountDashboard />
      </section>
      <SiteFooter />
    </main>
  );
}
