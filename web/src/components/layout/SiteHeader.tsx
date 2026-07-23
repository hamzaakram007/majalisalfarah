import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

export function SiteHeader({
  locale,
  dict,
  cartCount,
}: {
  locale: Locale;
  dict: Dictionary;
  cartCount?: number;
}) {
  const other = locale === "en" ? "ar" : "en";
  const base = `/${locale}`;

  const links = [
    { href: base, label: dict.nav.home },
    { href: `${base}/products`, label: dict.nav.products },
    { href: `${base}/gallery`, label: dict.nav.gallery },
    { href: `${base}/loyalty`, label: dict.nav.rewards },
    { href: `${base}/callback`, label: dict.nav.callback },
    { href: `${base}/blog`, label: dict.nav.blog },
    { href: `${base}/customizer`, label: dict.nav.customizer },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-[#f4eee4]/95 text-stone-950 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <BrandLogo
          href={base}
          name={dict.brand}
          subtitle={dict.hero.eyebrow}
        />
        <nav aria-label={locale === "ar" ? "القائمة الرئيسية" : "Main navigation"}>
          <ul className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] md:gap-3 md:text-xs md:tracking-[0.12em]">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="rounded-full px-2 py-1 hover:bg-stone-950/5 hover:text-stone-600"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={`/${other}`}
                className="rounded-full border border-stone-300 px-3 py-1 text-stone-700"
              >
                {dict.nav.localeSwitch}
              </Link>
            </li>
            <li>
              <Link
                href={`${base}/cart`}
                className={cn(
                  "rounded-full bg-stone-950 px-3 py-1 text-white hover:bg-stone-800",
                )}
              >
                {dict.nav.cart}
                {cartCount ? ` (${cartCount})` : ""}
              </Link>
            </li>
            <li>
              <Link
                href={`${base}/account`}
                className="hidden sm:inline rounded-full px-2 py-1 hover:text-stone-500"
              >
                {dict.nav.account}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
