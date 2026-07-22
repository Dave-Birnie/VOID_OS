# VOID OS — Build Task List (Claude)

Working tracker for the member-dashboard build. Ported from the 3amCEO backend
pattern + FamilyLock's edit-layout UX. Keep this updated as phases land.

## Architecture recap
- Real Supabase SSR auth (done). `profiles.role` = admin source of truth.
- Member dashboard at `/dashboard`; admin CMS at `/admin`; CMS↔Dashboard toggle (done).
- Per-user state: `user_apps` table (installs) + `profiles.app_settings` JSONB
  (`widgets[]`, `widget_sizes{}`, `hidden_widgets[]`, `app_names{}`, `today{}`, `notifications{}`).

## App catalog (16 apps — all "coming soon" placeholders)
Users can rename any app (stored in `app_settings.app_names`). IDs are fixed.

| id | default name | category | feeds stat |
|----|--------------|----------|-----------|
| daily_ops | Daily Ops | Core | work |
| battle_board | Battle Board | Gamification | strength |
| the_campaign | The Campaign | Goals | work |
| north_star | North Star | Goals | focus |
| habit_forge | Habit Forge | Habits | strength |
| field_base | Field Base (Kanban) | Productivity | work |
| the_bunker | The Bunker (therapy) | Wellness | mind |
| mess_hall | Mess Hall (recipes) | Life | strength |
| quest_log | Quest Log (tasks) | Productivity | work |
| word_and_spirit | Word & Spirit | Faith | spiritual |
| focus | Focus (timer) | Productivity | focus |
| brainstorm | BrainStorm | Ideation | mind |
| debrief | Debrief (reflection) | Reflection | mind |
| command_brief | Command Brief (AI) | Intel | focus |
| money_ops | Money Ops | Finance | work |
| horizon | Horizon (vision board) | Vision | spiritual |

## Phases
- [x] **Phase 1 — Foundation** (merged): profiles columns, `user_apps`, member `/dashboard` shell, DashboardHeader, ModeSwitch (CMS↔Dashboard).
- [ ] **Phase 2 — App Store + adjustable layout** (in progress)
  - [ ] Store page: install / remove apps (`user_apps`), filters, coming-soon states
  - [ ] **User app rename** (`app_settings.app_names`)
  - [ ] Dashboard active-apps grid using custom names
  - [ ] Quick-action cards: Visit Store, Watch the Journey (paid), Chat with Dev (paid), Life Stats
  - [ ] **Adjustable widget board** with **"Edit Layout" FAB** (FamilyLock style — drag/hide controls hidden until edit mode). Reorder + hide/show + (optional) resize, persisted to `app_settings`.
  - [ ] **Life Stats** widget (6 areas: Spiritual/Love/Work/Focus/Mind/Strength, RPG-style with levels). Placeholder values until source apps exist.
  - [ ] Today View widget
- [x] **Phase 3 — Gideon in the dashboard**
  - [x] Member-facing Gideon assistant (floating dock) wired into the dashboard
  - [ ] Real BYOK AI call (shared callAI adapter) — currently canned responses
- [x] **Phase 4 — Notifications & Alerts**
  - [x] `notifications` table (per-user) + RLS
  - [x] Notification bell + auto-toast popup on the dashboard
  - [x] **Shoutout → notification fan-out** via `broadcast_notification()` SECURITY DEFINER RPC; toast on next load
  - [ ] Daily nudge hooks (overdue/streak) — later, needs real apps
- [ ] **Phase 5 — Settings**
  - [ ] Appearance (theme/font/density/reduced-motion) + CSS theme system (`data-theme`)
  - [ ] Account (nickname/timezone)
  - [ ] AI Providers (BYOK keys — Gemini/Claude/OpenAI/Grok), shared `callAI` adapter
  - [ ] Notifications prefs, Privacy & Data
- [ ] **Cross-cutting**
  - [ ] Dev Journey ("Watch the Journey") + Community Chat ("Chat with Dev") surfaced as dashboard entry points, gated by `has_dev_pass`
  - [ ] `NEXT_PUBLIC_KICKSTARTER_URL` used for unlock CTAs

## Deploy notes
- DB migrations applied to the live `davidbirnie-site` Supabase project (shared with VOID for now).
- Each phase ships as its own PR, squash-merged to `main` → Vercel deploy.

## Scope decisions (from Master Plan v3)
- **No Stripe / no in-app billing** in this project — Kickstarter handles pledges.
  Stripe belongs to a future standalone-SaaS phase only. `.env.example` has no
  STRIPE_* vars.
- **AI = BYOK, any provider** (`AI_PROVIDER` / `AI_API_KEY` per-user encrypted /
  `AI_MODEL`) via a shared `callAI()` adapter. No shared server-paid key.
- **Landing pricing = 6-tier Kickstarter structure** ($10/$25/$150/$350-450/$999/$2,500) — done.
- **Dual stack**: PHP (FamilyLock) for lower tiers, Next.js/Supabase/Vercel for AI/CMS tiers.

## FamilyLock repo findings (answers to the plan's open questions)
- Hosting: **shared hosting** (localhost MySQL, cPanel/.htaccess). PHP shared
  hosting *can* still run server-side DB/auth + receive webhooks; the real limit
  is the Next.js runtime.
- DB access: **server-side & safe** — PDO prepared statements, no client creds.
- Multi-user: **one codebase, multi-tenant**, keyed by `user_id`; `add-user.php`
  + shared users table w/ `subdomain` + `role_id`; PHP sessions + bcrypt.

## Known follow-ups / tech debt
- VOID shares the `davidbirnie-site` Supabase project — eventually give VOID its own.
- The 16 apps themselves are placeholders; real app builds are separate work (see mytodo.md).
- Gideon uses canned responses until wired to real BYOK AI (shared callAI adapter).
