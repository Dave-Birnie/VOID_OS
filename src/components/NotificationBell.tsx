"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Check, Megaphone, X } from "lucide-react";
import { markAllNotificationsRead } from "@/app/dashboard/notification-actions";

export type AppNotification = {
  id: string;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  created_at: string;
};

// Bell + unread badge + dropdown feed, plus an auto-toast for the newest unread
// notification (e.g. a fresh shoutout) that this browser hasn't shown yet.
export function NotificationBell({ notifications }: { notifications: AppNotification[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<AppNotification | null>(null);

  const unread = notifications.filter((n) => !n.read);
  const unreadCount = unread.length;

  useEffect(() => {
    if (unread.length === 0) return;
    const newest = unread[0];
    let seen: string[] = [];
    try {
      seen = JSON.parse(localStorage.getItem("void_os_toasted") || "[]");
    } catch {
      seen = [];
    }
    if (seen.includes(newest.id)) return;
    setToast(newest);
    localStorage.setItem("void_os_toasted", JSON.stringify([newest.id, ...seen].slice(0, 50)));
    const t = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications]);

  const markRead = async () => {
    await markAllNotificationsRead();
    router.refresh();
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Notifications"
          className="relative p-2 rounded-xl border themed-border themed-hover themed-muted transition-all"
        >
          <Bell className="w-4 h-4" aria-hidden="true" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-void-pink themed-text text-[9px] font-bold flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden="true" />
            <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto z-50 themed-card border themed-border rounded-2xl shadow-2xl p-2">
              <div className="flex items-center justify-between px-2 py-2 border-b themed-border mb-1">
                <span className="text-xs font-bold themed-text">Notifications</span>
                {unreadCount > 0 && (
                  <button onClick={markRead} className="text-[10px] font-mono text-void-cyan hover:opacity-80 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>

              {notifications.length === 0 && (
                <p className="text-xs themed-muted px-2 py-6 text-center">You&apos;re all caught up.</p>
              )}

              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`px-2.5 py-2 rounded-xl mb-1 border ${
                    n.read ? "border-transparent" : "border-purple-500/30 bg-purple-950/20"
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-void-pink flex-shrink-0" />}
                    <span className="text-xs font-bold themed-text">{n.title}</span>
                  </div>
                  {n.body && <p className="text-[11px] themed-muted leading-relaxed">{n.body}</p>}
                  <span className="text-[9px] themed-muted font-mono">{n.created_at?.slice(0, 16).replace("T", " ")}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Auto-toast for the newest unread notification */}
      {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-2rem)] max-w-sm">
          <div className="themed-card border themed-accent-border rounded-2xl shadow-2xl p-4 flex items-start gap-3 ">
            <div className="p-2 rounded-xl bg-purple-500/20 text-void-purple border themed-border flex-shrink-0">
              <Megaphone className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold themed-text">{toast.title}</div>
              {toast.body && <p className="text-xs themed-muted mt-0.5 leading-relaxed">{toast.body}</p>}
            </div>
            <button onClick={() => setToast(null)} aria-label="Dismiss" className="themed-muted hover:opacity-80 flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
