import { notFound } from "next/navigation";

type SlugParams = { slug: string };

/**
 * Unwrap dynamic route params (Next 15 Promise or OpenNext sync object).
 */
export async function resolveSlugParam(
  params: Promise<SlugParams>,
): Promise<string> {
  const resolved = await params;
  const slug = resolved?.slug?.trim();
  if (!slug) notFound();
  return slug;
}
