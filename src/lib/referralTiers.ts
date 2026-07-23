// The referral "level up" ladder. Referring friends who sign up unlocks each
// rung, building toward the ultimate prize: Backstage (Dev Pass). Thresholds
// here must match the grants in evaluate_badges() (early_access ≥3,
// founding_backer ≥5, dev_pass ≥10).

export type PerkKey = "early_access" | "founding_backer" | "dev_pass";

export interface ReferralTier {
  count: number;
  name: string;
  emoji: string;
  perk: string;
  grant?: PerkKey; // the real flag this rung turns on (if any)
  ultimate?: boolean;
}

export const REFERRAL_TIERS: ReferralTier[] = [
  { count: 1, name: "Recruiter", emoji: "📣", perk: "You're on the leaderboard + Recruiter badge" },
  { count: 3, name: "Ambassador", emoji: "🌟", perk: "Ambassador flair + early access to new apps", grant: "early_access" },
  { count: 5, name: "Founding Backer", emoji: "👑", perk: "Founding Backer status", grant: "founding_backer" },
  { count: 10, name: "Backstage", emoji: "🎬", perk: "Dev Pass — Watch the Journey + Chat with Dev", grant: "dev_pass", ultimate: true },
];

export const ULTIMATE_TIER = REFERRAL_TIERS[REFERRAL_TIERS.length - 1];

// Where a user sits on the ladder.
export function referralStanding(count: number) {
  const unlocked = REFERRAL_TIERS.filter((t) => count >= t.count);
  const current = unlocked[unlocked.length - 1] ?? null;
  const next = REFERRAL_TIERS.find((t) => count < t.count) ?? null;
  return { current, next, unlockedCount: unlocked.length };
}

// Short flair title for a referral count (used on profiles / leaderboard).
export function referralTitle(count: number): string | null {
  const { current } = referralStanding(count);
  return current ? current.name : null;
}
