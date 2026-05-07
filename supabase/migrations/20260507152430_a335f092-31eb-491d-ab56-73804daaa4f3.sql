
CREATE TABLE public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'cultura',
  excerpt text NOT NULL DEFAULT '',
  cover_image_url text,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  file_url text NOT NULL,
  cover_image_url text,
  requires_email boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Posts policies
CREATE POLICY "Public can read published posts" ON public.posts FOR SELECT USING (published = true);
CREATE POLICY "Authenticated can read all posts" ON public.posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert posts" ON public.posts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update posts" ON public.posts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete posts" ON public.posts FOR DELETE TO authenticated USING (true);

-- Resources policies
CREATE POLICY "Public can read published resources" ON public.resources FOR SELECT USING (published = true);
CREATE POLICY "Authenticated can read all resources" ON public.resources FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert resources" ON public.resources FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update resources" ON public.resources FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete resources" ON public.resources FOR DELETE TO authenticated USING (true);

-- Subscribers policies
CREATE POLICY "Anyone can subscribe" ON public.subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can read subscribers" ON public.subscribers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can delete subscribers" ON public.subscribers FOR DELETE TO authenticated USING (true);

-- updated_at trigger for posts
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TRIGGER posts_updated_at BEFORE UPDATE ON public.posts
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
