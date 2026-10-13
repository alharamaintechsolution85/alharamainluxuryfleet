import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { SiteFooter, SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Create Account | Al Haramain Luxury Fleet",
  description: "Create a private Al Haramain account to save your journey enquiries.",
};

export default function SignupPage() {
  return (
    <main className="site subpage">
      <SiteHeader />
      <section className="account-page">
        <div className="account-card">
          <span className="eyebrow eyebrow--dark">A MORE PERSONAL JOURNEY</span>
          <h1>Create your <em>account.</em></h1>
          <p>Save your details and keep your journey enquiries together in one private dashboard.</p>
          <AuthForm mode="signup" />
          <p className="account-terms">By creating an account, you agree to use it for your own journey enquiries.</p>
          <Link className="account-back" href="/">Return to home</Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
