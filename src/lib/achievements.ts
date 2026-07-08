import { useEffect, useState, useCallback } from "react";

export type ActionKey =
  | "chat_sent"
  | "route_planned"
  | "city_searched"
  | "feature_opened"
  | "mode_switched"
  | "navigator_visited"
  | "achievements_visited";

export type Milestone = {
  id: string;
  name: string;
  desc: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  points: number;
  action: ActionKey;
  target: number;
};

export const MILESTONES: Milestone[] = [
  { id: "first_contact",  name: "First Contact",     desc: "Send your first message to H.E.R.I.",              icon: "📡", rarity: "common",    points: 50,  action: "chat_sent",           target: 1 },
  { id: "curious_mind",   name: "Curious Mind",      desc: "Ask H.E.R.I 5 questions.",                         icon: "🧠", rarity: "rare",      points: 150, action: "chat_sent",           target: 5 },
  { id: "co_pilot",       name: "Co-Pilot",          desc: "Hold a 15-message conversation with H.E.R.I.",     icon: "🤖", rarity: "epic",      points: 400, action: "chat_sent",           target: 15 },

  { id: "plotter",        name: "Route Plotter",     desc: "Plan your first route in the Navigator.",          icon: "🗺️", rarity: "common",    points: 75,  action: "route_planned",       target: 1 },
  { id: "trailblazer",    name: "Trailblazer",       desc: "Plan 5 routes.",                                   icon: "🧭", rarity: "rare",      points: 200, action: "route_planned",       target: 5 },
  { id: "wayfinder",      name: "Wayfinder",         desc: "Plan 20 routes across regions.",                   icon: "🛰", rarity: "legendary", points: 800, action: "route_planned",       target: 20 },

  { id: "scout",          name: "City Scout",        desc: "Search for 3 different cities.",                   icon: "🔎", rarity: "common",    points: 60,  action: "city_searched",       target: 3 },
  { id: "atlas",          name: "Living Atlas",      desc: "Search 15 cities.",                                icon: "🌍", rarity: "epic",      points: 350, action: "city_searched",       target: 15 },

  { id: "dashboard_diver",name: "Dashboard Diver",   desc: "Open every pillar on the dashboard.",              icon: "🎛️", rarity: "rare",      points: 180, action: "feature_opened",      target: 9 },
  { id: "mode_master",    name: "Mode Master",       desc: "Switch between 4 travel modes.",                   icon: "🔀", rarity: "common",    points: 40,  action: "mode_switched",       target: 4 },
  { id: "navigator_pro",  name: "Navigator Pro",     desc: "Visit the Navigator 3 times.",                     icon: "📍", rarity: "rare",      points: 120, action: "navigator_visited",   target: 3 },
];

const STORAGE_KEY = "heri.achievements.v1";
const EVENT_NAME = "heri:achievements-changed";
const UNLOCK_EVENT = "heri:achievement-unlocked";

export type ProgressState = {
  counters: Record<ActionKey, number>;
  unlocked: Record<string, number>; // milestoneId -> timestamp
  seenCities: string[];
  openedFeatures: string[];
  switchedModes: string[];
};

const emptyState = (): ProgressState => ({
  counters: {
    chat_sent: 0,
    route_planned: 0,
    city_searched: 0,
    feature_opened: 0,
    mode_switched: 0,
    navigator_visited: 0,
    achievements_visited: 0,
  },
  unlocked: {},
  seenCities: [],
  openedFeatures: [],
  switchedModes: [],
});

function read(): ProgressState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return { ...emptyState(), ...parsed, counters: { ...emptyState().counters, ...(parsed.counters ?? {}) } };
  } catch {
    return emptyState();
  }
}

function write(s: ProgressState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

function evaluateUnlocks(prev: ProgressState, next: ProgressState) {
  for (const m of MILESTONES) {
    if (next.unlocked[m.id]) continue;
    if ((next.counters[m.action] ?? 0) >= m.target) {
      next.unlocked[m.id] = Date.now();
      window.dispatchEvent(new CustomEvent(UNLOCK_EVENT, { detail: m }));
    }
  }
  return next;
}

export function trackAction(action: ActionKey, meta?: { city?: string; feature?: string; mode?: string }) {
  if (typeof window === "undefined") return;
  const prev = read();
  const next: ProgressState = { ...prev, counters: { ...prev.counters }, unlocked: { ...prev.unlocked } };

  if (action === "city_searched" && meta?.city) {
    const c = meta.city.trim().toLowerCase();
    if (c.length < 2 || next.seenCities.includes(c)) return;
    next.seenCities = [...next.seenCities, c];
    next.counters.city_searched = next.seenCities.length;
  } else if (action === "feature_opened" && meta?.feature) {
    if (next.openedFeatures.includes(meta.feature)) return;
    next.openedFeatures = [...next.openedFeatures, meta.feature];
    next.counters.feature_opened = next.openedFeatures.length;
  } else if (action === "mode_switched" && meta?.mode) {
    if (next.switchedModes.includes(meta.mode)) return;
    next.switchedModes = [...next.switchedModes, meta.mode];
    next.counters.mode_switched = next.switchedModes.length;
  } else {
    next.counters[action] = (next.counters[action] ?? 0) + 1;
  }

  write(evaluateUnlocks(prev, next));
}

export function resetProgress() {
  if (typeof window === "undefined") return;
  write(emptyState());
}

export function useAchievements() {
  const [state, setState] = useState<ProgressState>(() => emptyState());

  useEffect(() => {
    setState(read());
    const sync = () => setState(read());
    window.addEventListener(EVENT_NAME, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT_NAME, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const totalPoints = MILESTONES.reduce(
    (sum, m) => (state.unlocked[m.id] ? sum + m.points : sum),
    0,
  );
  const unlockedCount = Object.keys(state.unlocked).length;

  return { state, totalPoints, unlockedCount, milestones: MILESTONES };
}

export function useAchievementToasts() {
  const [toasts, setToasts] = useState<Milestone[]>([]);

  useEffect(() => {
    const onUnlock = (e: Event) => {
      const m = (e as CustomEvent<Milestone>).detail;
      setToasts((t) => [...t, m]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== m.id)), 5000);
    };
    window.addEventListener(UNLOCK_EVENT, onUnlock);
    return () => window.removeEventListener(UNLOCK_EVENT, onUnlock);
  }, []);

  const dismiss = useCallback((id: string) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  return { toasts, dismiss };
}
