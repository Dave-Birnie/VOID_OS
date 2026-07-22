# VOID OS — Project / Engineering TODO

Technical backlog from a build standpoint (distinct from `todo.md`, which tracks
product/business requirements). Grouped by area, roughly in priority order.

Legend: `[ ]` todo · `[x]` done · 🔴 blocker · 🟠 important · 🟢 polish

---

## Architecture & Hosting

- [ ] 🔴 **Migrate to Vercel for the real app** — Hostinger shared hosting can't run
      the Next.js server (API routes, ISR, Stripe webhooks, service-role writes).
      Landing page can stay static; the authenticated app must move.
- [ ] 🟠 Decide runtime story on Hostinger now: is it serving a Node server or static?
      This determines whether `/blog` ISR (`revalidate`) actually re-generates.
- [ ] 🟠 Set production env vars in the deploy environment (`NEXT_PUBLIC_SUPABASE_URL`,
      `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`). Blog + waitlist need them.
- [ ] 🟢 Consider `output: 'export'` only if committing to pure-static hosting (would
      disable ISR, API routes, and dynamic `[slug]` fallback — likely not what we want).

## Authentication (currently mock)

- [ ] 🔴 Replace localStorage mock auth with **real Supabase Auth** (email/password + OAuth).
      Files: `src/components/AuthModal.tsx`, `src/lib/supabase/client.ts`.
- [ ] 🔴 Move admin gating from the client-side `ADMIN_EMAILS` allowlist to
      `profiles.role` + RLS. The current allowlist is UI-only and not a security boundary.
- [ ] 🟠 Wire `getLocalAuthState`/`setLocalAuthState` usage over to a real session/context
      (React context or Supabase session listener) instead of ad-hoc localStorage reads.
- [ ] 🟠 Add real profile bootstrapping: on first sign-in, insert a `profiles` row;
      seed the owner account as `role = 'admin'`.
- [ ] 🟢 Guard `/admin` and `/admin/blog` with a real auth check (currently the admin
      page mock-creates an admin profile for any visitor).

## Backend data wiring (dashboard is demo)

- [ ] 🟠 Analytics tab → real metrics from Supabase (signups, subs, token usage).
- [ ] 🟠 Chat transcripts → persist Gideon visitor chats to `chat_transcripts` (currently
      localStorage only); read them in `/admin`.
- [ ] 🟠 Shoutouts / global messages → persist to `shoutouts` + a real broadcast surface.
- [ ] 🟠 Devlogs → the old `/admin` "CMS" tab is mock; either wire it to the `devlogs`
      table or retire it in favor of the real Blog CMS.
- [ ] 🟢 Add RLS policies for `profiles` (self read/update) once auth is real.

## Blog / CMS (shipped — hardening)

- [x] `blog_posts` table + RLS (public read published)
- [x] Token-gated `blog-admin` edge function for writes
- [x] `/blog`, `/blog/[slug]` SSG + `/admin/blog` CMS
- [ ] 🟠 Rotate the CMS admin token out of chat history into a proper secret; support
      rotating it (update `blog_admin.token_hash`).
- [ ] 🟢 Markdown renderer (`src/lib/markdown.ts`) is minimal — consider a vetted lib
      (react-markdown + rehype-sanitize) if posts need tables/images/code blocks.
- [ ] 🟢 Add image/cover upload (Supabase Storage) instead of emoji-only covers.
- [ ] 🟢 `generateStaticParams` returns nothing when Supabase is unreachable at build —
      confirm production build has network + env so post pages pre-render.

## Waitlist (shipped — follow-ups)

- [x] `void_waitlist` table (public insert, no row read-back) + `void_waitlist_count()`
- [ ] 🟠 Add basic anti-abuse (rate limit / captcha) before heavy promotion — insert is open.
- [ ] 🟢 Admin view of waitlist signups (via a service-role edge function, like blog-admin).
- [ ] 🟢 Confirmation email on join (needs an email provider — deferred per master plan).

## Payments

- [ ] 🟠 Stripe **Payment Links** for one-time tiers (works on static hosting now).
- [ ] 🔴 Stripe subscriptions + webhooks for VOID Online monthly plans (Vercel only).
- [ ] Wire the price-ID env vars from the master plan's checklist.

## Quality, testing, tooling

- [ ] 🟠 No tests exist — add a smoke/e2e (Playwright) covering: splash → mode select →
      no client exceptions; blog renders; CMS token gate; waitlist join.
- [ ] 🟠 Add a SessionStart hook / CI that runs `next build` + `next lint` so a broken
      build never reaches `main` (the original crash shipped because nothing caught it).
- [ ] 🟢 Enable stricter lint/type rules; wire `npm run lint` into CI.
- [ ] 🟢 Add error boundaries around client widgets (Simulator, chatbot) so one failure
      can't blank the whole tree (root cause pattern of the original outage).

## SEO & accessibility (shipped — finish)

- [x] Metadata, OG/Twitter, JSON-LD, robots, sitemap, og-image
- [x] Skip link, focus rings, reduced-motion, ARIA labels, landmarks
- [ ] 🟠 Contrast audit on `text-[9px]`/`text-[10px]` grey labels for WCAG AA (4.5:1).
- [ ] 🟢 Mobile nav menu — header nav links are `hidden md:flex` (invisible on phones).
- [ ] 🟢 Submit sitemap to Google Search Console + Bing once the domain is final.

## Housekeeping

- [ ] 🟢 Remove the stray `void_os_landing_page (2).html` from the repo root if unused.
- [ ] 🟢 Consolidate duplicated `Header`/`AuthModal` wiring across pages into shared layout.
- [ ] 🟢 The Supabase schema lives across ad-hoc migrations; keep `src/lib/db/schema.sql`
      in sync as the source of truth (now also has blog_posts, blog_admin, void_waitlist).

---

_Working branch: `claude/sites-broken-thkdw6` → merged to `main` to deploy._
