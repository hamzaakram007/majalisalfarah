import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/products/ProductCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getFeaturedProducts } from "@/lib/data/products";
import { getBlogPosts } from "@/lib/data/blog";
import { brandImages } from "@/lib/seo/images";
import {
  faqJsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/seo/structured-data";
import { homeMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) return {};
  return homeMetadata(localeParam as Locale);
}

function CategoryIcon({ type }: { type: string }) {
  const common = "stroke-current";
  if (type === "foam") {
    return (
      <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" aria-hidden>
        <path className={common} strokeWidth="3" strokeLinejoin="round" d="M8 17 24 8l16 9-16 9-16-9Z" />
        <path className={common} strokeWidth="3" strokeLinejoin="round" d="M8 17v14l16 9 16-9V17" />
      </svg>
    );
  }
  if (type === "curtains") {
    return (
      <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" aria-hidden>
        <path className={common} strokeWidth="3" strokeLinecap="round" d="M9 9h30" />
        <path className={common} strokeWidth="3" strokeLinejoin="round" d="M14 10c6 8 1 21 7 29H10c5-9-1-22 4-29ZM30 10c6 8 1 21 7 29H26c5-9-1-22 4-29Z" />
      </svg>
    );
  }
  if (type === "decor" || type === "majlis") {
    return (
      <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" aria-hidden>
        <path className={common} strokeWidth="3" strokeLinejoin="round" d="M21 6h6l3 10 6 9-4 17H16l-4-17 6-9 3-10Z" />
      </svg>
    );
  }
  if (type === "custom") {
    return (
      <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" aria-hidden>
        <path className={common} strokeWidth="3" strokeLinejoin="round" d="M10 8h20l8 8v24H10V8Z" />
        <path className={common} strokeWidth="3" strokeLinecap="round" d="M18 24h12" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" aria-hidden>
      <path className={common} strokeWidth="3" strokeLinejoin="round" d="M10 25v-5a7 7 0 0 1 7-7h14a7 7 0 0 1 7 7v5" />
      <path className={common} strokeWidth="3" strokeLinejoin="round" d="M8 24h32a4 4 0 0 1 4 4v8H4v-8a4 4 0 0 1 4-4Z" />
    </svg>
  );
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = getDictionary(locale);
  const [featured, blogPosts] = await Promise.all([
    getFeaturedProducts(locale),
    getBlogPosts(locale),
  ]);
  const base = `/${locale}`;
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "966570169672";

  const categoryTiles = [
    { key: "sofas", label: dict.categories.sofas, sub: locale === "ar" ? "كنب" : "Sofas", href: `${base}/products#sofas`, image: brandImages.hero },
    { key: "foam", label: dict.categories.foam, sub: locale === "ar" ? "فوم" : "Foam", href: `${base}/products#foam`, image: brandImages.foam },
    { key: "majlis", label: dict.categories.decor, sub: locale === "ar" ? "مجالس" : "Majlis", href: `${base}/products#majlis`, image: brandImages.majlis },
    { key: "curtains", label: dict.categories.curtains, sub: locale === "ar" ? "ستائر" : "Curtains", href: `${base}/products#curtains`, image: brandImages.curtains },
    { key: "custom", label: dict.categories.custom, sub: locale === "ar" ? "مخصص" : "Custom", href: `${base}/customizer`, image: brandImages.customSofa },
  ];

  const trustItems = [
    { title: dict.trust.years, desc: dict.trust.yearsDesc },
    { title: dict.trust.delivery, desc: dict.trust.deliveryDesc },
    { title: dict.trust.custom, desc: dict.trust.customDesc },
    { title: dict.trust.payments, desc: dict.trust.paymentsDesc },
  ];

  const faqs =
    locale === "ar"
      ? [
          { question: "هل يمكن طلب ستائر بمقاسات وألوان خاصة؟", answer: "نعم، نوفر طلب مباشر بالمقاسات الجاهزة أو تفصيل حسب قياساتك مع اختيار نوع الستارة واللون." },
          { question: "هل تصنعون كنب ومجالس حسب الطلب؟", answer: "نعم، نصمم الكنب والمجالس حسب المقاس والقماش ونوع الفوم مع خدمة استشارة." },
          { question: "ما طرق الدفع المتاحة؟", answer: "الدفع عبر مويسر يدعم مدى وآبل باي والبطاقات." },
        ]
      : [
          { question: "Can I order curtains in custom sizes and colors?", answer: "Yes. Choose self-order standard sizes or send measurements for wave, pleated, blackout, sheer, or layered curtains." },
          { question: "Do you build custom sofas and majlis seating?", answer: "Yes. We tailor sofas and majlis packages to your dimensions, fabric, and comfort preferences." },
          { question: "Which payment methods are supported?", answer: "Checkout supports Mada, Apple Pay, and cards through Moyasar." },
        ];

  const testimonials =
    locale === "ar"
      ? [
          { quote: "ستائر ويف رائعة وجودة التركيب ممتازة.", name: "نورة — ينبع" },
          { quote: "طقم كنب المجلس تجاوز توقعاتنا من حيث الراحة.", name: "فهد — جدة" },
        ]
      : [
          { quote: "Beautiful wave curtains and professional installation guidance.", name: "Noura — Yanbu" },
          { quote: "Our majlis sofa set exceeded expectations for comfort.", name: "Fahad — Jeddah" },
        ];

  return (
    <>
      <JsonLd
        data={[organizationJsonLd(locale), websiteJsonLd(locale), faqJsonLd(faqs)]}
      />

      <section className="relative overflow-hidden border-b border-stone-200 bg-[#f4eee4]">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-[1fr_1.05fr] md:py-20">
          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-600">
              {dict.hero.eyebrow}
            </p>
            <h1 className="mt-5 text-4xl font-black leading-[0.95] tracking-tight text-stone-950 md:text-6xl lg:text-7xl">
              {dict.hero.title}
              <span className="mt-2 block text-3xl md:text-5xl" dir="rtl">
                {dict.hero.arabicTitle}
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-stone-700">
              {dict.hero.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`${base}/products`}
                className="rounded-full bg-stone-950 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-stone-900/20 hover:bg-stone-800"
              >
                {dict.hero.cta}
              </Link>
              <Link
                href={`${base}/customizer`}
                className="rounded-full border-2 border-stone-950 px-7 py-3.5 text-sm font-semibold text-stone-950 hover:bg-stone-950 hover:text-white"
              >
                {dict.hero.customCta}
              </Link>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {trustItems.slice(0, 2).map((t) => (
                <div
                  key={t.title}
                  className="rounded-2xl bg-white/70 px-4 py-3 ring-1 ring-stone-200/80"
                >
                  <p className="text-sm font-black">{t.title}</p>
                  <p className="text-xs text-stone-600">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative min-h-[380px] overflow-hidden rounded-[2rem] shadow-2xl shadow-stone-900/15 ring-1 ring-stone-900/10 md:min-h-[520px]">
            <Image
              src={brandImages.hero}
              alt={
                locale === "ar"
                  ? "كنب وغرفة معيشة فاخرة — مجالس الفرح"
                  : "Luxury living room sofa — Majalis Alfarah"
              }
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/50 via-transparent to-transparent" />
            <p className="absolute bottom-6 start-6 end-6 text-sm font-medium text-white/95">
              {locale === "ar"
                ? "صور احترافية لمنتجات حقيقية — كنب، ستائر، فوم، ومخدات"
                : "Showroom-quality photography for sofas, curtains, foam & cushions"}
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-stone-200 bg-[#fffaf1] py-6">
        <div className="mx-auto flex max-w-6xl gap-3 overflow-x-auto px-4 pb-2 md:grid md:grid-cols-4 md:overflow-visible">
          {trustItems.map((t) => (
            <div
              key={t.title}
              className="min-w-[200px] shrink-0 rounded-2xl bg-[#f4eee4] px-4 py-4 md:min-w-0"
            >
              <p className="font-black text-stone-950">{t.title}</p>
              <p className="mt-1 text-xs leading-5 text-stone-600">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#fffaf1] py-10 md:py-14">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-2xl font-black md:text-3xl">
            {dict.categories.title}
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {categoryTiles.map((tile) => (
              <Link
                key={tile.key}
                href={tile.href}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] bg-[#ead8c3]">
                  <Image
                    src={tile.image}
                    alt={tile.label}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="240px"
                  />
                </div>
                <div className="flex flex-col items-center p-4 text-center">
                  <CategoryIcon type={tile.key === "majlis" ? "decor" : tile.key} />
                  <h3 className="mt-3 font-black">{tile.label}</h3>
                  <p className="text-xs font-semibold text-stone-500" dir="rtl">
                    {tile.sub}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f4eee4] py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-black leading-tight text-emerald-950 md:text-4xl">
              {locale === "ar" ? "أكثر من 30 عاماً من الجودة" : "Over 30 Years of Quality"}
            </h2>
            <p className="mt-6 leading-7 text-stone-700">
              {dict.home.whyUs}. {dict.home.seoBlockBody.slice(0, 180)}…
            </p>
            <Link
              href={`${base}/location`}
              className="mt-6 inline-block text-sm font-semibold underline decoration-stone-400"
            >
              {dict.location.title}
            </Link>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
            <Image
              src={brandImages.foam}
              alt={dict.categories.foam}
              fill
              className="object-cover"
              sizes="50vw"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#fffaf1] py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2">
          <div className="relative order-2 aspect-[4/3] overflow-hidden rounded-2xl shadow-lg md:order-1">
            <Image
              src={brandImages.curtains}
              alt={dict.categories.curtains}
              fill
              className="object-cover"
              sizes="50vw"
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-black md:text-4xl">
              {locale === "ar" ? "ستائر حسب ذوقك" : "Curtains Made First-Class"}
            </h2>
            <p className="mt-5 leading-7 text-stone-700">
              {dict.categories.selfOrder}. {dict.categories.customOrder}.
            </p>
            <Link
              href={`${base}/customizer`}
              className="mt-7 inline-block rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold text-white"
            >
              {dict.categories.customOrder}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl font-black">{dict.home.bestSellers}</h2>
          <Link href={`${base}/products`} className="text-sm font-semibold underline">
            {dict.products.title}
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.slice(0, 6).map((p) => (
            <ProductCard key={p.id} product={p} locale={locale} dict={dict} />
          ))}
        </div>
      </section>

      <section className="bg-stone-950 py-16 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-black">{dict.home.testimonials}</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {testimonials.map((t) => (
              <blockquote
                key={t.name}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <p className="leading-7 text-stone-200">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-4 text-sm font-semibold text-[#c9b79f]">
                  {t.name}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fffaf1] py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src={brandImages.cushions}
              alt={dict.categories.cushions}
              fill
              className="object-cover"
              sizes="50vw"
            />
          </div>
          <div>
            <h2 className="text-3xl font-black">{dict.customSection.title}</h2>
            <p className="mt-4 leading-7 text-stone-700">{dict.customSection.body}</p>
            <Link
              href={`${base}/customizer`}
              className="mt-6 inline-block rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold text-white"
            >
              {dict.nav.customizer}
            </Link>
          </div>
        </div>
      </section>

      {blogPosts[0] && (
        <section className="border-t border-stone-200 bg-[#f4eee4] py-12">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-4">
            <div>
              <h2 className="text-xl font-black">{dict.blog.title}</h2>
              <p className="mt-2 max-w-lg text-stone-600">{blogPosts[0].excerpt}</p>
            </div>
            <Link
              href={`${base}/blog/${blogPosts[0].slug}`}
              className="rounded-full border border-stone-950 px-5 py-2 text-sm font-semibold"
            >
              {dict.blog.readMore}
            </Link>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-black">{dict.home.seoBlockTitle}</h2>
        <p className="mt-4 max-w-3xl leading-8 text-stone-700">{dict.home.seoBlockBody}</p>
        <h3 className="mt-10 text-xl font-black">{dict.home.faqTitle}</h3>
        <dl className="mt-6 grid gap-4 md:grid-cols-3">
          {faqs.map((f) => (
            <div key={f.question} className="rounded-2xl bg-[#fffaf1] p-5 ring-1 ring-stone-200">
              <dt className="font-bold text-stone-950">{f.question}</dt>
              <dd className="mt-2 text-sm leading-6 text-stone-600">{f.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="border-t border-stone-200 bg-stone-950 py-14 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 text-center md:flex-row md:justify-between md:text-start">
          <div>
            <h2 className="text-2xl font-black">{dict.home.showroom}</h2>
            <p className="mt-2 text-stone-300">{dict.location.address}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={`https://wa.me/${wa}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold hover:bg-emerald-500"
            >
              WhatsApp
            </a>
            <Link
              href={`${base}/callback`}
              className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold hover:bg-white/10"
            >
              {dict.callback.title}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
