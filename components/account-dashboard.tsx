"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearLocalSession, getLocalSession } from "@/lib/local-auth";

type RequestRecord = {
  id: string;
  vehicle: string;
  journey: string;
  destination: string;
  createdAt: string;
};

type AccountData = {
  user: { name: string; email: string; createdAt: string };
  requests: RequestRecord[];
};

export function AccountDashboard() {
  const router = useRouter();
  const [account, setAccount] = useState<AccountData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadAccount() {
      try {
        const localUser = await Promise.resolve().then(getLocalSession);
        if (localUser) {
          if (active) setAccount({ user: localUser, requests: [] });
          return;
        }
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        const data = await response.json();
        if (response.status === 401) {
          router.replace("/login");
          return;
        }
        if (!response.ok) throw new Error(data.error || "We could not load your account.");
        if (active) setAccount(data);
      } catch (requestError) {
        if (active) setError(requestError instanceof Error ? requestError.message : "We could not load your account.");
      }
    }
    void loadAccount();
    return () => { active = false; };
  }, [router]);

  async function signOut() {
    setError("");
    try {
      const localUser = await Promise.resolve().then(getLocalSession);
      clearLocalSession();
      if (localUser) {
        router.replace("/");
        router.refresh();
        return;
      }
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) {
        const data = await response.json();
        if (response.status !== 503 || !String(data.error || "").toLowerCase().includes("not configured")) {
          throw new Error(data.error || "We could not sign you out.");
        }
      }
      router.replace("/");
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "We could not sign you out.");
    }
  }

  return (
    <section className="account-panel">
      {error && <p className="form-message form-message--error" role="alert">{error}</p>}
      {!account && !error && <p>Loading your account...</p>}
      {account && <>
        <div className="account-panel__welcome">
          <div><span className="eyebrow eyebrow--dark">YOUR PRIVATE DASHBOARD</span><h1>Welcome, <em>{account.user.name.split(" ")[0]}.</em></h1><p>{account.user.email}</p></div>
          <button className="button button--outline-dark button--small" onClick={signOut}>Sign out</button>
        </div>
        <div className="account-panel__links">
          <Link className="button button--gold" href="/fleet">Explore the fleet</Link>
          <Link className="button button--outline-dark" href="/enquire">Plan a journey</Link>
        </div>
        <div className="account-requests">
          <h2>Your enquiries</h2>
          {account.requests.length === 0
            ? <p>Your saved journey requests will appear here.</p>
            : account.requests.map((request) => <article key={request.id}><div><strong>{request.vehicle || request.journey}</strong><span>{request.destination} · {request.journey}</span></div><time dateTime={request.createdAt}>{new Date(request.createdAt).toLocaleDateString()}</time></article>)}
        </div>
      </>}
    </section>
  );
}
