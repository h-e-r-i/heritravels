import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  phone: string | null;
  address: string | null;
  emergency_contact: string | null;
  payment_brand: string | null;
  payment_last4: string | null;
  payment_holder: string | null;
  language: string | null;
  units: string | null;
  notifications_enabled: boolean | null;
};

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
  head: () => ({
    meta: [
      { title: "Your account — H.E.R.I" },
      { name: "description", content: "Manage your H.E.R.I account, personal info, payment method and preferences." },
      { name: "robots", content: "noindex" },
    ],
  }),
});

const EMPTY: Omit<Profile, "id" | "email"> = {
  full_name: "", username: "", avatar_url: "", phone: "", address: "", emergency_contact: "",
  payment_brand: "", payment_last4: "", payment_holder: "",
  language: "en", units: "metric", notifications_enabled: true,
};

function ProfilePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"account" | "personal" | "payment" | "prefs">("account");
  const [form, setForm] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { redirect: "/profile" }, replace: true });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    let active = true;
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (!active) return;
      const p = (data as Profile | null) ?? { id: user.id, email: user.email ?? null, ...EMPTY } as Profile;
      setForm({ ...p, email: p.email ?? user.email ?? null });
    });
    return () => { active = false; };
  }, [user]);

  async function save() {
    if (!user || !form) return;
    setSaving(true); setMsg(null); setErr(null);
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      email: form.email,
      full_name: form.full_name,
      avatar_url: form.avatar_url,
      phone: form.phone,
      address: form.address,
      emergency_contact: form.emergency_contact,
      payment_brand: form.payment_brand,
      payment_last4: form.payment_last4?.slice(-4) ?? null,
      payment_holder: form.payment_holder,
      language: form.language,
      units: form.units,
      notifications_enabled: form.notifications_enabled,
    });
    setSaving(false);
    if (error) setErr(error.message);
    else setMsg("Saved.");
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  if (loading || !user || !form) {
    return <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">Loading cockpit…</div>;
  }

  const initial = (form.full_name || user.email || "U").charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div className="flex items-start gap-5 flex-wrap">
        <div className="relative h-24 w-24 rounded-full overflow-hidden border border-primary/40 ring-1 ring-primary/40 bg-gradient-to-br from-primary/40 to-electric/40 flex items-center justify-center">
          {form.avatar_url ? (
            <img src={form.avatar_url} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <span className="font-display text-3xl font-semibold text-primary-foreground">{initial}</span>
          )}
        </div>
        <div className="flex-1 min-w-[220px]">
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Account</div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold">{form.full_name || user.email}</h1>
          <p className="text-sm text-muted-foreground">{user.email} · joined {new Date(user.created_at).toLocaleDateString()}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/" className="rounded-full border border-border px-4 py-2 text-xs hover:bg-accent">Back</Link>
          <button onClick={signOut} className="rounded-full border border-destructive/40 text-destructive px-4 py-2 text-xs hover:bg-destructive/10">Sign out</button>
        </div>
      </div>

      <div className="mt-8 flex gap-1 rounded-full border border-border/60 bg-surface/60 p-1 text-xs w-fit">
        {([["account","Account"],["personal","Personal"],["payment","Payment"],["prefs","Preferences"]] as const).map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)} className={`px-4 py-1.5 rounded-full transition ${tab === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>{label}</button>
        ))}
      </div>

      <div className="mt-6 glass-panel rounded-2xl p-6 grid gap-4 md:grid-cols-2">
        {tab === "account" && (<>
          <Field label="Full name"><input className={inputCls} value={form.full_name ?? ""} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></Field>
          <Field label="Email"><input className={inputCls} value={form.email ?? ""} disabled /></Field>
          <Field label="Avatar URL"><input className={inputCls} placeholder="https://…" value={form.avatar_url ?? ""} onChange={(e) => setForm({ ...form, avatar_url: e.target.value })} /></Field>
          <Field label="User ID"><input className={inputCls} value={user.id} disabled /></Field>
        </>)}

        {tab === "personal" && (<>
          <Field label="Phone"><input className={inputCls} placeholder="+254…" value={form.phone ?? ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
          <Field label="Emergency contact"><input className={inputCls} placeholder="Name · Phone" value={form.emergency_contact ?? ""} onChange={(e) => setForm({ ...form, emergency_contact: e.target.value })} /></Field>
          <Field label="Address" full><textarea rows={3} className={inputCls} value={form.address ?? ""} onChange={(e) => setForm({ ...form, address: e.target.value })} /></Field>
        </>)}

        {tab === "payment" && (<>
          <div className="md:col-span-2 text-xs text-muted-foreground rounded-lg border border-border/60 bg-background/40 p-3">
            💳 Optional — this is a mocked payment method used only for display. No real charges are made.
          </div>
          <Field label="Card brand">
            <select className={inputCls} value={form.payment_brand ?? ""} onChange={(e) => setForm({ ...form, payment_brand: e.target.value })}>
              <option value="">— None —</option><option>Visa</option><option>Mastercard</option><option>Amex</option><option>M-Pesa</option><option>Airtel Money</option>
            </select>
          </Field>
          <Field label="Cardholder / account"><input className={inputCls} value={form.payment_holder ?? ""} onChange={(e) => setForm({ ...form, payment_holder: e.target.value })} /></Field>
          <Field label="Last 4 digits"><input className={inputCls} maxLength={4} placeholder="4242" value={form.payment_last4 ?? ""} onChange={(e) => setForm({ ...form, payment_last4: e.target.value.replace(/\D/g, "").slice(0, 4) })} /></Field>
          <div />
        </>)}

        {tab === "prefs" && (<>
          <Field label="Language">
            <select className={inputCls} value={form.language ?? "en"} onChange={(e) => setForm({ ...form, language: e.target.value })}>
              <option value="en">English</option><option value="sw">Kiswahili</option><option value="fr">Français</option><option value="ar">العربية</option><option value="pt">Português</option>
            </select>
          </Field>
          <Field label="Units">
            <select className={inputCls} value={form.units ?? "metric"} onChange={(e) => setForm({ ...form, units: e.target.value })}>
              <option value="metric">Metric (km, °C)</option><option value="imperial">Imperial (mi, °F)</option>
            </select>
          </Field>
          <label className="md:col-span-2 flex items-center gap-3 rounded-lg border border-border/60 bg-background/40 p-3">
            <input type="checkbox" checked={!!form.notifications_enabled} onChange={(e) => setForm({ ...form, notifications_enabled: e.target.checked })} />
            <span className="text-sm">Push notifications & alerts</span>
          </label>
        </>)}
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button onClick={save} disabled={saving} className="rounded-full bg-gradient-to-r from-primary to-electric px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] hover:brightness-110 disabled:opacity-60 transition">
          {saving ? "Saving…" : "Save changes"}
        </button>
        {msg && <span className="text-xs text-signal">{msg}</span>}
        {err && <span className="text-xs text-destructive">{err}</span>}
      </div>
    </div>
  );
}

const inputCls = "mt-1 w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary disabled:opacity-60";

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block ${full ? "md:col-span-2" : ""}`}>
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
