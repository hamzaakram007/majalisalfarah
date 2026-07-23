-- Run after seed.sql to add sample variants and option groups

INSERT INTO product_variants (product_id, sku, option_label, price_sar, stock, sort_order) VALUES
  ('b0000000-0000-4000-8000-000000000004', 'linen-wave-beige', 'Beige', 890, 12, 0),
  ('b0000000-0000-4000-8000-000000000004', 'linen-wave-ivory', 'Ivory', 890, 10, 1),
  ('b0000000-0000-4000-8000-000000000004', 'linen-wave-olive', 'Olive', 890, 8, 2),
  ('b0000000-0000-4000-8000-000000000004', 'linen-wave-charcoal', 'Charcoal', 920, 6, 3),
  ('b0000000-0000-4000-8000-000000000006', 'cushion-sand', 'Sand Boucle', 260, 20, 0),
  ('b0000000-0000-4000-8000-000000000006', 'cushion-ivory', 'Ivory Linen', 260, 18, 1),
  ('b0000000-0000-4000-8000-000000000006', 'cushion-olive', 'Olive Velvet', 280, 15, 2)
ON CONFLICT DO NOTHING;

INSERT INTO product_option_groups (id, product_id, group_key, is_required, affects_price, is_quote_only, sort_order) VALUES
  ('d0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000004', 'installation', false, true, false, 0),
  ('d0000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000004', 'width', false, false, true, 1)
ON CONFLICT (product_id, group_key) DO NOTHING;

INSERT INTO product_option_group_translations (group_id, locale, label) VALUES
  ('d0000000-0000-4000-8000-000000000001', 'en', 'Installation'),
  ('d0000000-0000-4000-8000-000000000001', 'ar', 'التركيب'),
  ('d0000000-0000-4000-8000-000000000002', 'en', 'Width (cm)'),
  ('d0000000-0000-4000-8000-000000000002', 'ar', 'العرض (سم)')
ON CONFLICT DO NOTHING;

INSERT INTO product_option_values (id, group_id, value_key, price_adjustment_sar, sort_order) VALUES
  ('e0000000-0000-4000-8000-000000000001', 'd0000000-0000-4000-8000-000000000001', 'none', 0, 0),
  ('e0000000-0000-4000-8000-000000000002', 'd0000000-0000-4000-8000-000000000001', 'standard', 150, 1),
  ('e0000000-0000-4000-8000-000000000003', 'd0000000-0000-4000-8000-000000000002', '120', 0, 0),
  ('e0000000-0000-4000-8000-000000000004', 'd0000000-0000-4000-8000-000000000002', 'custom', 0, 1)
ON CONFLICT (group_id, value_key) DO NOTHING;

INSERT INTO product_option_value_translations (value_id, locale, label) VALUES
  ('e0000000-0000-4000-8000-000000000001', 'en', 'No installation'),
  ('e0000000-0000-4000-8000-000000000001', 'ar', 'بدون تركيب'),
  ('e0000000-0000-4000-8000-000000000002', 'en', 'Standard install'),
  ('e0000000-0000-4000-8000-000000000002', 'ar', 'تركيب عادي'),
  ('e0000000-0000-4000-8000-000000000003', 'en', '120 cm'),
  ('e0000000-0000-4000-8000-000000000003', 'ar', '120 سم'),
  ('e0000000-0000-4000-8000-000000000004', 'en', 'Custom size'),
  ('e0000000-0000-4000-8000-000000000004', 'ar', 'مقاس خاص')
ON CONFLICT DO NOTHING;
