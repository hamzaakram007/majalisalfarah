import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPosts } from "@/lib/data/blog";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = getDictionary(locale);
  const posts = await getBlogPosts(locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">{dict.blog.title}</h1>
      <ul className="space-y-6">
        {posts.map((post) => (
          <li key={post.id} className="rounded-lg border bg-white p-6">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="mt-2 text-zinc-600">{post.excerpt}</p>
            <Link
              href={`/${locale}/blog/${post.slug}`}
              className="mt-4 inline-block text-emerald-700 underline"
            >
              {dict.blog.readMore}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
