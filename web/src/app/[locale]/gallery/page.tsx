import Image from "next/image";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

const images = [
  "/images/gallery1.svg",
  "/images/gallery2.svg",
  "/images/gallery3.svg",
  "/images/sofa-sample.svg",
  "/images/majlis.svg",
  "/images/foam-block.svg",
];

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const dict = getDictionary(localeParam as Locale);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">{dict.gallery.title}</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((src, i) => (
          <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-zinc-100">
            <Image src={src} alt={`Gallery ${i + 1}`} fill className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
