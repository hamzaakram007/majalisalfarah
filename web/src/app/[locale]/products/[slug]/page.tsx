import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductPurchasePanel } from "@/components/products/ProductPurchasePanel";
import { ProductViewTracker } from "@/components/analytics/ProductViewTracker";
import { TrackedWhatsAppLink } from "@/components/analytics/TrackedWhatsAppLink";
import { ProductCard } from "@/components/products/ProductCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getProduct, getRelatedProducts } from "@/lib/data/products";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  breadcrumbJsonLd,
  productJsonLd,
} from "@/lib/seo/structured-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeParam, slug } = await params;
  if (!isLocale(localeParam)) return {};
  const locale = localeParam as Locale;
  const product = await getProduct(locale, slug);
  if (!product) return {};
  return buildPageMetadata({
    locale,
    title: product.name,
    description: product.description ?? undefined,
    path: `products/${slug}`,
    image: product.image_url,
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeParam, slug } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = getDictionary(locale);
  const product = await getProduct(locale, slug);
  if (!product) notFound();
  const related = await getRelatedProducts(locale, slug);
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "966570169672";
  const waText = encodeURIComponent(
    `${locale === "ar" ? "استفسار عن" : "Inquiry about"}: ${product.name}`,
  );

  return (
    <div className="bg-[#f4eee4]">
      <ProductViewTracker
        product={{
          id: product.id,
          slug: product.slug,
          name: product.name,
          price_sar: product.price_sar,
          category_slug: product.category_slug,
        }}
        locale={locale}
      />
      <JsonLd
        data={[
          productJsonLd(product, locale),
          breadcrumbJsonLd(
            [
              { name: dict.nav.home, path: "" },
              { name: dict.products.title, path: "products" },
              { name: product.name, path: `products/${slug}` },
            ],
            locale,
          ),
        ]}
      />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-[#ead8c3] shadow-xl shadow-stone-900/10">
          <Image
            src={product.image_url ?? "/images/sofa-sample.svg"}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
        <div className="rounded-[2rem] bg-[#fffaf1] p-8 shadow-sm ring-1 ring-stone-200">
          {product.category_slug && (
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
              {product.category_slug}
            </p>
          )}
          <h1 className="mt-3 text-4xl font-black tracking-tight">{product.name}</h1>
          <p className="mt-4 leading-7 text-stone-700">{product.description}</p>

          <div className="mt-5 rounded-2xl bg-[#f4eee4] p-4 text-sm leading-6 text-stone-700">
            <p className="font-semibold">{dict.product.specs}</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>{dict.product.deliveryNote}</li>
              {product.category_slug === "curtains" && (
                <li>
                  {dict.categories.selfOrder}. {dict.categories.customOrder}.
                </li>
              )}
            </ul>
          </div>

          <div className="mt-6">
            <ProductPurchasePanel
              product={product}
              dict={dict}
              locale={locale}
            />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <TrackedWhatsAppLink
              href={`https://wa.me/${wa}?text=${waText}`}
              source="product_page"
              locale={locale}
              className="rounded-full border border-emerald-700 px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
            >
              {dict.product.whatsappQuote}
            </TrackedWhatsAppLink>
            <Link
              href={`/${locale}/customizer`}
              className="rounded-full border border-stone-950 px-4 py-2 text-sm font-semibold text-stone-950 hover:bg-stone-950 hover:text-white"
            >
              {dict.hero.customCta}
            </Link>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <h2 className="text-2xl font-black">{dict.product.related}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} dict={dict} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
