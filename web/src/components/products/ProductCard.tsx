"use client";

import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { ProductWithTranslation } from "@/lib/data/mock";
import { formatSar } from "@/lib/utils";

export function ProductCard({
  product,
  locale,
  dict,
}: {
  product: ProductWithTranslation;
  locale: Locale;
  dict: Dictionary;
}) {
  const inStock = product.stock > 0;

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-[#fffaf1] shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] bg-[#ead8c3]">
        <Image
          src={product.image_url ?? "/images/sofa-sample.svg"}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width:768px) 100vw, 33vw"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {product.category_slug && (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            {product.category_slug}
          </p>
        )}
        <h3 className="font-black text-stone-950">{product.name}</h3>
        <p className="text-sm leading-6 text-stone-600 line-clamp-2">
          {product.description}
        </p>
        <p className="mt-auto text-lg font-black text-stone-950">
          {formatSar(product.price_sar, locale)}
        </p>
        <div className="flex items-center gap-2">
          <Link
            href={`/${locale}/products/${product.slug}`}
            className="text-sm font-semibold text-stone-800 underline decoration-stone-300 underline-offset-4 hover:text-stone-500"
          >
            {dict.products.view}
          </Link>
          <div className="ms-auto">
            <AddToCartButton
              product={product}
              dict={dict}
              locale={locale}
              disabled={!inStock}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
