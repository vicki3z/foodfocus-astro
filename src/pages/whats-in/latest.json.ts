import type { APIRoute } from "astro";
import { fetchGraphQL } from "../../lib/graphql";
import { GET_POSTS_BY_CATEGORY } from "../../lib/queries";

// Static endpoint: emits the latest What's In posts as a single JSON file
// (dist/whats-in/latest.json) at build time. The sidebar island fetches this
// at runtime, so the "latest posts" list lives in ONE file instead of being
// inlined into every article page. Publishing a post then changes only this
// file + the new page, leaving every existing article page byte-identical.
//
// The sidebar shows 3 cards after excluding the current article, so a small
// buffer (6) keeps it stable even when the current article is itself recent.
const LATEST_COUNT = 6;

export const GET: APIRoute = async () => {
  const data = await fetchGraphQL<any>(GET_POSTS_BY_CATEGORY, {
    first: LATEST_COUNT,
    category: "whats-in",
  });

  // fetchGraphQL already runs enforceHttps() over the response, so image URLs
  // are normalized to https here.
  const items = (data?.posts?.nodes || []).map((p: any) => ({
    title: p.title ?? "",
    slug: p.slug ?? "",
    image: p.featuredImage?.node?.sourceUrl ?? "",
    imageAlt: p.featuredImage?.node?.altText ?? "",
    excerpt: p.excerpt ?? "",
  }));

  return new Response(JSON.stringify(items), {
    headers: { "Content-Type": "application/json" },
  });
};
