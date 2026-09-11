import type { Locale } from "@/lib/i18n/config";
import type {
  ProductImage,
  ProductOptionGroup,
  ProductVariant,
} from "@/lib/products/types";

export type ProductWithTranslation = {
  id: string;
  slug: string;
  price_sar: number;
  stock: number;
  is_featured: boolean;
  is_active?: boolean;
  image_url: string | null;
  name: string;
  description: string | null;
  category_slug: string | null;
  variants?: ProductVariant[];
  option_groups?: ProductOptionGroup[];
  images?: ProductImage[];
};

export type CategoryWithTranslation = {
  id: string;
  slug: string;
  sort_order: number;
  name: string;
  description: string | null;
};

export type BlogPostWithTranslation = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  image_url: string | null;
  published_at: string | null;
};

type ProductDefinition = {
  index: number;
  slug: string;
  price_sar: number;
  stock: number;
  is_featured: boolean;
  image_url: string;
  category_slug: string;
  en: { name: string; description: string };
  ar: { name: string; description: string };
};

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

const productDefinitions: ProductDefinition[] = [
  {
    index: 1,
    slug: "luxury-sofa-set",
    price_sar: 5500,
    stock: 10,
    is_featured: true,
    image_url: img("photo-1555041469-a586c61ea9bc"),
    category_slug: "sofas",
    en: {
      name: "Luxury Sofa Set",
      description: "Premium custom Saudi sofa set with tailored fabric options.",
    },
    ar: {
      name: "طقم كنب فاخر",
      description: "طقم كنب سعودي فاخر مع خيارات قماش حسب الطلب.",
    },
  },
  {
    index: 2,
    slug: "modern-three-seat-sofa",
    price_sar: 4200,
    stock: 14,
    is_featured: true,
    image_url: img("photo-1493663284031-b7e3aefcae8e"),
    category_slug: "sofas",
    en: { name: "Modern Three-Seat Sofa", description: "Clean-lined three-seat sofa for living rooms and majlis lounges." },
    ar: { name: "كنب مودرن ثلاثي", description: "كنب بثلاثة مقاعد بخطوط عصرية للمجالس وغرف المعيشة." },
  },
  {
    index: 3,
    slug: "l-shape-family-sofa",
    price_sar: 6800,
    stock: 8,
    is_featured: false,
    image_url: img("photo-1616486338812-3dadae4b4ace"),
    category_slug: "sofas",
    en: { name: "L-Shape Family Sofa", description: "Large sectional sofa with comfortable deep seating and washable fabrics." },
    ar: { name: "كنب عائلي حرف L", description: "كنب زاوية واسع بجلسة عميقة وأقمشة قابلة للتنظيف." },
  },
  {
    index: 4,
    slug: "boucle-lounge-sofa",
    price_sar: 6100,
    stock: 9,
    is_featured: false,
    image_url: img("photo-1586023492125-27b2c045efd7"),
    category_slug: "sofas",
    en: { name: "Boucle Lounge Sofa", description: "Soft boucle sofa with a sculptural silhouette and premium foam." },
    ar: { name: "كنب بوكليه لاونج", description: "كنب بوكليه ناعم بتصميم منحني وفوم فاخر." },
  },
  {
    index: 5,
    slug: "compact-apartment-sofa",
    price_sar: 2800,
    stock: 16,
    is_featured: false,
    image_url: img("photo-1540574163026-643ea20ade25"),
    category_slug: "sofas",
    en: { name: "Compact Apartment Sofa", description: "Space-saving two-seat sofa for apartments, offices, and guest rooms." },
    ar: { name: "كنب شقق صغير", description: "كنب مقعدين موفر للمساحة للشقق والمكاتب وغرف الضيوف." },
  },
  {
    index: 6,
    slug: "majlis-low-sofa",
    price_sar: 7300,
    stock: 7,
    is_featured: true,
    image_url: img("photo-1618220179428-22790b461013"),
    category_slug: "sofas",
    en: { name: "Low Majlis Sofa", description: "Low-profile majlis sofa designed for traditional Saudi hospitality." },
    ar: { name: "كنب مجلس منخفض", description: "كنب مجلس منخفض مصمم للضيافة السعودية التقليدية." },
  },
  {
    index: 7,
    slug: "velvet-accent-sofa",
    price_sar: 3900,
    stock: 13,
    is_featured: false,
    image_url: img("photo-1567016376408-0226e4d0c1ea"),
    category_slug: "sofas",
    en: { name: "Velvet Accent Sofa", description: "Statement velvet sofa available in olive, sand, charcoal, and navy." },
    ar: { name: "كنب مخمل مميز", description: "كنب مخمل أنيق بألوان زيتوني ورملي وفحمي وكحلي." },
  },
  {
    index: 8,
    slug: "classic-rolled-arm-sofa",
    price_sar: 4700,
    stock: 11,
    is_featured: false,
    image_url: img("photo-1519961655809-34fa156820ff"),
    category_slug: "sofas",
    en: { name: "Classic Rolled-Arm Sofa", description: "Timeless rolled-arm sofa with firm support and elegant stitching." },
    ar: { name: "كنب كلاسيكي بأذرع مستديرة", description: "كنب كلاسيكي فاخر بدعم ثابت وخياطة أنيقة." },
  },
  {
    index: 9,
    slug: "recliner-sofa-set",
    price_sar: 7900,
    stock: 6,
    is_featured: false,
    image_url: img("photo-1600607687920-4e2a09cf159d"),
    category_slug: "sofas",
    en: { name: "Recliner Sofa Set", description: "Comfort recliner sofa set for family rooms and home cinema corners." },
    ar: { name: "طقم كنب استرخاء", description: "طقم كنب استرخاء لغرف العائلة وزوايا السينما المنزلية." },
  },
  {
    index: 10,
    slug: "custom-modular-sofa",
    price_sar: 9200,
    stock: 5,
    is_featured: true,
    image_url: img("photo-1618221195710-dd6b41faaea6"),
    category_slug: "sofas",
    en: { name: "Custom Modular Sofa", description: "Build-your-own modular sofa with configurable corners, lengths, and fabrics." },
    ar: { name: "كنب مودولار حسب الطلب", description: "كنب وحدات قابل للتخصيص بالزوايا والأطوال والأقمشة." },
  },
  {
    index: 11,
    slug: "foam-block-20cm",
    price_sar: 320,
    stock: 50,
    is_featured: true,
    image_url: img("photo-1618221118493-9cfa1a1c00da"),
    category_slug: "foam",
    en: { name: "Foam Block 20cm", description: "High-density foam block, 20cm thickness, cut to order." },
    ar: { name: "فوم ٢٠ سم", description: "كتلة فوم عالية الكثافة بسمك ٢٠ سم مع قص حسب الطلب." },
  },
  {
    index: 12,
    slug: "high-density-foam-sheet",
    price_sar: 260,
    stock: 60,
    is_featured: false,
    image_url: img("photo-1604147706283-d7119b5b822c"),
    category_slug: "foam",
    en: { name: "High-Density Foam Sheet", description: "Durable foam sheet for sofa seats, repairs, and upholstery projects." },
    ar: { name: "لوح فوم عالي الكثافة", description: "لوح فوم متين لمقاعد الكنب والصيانة والتنجيد." },
  },
  {
    index: 13,
    slug: "memory-foam-topper",
    price_sar: 480,
    stock: 32,
    is_featured: false,
    image_url: img("photo-1582582621959-48d27397dc69"),
    category_slug: "foam",
    en: { name: "Memory Foam Topper", description: "Pressure-relief foam topper for seating, daybeds, and majlis comfort." },
    ar: { name: "طبقة ميموري فوم", description: "طبقة فوم مريحة للمقاعد والأسرة النهارية والمجالس." },
  },
  {
    index: 14,
    slug: "firm-seat-foam-core",
    price_sar: 390,
    stock: 42,
    is_featured: false,
    image_url: img("photo-1598300042247-d088f8ab3a91"),
    category_slug: "foam",
    en: { name: "Firm Seat Foam Core", description: "Firm support foam core for long-lasting sofa seat structure." },
    ar: { name: "قلب فوم صلب للمقاعد", description: "قلب فوم صلب لدعم مقاعد الكنب لفترة طويلة." },
  },
  {
    index: 15,
    slug: "soft-back-cushion-foam",
    price_sar: 210,
    stock: 46,
    is_featured: false,
    image_url: img("photo-1615873968403-89e068629265"),
    category_slug: "foam",
    en: { name: "Soft Back Cushion Foam", description: "Soft foam for back pillows, cushions, and lounge seating." },
    ar: { name: "فوم ناعم لمخدات الظهر", description: "فوم ناعم لمخدات الظهر والوسائد وجلسات الاسترخاء." },
  },
  {
    index: 16,
    slug: "outdoor-foam-pad",
    price_sar: 340,
    stock: 28,
    is_featured: false,
    image_url: img("photo-1505693416388-ac5ce068fe85"),
    category_slug: "foam",
    en: { name: "Outdoor Foam Pad", description: "Quick-dry foam pad for patios, terraces, and outdoor majlis seating." },
    ar: { name: "فوم خارجي سريع الجفاف", description: "فوم سريع الجفاف للجلسات الخارجية والتراسات." },
  },
  {
    index: 17,
    slug: "foam-roll-upholstery",
    price_sar: 520,
    stock: 25,
    is_featured: true,
    image_url: img("photo-1620626011761-996317b8d101"),
    category_slug: "foam",
    en: { name: "Foam Roll for Upholstery", description: "Flexible foam roll for upholstery workshops and B2B orders." },
    ar: { name: "رول فوم للتنجيد", description: "رول فوم مرن للورش وطلبات الجملة." },
  },
  {
    index: 18,
    slug: "custom-cut-foam-kit",
    price_sar: 650,
    stock: 30,
    is_featured: false,
    image_url: img("photo-1586023492125-27b2c045efd7"),
    category_slug: "foam",
    en: { name: "Custom-Cut Foam Kit", description: "Made-to-measure foam kit for sofa restoration and cushion replacement." },
    ar: { name: "طقم فوم بقص مخصص", description: "طقم فوم بالمقاس لترميم الكنب وتبديل الوسائد." },
  },
  {
    index: 19,
    slug: "premium-latex-foam",
    price_sar: 780,
    stock: 18,
    is_featured: false,
    image_url: img("photo-1618220179428-22790b461013"),
    category_slug: "foam",
    en: { name: "Premium Latex Foam", description: "Resilient latex-blend foam with elevated bounce and comfort." },
    ar: { name: "فوم لاتكس فاخر", description: "فوم لاتكس مرن براحة وثبات أعلى." },
  },
  {
    index: 20,
    slug: "commercial-foam-bundle",
    price_sar: 1850,
    stock: 15,
    is_featured: false,
    image_url: img("photo-1540932239986-30128078f3c5"),
    category_slug: "foam",
    en: { name: "Commercial Foam Bundle", description: "Bulk foam bundle for decorators, contractors, and hotel projects." },
    ar: { name: "باقة فوم تجارية", description: "باقة فوم بالجملة للمصممين والمقاولين ومشاريع الفنادق." },
  },
  {
    index: 21,
    slug: "majlis-corner-set",
    price_sar: 8900,
    stock: 5,
    is_featured: true,
    image_url: img("photo-1600607687939-ce8a6c25118c"),
    category_slug: "majlis",
    en: { name: "Majlis Corner Set", description: "Complete majlis corner seating package with custom fabric options." },
    ar: { name: "مجلس زاوية كامل", description: "طقم مجلس زاوية متكامل مع خيارات قماش مخصصة." },
  },
  {
    index: 22,
    slug: "floor-majlis-seating",
    price_sar: 6200,
    stock: 8,
    is_featured: false,
    image_url: img("photo-1600210492486-724fe5c67fb0"),
    category_slug: "majlis",
    en: { name: "Floor Majlis Seating", description: "Low floor seating with plush cushions for traditional gatherings." },
    ar: { name: "جلسة مجلس أرضية", description: "جلسة أرضية منخفضة بوسائد مريحة للمناسبات التقليدية." },
  },
  {
    index: 23,
    slug: "arabic-wall-panel-set",
    price_sar: 2400,
    stock: 12,
    is_featured: false,
    image_url: img("photo-1618221195710-dd6b41faaea6"),
    category_slug: "majlis",
    en: { name: "Arabic Wall Panel Set", description: "Decorative wall panels that add warmth and structure to majlis rooms." },
    ar: { name: "طقم ألواح جدارية عربية", description: "ألواح جدارية زخرفية تضيف دفئاً وتنظيماً للمجلس." },
  },
  {
    index: 24,
    slug: "majlis-coffee-table",
    price_sar: 1250,
    stock: 20,
    is_featured: false,
    image_url: img("photo-1532372320572-cda25653a694"),
    category_slug: "majlis",
    en: { name: "Majlis Coffee Table", description: "Low coffee table designed for Saudi hospitality and easy serving." },
    ar: { name: "طاولة قهوة للمجلس", description: "طاولة منخفضة للضيافة السعودية وسهولة التقديم." },
  },
  {
    index: 25,
    slug: "heritage-majlis-package",
    price_sar: 11800,
    stock: 4,
    is_featured: true,
    image_url: img("photo-1616486338812-3dadae4b4ace"),
    category_slug: "majlis",
    en: { name: "Heritage Majlis Package", description: "Full-room heritage package with seating, pillows, table, and curtains." },
    ar: { name: "باقة مجلس تراثية", description: "باقة غرفة كاملة تشمل الجلسة والمخدات والطاولة والستائر." },
  },
  {
    index: 26,
    slug: "modern-majlis-package",
    price_sar: 13200,
    stock: 3,
    is_featured: false,
    image_url: img("photo-1615873968403-89e068629265"),
    category_slug: "majlis",
    en: { name: "Modern Majlis Package", description: "Contemporary majlis set with clean fabric palette and custom dimensions." },
    ar: { name: "باقة مجلس مودرن", description: "طقم مجلس عصري بألوان هادئة ومقاسات حسب الطلب." },
  },
  {
    index: 27,
    slug: "majlis-side-cushions",
    price_sar: 980,
    stock: 22,
    is_featured: false,
    image_url: img("photo-1618221118493-9cfa1a1c00da"),
    category_slug: "majlis",
    en: { name: "Majlis Side Cushions", description: "Long side cushions for wall seating and floor majlis arrangements." },
    ar: { name: "مساند مجلس جانبية", description: "مساند طويلة للجلسات الجدارية والمجالس الأرضية." },
  },
  {
    index: 28,
    slug: "majlis-rug-and-runner",
    price_sar: 1650,
    stock: 13,
    is_featured: false,
    image_url: img("photo-1505693416388-ac5ce068fe85"),
    category_slug: "majlis",
    en: { name: "Majlis Rug & Runner", description: "Coordinated rug and runner set for warm majlis styling." },
    ar: { name: "سجاد وممر مجلس", description: "طقم سجاد وممر متناسق لتنسيق مجلس دافئ." },
  },
  {
    index: 29,
    slug: "majlis-lighting-set",
    price_sar: 2100,
    stock: 10,
    is_featured: false,
    image_url: img("photo-1513506003901-1e6a229e2d15"),
    category_slug: "majlis",
    en: { name: "Majlis Lighting Set", description: "Warm lighting set with floor lamp and accent fixtures." },
    ar: { name: "طقم إضاءة مجلس", description: "إضاءة دافئة تشمل مصباح أرضي ولمسات جانبية." },
  },
  {
    index: 30,
    slug: "vip-majlis-design-service",
    price_sar: 3500,
    stock: 9,
    is_featured: false,
    image_url: img("photo-1618221195710-dd6b41faaea6"),
    category_slug: "majlis",
    en: { name: "VIP Majlis Design Service", description: "Consultation and layout plan for premium majlis rooms." },
    ar: { name: "خدمة تصميم مجلس VIP", description: "استشارة ومخطط توزيع للمجالس الفاخرة." },
  },
  {
    index: 31,
    slug: "linen-wave-curtains",
    price_sar: 890,
    stock: 24,
    is_featured: true,
    image_url: img("photo-1513694203232-719a280e022f"),
    category_slug: "curtains",
    en: { name: "Linen Wave Curtains", description: "Self-order wave curtains in beige, ivory, olive, or charcoal." },
    ar: { name: "ستائر كتان ويف", description: "ستائر ويف للطلب المباشر بألوان بيج وعاجي وزيتوني وفحمي." },
  },
  {
    index: 32,
    slug: "blackout-pleated-curtains",
    price_sar: 1150,
    stock: 18,
    is_featured: true,
    image_url: img("photo-1524758631624-e2822e304c36"),
    category_slug: "curtains",
    en: { name: "Blackout Pleated Curtains", description: "Thermal blackout curtains with pleated, eyelet, and track options." },
    ar: { name: "ستائر بلاك آوت بكسرات", description: "ستائر عازلة بخيارات كسرات وحلقات ومسارات." },
  },
  {
    index: 33,
    slug: "sheer-voile-curtains",
    price_sar: 590,
    stock: 30,
    is_featured: false,
    image_url: img("photo-1616046229478-9901c5536a45"),
    category_slug: "curtains",
    en: { name: "Sheer Voile Curtains", description: "Light-filtering sheer curtains for bright living rooms and layered looks." },
    ar: { name: "ستائر فوال شفافة", description: "ستائر شفافة تسمح بمرور الضوء لغرف المعيشة والتنسيق الطبقي." },
  },
  {
    index: 34,
    slug: "double-layer-curtain-set",
    price_sar: 1450,
    stock: 16,
    is_featured: false,
    image_url: img("photo-1617806118233-18e1de247200"),
    category_slug: "curtains",
    en: { name: "Double-Layer Curtain Set", description: "Sheer plus blackout curtain package with rails and measurement support." },
    ar: { name: "طقم ستائر طبقتين", description: "باقة شفافة وبلاك آوت مع مسارات ودعم المقاسات." },
  },
  {
    index: 35,
    slug: "wifi-smart-curtains",
    price_sar: 2450,
    stock: 12,
    is_featured: true,
    image_url: "/images/wifi-curtains/wifi-curtain-cream-ivory.jpg",
    category_slug: "curtains",
    en: {
      name: "WiFi Smart Curtains",
      description:
        "Motorized WiFi curtains with app control in six light colors: cream ivory, soft sand, pearl white, mist gray, soft sage, and blush pink.",
    },
    ar: {
      name: "ستائر واي فاي ذكية",
      description:
        "ستائر بمحرك وتحكم عبر التطبيق بستة ألوان فاتحة: عاجي كريمي، رملي ناعم، أبيض لؤلؤي، رمادي ضبابي، أخضر مريمي، ووردي خفيف.",
    },
  },
  {
    index: 36,
    slug: "kids-room-curtains",
    price_sar: 720,
    stock: 21,
    is_featured: false,
    image_url: img("photo-1560448075-bb485b067938"),
    category_slug: "curtains",
    en: { name: "Kids Room Curtains", description: "Soft washable curtains in playful colors and safe hardware options." },
    ar: { name: "ستائر غرف أطفال", description: "ستائر ناعمة قابلة للغسيل بألوان مرحة وخيارات آمنة." },
  },
  {
    index: 37,
    slug: "hotel-grade-curtains",
    price_sar: 1780,
    stock: 14,
    is_featured: false,
    image_url: img("photo-1505693416388-ac5ce068fe85"),
    category_slug: "curtains",
    en: { name: "Hotel-Grade Curtains", description: "Heavy-duty curtains for villas, hotels, and commercial projects." },
    ar: { name: "ستائر بجودة الفنادق", description: "ستائر قوية للفلل والفنادق والمشاريع التجارية." },
  },
  {
    index: 38,
    slug: "roman-shade-curtains",
    price_sar: 980,
    stock: 17,
    is_featured: false,
    image_url: img("photo-1616594039964-ae9021a400a0"),
    category_slug: "curtains",
    en: { name: "Roman Shade Curtains", description: "Tailored roman shades for windows, offices, and compact spaces." },
    ar: { name: "ستائر رومانية", description: "ستائر رومانية مفصلة للنوافذ والمكاتب والمساحات الصغيرة." },
  },
  {
    index: 39,
    slug: "velvet-drape-curtains",
    price_sar: 1550,
    stock: 12,
    is_featured: false,
    image_url: img("photo-1618221195710-dd6b41faaea6"),
    category_slug: "curtains",
    en: { name: "Velvet Drape Curtains", description: "Rich velvet drapes in warm tones for formal rooms and majlis spaces." },
    ar: { name: "ستائر مخمل ثقيلة", description: "ستائر مخمل فاخرة بألوان دافئة للمجالس والغرف الرسمية." },
  },
  {
    index: 40,
    slug: "curtain-measure-install-kit",
    price_sar: 350,
    stock: 40,
    is_featured: false,
    image_url: img("photo-1519710164239-da123dc03ef4"),
    category_slug: "curtains",
    en: { name: "Measure & Install Kit", description: "Self-order kit with measuring guide, rail options, hooks, and brackets." },
    ar: { name: "طقم القياس والتركيب", description: "طقم للطلب الذاتي يشمل دليل القياس والمسارات والخطافات والحاملات." },
  },
  {
    index: 41,
    slug: "sofa-cushion-set",
    price_sar: 260,
    stock: 40,
    is_featured: true,
    image_url: img("photo-1584100936595-c0654b55a2e2"),
    category_slug: "cushions",
    en: { name: "Sofa Cushion & Pillow Set", description: "Layered cushions and pillows in boucle, linen, velvet, and patterned fabrics." },
    ar: { name: "طقم مخدات ووسائد للكنب", description: "مخدات ووسائد متناسقة من البوكليه والكتان والمخمل والأقمشة المزخرفة." },
  },
  {
    index: 42,
    slug: "velvet-throw-pillows",
    price_sar: 180,
    stock: 55,
    is_featured: false,
    image_url: img("photo-1615874959474-d609969a20ed"),
    category_slug: "cushions",
    en: { name: "Velvet Throw Pillows", description: "Soft velvet pillows in jewel tones and neutrals for sofa styling." },
    ar: { name: "وسائد مخمل للديكور", description: "وسائد مخمل ناعمة بألوان فاخرة وحيادية لتنسيق الكنب." },
  },
  {
    index: 43,
    slug: "linen-cushion-pair",
    price_sar: 140,
    stock: 60,
    is_featured: false,
    image_url: img("photo-1513519245088-0e12902e5a38"),
    category_slug: "cushions",
    en: { name: "Linen Cushion Pair", description: "Breathable linen cushion pair in sand, ivory, mocha, and olive." },
    ar: { name: "زوج مخدات كتان", description: "زوج مخدات كتان بألوان رملي وعاجي وموكا وزيتوني." },
  },
  {
    index: 44,
    slug: "bolster-pillow-set",
    price_sar: 220,
    stock: 36,
    is_featured: false,
    image_url: img("photo-1555041469-a586c61ea9bc"),
    category_slug: "cushions",
    en: { name: "Bolster Pillow Set", description: "Long bolster pillows for majlis sides, sofas, and daybeds." },
    ar: { name: "طقم مخدات اسطوانية", description: "مخدات طويلة لمساند المجالس والكنب والأسرة النهارية." },
  },
  {
    index: 45,
    slug: "embroidered-arabic-pillows",
    price_sar: 320,
    stock: 28,
    is_featured: true,
    image_url: img("photo-1600210492486-724fe5c67fb0"),
    category_slug: "cushions",
    en: { name: "Embroidered Arabic Pillows", description: "Decorative pillows with Arabic-inspired embroidery and premium inserts." },
    ar: { name: "مخدات بتطريز عربي", description: "مخدات ديكور بتطريز مستوحى من الطابع العربي وحشوة فاخرة." },
  },
  {
    index: 46,
    slug: "outdoor-cushion-pack",
    price_sar: 290,
    stock: 34,
    is_featured: false,
    image_url: img("photo-1505693416388-ac5ce068fe85"),
    category_slug: "cushions",
    en: { name: "Outdoor Cushion Pack", description: "Weather-resistant cushion pack for patios and outdoor seating." },
    ar: { name: "باقة مخدات خارجية", description: "باقة مخدات مقاومة للعوامل الخارجية للجلسات الخارجية." },
  },
  {
    index: 47,
    slug: "floor-pouf-cushion",
    price_sar: 380,
    stock: 24,
    is_featured: false,
    image_url: img("photo-1618220179428-22790b461013"),
    category_slug: "cushions",
    en: { name: "Floor Pouf Cushion", description: "Large floor pouf cushion for casual seating and majlis corners." },
    ar: { name: "بوف أرضي كبير", description: "بوف أرضي كبير للجلسات غير الرسمية وزوايا المجلس." },
  },
  {
    index: 48,
    slug: "custom-fabric-pillow",
    price_sar: 240,
    stock: 42,
    is_featured: false,
    image_url: img("photo-1615873968403-89e068629265"),
    category_slug: "cushions",
    en: { name: "Custom Fabric Pillow", description: "Choose size, fabric, piping, and filling for a made-to-order pillow." },
    ar: { name: "مخدة قماش حسب الطلب", description: "اختر المقاس والقماش والحواف والحشوة لمخدة مخصصة." },
  },
  {
    index: 49,
    slug: "kids-cushion-set",
    price_sar: 190,
    stock: 38,
    is_featured: false,
    image_url: img("photo-1560448075-bb485b067938"),
    category_slug: "cushions",
    en: { name: "Kids Cushion Set", description: "Soft washable cushions for kids rooms and family lounges." },
    ar: { name: "طقم مخدات أطفال", description: "مخدات ناعمة قابلة للغسيل لغرف الأطفال والجلسات العائلية." },
  },
  {
    index: 50,
    slug: "premium-cushion-inserts",
    price_sar: 120,
    stock: 80,
    is_featured: false,
    image_url: img("photo-1618221118493-9cfa1a1c00da"),
    category_slug: "cushions",
    en: { name: "Premium Cushion Inserts", description: "Plush inserts in multiple sizes for cushion replacement and upgrades." },
    ar: { name: "حشوات مخدات فاخرة", description: "حشوات ناعمة بمقاسات متعددة لتبديل وترقية المخدات." },
  },
  {
    index: 51,
    slug: "sofa-care-accessories",
    price_sar: 180,
    stock: 35,
    is_featured: true,
    image_url: img("photo-1586023492125-27b2c045efd7"),
    category_slug: "accessories",
    en: { name: "Sofa Care Accessories", description: "Coordinated arm trays, fabric care kits, leg protectors, and styling accessories." },
    ar: { name: "إكسسوارات العناية بالكنب", description: "صواني ذراع الكنب وأدوات العناية بالقماش وحمايات الأرجل وإكسسوارات التنسيق." },
  },
  {
    index: 52,
    slug: "wooden-sofa-arm-tray",
    price_sar: 160,
    stock: 44,
    is_featured: false,
    image_url: img("photo-1532372320572-cda25653a694"),
    category_slug: "accessories",
    en: { name: "Wooden Sofa Arm Tray", description: "Slip-on wooden tray for drinks, remotes, and small accessories." },
    ar: { name: "صينية ذراع كنب خشبية", description: "صينية خشبية تثبت على ذراع الكنب للمشروبات والريموت والإكسسوارات." },
  },
  {
    index: 53,
    slug: "fabric-protection-spray",
    price_sar: 95,
    stock: 70,
    is_featured: false,
    image_url: img("photo-1583947215259-38e31be8751f"),
    category_slug: "accessories",
    en: { name: "Fabric Protection Spray", description: "Protective spray for upholstery fabrics against stains and daily wear." },
    ar: { name: "بخاخ حماية الأقمشة", description: "بخاخ يحمي أقمشة التنجيد من البقع والاستخدام اليومي." },
  },
  {
    index: 54,
    slug: "sofa-leg-protectors",
    price_sar: 65,
    stock: 90,
    is_featured: false,
    image_url: img("photo-1556228720-195a672e8a03"),
    category_slug: "accessories",
    en: { name: "Sofa Leg Protectors", description: "Floor-safe protectors for sofa legs and heavy living room furniture." },
    ar: { name: "حمايات أرجل الكنب", description: "حمايات آمنة للأرضيات لأرجل الكنب والأثاث الثقيل." },
  },
  {
    index: 55,
    slug: "decorative-throw-blanket",
    price_sar: 230,
    stock: 41,
    is_featured: true,
    image_url: img("photo-1519710164239-da123dc03ef4"),
    category_slug: "accessories",
    en: { name: "Decorative Throw Blanket", description: "Soft throw blanket for layered sofa styling and guest comfort." },
    ar: { name: "بطانية ديكور للكنب", description: "بطانية ناعمة لتنسيق الكنب وراحة الضيوف." },
  },
  {
    index: 56,
    slug: "ottoman-storage-box",
    price_sar: 520,
    stock: 20,
    is_featured: false,
    image_url: img("photo-1616486338812-3dadae4b4ace"),
    category_slug: "accessories",
    en: { name: "Ottoman Storage Box", description: "Compact ottoman with storage for blankets, remotes, and accessories." },
    ar: { name: "بوف تخزين", description: "بوف صغير مع مساحة تخزين للبطانيات والريموت والإكسسوارات." },
  },
  {
    index: 57,
    slug: "sofa-cleaning-kit",
    price_sar: 145,
    stock: 62,
    is_featured: false,
    image_url: img("photo-1620626011761-996317b8d101"),
    category_slug: "accessories",
    en: { name: "Sofa Cleaning Kit", description: "Gentle upholstery cleaner, brush, cloth, and care instructions." },
    ar: { name: "طقم تنظيف الكنب", description: "منظف لطيف للتنجيد مع فرشاة وقماش وتعليمات العناية." },
  },
  {
    index: 58,
    slug: "side-table-set",
    price_sar: 690,
    stock: 17,
    is_featured: false,
    image_url: img("photo-1513506003901-1e6a229e2d15"),
    category_slug: "accessories",
    en: { name: "Side Table Set", description: "Two-piece side table set for sofa corners and majlis service." },
    ar: { name: "طقم طاولات جانبية", description: "طقم طاولتين جانبيتين لزوايا الكنب وخدمة المجلس." },
  },
  {
    index: 59,
    slug: "accent-floor-lamp",
    price_sar: 820,
    stock: 14,
    is_featured: false,
    image_url: img("photo-1507473885765-e6ed057f782c"),
    category_slug: "accessories",
    en: { name: "Accent Floor Lamp", description: "Warm floor lamp that completes sofa corners and reading areas." },
    ar: { name: "مصباح أرضي ديكوري", description: "مصباح أرضي دافئ يكمل زوايا الكنب ومناطق القراءة." },
  },
  {
    index: 60,
    slug: "fabric-swatch-book",
    price_sar: 75,
    stock: 100,
    is_featured: false,
    image_url: img("photo-1604147706283-d7119b5b822c"),
    category_slug: "accessories",
    en: { name: "Fabric Swatch Book", description: "Curated fabric swatches for choosing sofa, curtain, and cushion colors." },
    ar: { name: "دفتر عينات الأقمشة", description: "عينات أقمشة مختارة لاختيار ألوان الكنب والستائر والمخدات." },
  },
];

function mockVariantsForSlug(
  slug: string,
  productId: string,
  locale: Locale,
): ProductVariant[] | undefined {
  const colorLabels: Record<string, { en: string; ar: string; price?: number }[]> = {
    "velvet-accent-sofa": [
      { en: "Olive", ar: "زيتوني" },
      { en: "Sand", ar: "رملي" },
      { en: "Charcoal", ar: "فحمي" },
      { en: "Navy", ar: "كحلي", price: 4100 },
    ],
    "linen-wave-curtains": [
      { en: "Beige", ar: "بيج" },
      { en: "Ivory", ar: "عاجي" },
      { en: "Olive", ar: "زيتوني" },
      { en: "Charcoal", ar: "فحمي", price: 920 },
    ],
    "wifi-smart-curtains": [
      { en: "Cream Ivory", ar: "عاجي كريمي" },
      { en: "Soft Sand", ar: "رملي ناعم" },
      { en: "Pearl White", ar: "أبيض لؤلؤي" },
      { en: "Mist Gray", ar: "رمادي ضبابي" },
      { en: "Soft Sage", ar: "أخضر مريمي" },
      { en: "Blush Pink", ar: "وردي خفيف" },
    ],
    "sofa-cushion-set": [
      { en: "Sand Boucle", ar: "بوكليه رملي" },
      { en: "Ivory Linen", ar: "كتان عاجي" },
      { en: "Olive Velvet", ar: "مخمل زيتوني" },
    ],
  };
  const colors = colorLabels[slug];
  if (!colors) return undefined;
  const wifiCurtainImages: Record<string, string> = {
    "cream-ivory": "/images/wifi-curtains/wifi-curtain-cream-ivory.jpg",
    "soft-sand": "/images/wifi-curtains/wifi-curtain-soft-sand.jpg",
    "pearl-white": "/images/wifi-curtains/wifi-curtain-pearl-white.jpg",
    "mist-gray": "/images/wifi-curtains/wifi-curtain-mist-gray.jpg",
    "soft-sage": "/images/wifi-curtains/wifi-curtain-soft-sage.jpg",
    "blush-pink": "/images/wifi-curtains/wifi-curtain-blush-pink.jpg",
  };
  return colors.map((c, i) => {
    const colorKey = c.en.toLowerCase().replace(/\s+/g, "-");
    return {
      id: `v-${slug}-${i}`,
      product_id: productId,
      sku: `${slug}-${colorKey}`,
      option_label: locale === "ar" ? c.ar : c.en,
      price_sar:
        c.price ??
        (slug === "linen-wave-curtains"
          ? 890
          : slug === "wifi-smart-curtains"
            ? 2450
            : slug === "velvet-accent-sofa"
              ? 3900
              : 180),
      compare_at_price_sar: null,
      stock: 8 + i,
      image_url:
        slug === "wifi-smart-curtains" ? (wifiCurtainImages[colorKey] ?? null) : null,
      attributes: { color: colorKey },
      is_active: true,
      sort_order: i,
    };
  });
}

function mockOptionGroupsForSlug(
  slug: string,
  productId: string,
  locale: Locale,
): ProductOptionGroup[] | undefined {
  const t = (en: string, ar: string) => (locale === "ar" ? ar : en);
  if (slug === "linen-wave-curtains" || slug === "blackout-pleated-curtains") {
    return [
      {
        id: `og-size-${slug}`,
        product_id: productId,
        group_key: "width",
        label: t("Width (cm)", "العرض (سم)"),
        selection_type: "single",
        is_required: false,
        affects_price: false,
        is_quote_only: true,
        sort_order: 0,
        values: [
          { id: "ov-w120", group_id: `og-size-${slug}`, value_key: "120", price_adjustment_sar: 0, label: "120", sort_order: 0 },
          { id: "ov-w150", group_id: `og-size-${slug}`, value_key: "150", price_adjustment_sar: 0, label: "150", sort_order: 1 },
          { id: "ov-w180", group_id: `og-size-${slug}`, value_key: "180", price_adjustment_sar: 0, label: "180", sort_order: 2 },
          { id: "ov-custom", group_id: `og-size-${slug}`, value_key: "custom", price_adjustment_sar: 0, label: t("Custom size", "مقاس خاص"), sort_order: 3 },
        ],
      },
      {
        id: `og-install-${slug}`,
        product_id: productId,
        group_key: "installation",
        label: t("Installation", "التركيب"),
        selection_type: "single",
        is_required: false,
        affects_price: true,
        is_quote_only: false,
        sort_order: 1,
        values: [
          { id: "ov-none", group_id: `og-install-${slug}`, value_key: "none", price_adjustment_sar: 0, label: t("No installation", "بدون تركيب"), sort_order: 0 },
          { id: "ov-std", group_id: `og-install-${slug}`, value_key: "standard", price_adjustment_sar: 150, label: t("Standard install", "تركيب عادي"), sort_order: 1 },
        ],
      },
    ];
  }
  if (slug === "foam-block-20cm") {
    return [
      {
        id: `og-thickness-${slug}`,
        product_id: productId,
        group_key: "thickness",
        label: t("Thickness", "السمك"),
        selection_type: "single",
        is_required: true,
        affects_price: true,
        is_quote_only: false,
        sort_order: 0,
        values: [
          { id: "ov-15", group_id: `og-thickness-${slug}`, value_key: "15", price_adjustment_sar: -40, label: "15 cm", sort_order: 0 },
          { id: "ov-20", group_id: `og-thickness-${slug}`, value_key: "20", price_adjustment_sar: 0, label: "20 cm", sort_order: 1 },
          { id: "ov-25", group_id: `og-thickness-${slug}`, value_key: "25", price_adjustment_sar: 60, label: "25 cm", sort_order: 2 },
        ],
      },
    ];
  }
  return undefined;
}

const toProduct = (
  locale: Locale,
  product: ProductDefinition,
): ProductWithTranslation => {
  const id = `b0000000-0000-4000-8000-${String(product.index).padStart(12, "0")}`;
  const variants = mockVariantsForSlug(product.slug, id, locale);
  const option_groups = mockOptionGroupsForSlug(product.slug, id, locale);
  return {
    id,
    slug: product.slug,
    price_sar: product.price_sar,
    stock: product.stock,
    is_featured: product.is_featured,
    is_active: true,
    image_url: product.image_url,
    category_slug: product.category_slug,
    name: product[locale].name,
    description: product[locale].description,
    variants,
    option_groups,
  };
};

const products: Record<Locale, ProductWithTranslation[]> = {
  en: productDefinitions.map((product) => toProduct("en", product)),
  ar: productDefinitions.map((product) => toProduct("ar", product)),
};

const categories: Record<Locale, CategoryWithTranslation[]> = {
  en: [
    {
      id: "a0000000-0000-4000-8000-000000000001",
      slug: "sofas",
      sort_order: 1,
      name: "Sofas",
      description: "Custom Saudi sofa sets in tailored sizes and fabrics.",
    },
    {
      id: "a0000000-0000-4000-8000-000000000002",
      slug: "foam",
      sort_order: 2,
      name: "Foam",
      description: "High-density foam blocks and comfort upgrades.",
    },
    {
      id: "a0000000-0000-4000-8000-000000000003",
      slug: "majlis",
      sort_order: 3,
      name: "Majlis Decor",
      description: "Seating, decor, and finishing for majlis rooms.",
    },
    {
      id: "a0000000-0000-4000-8000-000000000004",
      slug: "curtains",
      sort_order: 4,
      name: "Curtains",
      description:
        "Wave, pleated, blackout, sheer, and layered curtains in standard or custom sizes.",
    },
    {
      id: "a0000000-0000-4000-8000-000000000005",
      slug: "cushions",
      sort_order: 5,
      name: "Cushions & Pillows",
      description: "Sofa cushions, decorative pillows, and fabric accents.",
    },
    {
      id: "a0000000-0000-4000-8000-000000000006",
      slug: "accessories",
      sort_order: 6,
      name: "Accessories",
      description: "Sofa care, styling, and practical living room add-ons.",
    },
  ],
  ar: [
    {
      id: "a0000000-0000-4000-8000-000000000001",
      slug: "sofas",
      sort_order: 1,
      name: "كنب",
      description: "أطقم كنب سعودية حسب المقاس والقماش.",
    },
    {
      id: "a0000000-0000-4000-8000-000000000002",
      slug: "foam",
      sort_order: 2,
      name: "فوم",
      description: "فوم عالي الكثافة وترقيات للراحة.",
    },
    {
      id: "a0000000-0000-4000-8000-000000000003",
      slug: "majlis",
      sort_order: 3,
      name: "ديكور المجالس",
      description: "جلسات وديكور وتشطيبات للمجالس.",
    },
    {
      id: "a0000000-0000-4000-8000-000000000004",
      slug: "curtains",
      sort_order: 4,
      name: "ستائر",
      description:
        "ستائر ويف وبلاك آوت وشفافة وطبقات بمقاسات جاهزة أو مخصصة.",
    },
    {
      id: "a0000000-0000-4000-8000-000000000005",
      slug: "cushions",
      sort_order: 5,
      name: "مخدات ووسائد",
      description: "مخدات للكنب ووسائد ديكور ولمسات قماشية.",
    },
    {
      id: "a0000000-0000-4000-8000-000000000006",
      slug: "accessories",
      sort_order: 6,
      name: "إكسسوارات",
      description: "عناية وتنسيق وإضافات عملية لغرفة المعيشة.",
    },
  ],
};

const blogPosts: Record<Locale, BlogPostWithTranslation[]> = {
  en: [
    {
      id: "c0000000-0000-4000-8000-000000000001",
      slug: "majlis-layout-tips",
      title: "Majlis Layout Tips",
      excerpt: "How to plan your Saudi majlis space.",
      body: "Choose seating that matches your room dimensions and traffic flow.",
      image_url: "/images/gallery2.svg",
      published_at: new Date().toISOString(),
    },
  ],
  ar: [
    {
      id: "c0000000-0000-4000-8000-000000000001",
      slug: "majlis-layout-tips",
      title: "نصائح تخطيط المجلس",
      excerpt: "كيف تخطط لمساحة مجلسك السعودي.",
      body: "اختر الجلسات التي تناسب أبعاد الغرفة وحركة الضيوف.",
      image_url: "/images/gallery2.svg",
      published_at: new Date().toISOString(),
    },
  ],
};

export function getMockProducts(locale: Locale) {
  return products[locale];
}

export function getMockCategories(locale: Locale) {
  return categories[locale];
}

export function getMockProduct(locale: Locale, slug: string) {
  return products[locale].find((p) => p.slug === slug) ?? null;
}

export function getMockFeatured(locale: Locale) {
  return products[locale].filter((p) => p.is_featured);
}

export function getMockBlogPosts(locale: Locale) {
  return blogPosts[locale];
}

export function getMockBlogPost(locale: Locale, slug: string) {
  return blogPosts[locale].find((p) => p.slug === slug) ?? null;
}

export const loyaltySettings = {
  pointsPer100Sar: 1,
  redeemAt: 200,
  discountPercent: 10,
};
