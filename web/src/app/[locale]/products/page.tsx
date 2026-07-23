import { notFound } from "next/navigation";
import { ProductCard } from "@/components/products/ProductCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getCategories, getProducts } from "@/lib/data/products";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/structured-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) return {};
  const locale = localeParam as Locale;
  const title =
    locale === "ar"
      ? "منتجات الكنب والستائر والفوم والمخدات"
      : "Sofas, Curtains, Foam & Accessories";
  const description =
    locale === "ar"
      ? "تصفح أكثر من 60 منتجاً: كنب، مجالس، ستائر، فوم، مخدات، وإكسسوارات مع طلب مباشر أو تفصيل حسب المقاس."
      : "Browse 60+ products: sofas, majlis, curtains, foam, cushions, and accessories with self-order or custom sizing.";
  return buildPageMetadata({ locale, title, description, path: "products" });
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = getDictionary(locale);
  const [products, categories] = await Promise.all([
    getProducts(locale),
    getCategories(locale),
  ]);

  return (
    <div className="bg-[#f4eee4]">
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: dict.nav.home, path: "" },
            { name: dict.products.title, path: "products" },
          ],
          locale,
        )}
      />
      <section className="mx-auto max-w-6xl px-4 py-12">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-stone-600">
          {dict.categories.title}
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
          {dict.products.title}
        </h1>
        <p className="mt-3 max-w-2xl text-stone-600">
          {locale === "ar"
            ? `${products.length} منتجاً في ${categories.length} فئات`
            : `${products.length} products across ${categories.length} categories`}
        </p>

        <nav
          className="mt-8 flex gap-2 overflow-x-auto pb-2"
          aria-label={locale === "ar" ? "فلاتر الفئات" : "Category filters"}
        >
          {categories.map((category) => (
            <a
              key={category.id}
              href={`#${category.slug}`}
              className="shrink-0 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-800 hover:bg-stone-950 hover:text-white"
            >
              {category.name}
            </a>
          ))}
        </nav>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <a
              key={category.id}
              href={`#${category.slug}`}
              className="rounded-2xl bg-[#fffaf1] p-5 shadow-sm ring-1 ring-stone-200 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <h2 className="text-xl font-black">{category.name}</h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                {category.description}
              </p>
              <p className="mt-3 text-xs font-semibold text-stone-500">
                {products.filter((p) => p.category_slug === category.slug).length}{" "}
                {locale === "ar" ? "منتج" : "items"}
              </p>
              {category.slug === "curtains" && (
                <p className="mt-4 inline-block rounded-full bg-stone-950 px-3 py-1 text-xs font-semibold text-white">
                  {dict.categories.selfOrder}
                </p>
              )}
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-14 px-4 pb-16">
        {categories.map((category) => {
          const categoryProducts = products.filter(
            (product) => product.category_slug === category.slug,
          );
          if (!categoryProducts.length) {
            return (
              <div key={category.id} id={category.slug} className="scroll-mt-24">
                <h2 className="text-2xl font-black">{category.name}</h2>
                <p className="mt-2 text-stone-500">
                  {locale === "ar" ? "لا توجد منتجات حالياً." : "No products yet."}
                </p>
              </div>
            );
          }

          return (
            <div key={category.id} id={category.slug} className="scroll-mt-24">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black">{category.name}</h2>
                  <p className="mt-1 text-sm text-stone-600">
                    {category.description}
                  </p>
                </div>
                {category.slug === "curtains" && (
                  <span className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700">
                    Wave · Pleated · Blackout · Sheer
                  </span>
                )}
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {categoryProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    locale={locale}
                    dict={dict}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
