# VOID OS — Master TODO

Living checklist of everything for VOID OS: shipped work, config still needed,
the Phase‑2 backend, launch/marketing, and open decisions.

> **How deploys work:** the site auto-deploys from the `main` branch to Hostinger.
> Merging to `main` triggers a rebuild. Give it a few minutes, then hard-refresh
> (or use an incognito tab) to clear the cached old bundle.

Legend: `[ ]` todo · `[x]` done · 🔴 blocking/important · 🟡 phase 2 · 🟢 nice-to-have

---

## ✅ Done (shipped to `main`)

- [x] Fix the black "Application error" crash (splash-screen `undefined.split` bug)
- [x] After-splash **Consumer vs Developer** mode-select screen (header toggle kept)
- [x] **Blue (developer) vs purple (consumer)** theming across the site
- [x] Stronger content separation between the two modes
- [x] Developer pricing rebuilt:
  - Modular $100 · Founder $150→$250 · Extended Bundle $750 · Ultimate 15-App + AI $1,199→$1,450
  - Lifetime VIP White-Label $2,500 (5 seats) — **Kickstarter campaign only**
- [x] Gideon assistant: robot logo button with "Gideon" label (removed "Chat with")
- [x] Fixed invisible brand logos (missing `#logoGrad` SVG gradient)
- [x] **SEO**: rich metadata, OpenGraph + Twitter cards, JSON-LD (Org, SoftwareApplication, FAQ, Blog, Article), `robots.txt`, `sitemap.xml`, per-page metadata
- [x] `og-image.png` (1200×630) for link previews
- [x] **Accessibility (AODA/WCAG best-effort)**: skip link, focus rings, reduced-motion, ARIA labels, landmarks, dialog semantics
- [x] **Blog**: public `/blog` + `/blog/[slug]` (SSG, SEO), 2 starter posts
- [x] **Blog CMS**: `/admin/blog` — create/edit/publish/delete, token-gated Supabase edge function (secure writes)
- [x] Supabase schema applied to `davidbirnie-site` project (VOID OS tables + `blog_posts`)
- [x] Admin access: allowlist your Gmail, auto-upgrade session, always-visible Admin button
- [x] Admins redirect to `/admin` dashboard after login
- [x] Renamed consumer product from "turnkey SaaS" jargon to **VOID Online** everywhere
- [x] **VOID Online waitlist** with live count-up ticker toward a 50-member goal
      (Supabase `void_waitlist` table + public count function)

---

## 🔴 Config & Deploy (do these so production fully works)

- [ ] **Set environment variables in the Hostinger deploy settings** (they live in
      local `.env.local`, which is git-ignored and never deployed):
  - `NEXT_PUBLIC_SUPABASE_URL` = `https://cbaavalgsioychutzcga.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (the anon key from Supabase → Project Settings → API)
  - `NEXT_PUBLIC_SITE_URL` = your canonical domain (e.g. `https://voidos.io`)
      → without these, `/blog` shows an empty state and SEO URLs fall back to a default host
- [ ] Confirm Hostinger actually rebuilds on push to `main` (check its deploy/build logs)
- [ ] Keep the **Blog CMS admin token** private (provided in chat, NOT stored in this repo).
      Ask to rotate it anytime.
- [ ] Point the real domain at the site; update `NEXT_PUBLIC_SITE_URL` to match

---

## 🟡 Phase 2 — Real Backend (currently demo/mock)

The dashboard exists but most of it is demo data. Real versions need Supabase Auth
+ a server runtime (per the master plan, this is the **Vercel** move).

- [ ] **Real Supabase Auth** (email/password + OAuth), replacing the mock localStorage login
- [ ] **User portal / app after login** (`/app` or `/dashboard`) — real Daily Ops + Battle
      Board saved per user, so a normal login lands somewhere real instead of the landing page
- [ ] Enforce admin via `profiles.role` + RLS (not a client-side allowlist)
- [ ] Wire **Analytics** tab to real data (currently static sample numbers)
- [ ] Wire **Chat transcripts** to Supabase (currently local-browser only)
- [ ] Wire **Global Messages / Shoutouts** to Supabase so they actually broadcast
- [ ] Add RLS policies for `profiles` (self read/update) once auth is real
- [ ] Migrate app off Hostinger to **Vercel** once the $750 goal is hit (server runtime for auth, Stripe webhooks, Supabase service-role)
- [ ] Stripe: subscription plumbing (webhooks, price IDs) — Vercel only

**Note:** the **Blog CMS is already real** (Supabase + edge function) and works today.

---

## 💰 Pricing & Kickstarter

- [ ] Confirm final tier lineup vs the master plan (Modular $100, Founder $150/$250,
      Extended $750, Ultimate 15-App $1,199/$1,450, Lifetime VIP $2,500 KS-only)
- [ ] 🟢 Add a **$45–60 "3-App Starter" Kickstarter tier** (bridges $15 → $100) — *Manus rec*
- [ ] 🟢 Add **anchor "retail value"** labels (e.g. "$150 Founder — $499 value") — *Manus rec*
- [ ] Set up **Stripe Payment Links** for one-time tiers (works on static Hostinger now)
- [ ] Decide whether the $25 post-campaign Watch-the-Dev tier survives after launch
- [ ] Confirm funding goal: $750 vs **$2,500** (Manus recommends $2,500)
- [ ] Confirm "15 apps" for Lifetime VIP = a real build commitment (10 planned + 5 more)

---

## 🟢 Content & Marketing (get discovered)

- [ ] Write more blog posts via the CMS (`/admin/blog`) — target search terms:
      "self-hosted habit tracker", "ADHD productivity system", "gamified habit tracking"
- [ ] Publish some `dev-journey` devlogs **publicly** (locked posts are invisible to Google)
- [ ] Add a **"why data sovereignty matters to me"** mission section — *Manus rec*
      (a seed blog post already exists to adapt)
- [ ] Launch posts: Show HN / Product Hunt; subreddits (r/selfhosted, r/productivity, r/ADHD, r/nextjs)
- [ ] Cross-post engineering deep-dives to dev.to / Indie Hackers (canonical link back)
- [ ] Submit `sitemap.xml` to Google Search Console + Bing Webmaster Tools

---

## ♿ Accessibility (finish AODA AA)

- [ ] Contrast sweep on tiny `text-[9px]`/`text-[10px]` grey labels (some may miss 4.5:1)
- [ ] Verify keyboard navigation through the full flow (splash → mode select → app)
- [ ] Add a mobile nav menu (nav links are hidden on small screens today)

---

## 🔑 References

- **Supabase project:** `davidbirnie-site` (`cbaavalgsioychutzcga`), region `us-east-1`
- **Blog admin edge function:** `blog-admin` (token-gated; token kept out of repo)
- **Admin email allowlist:** `src/lib/supabase/client.ts` → `ADMIN_EMAILS`
- **Site/SEO config:** `src/lib/site.ts`
- **Working branch:** `claude/sites-broken-thkdw6` → merged to `main` to deploy
- **Waitlist:** `void_waitlist` table + `void_waitlist_count()` fn; goal = 50 (in `src/components/Waitlist.tsx`)

---

## ❓ Open decisions (need your call)

- [ ] Start Phase‑2 **real auth** now, or keep the demo dashboard for the Kickstarter launch?
- [ ] Add the Manus tweaks (starter tier, anchor pricing, mission section)?
- [ ] Funding goal: $750 or $2,500?
