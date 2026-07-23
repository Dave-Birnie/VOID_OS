import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

// First-party page-view beacon. No cookies: visitors are identified by a
// daily-rotating hash of IP + user agent, so nothing stored is reversible to a
// person and counts reset naturally each day.

const BOT_RE =
  /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|headless|lighthouse|pingdom|monitor|curl|wget|python-requests/i;

export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) return new NextResponse(null, { status: 204 });

  const ua = req.headers.get("user-agent") ?? "";
  if (!ua || BOT_RE.test(ua)) return new NextResponse(null, { status: 204 });

  let body: { path?: unknown; referrer?: unknown };
  try {
    body = await req.json();
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  const path = typeof body.path === "string" ? body.path.slice(0, 200) : "";
  if (!path.startsWith("/")) return new NextResponse(null, { status: 204 });

  // External referrers only — internal navigation isn't a traffic source.
  let referrer: string | null = null;
  if (typeof body.referrer === "string" && body.referrer) {
    try {
      const r = new URL(body.referrer);
      if (r.host !== req.nextUrl.host) referrer = r.host.slice(0, 120);
    } catch {
      /* ignore malformed referrers */
    }
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const day = new Date().toISOString().slice(0, 10);
  const visitor_hash = createHash("sha256").update(`${ip}|${ua}|${day}`).digest("hex").slice(0, 32);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await supabase.from("profiles").update({ last_active: new Date().toISOString() }).eq("id", user.id);
  }

  await supabase.from("void_page_views").insert({
    path,
    referrer,
    visitor_hash,
    user_id: user?.id ?? null,
    device: /mobile|android|iphone|ipad/i.test(ua) ? "mobile" : "desktop",
    country: req.headers.get("x-vercel-ip-country"),
  });

  // Blog posts also carry a public view counter.
  const slug = /^\/blog\/([^/?#]+)/.exec(path)?.[1];
  if (slug) await supabase.rpc("bump_post_views", { post_slug: slug });

  return new NextResponse(null, { status: 204 });
}
