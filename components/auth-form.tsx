"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { clearLocalSession, loginLocalAccount, registerLocalAccount } from "@/lib/local-auth";

export function AuthForm({ mode }: { mode: "signup" | "login" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const isSignup = mode === "signup";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setSubmitting(true);
    const form = event.currentTarget;
    const body = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      if (!response.ok) {
        if (response.status !== 503 || !String(result.error || "").toLowerCase().includes("not configured")) {
          throw new Error(result.error || "We could not complete your request.");
        }
        if (isSignup) {
          await registerLocalAccount(String(body.name), String(body.email), String(body.password));
        } else {
          await loginLocalAccount(String(body.email), String(body.password));
        }
        setNotice(isSignup
          ? "Your account is saved in this browser. It will not sync to other devices. Redirecting..."
          : "You’re signed in on this browser. Redirecting...");
        window.setTimeout(() => {
          router.replace("/account");
          router.refresh();
        }, 700);
        return;
      }
      clearLocalSession();
      setNotice(isSignup ? "Your account is ready. Taking you to your dashboard..." : "You’re signed in. Taking you to your dashboard...");
      window.setTimeout(() => {
        router.replace("/account");
        router.refresh();
      }, 700);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "We could not complete your request.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="account-form" onSubmit={submit}>
      {isSignup && <label>Full name<input name="name" required minLength={2} maxLength={100} autoComplete="name" /></label>}
      <label>Email address<input name="email" type="email" required maxLength={254} autoComplete="email" /></label>
      <label>Password<input name="password" type="password" required minLength={isSignup ? 12 : 1} maxLength={128} autoComplete={isSignup ? "new-password" : "current-password"} /></label>
      {isSignup && <p className="form-hint">Use at least 12 characters. Your password is securely hashed before it is saved.</p>}
      {error && <p className="form-message form-message--error" role="alert">{error}</p>}
      {notice && <p className="form-message" role="status">{notice}</p>}
      <button className="button button--gold" disabled={submitting}>{submitting ? "Please wait..." : isSignup ? "Create account" : "Sign in"}</button>
      <p className="account-switch">
        {isSignup ? "Already have an account? " : "New to Al Haramain? "}
        <Link href={isSignup ? "/login" : "/signup"}>{isSignup ? "Sign in" : "Create an account"}</Link>
      </p>
    </form>
  );
}
