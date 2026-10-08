-- Migration to add product translations table

CREATE TABLE IF NOT EXISTS public.product_translations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id text NOT NULL, -- Assuming product IDs are text based on current mockup
  language_code text NOT NULL, -- e.g., 'fr', 'ar', 'zh'
  name text NOT NULL,
  description text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Add unique constraint so there's only one translation per product per language
ALTER TABLE public.product_translations 
  ADD CONSTRAINT unique_product_language UNIQUE (product_id, language_code);

-- Enable RLS
ALTER TABLE public.product_translations ENABLE ROW LEVEL SECURITY;

-- Anyone can view product translations
CREATE POLICY "Translations are viewable by everyone" ON public.product_translations
  FOR SELECT USING (true);

-- Only admins can modify translations
CREATE POLICY "Only admins can modify translations" ON public.product_translations
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('super_admin', 'content_admin', 'operations_admin')
    )
  );
