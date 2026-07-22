"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Star } from "lucide-react";
import type { UserProfile } from "@/lib/supabase/client";
import { setDevPass, setAdminRole } from "@/app/admin/members/actions";

export function MembersManager({ members }: { members: UserProfile[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async (id: string, fn: () => Promise<{ ok: boolean; error?: string }>) => {
    setBusyId(id);
    setError(null);
    const res = await fn();
    setBusyId(null);
    if (!res.ok) setError(res.error ?? "Update failed.");
    else router.refresh();
  };

  const toggleDevPass = (m: UserProfile) => {
    const fd = new FormData();
    fd.set("user_id", m.id);
    fd.set("value", String(!m.has_dev_pass));
    return run(m.id, () => setDevPass(fd));
  };

  const toggleAdmin = (m: UserProfile) => {
    const fd = new FormData();
    fd.set("user_id", m.id);
    fd.set("value", String(m.role !== "admin"));
    return run(m.id, () => setAdminRole(fd));
  };

  return (
    <div>
      {error && (
        <div className="mb-4 px-4 py-2.5 rounded-xl text-xs border bg-red-950/30 border-red-500/40 text-red-300">
          {error}
        </div>
      )}

      {members.length === 0 && <p className="text-xs text-zinc-500">No members yet.</p>}

      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="text-left text-zinc-500 border-b border-zinc-800">
              <th className="py-3 pr-4 font-bold">Member</th>
              <th className="py-3 px-4 font-bold">Role</th>
              <th className="py-3 px-4 font-bold text-center">Dev Pass</th>
              <th className="py-3 px-4 font-bold text-center">Admin</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => {
              const busy = busyId === m.id;
              return (
                <tr key={m.id} className="border-b border-zinc-900">
                  <td className="py-3 pr-4">
                    <div className="font-bold text-white">{m.full_name || "—"}</div>
                    <div className="text-[10px] text-zinc-500">{m.email}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        m.role === "admin" ? "bg-amber-500/20 text-amber-300" : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {m.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => toggleDevPass(m)}
                      disabled={busy}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all disabled:opacity-50 ${
                        m.has_dev_pass
                          ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                          : "bg-black/40 border-zinc-800 text-zinc-400 hover:text-white"
                      }`}
                    >
                      <Star className="w-3 h-3" /> {m.has_dev_pass ? "Granted" : "Grant"}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => toggleAdmin(m)}
                      disabled={busy}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all disabled:opacity-50 ${
                        m.role === "admin"
                          ? "bg-amber-500/15 border-amber-500/40 text-amber-300"
                          : "bg-black/40 border-zinc-800 text-zinc-400 hover:text-white"
                      }`}
                    >
                      <Shield className="w-3 h-3" /> {m.role === "admin" ? "Admin" : "Make admin"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
