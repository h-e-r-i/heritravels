import { supabase } from "@/integrations/supabase/client";

export type FriendProfile = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
};

export type FriendRequest = {
  id: string;
  from_user: string;
  to_user: string;
  status: "pending" | "accepted" | "declined" | "cancelled";
  created_at: string;
  updated_at: string;
};

export type ChatMessage = {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
};

export async function searchUsers(query: string, meId: string): Promise<FriendProfile[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, full_name, avatar_url, email")
    .or(`username.ilike.%${q}%,full_name.ilike.%${q}%,email.ilike.%${q}%`)
    .neq("id", meId)
    .limit(15);
  if (error) throw error;
  return (data ?? []) as FriendProfile[];
}

export async function sendFriendRequest(fromId: string, toId: string) {
  const { error } = await supabase
    .from("friend_requests")
    .upsert({ from_user: fromId, to_user: toId, status: "pending" }, { onConflict: "from_user,to_user" });
  if (error) throw error;
}

export async function respondToRequest(id: string, accept: boolean) {
  const { error } = await supabase
    .from("friend_requests")
    .update({ status: accept ? "accepted" : "declined" })
    .eq("id", id);
  if (error) throw error;
}

export async function listFriends(meId: string): Promise<FriendProfile[]> {
  const { data, error } = await supabase
    .from("friendships")
    .select("friend_id, profiles!friendships_friend_id_fkey(id, username, full_name, avatar_url, email)")
    .eq("user_id", meId);
  if (error) {
    // Fallback: two-step lookup if the join fails (no explicit FK named).
    const { data: rows } = await supabase.from("friendships").select("friend_id").eq("user_id", meId);
    const ids = (rows ?? []).map((r) => r.friend_id as string);
    if (ids.length === 0) return [];
    const { data: profs } = await supabase
      .from("profiles")
      .select("id, username, full_name, avatar_url, email")
      .in("id", ids);
    return (profs ?? []) as FriendProfile[];
  }
  return (data ?? [])
    .map((r) => (r as unknown as { profiles: FriendProfile }).profiles)
    .filter(Boolean);
}

export async function listIncomingRequests(meId: string): Promise<FriendRequest[]> {
  const { data, error } = await supabase
    .from("friend_requests")
    .select("*")
    .eq("to_user", meId)
    .eq("status", "pending")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as FriendRequest[];
}

export async function listOutgoingRequests(meId: string): Promise<FriendRequest[]> {
  const { data, error } = await supabase
    .from("friend_requests")
    .select("*")
    .eq("from_user", meId)
    .eq("status", "pending");
  if (error) throw error;
  return (data ?? []) as FriendRequest[];
}

export async function getProfilesByIds(ids: string[]): Promise<Record<string, FriendProfile>> {
  if (ids.length === 0) return {};
  const { data } = await supabase
    .from("profiles")
    .select("id, username, full_name, avatar_url, email")
    .in("id", ids);
  const out: Record<string, FriendProfile> = {};
  for (const p of (data ?? []) as FriendProfile[]) out[p.id] = p;
  return out;
}

export async function fetchConversation(meId: string, otherId: string): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .or(
      `and(sender_id.eq.${meId},recipient_id.eq.${otherId}),and(sender_id.eq.${otherId},recipient_id.eq.${meId})`,
    )
    .order("created_at", { ascending: true })
    .limit(200);
  if (error) throw error;
  return (data ?? []) as ChatMessage[];
}

export async function sendMessage(meId: string, otherId: string, content: string) {
  const text = content.trim();
  if (!text) return;
  const { error } = await supabase
    .from("messages")
    .insert({ sender_id: meId, recipient_id: otherId, content: text });
  if (error) throw error;
}
