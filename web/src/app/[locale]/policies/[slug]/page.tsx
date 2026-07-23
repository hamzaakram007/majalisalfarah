import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getPolicies, getPolicy, policySlugs } from "@/lib/policies";

export function generateStaticParams() {
  return ["en", "ar"].flatMap((locale) =>
    policySlugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeParam, slug } = await params;
  if (!isLocale(localeParam)) return {};
  const locale = localeParam as Locale;
  const policy = getPolicy(locale, slug);
  if (!policy) return {};

  return buildPageMetadata({
    locale,
    title: policy.title,
    description: policy.description,
    path: `policies/${slug}`,
  });
}

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeParam, slug } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = getDictionary(locale);
  const policy = getPolicy(locale, slug);
  if (!policy) notFound();
  const allPolicies = getPolicies(locale);

  return (
    <div className="bg-[#f4eee4]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[0.7fr_1.3fr]">
        <aside className="rounded-[2rem] bg-stone-950 p-6 text-white lg:sticky lg:top-6 lg:h-fit">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-300">
            {locale === "ar" ? "معلومات مهمة" : "Important Information"}
          </p>
          <h1 className="mt-4 text-3xl font-black">{policy.title}</h1>
          <p className="mt-4 text-sm leading-6 text-stone-300">
            {policy.description}
          </p>
          <nav className="mt-8 grid gap-2 text-sm">
            {allPolicies.map((item) => (
              <Link
                key={item.slug}
                href={`/${locale}/policies/${item.slug}`}
                className={`rounded-full px-4 py-2 transition ${
                  item.slug === policy.slug
                    ? "bg-white text-stone-950"
                    : "border border-white/20 text-stone-200 hover:bg-white/10"
                }`}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="rounded-[2rem] bg-[#fffaf1] p-6 shadow-sm ring-1 ring-stone-200 md:p-10">
          <div className="space-y-8">
            {policy.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-xl font-black text-stone-950">
                  {section.heading}
                </h2>
                <p className="mt-3 leading-7 text-stone-700">
                  {section.body}
                </p>
              </section>
            ))}
          </div>

          <div className="mt-10 rounded-2xl bg-[#f4eee4] p-5 text-sm leading-6 text-stone-700">
            <p className="font-semibold">
              {locale === "ar" ? "هل تحتاج مساعدة؟" : "Need help?"}
            </p>
            <p className="mt-2">
              {dict.checkoutInfo.support}
            </p>
            <Link
              href={`/${locale}/callback`}
              className="mt-4 inline-flex rounded-full bg-stone-950 px-4 py-2 font-semibold text-white hover:bg-stone-800"
            >
              {dict.nav.callback}
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
