# Al Haramain Luxury Fleet

Responsive Next.js App Router site for luxury chauffeur and vehicle enquiries across the UAE.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Environment

Set server-only credentials in `.env.local`; `.env.example` lists the required names. Never use `NEXT_PUBLIC_` for private credentials.

- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` enable quote and account storage and API rate limits.
- `SESSION_SECRET` must be a private random value of at least 32 characters. It signs secure account sessions and protects account lookup keys.
- `GROQ_API_KEY` enables the concierge assistant; `GEMINI_API_KEY` is the optional fallback provider.
- `NEXT_PUBLIC_SITE_URL` should be set to the canonical production origin when one is selected.

Account creation, sign-in, private dashboards, and saved enquiry history require both Upstash Redis credentials and `SESSION_SECRET`. Passwords are hashed before storage and account sessions use HTTP-only cookies. Configure these server-only credentials before deploying; account storage will return an explicit setup error until then. Generate a session secret with `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"` and keep the value private.

The values previously pasted into chat should be revoked and replaced before configuring the app. No credential values are stored in this repository.

## Pages

- `/` — focused introduction and featured vehicles.
- `/fleet` — the complete vehicle collection and enquiry links.
- `/about` — service overview and UAE destinations.
- `/enquire` — concierge enquiry form.
- `/signup`, `/login`, and `/account` — account creation, sign-in, and the private journey dashboard.

The featured fleet imagery is cropped from the supplied Dubai vehicle photograph; vehicle-specific photography should be verified against the actual available fleet before expanding the catalog.

## Production checks

```bash
npm run lint
npm run build
```

Reservations currently create a concierge request; this site does not collect card details or charge accounts. Confirm vehicle availability, final rates, exchange rates, insurance terms, and legal copy with the business before launch. The catalog inventory, exchange rates, and availability indicators are presentation data and are not connected to a fleet-management system.
