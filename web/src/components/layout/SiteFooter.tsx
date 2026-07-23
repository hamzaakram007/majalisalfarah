import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { getPolicies } from "@/lib/policies";
import { siteConfig } from "@/lib/seo/site";

export function SiteFooter({
  dict,
  locale = "en",
}: {
  dict: Dictionary;
  locale?: Locale;
}) {
  const base = `/${locale}`;
  const links = [
    { href: `${base}/products`, label: dict.nav.products },
    { href: `${base}/customizer`, label: dict.nav.customizer },
    { href: `${base}/blog`, label: dict.nav.blog },
    { href: `${base}/location`, label: dict.location.title },
    { href: `${base}/callback`, label: dict.nav.callback },
  ];
  const policyLinks = getPolicies(locale).map((policy) => ({
    href: `${base}/policies/${policy.slug}`,
    label: policy.title,
  }));

  return (
    <footer className="mt-auto border-t border-stone-200 bg-[#fffaf1]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <BrandLogo name={dict.brand} subtitle={dict.hero.eyebrow} />
          <p className="mt-4 max-w-sm text-sm leading-6 text-stone-600">
            {dict.home.seoBlockBody.slice(0, 160)}…
          </p>
          <div className="mt-5 grid gap-2 text-sm font-semibold text-stone-800">
            <a
              href={`https://wa.me/${siteConfig.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-stone-500"
            >
              WhatsApp: {siteConfig.phone}
            </a>
            <a
              href={`https://www.instagram.com/${siteConfig.instagram}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-stone-500"
            >
              Instagram: @{siteConfig.instagram}
            </a>
            <p className="text-stone-600">{dict.location.address}</p>
          </div>
        </div>
        <nav aria-label="Footer">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-stone-500">
            {locale === "ar" ? "الموقع" : "Site"}
          </p>
          <ul className="grid gap-2 text-sm font-semibold text-stone-800">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-stone-500">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Policies">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-stone-500">
            {locale === "ar" ? "السياسات" : "Policies"}
          </p>
          <ul className="grid gap-2 text-sm font-semibold text-stone-800">
            {policyLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-stone-500">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-stone-200 py-6 text-center text-sm text-stone-500">
        <p>{dict.footer}</p>
      </div>
    </footer>
  );
}
