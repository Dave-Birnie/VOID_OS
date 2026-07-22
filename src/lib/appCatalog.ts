// Single source of truth for the VOID OS app catalog and dashboard widgets.
// Every app is a "coming soon" placeholder until its real build ships. Users
// can rename any app for themselves — the `name` here is only the default
// (overrides live in profiles.app_settings.app_names).

export type AppStatus = "live" | "coming";

export interface CatalogApp {
  id: string; // matches user_apps.app_id
  name: string; // default display name (user-renamable)
  abbr: string;
  tagline: string;
  description: string;
  href: string | null;
  status: AppStatus;
  category: string;
  stat?: "spiritual" | "love" | "work" | "focus" | "mind" | "strength"; // Life Stat it feeds
}

export const APP_CATALOG: CatalogApp[] = [
  {
    id: "daily_ops",
    name: "Daily Ops",
    abbr: "DO",
    tagline: "Your daily command center.",
    description: "Plan the day, run your task list, and rack up XP as you clear it. Every app plugs into Daily Ops.",
    href: null,
    status: "coming",
    category: "Core",
    stat: "work",
  },
  {
    id: "battle_board",
    name: "Battle Board",
    abbr: "BB",
    tagline: "Gamified progress grid.",
    description: "A bingo-style board of goals and habits. Clear lines, earn rewards, and turn the grind into a game.",
    href: null,
    status: "coming",
    category: "Gamification",
    stat: "strength",
  },
  {
    id: "the_campaign",
    name: "The Campaign",
    abbr: "TC",
    tagline: "Your 90-day offensive.",
    description: "The 12-week execution sprint — set the mission, score every week, and push hard to the deadline.",
    href: null,
    status: "coming",
    category: "Goals",
    stat: "work",
  },
  {
    id: "north_star",
    name: "North Star",
    abbr: "NS",
    tagline: "Architect your goals.",
    description: "Break your guiding goal into layers and milestones, then push them down into daily action.",
    href: null,
    status: "coming",
    category: "Goals",
    stat: "focus",
  },
  {
    id: "habit_forge",
    name: "Habit Forge",
    abbr: "HF",
    tagline: "Build streaks that stick.",
    description: "Track habits with streaks, reminders, and momentum meters. Miss-proof your routines.",
    href: null,
    status: "coming",
    category: "Habits",
    stat: "strength",
  },
  {
    id: "field_base",
    name: "Field Base",
    abbr: "FB",
    tagline: "Work ops & Kanban.",
    description: "An interactive Kanban board for work tasks and projects — move cards, track lanes, ship.",
    href: null,
    status: "coming",
    category: "Productivity",
    stat: "work",
  },
  {
    id: "the_bunker",
    name: "The Bunker",
    abbr: "TB",
    tagline: "Your private headspace.",
    description: "A secure, AI-assisted journaling and therapy vault. Encrypted, private, yours alone.",
    href: null,
    status: "coming",
    category: "Wellness",
    stat: "mind",
  },
  {
    id: "mess_hall",
    name: "Mess Hall",
    abbr: "MH",
    tagline: "Fuel & recipes.",
    description: "Store recipes and plan meals. Keep the fuel dialed in so the mission never stalls.",
    href: null,
    status: "coming",
    category: "Life",
    stat: "strength",
  },
  {
    id: "quest_log",
    name: "Quest Log",
    abbr: "QL",
    tagline: "Tasks as quests.",
    description: "A clean task list with a gamified twist — accept quests, complete them, bank the XP.",
    href: null,
    status: "coming",
    category: "Productivity",
    stat: "work",
  },
  {
    id: "word_and_spirit",
    name: "Word & Spirit",
    abbr: "WS",
    tagline: "Scripture & devotion.",
    description: "Daily reading, verse tracking, and reflection to keep your spiritual stat strong.",
    href: null,
    status: "coming",
    category: "Faith",
    stat: "spiritual",
  },
  {
    id: "focus",
    name: "Focus",
    abbr: "FO",
    tagline: "Deep work, gamified.",
    description: "Focus cycles with session logging and XP for time on task. Lock in and go.",
    href: null,
    status: "coming",
    category: "Productivity",
    stat: "focus",
  },
  {
    id: "brainstorm",
    name: "BrainStorm",
    abbr: "BS",
    tagline: "AI idea sessions.",
    description: "Take a rough concept to a real plan with Gideon. Auto-saved, auto-titled, exportable.",
    href: null,
    status: "coming",
    category: "Ideation",
    stat: "mind",
  },
  {
    id: "debrief",
    name: "Debrief",
    abbr: "DB",
    tagline: "Daily after-action.",
    description: "End-of-day reflection — wins, hiccups, and lessons — streak-tracked with a weekly review.",
    href: null,
    status: "coming",
    category: "Reflection",
    stat: "mind",
  },
  {
    id: "command_brief",
    name: "Command Brief",
    abbr: "CB",
    tagline: "Your AI morning brief.",
    description: "Gideon pulls from all your active apps into one sharp morning briefing. Start the day informed.",
    href: null,
    status: "coming",
    category: "Intel",
    stat: "focus",
  },
  {
    id: "money_ops",
    name: "Money Ops",
    abbr: "MO",
    tagline: "Command your money.",
    description: "Budget, spending, and savings-goal tracking with XP for hitting your targets.",
    href: null,
    status: "coming",
    category: "Finance",
    stat: "work",
  },
  {
    id: "horizon",
    name: "Horizon",
    abbr: "HZ",
    tagline: "Vision & affirmations.",
    description: "A vision board of goals, images, and affirmations to keep your eyes on where you're headed.",
    href: null,
    status: "coming",
    category: "Vision",
    stat: "spiritual",
  },
];

export function getApp(id: string): CatalogApp | undefined {
  return APP_CATALOG.find((a) => a.id === id);
}

// Resolve an app's display name, honoring a user's custom rename.
export function appName(id: string, overrides?: Record<string, string> | null): string {
  const custom = overrides?.[id]?.trim();
  return custom || getApp(id)?.name || id;
}

// ── Widgets ───────────────────────────────────────────────────────

export interface WidgetDef {
  id: string;
  appId: string; // "platform" = always available, not tied to an installed app
  name: string;
  description: string;
}

export const WIDGETS: WidgetDef[] = [
  {
    id: "today_view",
    appId: "platform",
    name: "Today View",
    description: "Your day at a glance — an inspiration and your snapshot for the day.",
  },
  {
    id: "life_stats",
    appId: "platform",
    name: "Life Stats",
    description: "Your six life areas — Spiritual, Love, Work, Focus, Mind, Strength — leveled up by your apps.",
  },
];

export function getWidget(id: string): WidgetDef | undefined {
  return WIDGETS.find((w) => w.id === id);
}
