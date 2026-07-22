"use client";

import { useRef, useState, useTransition, type ReactNode } from "react";
import { GripVertical, LayoutGrid, Check, Eye, EyeOff } from "lucide-react";
import { saveWidgetOrder, saveHiddenWidgets } from "@/app/dashboard/widget-actions";

export interface BoardItem {
  id: string;
  name: string;
  node: ReactNode;
}

// Drag-to-arrange widget board with a FamilyLock-style "Edit Layout" toggle:
// the reorder/hide controls stay hidden until edit mode is turned on, keeping
// the dashboard clean by default.
export function WidgetBoard({
  items,
  initialOrder = [],
  initialHidden = [],
}: {
  items: BoardItem[];
  initialOrder?: string[];
  initialHidden?: string[];
}) {
  const ids = items.map((i) => i.id);
  const [order, setOrder] = useState<string[]>(() => {
    const kept = initialOrder.filter((id) => ids.includes(id));
    return [...kept, ...ids.filter((id) => !kept.includes(id))];
  });
  const [hidden, setHidden] = useState<Set<string>>(new Set(initialHidden));
  const [editing, setEditing] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const orderRef = useRef(order);
  orderRef.current = order;
  const hiddenRef = useRef(hidden);
  hiddenRef.current = hidden;

  const byId = new Map(items.map((i) => [i.id, i]));

  function moveTo(id: string, targetId: string) {
    if (id === targetId) return;
    setOrder((prev) => {
      const next = prev.filter((x) => x !== id);
      const ti = next.indexOf(targetId) + (prev.indexOf(id) < prev.indexOf(targetId) ? 1 : 0);
      next.splice(ti, 0, id);
      return next;
    });
  }

  function nudge(id: string, dir: -1 | 1) {
    setOrder((prev) => {
      const i = prev.indexOf(id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  function toggleHide(id: string) {
    setHidden((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  function persist() {
    startTransition(() => {
      void saveWidgetOrder(orderRef.current);
      void saveHiddenWidgets([...hiddenRef.current]);
    });
  }

  function toggleEditing() {
    if (editing) persist(); // exiting edit mode saves the layout
    setEditing((e) => !e);
  }

  // In normal mode, hidden widgets are gone; in edit mode they show as a stub.
  const shown = editing ? order : order.filter((id) => !hidden.has(id));

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {shown.map((id, i) => {
          const item = byId.get(id);
          if (!item) return null;
          const isHidden = hidden.has(id);
          return (
            <div
              key={id}
              onDragOver={(e) => {
                if (dragId) e.preventDefault();
              }}
              onDragEnter={() => {
                if (dragId && dragId !== id) moveTo(dragId, id);
              }}
              className={`transition-opacity ${
                editing ? "rounded-2xl outline outline-1 outline-dashed outline-purple-500/40 outline-offset-4" : ""
              } ${dragId === id ? "opacity-50" : ""} ${isHidden ? "opacity-60" : ""}`}
            >
              {editing && (
                <div className="flex items-center gap-2 mb-2 px-1">
                  <button
                    type="button"
                    draggable
                    onDragStart={(e) => {
                      setDragId(id);
                      e.dataTransfer.effectAllowed = "move";
                    }}
                    onDragEnd={() => {
                      setDragId(null);
                      persist();
                    }}
                    aria-label="Drag to reorder"
                    className="cursor-grab active:cursor-grabbing text-zinc-500 hover:text-white"
                  >
                    <GripVertical className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => nudge(id, -1)} disabled={i === 0} aria-label="Move up" className="text-zinc-500 hover:text-white disabled:opacity-30 text-sm leading-none">
                    ↑
                  </button>
                  <button type="button" onClick={() => nudge(id, 1)} disabled={i === shown.length - 1} aria-label="Move down" className="text-zinc-500 hover:text-white disabled:opacity-30 text-sm leading-none">
                    ↓
                  </button>
                  <span className="text-[10px] font-mono uppercase tracking-wide text-zinc-400 flex-1 truncate">{item.name}</span>
                  <button
                    type="button"
                    onClick={() => toggleHide(id)}
                    className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-1 rounded-lg border transition-colors ${
                      isHidden ? "text-emerald-300 border-emerald-500/40" : "text-zinc-400 border-zinc-700 hover:text-white"
                    }`}
                  >
                    {isHidden ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {isHidden ? "Show" : "Hide"}
                  </button>
                </div>
              )}
              <div className={editing && isHidden ? "hidden" : ""}>{item.node}</div>
            </div>
          );
        })}
      </div>

      {/* Edit Layout FAB */}
      <button
        type="button"
        onClick={toggleEditing}
        className={`fixed right-5 bottom-5 z-50 rounded-full px-4 py-3 text-xs font-bold flex items-center gap-2 shadow-2xl transition-all hover:-translate-y-0.5 ${
          editing
            ? "bg-gradient-to-r from-emerald-500 to-void-cyan text-slate-950"
            : "bg-gradient-to-r from-void-purple to-void-blue text-white glow-purple"
        }`}
      >
        {editing ? <Check className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
        {editing ? "Done" : "Edit Layout"}
      </button>
    </>
  );
}
