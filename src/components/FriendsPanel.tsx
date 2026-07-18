import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import {
  fetchConversation,
  getProfilesByIds,
  listFriends,
  listIncomingRequests,
  listOutgoingRequests,
  respondToRequest,
  searchUsers,
  sendFriendRequest,
  sendMessage,
  type ChatMessage,
  type FriendProfile,
  type FriendRequest,
} from "@/lib/friends";

export function FriendsPanel() {
  const { user, loading } = useAuth();
  const [tab, setTab] = useState<"friends" | "requests" | "find">("friends");
  const [friends, setFriends] = useState<FriendProfile[]>([]);
  const [incoming, setIncoming] = useState<FriendRequest[]>([]);
  const [outgoing, setOutgoing] = useState<FriendRequest[]>([]);
  const [profiles, setProfiles] = useState<Record<string, FriendProfile>>({});
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FriendProfile[]>([]);
  const [active, setActive] = useState<FriendProfile | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const meId = user?.id;

  const refresh = async () => {
    if (!meId) return;
    try {
      const [f, i, o] = await Promise.all([
        listFriends(meId),
        listIncomingRequests(meId),
        listOutgoingRequests(meId),
      ]);
      setFriends(f);
      setIncoming(i);
      setOutgoing(o);
      const ids = Array.from(new Set([...i.map((r) => r.from_user), ...o.map((r) => r.to_user)]));
      if (ids.length) setProfiles(await getProfilesByIds(ids));
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    }
  };

  useEffect(() => { refresh(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [meId]);

  // Realtime: refresh on request/friendship changes
  useEffect(() => {
    if (!meId) return;
    const ch = supabase
      .channel(`friends:${meId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "friend_requests" }, refresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "friendships" }, refresh)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meId]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2 || !meId) { setResults([]); return; }
    const h = setTimeout(async () => {
      try { setResults(await searchUsers(q, meId)); } catch (e) { setErr(String(e)); }
    }, 300);
    return () => clearTimeout(h);
  }, [query, meId]);

  if (loading) return <div className="text-sm text-muted-foreground">Loading…</div>;
  if (!user) {
    return (
      <div className="glass-panel rounded-2xl p-6 text-sm">
        <p className="text-muted-foreground">Sign in to connect with fellow travelers, send requests and chat.</p>
        <a href="/auth?redirect=/achievements" className="mt-3 inline-block rounded-full bg-primary text-primary-foreground px-4 py-2 text-xs font-semibold">Sign in</a>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-1 rounded-full border border-border/60 bg-surface/60 p-1 text-xs w-fit">
        {([["friends", `Friends (${friends.length})`], ["requests", `Requests (${incoming.length})`], ["find", "Find people"]] as const).map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={`px-4 py-1.5 rounded-full transition ${tab === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>{l}</button>
        ))}
      </div>

      {err && <div className="mt-3 text-xs text-destructive">{err}</div>}

      <div className="mt-5 grid gap-5 md:grid-cols-[1fr_1.4fr]">
        <div className="glass-panel rounded-2xl p-4">
          {tab === "friends" && (
            <FriendList friends={friends} onOpen={setActive} active={active} />
          )}
          {tab === "requests" && (
            <RequestList
              incoming={incoming}
              outgoing={outgoing}
              profiles={profiles}
              onRespond={async (id, accept) => { await respondToRequest(id, accept); refresh(); }}
            />
          )}
          {tab === "find" && (
            <FindPeople
              query={query}
              setQuery={setQuery}
              results={results}
              friends={friends}
              outgoing={outgoing}
              onSend={async (id) => { await sendFriendRequest(meId!, id); refresh(); }}
            />
          )}
        </div>

        <div className="glass-panel rounded-2xl p-4 min-h-[360px]">
          {active ? <Conversation me={user.id} other={active} /> : (
            <div className="h-full grid place-items-center text-center text-sm text-muted-foreground p-6">
              <div>
                <div className="text-3xl mb-2">💬</div>
                Pick a friend to start chatting.
                <div className="text-[11px] mt-1">Messages sync live between devices.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function initials(p: FriendProfile) {
  return (p.full_name || p.username || p.email || "?").charAt(0).toUpperCase();
}
function label(p: FriendProfile) {
  return p.full_name || (p.username ? "@" + p.username : p.email) || "Traveler";
}

function Avatar({ p, size = 40 }: { p: FriendProfile; size?: number }) {
  return (
    <div style={{ width: size, height: size }} className="shrink-0 rounded-full overflow-hidden border border-primary/40 bg-gradient-to-br from-primary/40 to-electric/40 flex items-center justify-center">
      {p.avatar_url ? <img src={p.avatar_url} alt="" className="h-full w-full object-cover" /> :
        <span className="font-display font-semibold text-primary-foreground text-sm">{initials(p)}</span>}
    </div>
  );
}

function FriendList({ friends, onOpen, active }: { friends: FriendProfile[]; onOpen: (p: FriendProfile) => void; active: FriendProfile | null }) {
  if (friends.length === 0) return <div className="text-sm text-muted-foreground p-6 text-center">No companions yet. Head to <b>Find people</b>.</div>;
  return (
    <ul className="space-y-1">
      {friends.map((p) => (
        <li key={p.id}>
          <button onClick={() => onOpen(p)} className={`w-full text-left rounded-xl border px-3 py-2 flex items-center gap-3 transition ${active?.id === p.id ? "border-primary bg-primary/10" : "border-border/50 hover:bg-accent/50"}`}>
            <Avatar p={p} />
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">{label(p)}</div>
              {p.username && <div className="text-[11px] text-muted-foreground truncate">@{p.username}</div>}
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}

function RequestList({
  incoming, outgoing, profiles, onRespond,
}: {
  incoming: FriendRequest[];
  outgoing: FriendRequest[];
  profiles: Record<string, FriendProfile>;
  onRespond: (id: string, accept: boolean) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Incoming</div>
        {incoming.length === 0 ? <div className="text-xs text-muted-foreground">Nothing pending.</div> :
          <ul className="space-y-2">
            {incoming.map((r) => {
              const p = profiles[r.from_user];
              if (!p) return null;
              return (
                <li key={r.id} className="flex items-center gap-3 rounded-xl border border-border/50 p-2">
                  <Avatar p={p} />
                  <div className="flex-1 min-w-0"><div className="text-sm font-medium truncate">{label(p)}</div></div>
                  <button onClick={() => onRespond(r.id, true)} className="rounded-full bg-primary text-primary-foreground text-xs px-3 py-1">Accept</button>
                  <button onClick={() => onRespond(r.id, false)} className="rounded-full border border-border text-xs px-3 py-1">Decline</button>
                </li>
              );
            })}
          </ul>}
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Sent</div>
        {outgoing.length === 0 ? <div className="text-xs text-muted-foreground">No outgoing requests.</div> :
          <ul className="space-y-2">
            {outgoing.map((r) => {
              const p = profiles[r.to_user];
              if (!p) return null;
              return (
                <li key={r.id} className="flex items-center gap-3 rounded-xl border border-border/50 p-2">
                  <Avatar p={p} />
                  <div className="flex-1 min-w-0"><div className="text-sm font-medium truncate">{label(p)}</div></div>
                  <span className="text-[11px] text-muted-foreground">Pending</span>
                </li>
              );
            })}
          </ul>}
      </div>
    </div>
  );
}

function FindPeople({
  query, setQuery, results, friends, outgoing, onSend,
}: {
  query: string;
  setQuery: (s: string) => void;
  results: FriendProfile[];
  friends: FriendProfile[];
  outgoing: FriendRequest[];
  onSend: (id: string) => void;
}) {
  const friendIds = useMemo(() => new Set(friends.map((f) => f.id)), [friends]);
  const outIds = useMemo(() => new Set(outgoing.map((o) => o.to_user)), [outgoing]);
  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search @username, name or email…"
        className="w-full rounded-full border border-border bg-background/60 px-4 py-2 text-sm outline-none focus:border-primary" />
      <div className="mt-3">
        {query.trim().length < 2 && <div className="text-xs text-muted-foreground">Type at least 2 characters to search.</div>}
        {query.trim().length >= 2 && results.length === 0 && <div className="text-xs text-muted-foreground">No matches.</div>}
        <ul className="mt-2 space-y-2">
          {results.map((p) => {
            const already = friendIds.has(p.id);
            const pending = outIds.has(p.id);
            return (
              <li key={p.id} className="flex items-center gap-3 rounded-xl border border-border/50 p-2">
                <Avatar p={p} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{label(p)}</div>
                  {p.username && <div className="text-[11px] text-muted-foreground">@{p.username}</div>}
                </div>
                {already ? <span className="text-[11px] text-signal">Friend ✓</span> :
                  pending ? <span className="text-[11px] text-muted-foreground">Pending</span> :
                    <button onClick={() => onSend(p.id)} className="rounded-full bg-primary text-primary-foreground text-xs px-3 py-1">Add</button>}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function Conversation({ me, other }: { me: string; other: FriendProfile }) {
  const [msgs, setMsgs] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let live = true;
    fetchConversation(me, other.id).then((m) => { if (live) setMsgs(m); });
    const ch = supabase
      .channel(`chat:${me}:${other.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        const m = payload.new as ChatMessage;
        if ((m.sender_id === me && m.recipient_id === other.id) || (m.sender_id === other.id && m.recipient_id === me)) {
          setMsgs((prev) => [...prev, m]);
        }
      })
      .subscribe();
    return () => { live = false; supabase.removeChannel(ch); };
  }, [me, other.id]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    try { await sendMessage(me, other.id, text); setText(""); } finally { setSending(false); }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 pb-3 border-b border-border/50">
        <Avatar p={other} />
        <div className="min-w-0">
          <div className="text-sm font-medium truncate">{label(other)}</div>
          {other.username && <div className="text-[11px] text-muted-foreground truncate">@{other.username}</div>}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-3 space-y-2">
        {msgs.length === 0 && <div className="text-xs text-muted-foreground text-center pt-8">Say hi 👋</div>}
        {msgs.map((m) => {
          const mine = m.sender_id === me;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-2xl px-3 py-1.5 text-sm ${mine ? "bg-primary text-primary-foreground" : "bg-surface-2 border border-border/50"}`}>
                {m.content}
                <div className={`mt-0.5 text-[9px] uppercase tracking-widest ${mine ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <form onSubmit={submit} className="pt-3 border-t border-border/50 flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message…"
          className="flex-1 rounded-full border border-border bg-background/60 px-4 py-2 text-sm outline-none focus:border-primary" />
        <button disabled={sending || !text.trim()} className="rounded-full bg-gradient-to-r from-primary to-electric text-primary-foreground text-sm font-semibold px-4 py-2 disabled:opacity-60">Send</button>
      </form>
    </div>
  );
}
