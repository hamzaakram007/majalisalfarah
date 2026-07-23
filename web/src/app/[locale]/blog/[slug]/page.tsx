import { notFound } from "next/navigation";
import { getBlogPost } from "@/lib/data/blog";
import { isLocale, type Locale } from "@/lib/i18n/config";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeParam, slug } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const post = await getBlogPost(locale, slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 prose prose-zinc">
      <h1>{post.title}</h1>
      <p className="text-zinc-500">{post.excerpt}</p>
      <div className="mt-8 whitespace-pre-wrap">{post.body}</div>
    </article>
  );
}
