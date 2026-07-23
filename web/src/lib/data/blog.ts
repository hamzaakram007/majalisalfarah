import type { Locale } from "@/lib/i18n/config";
import {
  getMockBlogPost,
  getMockBlogPosts,
  type BlogPostWithTranslation,
} from "@/lib/data/mock";
import { createClient } from "@/lib/supabase/server";

async function fromSupabase(
  locale: Locale,
): Promise<BlogPostWithTranslation[] | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      `
      id, slug, published_at, image_url,
      blog_post_translations!inner(title, excerpt, body, locale)
    `,
    )
    .eq("published", true)
    .eq("blog_post_translations.locale", locale);

  if (error || !data) return null;

  return data.map((row) => {
    const t = Array.isArray(row.blog_post_translations)
      ? row.blog_post_translations[0]
      : row.blog_post_translations;
    return {
      id: row.id,
      slug: row.slug,
      title: t?.title ?? row.slug,
      excerpt: t?.excerpt ?? null,
      body: t?.body ?? null,
      image_url: row.image_url,
      published_at: row.published_at,
    };
  });
}

export async function getBlogPosts(locale: Locale) {
  const remote = await fromSupabase(locale);
  return remote ?? getMockBlogPosts(locale);
}

export async function getBlogPost(locale: Locale, slug: string) {
  const posts = await getBlogPosts(locale);
  const found = posts.find((p) => p.slug === slug);
  if (found) return found;
  return getMockBlogPost(locale, slug);
}
