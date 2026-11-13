import type { Locale } from "@/lib/i18n/config";

export const siteConfig = {
  name: "Majalis Alfarah",
  nameAr: "مجالس الفرح",
  defaultLocale: "en" as Locale,
  locales: ["en", "ar"] as Locale[],
  phone: "+966 59 613 5993",
  whatsappNumber: "966596135993",
  instagram: "majalisalfarah9",
  email: "contact@majalisalfarah.sa",
  address: "33V4 FWR, Ali Bin Abi Talib Road, Al Saharij, Yanbu, Saudi Arabia",
  addressAr: "33V4 FWR، طريق علي بن أبي طالب، الصهاريج، ينبع، المملكة العربية السعودية",
  foundingYear: 1990,
};

export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
    "http://localhost:3000"
  );
}

export function localePath(locale: Locale, path = "") {
  const base = getSiteUrl();
  const normalized = path.startsWith("/") ? path : path ? `/${path}` : "";
  return `${base}/${locale}${normalized}`;
}

export const seoKeywords = {
  en: [
    "custom sofas Saudi Arabia",
    "majlis sofas Yanbu",
    "curtains Saudi Arabia",
    "foam supplier Yanbu",
    "furniture cushions",
    "custom upholstery",
    "Majalis Alfarah",
  ],
  ar: [
    "كنب حسب الطلب السعودية",
    "مجالس سعودية",
    "ستائر ينبع",
    "فوم عالي الكثافة",
    "مخدات ووسائد",
    "تنجيد مخصص",
    "مجالس الفرح",
  ],
};

export const defaultDescriptions = {
  en: "Majalis Alfarah — custom Saudi sofas, majlis seating, curtains, foam, cushions, and home decor since 1990. Visit our Yanbu showroom or request a custom quote online.",
  ar: "مجالس الفرح — كنب ومجالس وستائر وفوم ومخدات وديكور منزلي حسب الطلب منذ 1990. زر معرضنا في ينبع أو اطلب عرض سعر أونلاين.",
};
