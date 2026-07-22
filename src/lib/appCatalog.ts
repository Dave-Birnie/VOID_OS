// Single source of truth for the VOID OS app catalog and dashboard widgets.
// Apps marked "coming" are placeholders that populate the store and dashboard
// until the real modular apps ship.

export type AppStatus = "live" | "coming";

export interface CatalogApp {
  id: string; // matches user_apps.app_id
  name: string;
  abbr: string;
  tagline: string;
  description: string;
  href: string | null;
  status: AppStatus;
  category: string;
}

export const APP_CATALOG: CatalogApp[] = [
  {
    id: "daily_ops",
    name: "Daily Ops",
    abbr: "DO",
    tagline: "Your daily command center.",
    description:
      "The anchor app. Plan the day, run your task list, and rack up XP as you clear it. Every modular app plugs into Daily Ops.",
    href: null,
    status: "coming",
    category: "Core",
  },
  {
    id: "battle_board",
    name: "Battle Board",
    abbr: "BB",
    tagline: "Gamified progress grid.",
    description:
      "A 4x3 bingo-style board of goals and habits. Clear lines, earn rewards, and turn the grind into a game.",
    href: null,
    status: "coming",
    category: "Gamification",
  },
  {
    id: "habit_forge",
    name: "Habit Forge",
    abbr: "HF",
    tagline: "Build streaks that stick.",
    description:
      "Track habits with streaks, reminders, and momentum meters. Miss-proof your routines.",
    href: null,
    status: "coming",
    category: "Habits",
  },
  {
    id: "field_log",
    name: "Field Log",
    abbr: "FL",
    tagline: "Daily debrief. Wins & lessons.",
    description:
      "End-of-day reflection — wins, hiccups, and lessons — streak-tracked with a weekly review.",
    href: null,
    status: "coming",
    category: "Reflection",
  },
  {
    id: "north_star",
    name: "North Star",
    abbr: "NS",
    tagline: "One goal, broken into habits.",
    description:
      "Set your guiding goal, break it down to this week, and build the daily habits that get you there.",
    href: null,
    status: "coming",
    category: "Goals",
  },
  {
    id: "focus_timer",
    name: "Focus Timer",
    abbr: "FT",
    tagline: "Deep work, gamified.",
    description:
      "Pomodoro-style focus cycles with session logging and XP for time on task.",
    href: null,
    status: "coming",
    category: "Productivity",
  },
];

export function getApp(id: string): CatalogApp | undefined {
  return APP_CATALOG.find((a) => a.id === id);
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
    description: "Your day at a glance — an inspiration, and your snapshot for the day.",
  },
];

export function getWidget(id: string): WidgetDef | undefined {
  return WIDGETS.find((w) => w.id === id);
}
