import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

type ProfileRow = { full_name: string | null; avatar_url: string | null; email: string | null };

export function ProfileAvatar() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<ProfileRow | null>(null);

  useEffect(() => {
    if (!user) { setProfile(null); return; }
    let active = true;
    supabase
      .from("profiles")
      .select("full_name, avatar_url, email")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => { if (active) setProfile(data as ProfileRow | null); });
    return () => { active = false; };
  }, [user]);

  if (loading) {
    return <div className="h-10 w-10 rounded-full bg-surface/60 border border-border/60 animate-pulse" />;
  }

  if (!user) {
    return (
      <Link
        to="/auth"
        className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-surface/60 px-4 py-2 text-xs font-semibold text-primary-glow hover:bg-primary/10 transition"
      >
        Sign in
      </Link>
    );
  }

  const name = profile?.full_name || user.email?.split("@")[0] || "You";
  const initial = name.charAt(0).toUpperCase();
  const avatarUrl = profile?.avatar_url || (user.user_metadata as { avatar_url?: string })?.avatar_url;

  return (
    <Link
      to="/profile"
      title={`${name} — Account`}
      aria-label="Open profile"
      className="group relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 bg-gradient-to-br from-primary/30 to-electric/30 ring-1 ring-primary/40 hover:ring-primary transition overflow-hidden"
    >
      <span className="absolute inset-0 rounded-full blur-md bg-primary/30 opacity-0 group-hover:opacity-100 transition" />
      {avatarUrl ? (
        <img src={avatarUrl} alt={name} className="relative h-full w-full object-cover" referrerPolicy="no-referrer" />
      ) : (
        <span className="relative font-display text-sm font-semibold text-primary-foreground">{initial}</span>
      )}
      <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-signal ring-2 ring-background" />
    </Link>
  );
}
