// Achievement badges. IDs here must match the ones awarded by the
// evaluate_badges() SQL function. Ordered roughly by how they're earned.

export type BadgeTier = "bronze" | "silver" | "gold" | "special";

export interface BadgeDef {
  id: string;
  name: string;
  description: string;
  emoji: string;
  tier: BadgeTier;
}

export const BADGES: BadgeDef[] = [
  { id: "early_adopter", name: "Early Adopter", description: "One of the first 100 to join VOID OS.", emoji: "🌱", tier: "gold" },
  { id: "founding_backer", name: "Founding Backer", description: "Backed VOID OS on Kickstarter.", emoji: "👑", tier: "special" },
  { id: "claimed_handle", name: "Identity", description: "Claimed your @handle.", emoji: "🪪", tier: "bronze" },
  { id: "profile_complete", name: "All Set Up", description: "Added a picture, handle, and bio.", emoji: "✨", tier: "silver" },
  { id: "first_app", name: "First Install", description: "Installed your first app.", emoji: "📦", tier: "bronze" },
  { id: "app_collector", name: "Collector", description: "Installed 5 or more apps.", emoji: "🗃️", tier: "silver" },
  { id: "welcomed", name: "Welcomed", description: "Joined through a friend's invite.", emoji: "🤝", tier: "bronze" },
  { id: "recruiter", name: "Recruiter", description: "Referred your first member.", emoji: "📣", tier: "silver" },
  { id: "ambassador", name: "Ambassador", description: "Referred 5 or more members.", emoji: "🌟", tier: "gold" },
  { id: "legend", name: "Legend", description: "Referred 10 or more members.", emoji: "🏆", tier: "special" },
];

export const BADGE_MAP: Record<string, BadgeDef> = Object.fromEntries(BADGES.map((b) => [b.id, b]));

export function getBadge(id: string): BadgeDef | undefined {
  return BADGE_MAP[id];
}

export const TIER_RING: Record<BadgeTier, string> = {
  bronze: "border-amber-700/50",
  silver: "border-zinc-400/40",
  gold: "border-amber-400/50",
  special: "border-fuchsia-500/50",
};
