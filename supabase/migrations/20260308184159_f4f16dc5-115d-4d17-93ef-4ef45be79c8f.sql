-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Girl profiles table
CREATE TABLE public.girl_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  personality TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.girl_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own girl profiles" ON public.girl_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own girl profiles" ON public.girl_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own girl profiles" ON public.girl_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own girl profiles" ON public.girl_profiles FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_girl_profiles_updated_at BEFORE UPDATE ON public.girl_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Saved dates table
CREATE TABLE public.saved_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  girl_profile_id UUID REFERENCES public.girl_profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  activities JSONB NOT NULL DEFAULT '[]',
  quiz_answers JSONB DEFAULT '{}',
  budget NUMERIC NOT NULL DEFAULT 1000,
  total_cost NUMERIC NOT NULL DEFAULT 0,
  date_scheduled DATE,
  share_token TEXT UNIQUE,
  share_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.saved_dates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own saved dates" ON public.saved_dates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own saved dates" ON public.saved_dates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own saved dates" ON public.saved_dates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own saved dates" ON public.saved_dates FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view shared dates by token" ON public.saved_dates FOR SELECT USING (share_token IS NOT NULL AND share_expires_at > now());

CREATE TRIGGER update_saved_dates_updated_at BEFORE UPDATE ON public.saved_dates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_saved_dates_share_token ON public.saved_dates(share_token) WHERE share_token IS NOT NULL;