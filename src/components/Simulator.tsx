"use client";

import React, { useState } from "react";
import { Gamepad2, Plus, RotateCcw, Flame, CheckCircle, Trash2, ShieldAlert } from "lucide-react";

export const Simulator: React.FC = () => {
  const [xp, setXp] = useState(56);
  const [level, setLevel] = useState(19);
  const [clearedBlocks, setClearedBlocks] = useState(0);
  const [burnTokens, setBurnTokens] = useState(2);
  const [tasks, setTasks] = useState([
    { id: "1", title: "Ascentai plan - Corp + bank account", category: "Business", due: "2026-07-17", priority: "High", completed: false },
    { id: "2", title: "Review Supabase RLS security policies", category: "Work", due: "2026-07-21", priority: "Normal", completed: false },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("Business");

  const battleBlocks = [
    { id: "b1", title: "30x Squats", cat: "Lower Body", color: "border-emerald-500/40 text-emerald-400 bg-emerald-950/20" },
    { id: "b2", title: "Morning Prayer", cat: "Mind", color: "border-blue-500/40 text-blue-400 bg-blue-950/20" },
    { id: "b3", title: "Lunges 20x", cat: "Lower Body", color: "border-emerald-500/40 text-emerald-400 bg-emerald-950/20" },
    { id: "b4", title: "Hydrate 2L", cat: "Habit", color: "border-amber-500/40 text-amber-400 bg-amber-950/20" },
    { id: "b5", title: "Calf Raises", cat: "Lower Body", color: "border-emerald-500/40 text-emerald-400 bg-emerald-950/20" },
    { id: "b6", title: "10k Steps", cat: "Habit", color: "border-amber-500/40 text-amber-400 bg-amber-950/20" },
    { id: "b7", title: "Journal Entry", cat: "Mind", color: "border-blue-500/40 text-blue-400 bg-blue-950/20" },
    { id: "b8", title: "Leg Press 3x12", cat: "Lower Body", color: "border-emerald-500/40 text-emerald-400 bg-emerald-950/20" },
  ];

  const [clearedIds, setClearedIds] = useState<string[]>([]);

  const handleToggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          const nextState = !t.completed;
          if (nextState) {
            addXp(35);
          }
          return { ...t, completed: nextState };
        }
        return t;
      })
    );
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    setTasks([
      ...tasks,
      {
        id: Date.now().toString(),
        title: newTaskTitle,
        category: newTaskCategory,
        due: new Date().toISOString().split("T")[0],
        priority: "Normal",
        completed: false,
      },
    ]);
    setNewTaskTitle("");
    setShowModal(false);
  };

  const addXp = (amount: number) => {
    setXp(prev => {
      const nextXp = prev + amount;
      if (nextXp >= 159) {
        setLevel(l => l + 1);
        return nextXp - 159;
      }
      return nextXp;
    });
  };

  const handleBlockClick = (id: string) => {
    if (!clearedIds.includes(id)) {
      setClearedIds([...clearedIds, id]);
      setClearedBlocks(b => b + 1);
      addXp(25);
    }
  };

  return (
    <section id="simulator-section" className="max-w-7xl mx-auto px-4 md:px-6 py-12">
      <div className="text-center mb-8 font-mono">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white flex items-center justify-center gap-2">
          <Gamepad2 className="w-7 h-7 text-void-purple" /> Live App Sandbox
        </h2>
        <p className="text-zinc-400 text-xs md:text-sm mt-1">
          Experience the Daily Ops (left) and Battle Board (right) modular simulator. Click tasks to award XP and increase levels!
        </p>
      </div>

      <div className="bg-[#100f1a] rounded-3xl border border-purple-500/20 p-4 md:p-6 shadow-2xl relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* COLUMN A: DAILY OPS */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-black/40 border border-zinc-800 p-5 rounded-2xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-void-card border border-zinc-800 p-1.5 rounded-xl flex items-center justify-center">
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                      <path d="M 100,20 A 80,80 0 0,1 175,75" fill="none" stroke="url(#logoGrad)" strokeWidth="16"/>
                      <path d="M 100,20 A 80,80 0 0,0 25,75" fill="none" stroke="url(#logoGrad)" strokeWidth="16"/>
                      <path d="M 25,125 A 80,80 0 0,0 100,180" fill="none" stroke="url(#logoGrad)" strokeWidth="16"/>
                      <path d="M 175,125 A 80,80 0 0,1 100,180" fill="none" stroke="url(#logoGrad)" strokeWidth="16"/>
                      <path d="M 30,75 L 100,165 L 170,75 L 132,75 L 100,125 L 68,75 Z" fill="url(#logoGrad)"/>
                    </svg>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-zinc-500 font-bold uppercase">DAVE BIRNIE</span>
                    <h3 className="text-xl font-black font-mono text-white tracking-wider">DAILY OPS</h3>
                  </div>
                </div>
                <div className="flex gap-2 font-mono text-xs">
                  <div className="bg-purple-500/10 border border-purple-500/30 px-2.5 py-1 rounded-lg text-purple-300">
                    Lvl <span className="font-bold">{level}</span>
                  </div>
                </div>
              </div>

              {/* XP Bar */}
              <div className="mb-4 font-mono text-[10px]">
                <div className="flex justify-between text-zinc-400 mb-1">
                  <span>INKOWL SCRIBE</span>
                  <span>{xp} / 159 XP</span>
                </div>
                <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-void-purple to-void-cyan h-2 rounded-full transition-all duration-500" style={{ width: `${(xp / 159) * 100}%` }}></div>
                </div>
              </div>

              {/* Task list */}
              <div className="space-y-2.5 font-mono">
                {tasks.map(t => (
                  <div
                    key={t.id}
                    onClick={() => handleToggleTask(t.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      t.completed ? "bg-emerald-950/20 border-emerald-500/40 opacity-70" : "bg-black/60 border-zinc-800 hover:border-purple-500/40"
                    }`}
                  >
                    <input type="checkbox" checked={t.completed} onChange={() => {}} className="mt-1 rounded bg-black border-zinc-700 text-void-purple" />
                    <div className="flex-1">
                      <span className={`text-xs font-bold ${t.completed ? "line-through text-zinc-500" : "text-white"}`}>{t.title}</span>
                      <div className="flex items-center gap-2 mt-1 text-[9px] text-zinc-400">
                        <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">{t.category}</span>
                        <span>Due: {t.due}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="mt-4 w-full py-2.5 rounded-xl border border-pink-500/40 bg-pink-950/20 text-pink-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5 hover:bg-pink-900/40 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Task
            </button>
          </div>

          {/* COLUMN B: BATTLE BOARD BINGO */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-black/40 border border-zinc-800 p-5 rounded-2xl">
            <div>
              <div className="flex items-center justify-between mb-4 font-mono">
                <div>
                  <h3 className="font-bold text-lg text-white flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-400" /> Battle Board Bingo
                  </h3>
                  <span className="text-[10px] text-zinc-400">Lower body execution & habits. Click to clear!</span>
                </div>
                <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/30 px-2.5 py-1 rounded-lg text-orange-400 text-xs">
                  Burn: <span className="font-bold">{burnTokens}</span>
                </div>
              </div>

              {/* Grid blocks */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
                {battleBlocks.map(b => {
                  const isCleared = clearedIds.includes(b.id);
                  return (
                    <button
                      key={b.id}
                      onClick={() => handleBlockClick(b.id)}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col justify-between h-24 ${
                        isCleared
                          ? "bg-emerald-500/20 border-emerald-500/60 text-emerald-300 scale-95"
                          : `${b.color} hover:scale-105`
                      }`}
                    >
                      <span className="text-[9px] opacity-70 uppercase">{b.cat}</span>
                      <span className={`font-bold text-xs ${isCleared ? "line-through" : ""}`}>{b.title}</span>
                      <span className="text-[9px] font-bold">{isCleared ? "✓ CLEARED" : "+25 XP"}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between font-mono text-xs text-zinc-400">
              <span>Cleared: <strong className="text-void-cyan">{clearedBlocks}</strong> / 8</span>
              <button
                onClick={() => {
                  setClearedIds([]);
                  setClearedBlocks(0);
                }}
                className="text-purple-400 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset Grid
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#100f1a] border border-pink-500/30 rounded-2xl p-6 max-w-sm w-full font-mono">
            <h4 className="font-bold text-white text-sm mb-4">+ Add Task to Daily Ops</h4>
            <form onSubmit={handleAddTask} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] text-zinc-400 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Build Next.js component..."
                  className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-800 text-white min-h-[44px]"
                />
              </div>
              <div>
                <label className="block text-[10px] text-zinc-400 mb-1">Category</label>
                <select
                  value={newTaskCategory}
                  onChange={(e) => setNewTaskCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-800 text-white min-h-[44px]"
                >
                  <option value="Business">Business</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Mission">Mission</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-zinc-800 text-zinc-400 min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-pink-500 text-white font-bold min-h-[44px]"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
