import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { SiteFooter, SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Sign In | Al Haramain Luxury Fleet",
  description: "Sign in to your Al Haramain journey dashboard.",
};

export default function LoginPage() {
  return (
    <main className="site subpage">
      <SiteHeader />
      <section className="account-page">
        <div className="account-card">
          <span className="eyebrow eyebrow--dark">WELCOME BACK</span>
          <h1>Sign in to <em>continue.</em></h1>
          <p>View your saved journey enquiries and account details.</p>
          <AuthForm mode="login" />
          <Link className="account-back" href="/">Return to home</Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
