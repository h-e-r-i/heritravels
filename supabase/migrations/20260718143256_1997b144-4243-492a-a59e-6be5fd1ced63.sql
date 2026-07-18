
-- 1) username on profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username text UNIQUE;
CREATE INDEX IF NOT EXISTS profiles_username_idx ON public.profiles (lower(username));

-- Allow authenticated users to view minimal public profile fields of others (for search).
DROP POLICY IF EXISTS "Authenticated can search profiles" ON public.profiles;
CREATE POLICY "Authenticated can search profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

-- 2) friend_requests
CREATE TABLE IF NOT EXISTS public.friend_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  to_user uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','declined','cancelled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (from_user, to_user)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.friend_requests TO authenticated;
GRANT ALL ON public.friend_requests TO service_role;
ALTER TABLE public.friend_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "See own requests" ON public.friend_requests
FOR SELECT TO authenticated
USING (auth.uid() = from_user OR auth.uid() = to_user);

CREATE POLICY "Send requests" ON public.friend_requests
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = from_user AND from_user <> to_user);

CREATE POLICY "Recipient or sender can update" ON public.friend_requests
FOR UPDATE TO authenticated
USING (auth.uid() = to_user OR auth.uid() = from_user)
WITH CHECK (auth.uid() = to_user OR auth.uid() = from_user);

CREATE POLICY "Sender can cancel" ON public.friend_requests
FOR DELETE TO authenticated
USING (auth.uid() = from_user);

CREATE TRIGGER friend_requests_set_updated_at
BEFORE UPDATE ON public.friend_requests
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 3) friendships (two rows per pair for easy querying)
CREATE TABLE IF NOT EXISTS public.friendships (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, friend_id),
  CHECK (user_id <> friend_id)
);
GRANT SELECT, INSERT, DELETE ON public.friendships TO authenticated;
GRANT ALL ON public.friendships TO service_role;
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "See own friendships" ON public.friendships
FOR SELECT TO authenticated
USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Create mutual friendships" ON public.friendships
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Unfriend" ON public.friendships
FOR DELETE TO authenticated
USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- 4) messages
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  read_at timestamptz
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS messages_conv_idx ON public.messages (sender_id, recipient_id, created_at);

CREATE POLICY "See own messages" ON public.messages
FOR SELECT TO authenticated
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Send to friends only" ON public.messages
FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = sender_id
  AND EXISTS (
    SELECT 1 FROM public.friendships f
    WHERE f.user_id = auth.uid() AND f.friend_id = messages.recipient_id
  )
);

CREATE POLICY "Recipient can mark read" ON public.messages
FOR UPDATE TO authenticated
USING (auth.uid() = recipient_id)
WITH CHECK (auth.uid() = recipient_id);

-- 5) Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.friend_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.friendships;

-- 6) Helper: on accepted request, create both friendship rows.
CREATE OR REPLACE FUNCTION public.handle_friend_request_accepted()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'accepted' AND (OLD.status IS DISTINCT FROM 'accepted') THEN
    INSERT INTO public.friendships (user_id, friend_id)
    VALUES (NEW.from_user, NEW.to_user), (NEW.to_user, NEW.from_user)
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS friend_requests_accept ON public.friend_requests;
CREATE TRIGGER friend_requests_accept
AFTER UPDATE ON public.friend_requests
FOR EACH ROW EXECUTE FUNCTION public.handle_friend_request_accepted();
