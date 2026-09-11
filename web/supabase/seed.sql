-- Seed categories and products (run after migration)
INSERT INTO categories (id, slug, sort_order) VALUES
  ('a0000000-0000-4000-8000-000000000001', 'sofas', 1),
  ('a0000000-0000-4000-8000-000000000002', 'foam', 2),
  ('a0000000-0000-4000-8000-000000000003', 'majlis', 3),
  ('a0000000-0000-4000-8000-000000000004', 'curtains', 4),
  ('a0000000-0000-4000-8000-000000000005', 'cushions', 5),
  ('a0000000-0000-4000-8000-000000000006', 'accessories', 6)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO category_translations (category_id, locale, name, description) VALUES
  ('a0000000-0000-4000-8000-000000000001', 'en', 'Sofas', 'Custom Saudi sofa sets'),
  ('a0000000-0000-4000-8000-000000000001', 'ar', 'كنب', 'طقم كنب سعودي حسب الطلب'),
  ('a0000000-0000-4000-8000-000000000002', 'en', 'Foam', 'High-density foam blocks'),
  ('a0000000-0000-4000-8000-000000000002', 'ar', 'فوم', 'فوم عالي الكثافة'),
  ('a0000000-0000-4000-8000-000000000003', 'en', 'Majlis', 'Majlis decor and seating'),
  ('a0000000-0000-4000-8000-000000000003', 'ar', 'مجالس', 'ديكور ومجالس'),
  ('a0000000-0000-4000-8000-000000000004', 'en', 'Curtains', 'Wave, pleated, blackout, sheer, and layered curtains'),
  ('a0000000-0000-4000-8000-000000000004', 'ar', 'ستائر', 'ستائر ويف وبلاك آوت وشفافة وطبقات'),
  ('a0000000-0000-4000-8000-000000000005', 'en', 'Cushions & Pillows', 'Sofa cushions, pillows, and fabric accents'),
  ('a0000000-0000-4000-8000-000000000005', 'ar', 'مخدات ووسائد', 'مخدات للكنب ووسائد ديكور'),
  ('a0000000-0000-4000-8000-000000000006', 'en', 'Accessories', 'Sofa care, styling, and living room add-ons'),
  ('a0000000-0000-4000-8000-000000000006', 'ar', 'إكسسوارات', 'عناية وتنسيق وإضافات للكنب')
ON CONFLICT DO NOTHING;

INSERT INTO products (id, slug, category_id, price_sar, stock, is_featured, image_url) VALUES
  ('b0000000-0000-4000-8000-000000000001', 'luxury-sofa-set', 'a0000000-0000-4000-8000-000000000001', 5500, 10, true, '/images/sofa-sample.svg'),
  ('b0000000-0000-4000-8000-000000000002', 'foam-block-20cm', 'a0000000-0000-4000-8000-000000000002', 320, 50, true, '/images/foam-block.svg'),
  ('b0000000-0000-4000-8000-000000000003', 'majlis-corner-set', 'a0000000-0000-4000-8000-000000000003', 8900, 5, false, '/images/majlis.svg'),
  ('b0000000-0000-4000-8000-000000000004', 'linen-wave-curtains', 'a0000000-0000-4000-8000-000000000004', 890, 24, true, '/images/curtains-panel.svg'),
  ('b0000000-0000-4000-8000-000000000005', 'blackout-pleated-curtains', 'a0000000-0000-4000-8000-000000000004', 1150, 18, false, '/images/curtains-panel.svg'),
  ('b0000000-0000-4000-8000-000000000008', 'wifi-smart-curtains', 'a0000000-0000-4000-8000-000000000004', 2450, 12, true, '/images/wifi-curtains/wifi-curtain-light-cream-ivory.jpg'),
  ('b0000000-0000-4000-8000-000000000006', 'sofa-cushion-set', 'a0000000-0000-4000-8000-000000000005', 260, 40, true, '/images/cushions-panel.svg'),
  ('b0000000-0000-4000-8000-000000000007', 'sofa-care-accessories', 'a0000000-0000-4000-8000-000000000006', 180, 35, false, '/images/accessories-panel.svg')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO product_translations (product_id, locale, name, description) VALUES
  ('b0000000-0000-4000-8000-000000000001', 'en', 'Luxury Sofa Set', 'Premium custom Saudi sofa set since 1990.'),
  ('b0000000-0000-4000-8000-000000000001', 'ar', 'طقم كنب فاخر', 'طقم كنب سعودي فاخر حسب الطلب منذ 1990.'),
  ('b0000000-0000-4000-8000-000000000002', 'en', 'Foam Block 20cm', 'High-density foam block, 20cm thickness.'),
  ('b0000000-0000-4000-8000-000000000002', 'ar', 'فوم ٢٠ سم', 'كتلة فوم عالية الكثافة بسمك ٢٠ سم.'),
  ('b0000000-0000-4000-8000-000000000003', 'en', 'Majlis Corner Set', 'Complete majlis corner seating package.'),
  ('b0000000-0000-4000-8000-000000000003', 'ar', 'مجلس زاوية كامل', 'طقم مجلس زاوية متكامل.'),
  ('b0000000-0000-4000-8000-000000000004', 'en', 'Linen Wave Curtains', 'Self-order wave curtains in beige, ivory, olive, or charcoal with custom sizing available.'),
  ('b0000000-0000-4000-8000-000000000004', 'ar', 'ستائر كتان ويف', 'ستائر ويف للطلب المباشر بألوان بيج وعاجي وزيتوني وفحمي مع دعم المقاسات الخاصة.'),
  ('b0000000-0000-4000-8000-000000000005', 'en', 'Blackout Pleated Curtains', 'Thermal blackout curtains with pleated, eyelet, and track options for bedrooms and majlis rooms.'),
  ('b0000000-0000-4000-8000-000000000005', 'ar', 'ستائر بلاك آوت بكسرات', 'ستائر عازلة للغرف والمجالس بخيارات كسرات وحلقات ومسارات.'),
  ('b0000000-0000-4000-8000-000000000008', 'en', 'WiFi Smart Curtains', 'Motorized WiFi curtains with app control in twelve colors — six light and six dark.'),
  ('b0000000-0000-4000-8000-000000000008', 'ar', 'ستائر واي فاي ذكية', 'ستائر بمحرك وتحكم عبر التطبيق باثني عشر لوناً — ستة فاتحة وستة داكنة.'),
  ('b0000000-0000-4000-8000-000000000006', 'en', 'Sofa Cushion & Pillow Set', 'Layered cushions and pillows in boucle, linen, velvet, and patterned fabrics.'),
  ('b0000000-0000-4000-8000-000000000006', 'ar', 'طقم مخدات ووسائد للكنب', 'مخدات ووسائد متناسقة من البوكليه والكتان والمخمل والأقمشة المزخرفة.'),
  ('b0000000-0000-4000-8000-000000000007', 'en', 'Sofa Care Accessories', 'Coordinated arm trays, fabric care kits, leg protectors, and styling accessories.'),
  ('b0000000-0000-4000-8000-000000000007', 'ar', 'إكسسوارات العناية بالكنب', 'صواني ذراع الكنب وأدوات العناية بالقماش وحمايات الأرجل وإكسسوارات التنسيق.')
ON CONFLICT DO NOTHING;

INSERT INTO blog_posts (id, slug, published, published_at, image_url) VALUES
  ('c0000000-0000-4000-8000-000000000001', 'majlis-layout-tips', true, now(), '/images/gallery2.jpg')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO blog_post_translations (post_id, locale, title, excerpt, body) VALUES
  ('c0000000-0000-4000-8000-000000000001', 'en', 'Majlis Layout Tips', 'How to plan your Saudi majlis space.', 'Choose seating that matches your room dimensions and traffic flow.'),
  ('c0000000-0000-4000-8000-000000000001', 'ar', 'نصائح تخطيط المجلس', 'كيف تخطط لمساحة مجلسك السعودي.', 'اختر الجلسات التي تناسب أبعاد الغرفة وحركة الضيوف.')
ON CONFLICT DO NOTHING;

INSERT INTO site_settings (key, value) VALUES
  ('loyalty', '{"pointsPer100Sar":1,"redeemAt":200,"discountPercent":10}'),
  ('contact', '{"email":"contact@majalisalfarah.sa","phone":"+966500000000","address":"Riyadh, Saudi Arabia"}')
ON CONFLICT (key) DO NOTHING;
