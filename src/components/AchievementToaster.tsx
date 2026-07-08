import { useAchievementToasts } from "@/lib/achievements";

export function AchievementToaster() {
  const { toasts, dismiss } = useAchievementToasts();
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((m) => (
        <button
          key={m.id}
          onClick={() => dismiss(m.id)}
          className="glass-panel rounded-2xl px-4 py-3 text-left animate-[float-up_0.3s_ease-out] shadow-[var(--shadow-glow)] border border-primary/40 flex items-start gap-3 hover:border-primary transition"
        >
          <div className="text-3xl">{m.icon}</div>
          <div className="flex-1">
            <div className="text-[10px] uppercase tracking-[0.3em] text-primary-glow">Achievement unlocked</div>
            <div className="font-display text-base font-semibold">{m.name}</div>
            <div className="text-xs text-muted-foreground">{m.desc}</div>
            <div className="mt-1 text-[10px] text-signal">+{m.points} pts · {m.rarity}</div>
          </div>
        </button>
      ))}
    </div>
  );
}
