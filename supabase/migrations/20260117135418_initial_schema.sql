-- Date For You: Supabase Schema

-- 1. Users table (Extends Auth users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  name TEXT,
  age INTEGER,
  gender TEXT,
  preferences TEXT[], -- 'Vibe' chips
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Personas (The bots)
CREATE TABLE IF NOT EXISTS public.personas (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  location TEXT,
  bio TEXT,
  photos TEXT[] NOT NULL,
  vibes TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Chats
CREATE TABLE IF NOT EXISTS public.chats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  persona_id UUID REFERENCES public.personas(id) NOT NULL,
  last_message TEXT,
  last_message_time TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  unread_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, persona_id)
);

-- 4. Messages
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  chat_id UUID REFERENCES public.chats(id) ON DELETE CASCADE NOT NULL,
  sender_type TEXT CHECK (sender_type IN ('user', 'persona')) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Usage Limits
CREATE TABLE IF NOT EXISTS public.usage_limits (
  user_id UUID REFERENCES public.users(id) NOT NULL PRIMARY KEY,
  swipes_today INTEGER DEFAULT 0,
  messages_today INTEGER DEFAULT 0,
  last_reset TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- SECURITY: Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_limits ENABLE ROW LEVEL SECURITY;

-- POLICIES
CREATE POLICY "Users can view their own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own data" ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can view personas" ON public.personas FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can view their own chats" ON public.chats FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own messages" ON public.messages FOR SELECT 
USING (chat_id IN (SELECT id FROM public.chats WHERE user_id = auth.uid()));

CREATE POLICY "Users can view their own limits" ON public.usage_limits FOR SELECT USING (auth.uid() = user_id);

-- RPC: Increment swipes
CREATE OR REPLACE FUNCTION increment_swipes(user_id_param UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.usage_limits (user_id, swipes_today)
  VALUES (user_id_param, 1)
  ON CONFLICT (user_id)
  DO UPDATE SET swipes_today = usage_limits.swipes_today + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

