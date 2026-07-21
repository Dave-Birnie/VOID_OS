# VOID OS — Master Plan

This documents every environment variable the app needs, grouped by service. Use this to fill out your actual `.env.local` (dev) and production environment variables — don't commit real secrets to this file or to git.

## Supabase (DB, Auth, Waitlist/Signup storage)

| Variable | Purpose | Where to get it |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project API URL | Supabase Dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public client key (safe to expose) | Supabase Dashboard → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key, bypasses RLS — used for backend/CMS writes | Supabase Dashboard → Project Settings → API (keep secret, server-side only) |

**Note on signups:** since you're not using Resend/SendGrid, waitlist and account signups write directly into a Supabase table (e.g. `public.signups` or `public.profiles`) via the service role key on the server side. No separate email-service keys needed. If you want automated "you're in!" confirmation emails later, that's the point you'd revisit an email provider — but nothing here depends on it.

## Stripe (SaaS subscription billing)

| Variable | Purpose | Where to get it |
|---|---|---|
| `STRIPE_SECRET_KEY` | Server-side API calls | Stripe Dashboard → Developers → API keys |
| `STRIPE_PUBLISHABLE_KEY` | Client-side checkout | Stripe Dashboard → Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | Verifies webhook events (subscription created/cancelled/etc.) | Stripe Dashboard → Developers → Webhooks (after you create the endpoint) |
| `STRIPE_PRICE_ID_STARTER` | Price ID for $10/mo — 3 apps, limited | Stripe Dashboard → Product catalog |
| `STRIPE_PRICE_ID_STANDARD` | Price ID for $15/mo — 10 apps | Stripe Dashboard → Product catalog |
| `STRIPE_PRICE_ID_ALLACCESS` | Price ID for $25/mo — all apps | Stripe Dashboard → Product catalog |
| `STRIPE_PRICE_ID_AI_ADDON` | Price ID for $10/mo AI add-on (mark inactive until AI ships) | Stripe Dashboard → Product catalog |

Set up one Stripe Product per tier, each with a recurring Price — that Price ID is what goes in the variables above. Keep the AI add-on product created but unpublished/inactive until the feature is actually live, so nothing can be purchased early.

**Near-term (pre-app) use of Stripe:** before any of the above webhook/subscription plumbing exists, use **Stripe Payment Links** for the Watch-the-Dev pass and any other one-time tiers. Payment Links are hosted by Stripe directly — no backend, no webhook, works fine linked from a static Hostinger page. This is the fastest way to test whether people will actually pay, before building anything else.

## AI Add-on (fixed provider: OpenAI)

| Variable | Purpose |
|---|---|
| `OPENAI_API_KEY` | Server-side key for AI-powered features (e.g. RepurposeIt) |
| `OPENAI_MODEL` | Default model string, e.g. `gpt-4o-mini` — keep this as a variable, not hardcoded, so you can swap models without a redeploy |

Since this is a fixed provider (not bring-your-own-key), this key lives only on your server and is never exposed to the client.

## App / Site Config

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL, e.g. `https://voidos.io` — used for OAuth redirects, Stripe redirect URLs, metadata |
| `NODE_ENV` | `development` / `production` |

## Hosting Plan (Pre-Launch vs. Post-Kickstarter)

**Phase 1 — Now, through the Kickstarter campaign: Hostinger (shared, free-tier)**
This is temporary and landing-page-only. Hostinger shared hosting is PHP/static-first and generally can't run a Next.js server (API routes, Stripe webhooks, Supabase service-role calls won't work there). So during this phase, keep it to the static landing page — waitlist signup, campaign links, dev portal CTA. No live billing or backend logic needs to run on Hostinger.

Note: this doesn't block taking payment during Phase 1 — Stripe Payment Links are just hosted external URLs, so they work fine from a static page. What Phase 1 can't do is run the Supabase login portal or Stripe webhooks server-side (see Watch-the-Dev Portal section below for how this is handled).

**Phase 2 — Once the $750 Kickstarter goal is hit (could be mid-campaign): transition to Vercel**
This is the trigger point. Once funded, move the real app — auth, Stripe checkout, Supabase-backed signups/CMS, AI add-on — onto Vercel, which supports the full Next.js server runtime. This is also when the environment variables above actually get set as real production values (in Vercel's dashboard, not a Hostinger panel).

Practical implication: don't build any backend logic assuming Hostinger will run it. Build for Vercel from day one, and just point the domain at the static landing page on Hostinger until funding lands — then cut over.

---

## Watch-the-Dev Monetization Plan

### Pricing / Kickstarter early-bird structure — FINALIZED
- **Kickstarter backer price:** $15
- **Post-campaign website price:** $25 (framed as a limited-time campaign discount off $25, not a standalone price)

Framing it as a discount off a stated higher price is what makes backers feel they got a deal — just lowering the number without an anchor doesn't have the same effect.

**Open decision — post-campaign viability:** the live weekly-devlog content only has "watch it unfold in real time" value *during* the build. Once VOID OS ships, the same repurposed footage is competing with every other "watch me build a SaaS" channel, sold to a smaller, more skeptical, non-Kickstarter audience. Don't let the $25 website tier default-carry-forward — decide separately, once the campaign ends, whether it survives as its own evergreen content (vibe-coding process, planning methodology) sold on its own merits, or retires once the live-build devlogs stop being about a product that doesn't exist yet.

### Free tier (top-of-funnel)
A free "updates" account exists purely to capture leads for later upsell. It does **not** need Supabase auth or credentials on its own — it's a mailing list, not a product:
- Backed by the existing waitlist email capture (or a simple ConvertKit/Mailchimp free-tier list)
- Delivers occasional posted updates only — no video, no tutorials
- Purpose: warm list to advertise the real product/app to once it ships

### Paid tier: Watch-the-Dev Portal
This is the tier that justifies real Supabase auth, since it's the same auth/profile system the full VOID OS app will reuse later — not duplicated work.

- **Delivery format:** blog-style written updates (not just a raw unlisted video) — gives paying backers a stronger sense of getting more than "just a video," and content is lighter to produce/maintain than a full video-editing pipeline
- **Video content:** raw/behind-the-scenes footage repurposed directly from existing 3amCEO filming — no new shooting required, just an additional export/cut of something already being filmed weekly
- **Access:** username/password login on the site (Supabase Auth), not just an unlisted YouTube link — the login wall itself is part of the credibility play (visitors see "this person has a real product with real infrastructure," which pre-sells trust in the eventual VOID OS app)
- **Portal contents (minimum viable, avoid a bare video page):** welcome/intro blurb, blog feed, embedded video, simple changelog/roadmap list — enough that it reads as a lightweight dashboard rather than a paywall around one clip

### Data collection guardrail
Collect only what's actually used: name, email, and Supabase's default auth fields. Don't gather extra fields (phone, address, etc.) "because the backend already exists" — more fields collected means more to secure and more liability, with no corresponding use case yet.

### Reuse path into the real product
The `profiles` table and Supabase Auth setup built for Watch-the-Dev backers is the same table structure the full VOID OS app will use for its users later — this is the one part of the "do it once" instinct that holds up. The blog/portal UI itself will not carry forward as-is; it's throwaway front-end wrapped around infrastructure that does carry forward.

### Realistic timeline (Kickstarter payout)
"Money in hand" = prep + campaign + payout, not just campaign + payout:
- **Prep** (campaign page, video, reward tiers): not yet started, 1–4 weeks depending on polish
- **Campaign duration:** typically ~30 days (Kickstarter allows 1–60)
- **Payout processing:** ~2 weeks after a successful campaign closes (Kickstarter uses Stripe for settlement)

Total: ~6 weeks if run lean, ~2–3 months if polished. The $750 funding goal is low enough that funding risk is minimal — but real income comes from how many backers buy the $100/$150/$750/$2,500 tiers, not from clearing the $750 threshold itself.

### Scope guardrail
This whole plan works because it piggybacks on content already being produced for 3amCEO — the incremental new work is small (login page, portal UI, blog posts). The trap to avoid is treating "I already have a Supabase project" as a reason to build out more backend/features than the Watch-the-Dev tier actually needs — build only the auth + profiles + content-serving pieces required for this tier now, and let the rest of the real app's backend get built later, on its own timeline.

---

## AI & API Key Boundary — FINALIZED

**Definition (important, gets restated often so it stays precise):** "AI integration" means every app ships with AI *hooks built into its workflow* (e.g. a "Generate tasks" button that parses free text into a structured to-do list). It does **not** mean AI usage is included. The buyer supplies their own model + API key. This applies to every non-SaaS tier — Modular, Founder's BYOK apps, Extended Bundle, Lifetime VIP — with no exceptions. Only the metered cloud-hosted SaaS tier uses server-side (your own) API credits.

Correct marketing language: *"AI-integrated — every app has AI built into its workflow. Bring your own API key (Claude, ChatGPT, Gemini, or Grok) to activate it. Setup video included with every purchase."* Not "AI included" — that implies you're footing usage costs.

### Provider architecture
- **Settings UI (per user, shared across all apps once configured):** provider dropdown + free-text model name field + API key field.
- **Supported providers (v1, by disclaimer — others are the buyer's own problem to wire in):** Claude, ChatGPT (OpenAI), Gemini, Grok.
- **Model name stays free-text, not a fixed dropdown** — providers rename/ship new models constantly; free-text means the app never goes stale.
- **Under the hood:** one shared adapter function (e.g. `callAI(provider, model, apiKey, prompt)`) branching to a per-provider request format (different base URLs, auth header styles, response shapes), normalizing all responses back to plain text before they hit the app UI. Written once, reused by every app in the ecosystem — this is the only piece of "real" new engineering work this feature adds.
- **Failure mode to flag in the setup video/disclaimer:** a mistyped or nonexistent model name fails as a provider API error, not an "app is broken" error — worth a line telling users to double-check the exact model string from their provider's docs, so support requests read as user typos, not bugs.

---

## Core Economic & Funding Model — FINALIZED

- **Kickstarter Goal:** $750 — sized as an achievable sprint to cover dedicated app server hosting and operational infrastructure for the upcoming year (raised from the earlier $500 figure).
- **Origin story:** built and battle-tested over a year of real-world personal use — 10 custom productivity/life-management tools, optimized for ADHD-friendly execution.
- **Post-campaign website model:** waitlist for a recurring pay-as-you-go / monthly SaaS tier, for users who want cloud-hosted convenience over self-hosting.

## Finalized Kickstarter Reward Tiers

- **Watch-the-Dev Pass — $15** (see Watch-the-Dev Monetization Plan section above for full detail: $25 post-campaign, delivery format, portal contents)
- **Modular Pass — $100**: one standalone app paired with Daily Ops. BYOK for AI.
- **Founder Early Bird Pass — $150 launch day / $250 after**: everything in Modular Pass plus 3 more apps (4 total) and a 3-month premium SaaS cloud-hosted pass using server-side API credits (the one tier where server AI usage is included, since it's the metered SaaS product).
- **Extended Bundle Pass — $750**: all 10 core apps + complete video guides/tutorials. No white-labeling, no server AI credits (BYOK). Note: sits at the same number as the campaign goal — one single backer at this tier would fully fund the campaign, worth knowing when reading early momentum.
- **Lifetime VIP White-Label Pass — $2,500, capped at 15 total apps, capped at 5 seats.** Full detail and rationale below.

### Lifetime VIP — rationale
Originally structured as $1,000+ for "all future apps, forever" — an uncapped liability against a one-time payment. Two independent caps fix this, not a price increase alone:
- **App cap:** 15 total apps (not open-ended), so the offer is a defined, evaluable bundle rather than an infinite promise.
- **Seat cap:** 5 passes available. With no ad spend planned for the campaign, the realistic backer pool is organic Kickstarter traffic plus personal shares — a small pool, not a large one — so scarcity does more real work here than a higher price tag.
- **Open question to confirm before launch:** does "15 apps" mean the 10 currently planned plus 5 more you're committing to build, or is 15 just a round target? If it's a real commitment, that's 5 apps of build-work owed to each Lifetime buyer — worth being sure that's a commitment you actually want on record.

## CMS / White-Label Add-Ons (post-launch, not v1 scope)
A CMS layer letting white-label buyers edit their own instance's content/branding without touching code is a legitimate future upsell — scoped as a **plugin sold separately once real white-label customers exist and ask for it**, not part of the initial Kickstarter build.

## Buyer Data — Marketing List vs. Data Resale
Capturing your own buyers' name/email at purchase, to market future VOID OS products to them later, is standard practice — needs a line in a privacy disclosure on the site, nothing more. This is **not** the same as collecting or reselling end-customer data belonging to a white-label buyer's own business — that data belongs to whoever runs the white-labeled instance, not to VOID OS. Reusing or reselling it would be both a trust-breaking move and a real legal exposure (PIPEDA in Canada, GDPR if any EU users). Keep these two categories clearly separate in any privacy policy language.

---

## Full Variable Checklist

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID_STARTER=
STRIPE_PRICE_ID_STANDARD=
STRIPE_PRICE_ID_ALLACCESS=
STRIPE_PRICE_ID_AI_ADDON=
STRIPE_PAYMENT_LINK_WATCHTHEDEV=

OPENAI_API_KEY=
OPENAI_MODEL=

NEXT_PUBLIC_SITE_URL=
NODE_ENV=
```
