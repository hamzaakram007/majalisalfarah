-- Daily social product posting: settings + history

CREATE TYPE social_post_status AS ENUM ('pending', 'posted', 'failed', 'skipped');

CREATE TABLE social_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  enabled BOOLEAN NOT NULL DEFAULT false,
  platforms TEXT[] NOT NULL DEFAULT ARRAY['webhook']::TEXT[],
  caption_template TEXT NOT NULL DEFAULT E'{{name}}\n\n{{description}}\n\n{{price}}\n{{url}}\n\n#MajalisAlfarah #SaudiFurniture #Majlis',
  prefer_featured BOOLEAN NOT NULL DEFAULT true,
  include_price BOOLEAN NOT NULL DEFAULT true,
  post_locale TEXT NOT NULL DEFAULT 'both' CHECK (post_locale IN ('en', 'ar', 'both')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO social_settings (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE social_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_slug TEXT,
  product_name TEXT,
  platforms TEXT[] NOT NULL DEFAULT '{}',
  caption TEXT NOT NULL,
  image_url TEXT,
  product_url TEXT,
  status social_post_status NOT NULL DEFAULT 'pending',
  results JSONB NOT NULL DEFAULT '{}'::jsonb,
  error TEXT,
  triggered_by TEXT NOT NULL DEFAULT 'cron',
  posted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX social_posts_created_at_idx ON social_posts (created_at DESC);
CREATE INDEX social_posts_product_id_idx ON social_posts (product_id);
CREATE INDEX social_posts_status_idx ON social_posts (status);

ALTER TABLE social_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage social_settings"
  ON social_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins manage social_posts"
  ON social_posts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Service role / cron uses service key (bypasses RLS)
