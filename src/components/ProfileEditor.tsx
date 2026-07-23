"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Camera, ExternalLink, Loader2, BadgeCheck } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { saveProfile, saveAvatar } from "@/app/dashboard/settings/actions";

export interface ProfileInitial {
  avatar_url: string | null;
  full_name: string;
  handle: string;
  tagline: string;
  bio: string;
  location: string;
  website_url: string;
  x_url: string;
  github_url: string;
  youtube_url: string;
  is_founding_backer: boolean;
  show_on_leaderboard: boolean;
}

const inputCls =
  "w-full px-3 py-2.5 rounded-xl border themed-border bg-[var(--surface)] themed-text text-xs focus:outline-none focus:border-[color:var(--accent)] min-h-[44px]";

export function ProfileEditor({ initial, userId }: { initial: ProfileInitial; userId: string }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState<string | null>(initial.avatar_url);
  const [handle, setHandle] = useState(initial.handle);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setStatus({ ok: false, msg: "Please choose an image file." });
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setStatus({ ok: false, msg: "Image must be under 4 MB." });
      return;
    }
    setUploading(true);
    setStatus(null);
    try {
      const supabase = createBrowserSupabase();
      const ext = (file.name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "");
      const path = `${userId}/avatar-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("void-avatars")
        .upload(path, file, { upsert: true, cacheControl: "3600", contentType: file.type });
      if (upErr) throw upErr;
      const publicUrl = supabase.storage.from("void-avatars").getPublicUrl(path).data.publicUrl;
      const res = await saveAvatar(publicUrl);
      if (!res.ok) throw new Error(res.error ?? "Could not save avatar.");
      setAvatar(publicUrl);
      setStatus({ ok: true, msg: "Profile picture updated." });
      router.refresh();
    } catch (err) {
      setStatus({ ok: false, msg: err instanceof Error ? err.message : "Upload failed." });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await saveProfile(new FormData(e.target as HTMLFormElement));
    setStatus(res.ok ? { ok: true, msg: "Profile saved." } : { ok: false, msg: res.error ?? "Failed." });
    if (res.ok) router.refresh();
  };

  return (
    <div>
      {/* Avatar + identity */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <Avatar name={initial.full_name} src={avatar} handle={handle} size={72} />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full themed-accent-bg flex items-center justify-center border-2 border-[var(--bg)] disabled:opacity-60"
            aria-label="Change profile picture"
          >
            {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={onPick} className="hidden" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 font-bold themed-text truncate">
            {initial.full_name || "Your name"}
            {initial.is_founding_backer && <BadgeCheck className="w-4 h-4 text-amber-400 shrink-0" />}
          </div>
          {initial.is_founding_backer && (
            <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-bold">
              Founding Backer
            </span>
          )}
          {handle && (
            <Link href={`/u/${handle}`} className="flex items-center gap-1 text-[11px] themed-accent mt-1 hover:opacity-80">
              voidos.io/u/{handle} <ExternalLink className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>

      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="text-[11px] font-mono uppercase tracking-wide themed-muted">Handle</label>
          <div className="flex items-center gap-1.5">
            <span className="themed-muted text-xs">@</span>
            <input
              name="handle"
              defaultValue={initial.handle}
              onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
              value={handle}
              placeholder="yourname"
              className={inputCls}
            />
          </div>
          <p className="text-[10px] themed-muted mt-1">3–20 chars · lowercase letters, numbers, underscores. Your public page lives at /u/handle.</p>
        </div>
        <div>
          <label className="text-[11px] font-mono uppercase tracking-wide themed-muted">Tagline</label>
          <input name="tagline" defaultValue={initial.tagline} placeholder="Building in public · Founder" className={inputCls} />
        </div>
        <div>
          <label className="text-[11px] font-mono uppercase tracking-wide themed-muted">Bio</label>
          <textarea name="bio" defaultValue={initial.bio} rows={3} placeholder="A sentence or two about you and what you're working toward." className={inputCls.replace("min-h-[44px]", "")} />
        </div>
        <div>
          <label className="text-[11px] font-mono uppercase tracking-wide themed-muted">Location</label>
          <input name="location" defaultValue={initial.location} placeholder="Toronto, Canada" className={inputCls} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-mono uppercase tracking-wide themed-muted">Website</label>
            <input name="website_url" defaultValue={initial.website_url} placeholder="yoursite.com" className={inputCls} />
          </div>
          <div>
            <label className="text-[11px] font-mono uppercase tracking-wide themed-muted">X / Twitter</label>
            <input name="x_url" defaultValue={initial.x_url} placeholder="x.com/you" className={inputCls} />
          </div>
          <div>
            <label className="text-[11px] font-mono uppercase tracking-wide themed-muted">GitHub</label>
            <input name="github_url" defaultValue={initial.github_url} placeholder="github.com/you" className={inputCls} />
          </div>
          <div>
            <label className="text-[11px] font-mono uppercase tracking-wide themed-muted">YouTube</label>
            <input name="youtube_url" defaultValue={initial.youtube_url} placeholder="youtube.com/@you" className={inputCls} />
          </div>
        </div>
        <label className="flex items-center gap-2.5 text-sm themed-text pt-1 cursor-pointer select-none">
          <input type="checkbox" name="show_on_leaderboard" defaultChecked={initial.show_on_leaderboard} className="w-4 h-4 rounded accent-[var(--accent)]" />
          Show me on the public <span className="font-bold">leaderboard</span>
        </label>
        <button type="submit" className="px-5 py-2.5 rounded-xl themed-accent-bg font-bold text-xs">Save profile</button>
        {status && <p className={`text-xs mt-3 ${status.ok ? "text-emerald-400" : "text-red-400"}`}>{status.msg}</p>}
      </form>
    </div>
  );
}
