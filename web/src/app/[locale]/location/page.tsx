import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { siteConfig } from "@/lib/seo/site";

export default async function LocationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const dict = getDictionary(localeParam as Locale);
  const mapQuery = encodeURIComponent(siteConfig.address);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold">{dict.location.title}</h1>
      <p className="mt-4 text-lg text-zinc-600">{dict.location.address}</p>
      <div className="mt-8 aspect-video w-full overflow-hidden rounded-xl bg-zinc-200">
        <iframe
          title="Showroom map"
          className="h-full w-full border-0"
          src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
