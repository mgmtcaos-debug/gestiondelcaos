CREATE TABLE public.post_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  media_type text NOT NULL DEFAULT 'image',
  url text NOT NULL,
  caption text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_post_media_post_id ON public.post_media(post_id);

ALTER TABLE public.post_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read media of published posts"
  ON public.post_media FOR SELECT
  TO public
  USING (EXISTS (SELECT 1 FROM public.posts p WHERE p.id = post_media.post_id AND p.published = true));

CREATE POLICY "Authenticated can read all post media"
  ON public.post_media FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can insert post media"
  ON public.post_media FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated can update post media"
  ON public.post_media FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated can delete post media"
  ON public.post_media FOR DELETE TO authenticated USING (true);