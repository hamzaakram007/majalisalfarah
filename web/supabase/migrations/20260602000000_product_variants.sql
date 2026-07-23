-- Product variants, option groups, images, and order line extensions

CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku TEXT,
  option_label TEXT NOT NULL,
  price_sar NUMERIC(12,2) NOT NULL,
  compare_at_price_sar NUMERIC(12,2),
  stock INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  attributes JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_product_variants_sku ON product_variants(sku) WHERE sku IS NOT NULL;
CREATE INDEX idx_product_variants_product ON product_variants(product_id);

CREATE TABLE product_option_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  group_key TEXT NOT NULL,
  selection_type TEXT NOT NULL DEFAULT 'single' CHECK (selection_type IN ('single', 'multi')),
  is_required BOOLEAN NOT NULL DEFAULT false,
  affects_price BOOLEAN NOT NULL DEFAULT false,
  is_quote_only BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (product_id, group_key)
);

CREATE TABLE product_option_group_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES product_option_groups(id) ON DELETE CASCADE,
  locale TEXT NOT NULL CHECK (locale IN ('en', 'ar')),
  label TEXT NOT NULL,
  UNIQUE (group_id, locale)
);

CREATE TABLE product_option_values (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES product_option_groups(id) ON DELETE CASCADE,
  value_key TEXT NOT NULL,
  price_adjustment_sar NUMERIC(12,2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (group_id, value_key)
);

CREATE TABLE product_option_value_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  value_id UUID NOT NULL REFERENCES product_option_values(id) ON DELETE CASCADE,
  locale TEXT NOT NULL CHECK (locale IN ('en', 'ar')),
  label TEXT NOT NULL,
  UNIQUE (value_id, locale)
);

CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_product_images_product ON product_images(product_id);

ALTER TABLE order_items
  ADD COLUMN IF NOT EXISTS variant_id UUID REFERENCES product_variants(id),
  ADD COLUMN IF NOT EXISTS options_json JSONB NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS line_key TEXT;

-- RLS
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_option_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_option_group_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_option_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_option_value_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active variants" ON product_variants
  FOR SELECT USING (
    is_active = true
    AND EXISTS (SELECT 1 FROM products p WHERE p.id = product_id AND p.is_active = true)
  );

CREATE POLICY "Public read option groups" ON product_option_groups FOR SELECT USING (true);
CREATE POLICY "Public read option group translations" ON product_option_group_translations FOR SELECT USING (true);
CREATE POLICY "Public read active option values" ON product_option_values FOR SELECT USING (is_active = true);
CREATE POLICY "Public read option value translations" ON product_option_value_translations FOR SELECT USING (true);
CREATE POLICY "Public read product images" ON product_images FOR SELECT USING (true);

CREATE POLICY "Admin all variants" ON product_variants FOR ALL USING (is_admin());
CREATE POLICY "Admin all option groups" ON product_option_groups FOR ALL USING (is_admin());
CREATE POLICY "Admin all option group translations" ON product_option_group_translations FOR ALL USING (is_admin());
CREATE POLICY "Admin all option values" ON product_option_values FOR ALL USING (is_admin());
CREATE POLICY "Admin all option value translations" ON product_option_value_translations FOR ALL USING (is_admin());
CREATE POLICY "Admin all product images" ON product_images FOR ALL USING (is_admin());

-- Storage bucket for product media (public read)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-media',
  'product-media',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read product media" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-media');

CREATE POLICY "Admin upload product media" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-media' AND is_admin());

CREATE POLICY "Admin update product media" ON storage.objects
  FOR UPDATE USING (bucket_id = 'product-media' AND is_admin());

CREATE POLICY "Admin delete product media" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-media' AND is_admin());
