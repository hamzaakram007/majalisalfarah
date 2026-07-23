import type { Locale } from "@/lib/i18n/config";

export type PolicySlug =
  | "shipping"
  | "returns"
  | "warranty"
  | "privacy"
  | "terms"
  | "payments";

type PolicySection = {
  heading: string;
  body: string;
};

type PolicyPage = {
  slug: PolicySlug;
  title: string;
  description: string;
  sections: PolicySection[];
};

export const policySlugs: PolicySlug[] = [
  "shipping",
  "returns",
  "warranty",
  "privacy",
  "terms",
  "payments",
];

const en: Record<PolicySlug, PolicyPage> = {
  shipping: {
    slug: "shipping",
    title: "Shipping & Delivery",
    description:
      "Delivery expectations for sofas, curtains, foam, cushions, accessories, and custom orders in Saudi Arabia.",
    sections: [
      {
        heading: "Delivery coverage",
        body: "We serve Yanbu through our showroom and arrange delivery to other Saudi cities where logistics partners are available. Delivery timelines depend on product availability, city, and whether the order is ready-made or custom.",
      },
      {
        heading: "Estimated timelines",
        body: "Ready products usually dispatch faster. Custom sofas, curtains, majlis seating, and made-to-measure items may require 2-4 weeks after measurements, material confirmation, and deposit/payment confirmation.",
      },
      {
        heading: "Receiving your order",
        body: "Customers should inspect products on delivery and report visible damage or missing items immediately through WhatsApp or customer support.",
      },
    ],
  },
  returns: {
    slug: "returns",
    title: "Returns & Refunds",
    description:
      "Return rules for ready products and custom-made furniture orders.",
    sections: [
      {
        heading: "Ready-made products",
        body: "Unused ready-made items may be eligible for return after review if they are in original condition and packaging. Delivery or handling fees may not be refundable once service has been completed.",
      },
      {
        heading: "Custom-made products",
        body: "Custom sofas, curtains, majlis sets, cut foam, and made-to-measure items are produced for the customer's specifications, so they are not normally returnable unless there is a confirmed manufacturing defect.",
      },
      {
        heading: "Refund process",
        body: "Approved refunds are returned through the original payment method or agreed channel after inspection and confirmation.",
      },
    ],
  },
  warranty: {
    slug: "warranty",
    title: "Warranty",
    description:
      "Warranty coverage for manufacturing defects and custom furniture workmanship.",
    sections: [
      {
        heading: "Coverage",
        body: "Warranty applies to confirmed manufacturing or workmanship defects. Coverage depends on the product type, material, and usage conditions.",
      },
      {
        heading: "What is not covered",
        body: "Normal wear, misuse, water damage, burns, stains, incorrect installation by third parties, and changes caused by improper cleaning are not covered.",
      },
      {
        heading: "Support",
        body: "Send your order number, photos, and a short description through WhatsApp so our team can review the case quickly.",
      },
    ],
  },
  privacy: {
    slug: "privacy",
    title: "Privacy Policy",
    description:
      "How Majalis Alfarah handles customer contact, order, analytics, and quote request data.",
    sections: [
      {
        heading: "Information we collect",
        body: "We collect information needed to process orders and quote requests, including name, phone, email, city, address, order details, and custom measurements or notes.",
      },
      {
        heading: "How we use information",
        body: "We use customer information to process orders, arrange delivery, provide quotes, send support messages, improve the website, and measure advertising performance when tracking is enabled.",
      },
      {
        heading: "Third-party services",
        body: "Payments, analytics, advertising pixels, email, WhatsApp, and delivery services may process limited data needed to provide their services. Tracking scripts stay disabled until configured for production.",
      },
    ],
  },
  terms: {
    slug: "terms",
    title: "Terms & Conditions",
    description:
      "General terms for using the website, placing orders, and requesting custom products.",
    sections: [
      {
        heading: "Orders",
        body: "Orders are subject to product availability, payment confirmation, and acceptance by Majalis Alfarah. We may contact customers to confirm details before production or delivery.",
      },
      {
        heading: "Custom orders",
        body: "Custom orders require accurate measurements and confirmed materials. Changes after production starts may affect price and timeline.",
      },
      {
        heading: "Prices and availability",
        body: "Prices, offers, images, colors, and stock may change. We work to keep product information accurate, but actual fabric colors can vary slightly by screen and lighting.",
      },
    ],
  },
  payments: {
    slug: "payments",
    title: "Payment Methods",
    description:
      "Suitable payment methods for Saudi customers and custom furniture orders.",
    sections: [
      {
        heading: "Online checkout",
        body: "The recommended Saudi checkout setup is Mada, Apple Pay, Visa, Mastercard, and STC Pay where supported by the payment provider.",
      },
      {
        heading: "Installments",
        body: "For higher-value furniture orders, Tabby or Tamara can be added later if approved and supported for the business account.",
      },
      {
        heading: "Custom order deposits",
        body: "For custom sofas, curtains, and majlis projects, the team may request a deposit or payment link after quote approval before production starts.",
      },
    ],
  },
};

const ar: Record<PolicySlug, PolicyPage> = {
  shipping: {
    slug: "shipping",
    title: "الشحن والتوصيل",
    description: "توقعات التوصيل للكنب والستائر والفوم والمخدات والطلبات الخاصة داخل السعودية.",
    sections: [
      {
        heading: "نطاق التوصيل",
        body: "نخدم مدينة ينبع من خلال معرضنا ونرتب التوصيل إلى مدن سعودية أخرى حسب توفر شركاء الشحن. تعتمد مدة التوصيل على توفر المنتج والمدينة ونوع الطلب.",
      },
      {
        heading: "المدة المتوقعة",
        body: "المنتجات الجاهزة عادة تشحن أسرع. أما الكنب والستائر والمجالس حسب الطلب فقد تحتاج من 2 إلى 4 أسابيع بعد تأكيد القياسات والخامات والدفع أو العربون.",
      },
      {
        heading: "استلام الطلب",
        body: "يرجى فحص المنتج عند الاستلام وإبلاغنا فوراً عبر واتساب في حال وجود تلف واضح أو نقص في الطلب.",
      },
    ],
  },
  returns: {
    slug: "returns",
    title: "الاسترجاع والاسترداد",
    description: "سياسة الاسترجاع للمنتجات الجاهزة والطلبات المصنعة حسب الطلب.",
    sections: [
      {
        heading: "المنتجات الجاهزة",
        body: "قد تكون المنتجات الجاهزة غير المستخدمة قابلة للاسترجاع بعد المراجعة إذا كانت بحالتها الأصلية. قد لا تكون رسوم التوصيل أو الخدمة قابلة للاسترداد بعد تنفيذها.",
      },
      {
        heading: "الطلبات المخصصة",
        body: "الكنب والستائر والمجالس والفوم المقصوص حسب المقاس يتم تصنيعها بناءً على طلب العميل، لذلك لا تقبل عادة للاسترجاع إلا في حال وجود عيب تصنيع مؤكد.",
      },
      {
        heading: "طريقة الاسترداد",
        body: "تتم عمليات الاسترداد المعتمدة عبر وسيلة الدفع الأصلية أو القناة المتفق عليها بعد الفحص والتأكيد.",
      },
    ],
  },
  warranty: {
    slug: "warranty",
    title: "الضمان",
    description: "تغطية الضمان لعيوب التصنيع وجودة تنفيذ الأثاث المخصص.",
    sections: [
      {
        heading: "التغطية",
        body: "يشمل الضمان عيوب التصنيع أو التنفيذ المؤكدة، وتختلف التغطية حسب نوع المنتج والخامة وطريقة الاستخدام.",
      },
      {
        heading: "ما لا يشمله الضمان",
        body: "لا يشمل الضمان الاستهلاك الطبيعي أو سوء الاستخدام أو أضرار الماء أو الحروق أو البقع أو التركيب غير الصحيح من طرف ثالث أو التنظيف الخاطئ.",
      },
      {
        heading: "الدعم",
        body: "أرسل رقم الطلب والصور ووصف المشكلة عبر واتساب ليتمكن فريقنا من مراجعة الحالة بسرعة.",
      },
    ],
  },
  privacy: {
    slug: "privacy",
    title: "سياسة الخصوصية",
    description: "كيف نتعامل مع بيانات التواصل والطلبات والتحليلات وطلبات عروض الأسعار.",
    sections: [
      {
        heading: "المعلومات التي نجمعها",
        body: "نجمع المعلومات اللازمة لتنفيذ الطلبات وطلبات عروض الأسعار مثل الاسم والجوال والبريد والمدينة والعنوان وتفاصيل الطلب والقياسات أو الملاحظات.",
      },
      {
        heading: "استخدام المعلومات",
        body: "نستخدم بيانات العميل لمعالجة الطلبات وترتيب التوصيل وتقديم عروض الأسعار وإرسال رسائل الدعم وتحسين الموقع وقياس أداء الإعلانات عند تفعيل التتبع.",
      },
      {
        heading: "الخدمات الخارجية",
        body: "قد تعالج خدمات الدفع والتحليلات والإعلانات والبريد وواتساب والتوصيل بيانات محدودة لازمة لتقديم الخدمة. تبقى سكربتات التتبع غير مفعلة حتى إعدادها للإنتاج.",
      },
    ],
  },
  terms: {
    slug: "terms",
    title: "الشروط والأحكام",
    description: "الشروط العامة لاستخدام الموقع وتنفيذ الطلبات والمنتجات المخصصة.",
    sections: [
      {
        heading: "الطلبات",
        body: "تخضع الطلبات لتوفر المنتج وتأكيد الدفع وقبول مجالس الفرح. قد نتواصل مع العميل لتأكيد التفاصيل قبل الإنتاج أو التوصيل.",
      },
      {
        heading: "الطلبات المخصصة",
        body: "تحتاج الطلبات المخصصة إلى قياسات دقيقة وخامات مؤكدة. أي تعديل بعد بدء التصنيع قد يؤثر على السعر والمدة.",
      },
      {
        heading: "الأسعار والتوفر",
        body: "قد تتغير الأسعار والعروض والصور والألوان والمخزون. نحرص على دقة المعلومات، لكن ألوان الأقمشة قد تختلف قليلاً حسب الشاشة والإضاءة.",
      },
    ],
  },
  payments: {
    slug: "payments",
    title: "طرق الدفع",
    description: "طرق الدفع المناسبة للعملاء في السعودية وطلبات الأثاث المخصصة.",
    sections: [
      {
        heading: "الدفع الإلكتروني",
        body: "الإعداد الأنسب للسعودية هو مدى وآبل باي وفيزا وماستركارد وSTC Pay عند توفرها من مزود الدفع.",
      },
      {
        heading: "التقسيط",
        body: "للطلبات ذات القيمة العالية يمكن إضافة تابي أو تمارا لاحقاً بعد الموافقة وتوفرها لحساب النشاط التجاري.",
      },
      {
        heading: "عربون الطلبات المخصصة",
        body: "بالنسبة للكنب والستائر والمجالس حسب الطلب قد يطلب الفريق عربوناً أو رابط دفع بعد اعتماد عرض السعر وقبل بدء التصنيع.",
      },
    ],
  },
};

const policies = { en, ar };

export function getPolicy(locale: Locale, slug: string) {
  if (!policySlugs.includes(slug as PolicySlug)) return null;
  return policies[locale][slug as PolicySlug];
}

export function getPolicies(locale: Locale) {
  return policySlugs.map((slug) => policies[locale][slug]);
}
