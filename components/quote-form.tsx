"use client";

import { FormEvent, useState } from "react";

export function QuoteForm({ vehicle = "" }: { vehicle?: string }) {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    const form = event.currentTarget;
    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form).entries())),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "We could not save your request.");
      form.reset();
      setMessage("Your enquiry has been saved. Our concierge will be in touch shortly.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "We could not save your request. Please call +971 55 716 2816.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="account-form quote-page-form" onSubmit={submit}>
      <input type="hidden" name="vehicle" value={vehicle} />
      <label>Your name<input name="name" required minLength={2} autoComplete="name" /></label>
      <div className="form-row">
        <label>Email address<input name="email" type="email" required autoComplete="email" /></label>
        <label>Phone number<input name="phone" type="tel" required autoComplete="tel" /></label>
      </div>
      <label>Journey type
        <select name="journey" defaultValue="Chauffeur service">
          <option>Chauffeur service</option>
          <option>Self-drive rental</option>
          <option>Airport transfer</option>
          <option>Wedding or event</option>
          <option>Corporate travel</option>
        </select>
      </label>
      <label>Destination
        <select name="destination" defaultValue="Dubai">
          <option>Dubai</option>
          <option>Abu Dhabi</option>
          <option>Sharjah</option>
          <option>Ras Al Khaimah</option>
          <option>Ajman</option>
          <option>Fujairah</option>
        </select>
      </label>
      <button className="button button--gold" disabled={submitting}>{submitting ? "Sending..." : "Send enquiry"}</button>
      {message && <p className="form-message" role="status">{message}</p>}
    </form>
  );
}
