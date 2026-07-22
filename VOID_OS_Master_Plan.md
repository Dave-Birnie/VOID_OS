# VOID OS — Master Plan

This documents every environment variable the app needs, grouped by service. Use this to fill out your actual `.env.local` (dev) and production environment variables — don't commit real secrets to this file or to git.

## Supabase (DB, Auth, Waitlist/Signup storage)

| Variable | Purpose | Where to get it |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project API URL | Supabase Dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public client key (safe to expose) | Supabase Dashboard → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key, bypasses RLS — used for backend/CMS writes | Supabase Dashboard → Project Settings → API (keep secret, server-side only) |

**Note on signups:** since you're not using Resend/SendGrid, waitlist and account signups write directly into a Supabase table (e.g. `public.signups` or `public.profiles`) via the service role key on the server side. No separate email-service keys needed. If you want automated "you're in!" confirmation emails later, that's the point you'd revisit an email provider — but nothing here depends on it.

## Future Phase — Standalone SaaS (Not Part of This Kickstarter Project)

**Scope clarification:** This Kickstarter project is a **code/source-delivery product** — backers receive app source code, self-host bundles, and (at higher tiers) BYOK AI integration. Kickstarter itself handles the pledge payment; there is no in-app checkout, subscription, or recurring billing in this project. Stripe is **not part of the current build**.

Stripe belongs to a **separate, future SaaS product** (a hosted, subscription version of VOID OS) that comes later. Keeping it here for reference so it's not lost, but do not build against it now:

| Variable | Purpose | Where to get it |
|---|---|---|
| `STRIPE_SECRET_KEY` | Server-side API calls | Stripe Dashboard → Developers → API keys |
| `STRIPE_PUBLISHABLE_KEY` | Client-side checkout | Stripe Dashboard → Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | Verifies webhook events (subscription created/cancelled/etc.) | Stripe Dashboard → Developers → Webhooks (after you create the endpoint) |
| `STRIPE_PRICE_ID_STARTER` | Price ID for entry SaaS tier | Stripe Dashboard → Product catalog |
| `STRIPE_PRICE_ID_STANDARD` | Price ID for mid SaaS tier | Stripe Dashboard → Product catalog |
| `STRIPE_PRICE_ID_ALLACCESS` | Price ID for all-apps SaaS tier | Stripe Dashboard → Product catalog |
| `STRIPE_PRICE_ID_AI_ADDON` | Price ID for AI add-on subscription | Stripe Dashboard → Product catalog |

When this phase starts, revisit hosting (Vercel, since Stripe webhooks + subscription logic need the Next.js server runtime) and re-derive tier pricing from the SaaS market, not from the Kickstarter tiers above.

## AI Add-on (BYOK — Bring Your Own Key, any provider)

**Decision (confirmed via Claude Code session):** the AI add-on is BYOK, not a fixed-provider key. Users supply their own API key (OpenAI, Gemini, Anthropic, or an AI gateway like OpenRouter/Portkey) rather than the app shipping with a single provider baked in.

| Variable | Purpose |
|---|---|
| `AI_PROVIDER` | Which provider the user has configured, e.g. `openai`, `gemini`, `anthropic`, `openrouter` |
| `AI_API_KEY` (per-user, stored encrypted) | The user's own key — never a shared server-side key paid for by you |
| `AI_MODEL` | Default model string for the selected provider — keep as a variable so users can swap models without redeploying |

Implementation notes:
- Store user-supplied keys encrypted at rest (Supabase: consider `pgsodium`/Vault or an encrypted column; PHP/MySQL: encrypt before insert, decrypt server-side only).
- Never log or expose the key to the client after initial entry.
- Since this is BYOK, there's no shared API cost to you — matches the "no recurring server cost" pitch to backers for the AI-enabled tiers.
- The affiliate PDF's OpenRouter/Portkey recommendation (see Affiliate section) fits naturally here — it's a legitimate BYOK path that also earns referral revenue.

## App / Site Config

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL, e.g. `https://voidos.io` — used for OAuth redirects, Stripe redirect URLs, metadata |
| `NODE_ENV` | `development` / `production` |

## Kickstarter Tier Structure (Current)

| Tier | Price | Includes PDF & Discount Links? | Core Deliverable |
|---|---|---|---|
| **Digital Supporter** | $10 | Yes | PDF Workflow Guide + Discount/Affiliate Links + Wall of Fame Credit |
| **Watch-the-Dev** | $25 | Yes | Everything in $10 + Private Dev Portal & Raw Video Logs |
| **Early Bird Pass** | $150 | Yes | Everything in $25 + VOID OS Core + Daily Ops + 1 App Code |
| **Core Builder Pass** | $350–$450 | Yes | Everything in $25 + VOID OS Core + 5 Apps Code |
| **Extended Bundle** | $999 | Yes | Everything in $25 + All 10 Apps + BYOK AI Code |
| **Lifetime VIP** | $2,500 | Yes | Everything in $25 + 15 Apps + Multi-Tenant CMS + Resell Rights |

**⚠️ Sync needed:** The current landing page HTML only shows three tiers ($25 / $150 / $1,000+) and doesn't match this 6-tier structure. Landing page copy and pricing cards need to be updated to match this table before launch. (No Stripe Price IDs involved — this is a Kickstarter pledge structure, not in-app billing.)

## Dual Tech-Stack Strategy (Hostinger/PHP vs. Vercel/Next.js)

VOID OS will ship in **two parallel implementations**, targeting different tiers:

1. **PHP/HTML stack** (modeled on the existing `familylock.ca` codebase — battle-tested in production for 1+ year, 3 users, all 10 apps, on Hostinger).
   - Intended for lower/mid tiers where simplicity and Hostinger-shared-hosting compatibility matter more than automation.
   - Likely uses its own session/auth handling and a MySQL (or similar) database rather than Supabase.
   - No server-side AI calls unless Hostinger is running on a VPS/Cloud plan rather than pure shared hosting — **needs confirmation** (see open questions below).
2. **Next.js/Supabase/Vercel stack** (as originally scoped in this document) — required for tiers needing BYOK/server-side AI (RepurposeIt, The Mirror) and multi-tenant CMS (Lifetime VIP tier).

**Note:** Stripe is not part of this decision at all — see "Future Phase — Standalone SaaS" below. Neither stack needs to handle billing for the current Kickstarter project.

**Open questions for Claude Code to resolve by inspecting the `familylock.ca` repo:**
- Is the current Hostinger deployment **shared hosting** or a **VPS/Cloud plan**? (This determines whether PHP tier users get any backend automation at all, or strictly static/client-side behavior.)
- Does `familylock.ca` call a database directly from PHP (server-side, safe) or from client-side JS with exposed credentials? Confirm before reusing this pattern for a public/paid product.
- Does the PHP version currently handle multiple users/auth, or is the "3 different users" setup actually 3 separate manual deployments/instances?
- Should the two stacks share a single Supabase database (PHP writing to Supabase via REST/service key) or stay fully independent (PHP+MySQL, Next.js+Supabase, no shared data)?
- Which specific tiers map to which stack? Current assumption: PHP for $10–$150 tiers (or as a "lite/self-host-friendly" option across all tiers), Next.js for tiers needing AI/CMS ($350+). Confirm or adjust.
- All tiers are one-time code/bundle deliveries — no recurring subscription logic in either stack for this project.

## $10 Tier PDF: "Solo Builder Tech Stack & Workflow Guide"

Bundled into the $10 tier and included in all higher tiers. Structure:
1. **Architecture Map** — 1-page visual diagram of how Vercel, Supabase, and Hostinger connect for VOID OS itself (update to reflect dual-stack reality once resolved above).
2. **Discount & Partner Links Directory** — curated affiliate/referral links.
3. **5-Minute Deployment Checklist** — step-by-step first deploy.
4. **Environment Variables Cheat Sheet** — based on the checklist below.

**Affiliate programs to include** (Hostinger, Vercel, Stripe, Supabase, OpenRouter/Portkey for AI gateway access, Resend/Postmark, Upstash, Cursor/Windsurf). Note: Stripe's inclusion here is a general "useful tool if you build your own SaaS" recommendation for backers — it's unrelated to VOID OS's own current scope, which has no billing integration:
- **Disclosure requirement:** the PDF and tier description must clearly disclose that these are affiliate/referral links (FTC compliance, backer trust).
- **Hostinger caveat:** since Hostinger will now be offered as a genuine supported path (not just a landing-page placeholder), the disclosure/limitation language should be scoped to whatever is confirmed in the open questions above — e.g. "Hostinger tier = works great for personal/single-tenant deploys; no automated billing or server-side AI unless on a VPS plan."
- Treat affiliate income as a minor bonus revenue stream, not a load-bearing part of the funding model.

## Hosting Plan (Pre-Launch vs. Post-Kickstarter)

**Phase 1 — Now, through the Kickstarter campaign: Hostinger (shared, free-tier)**
This is temporary and landing-page-only. Hostinger shared hosting is PHP/static-first and generally can't run a Next.js server (API routes, Supabase service-role calls won't work there). So during this phase, keep it to the static landing page — waitlist signup, campaign links, dev portal CTA.

**Phase 2 — Once the $500 Kickstarter goal is hit (could be mid-campaign): transition to Vercel**
This is the trigger point. Once funded, move the real app — auth, Supabase-backed signups/CMS, BYOK AI add-on — onto Vercel, which supports the full Next.js server runtime. This is also when the environment variables above actually get set as real production values (in Vercel's dashboard, not a Hostinger panel).

Practical implication: don't build any backend logic assuming Hostinger will run it. Build for Vercel from day one, and just point the domain at the static landing page on Hostinger until funding lands — then cut over.

---

## Full Variable Checklist (Current Project — No Stripe)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

AI_PROVIDER=
AI_API_KEY=
AI_MODEL=

NEXT_PUBLIC_SITE_URL=
NODE_ENV=
```

Stripe variables (`STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID_*`) belong only to the future standalone SaaS phase — see that section above. Don't add them to this project's `.env` until that phase actually starts.
