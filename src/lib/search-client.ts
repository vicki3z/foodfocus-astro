import {
  SEARCH_POSTS,
  SEARCH_ROADMAPS,
  SEARCH_ROADSHOWS,
  SEARCH_PROSERIES,
  SEARCH_SEMINARS,
} from "./search-queries";

export interface SearchResult {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  image: string;
  imageAlt: string;
  contentType:
    | "news"
    | "ushare"
    | "whats-in"
    | "roadmap"
    | "roadshow"
    | "proseries"
    | "seminar";
  categoryLabel: string;
  year?: string;
}

/**
 * Replaces http:// with https:// for foodfocusthailand.com URLs.
 * Simpler per-URL version of the server-side enforceHttps in graphql.ts.
 */
function enforceHttps(url: string): string {
  if (!url) return url;
  return url
    .replace(
      /^http:\/\/www\.foodfocusthailand\.com/,
      "https://www.foodfocusthailand.com"
    )
    .replace(
      /^http:\/\/foodfocusthailand\.com/,
      "https://foodfocusthailand.com"
    );
}

async function graphqlFetch(
  endpoint: string,
  query: string,
  variables: Record<string, unknown>
): Promise<any> {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.status}`);
  }

  const json = await response.json();
  if (json.errors) {
    throw new Error(json.errors.map((e: any) => e.message).join(", "));
  }
  return json.data;
}

const CATEGORY_TO_CONTENT_TYPE: Record<string, SearchResult["contentType"]> = {
  news: "news",
  ushare: "ushare",
  "whats-in": "whats-in",
};

const CONTENT_TYPE_LABELS: Record<SearchResult["contentType"], string> = {
  news: "News",
  ushare: "UShare",
  "whats-in": "What's In",
  roadmap: "Roadmap",
  roadshow: "Roadshow",
  proseries: "Proseries",
  seminar: "Exclusive Events",
};

function normalizePostResults(
  nodes: any[],
  categorySlug: string
): SearchResult[] {
  const contentType =
    CATEGORY_TO_CONTENT_TYPE[categorySlug] || ("news" as const);
  return nodes.map((node) => ({
    title: node.title || "",
    excerpt: node.excerpt || "",
    date: node.date || "",
    slug: node.slug || "",
    image: enforceHttps(node.featuredImage?.node?.sourceUrl || ""),
    imageAlt: node.featuredImage?.node?.altText || "",
    contentType,
    categoryLabel:
      CONTENT_TYPE_LABELS[contentType] ||
      node.categories?.nodes?.[0]?.name ||
      "",
  }));
}

function normalizeEventResults(
  nodes: any[],
  contentType: SearchResult["contentType"]
): SearchResult[] {
  return nodes.map((node) => ({
    title: node.title || "",
    excerpt: node.postSummary?.summary || "",
    date: node.date || "",
    slug: node.slug || "",
    image: enforceHttps(node.featuredImage?.node?.sourceUrl || ""),
    imageAlt: node.featuredImage?.node?.altText || "",
    contentType,
    categoryLabel: CONTENT_TYPE_LABELS[contentType],
    year: node.eventYears?.nodes?.[0]?.slug || "",
  }));
}

export async function fetchSearchResults(
  graphqlUrl: string,
  query: string
): Promise<{ results: SearchResult[]; errors: string[] }> {
  const first = 50;

  const requests = [
    // Posts by category: news, ushare, whats-in
    graphqlFetch(graphqlUrl, SEARCH_POSTS, {
      search: query,
      categoryName: "news",
      first,
    }).then((data) => normalizePostResults(data?.posts?.nodes || [], "news")),

    graphqlFetch(graphqlUrl, SEARCH_POSTS, {
      search: query,
      categoryName: "ushare",
      first,
    }).then((data) => normalizePostResults(data?.posts?.nodes || [], "ushare")),

    graphqlFetch(graphqlUrl, SEARCH_POSTS, {
      search: query,
      categoryName: "whats-in",
      first,
    }).then((data) =>
      normalizePostResults(data?.posts?.nodes || [], "whats-in")
    ),

    // Custom post types
    graphqlFetch(graphqlUrl, SEARCH_ROADMAPS, { search: query, first }).then(
      (data) =>
        normalizeEventResults(data?.roadmaps?.nodes || [], "roadmap")
    ),

    graphqlFetch(graphqlUrl, SEARCH_ROADSHOWS, { search: query, first }).then(
      (data) =>
        normalizeEventResults(data?.roadshows?.nodes || [], "roadshow")
    ),

    graphqlFetch(graphqlUrl, SEARCH_PROSERIES, { search: query, first }).then(
      (data) =>
        normalizeEventResults(data?.proseries?.nodes || [], "proseries")
    ),

    graphqlFetch(graphqlUrl, SEARCH_SEMINARS, { search: query, first }).then(
      (data) =>
        normalizeEventResults(data?.seminars?.nodes || [], "seminar")
    ),
  ];

  const settled = await Promise.allSettled(requests);

  const results: SearchResult[] = [];
  const errors: string[] = [];

  for (const result of settled) {
    if (result.status === "fulfilled") {
      results.push(...result.value);
    } else {
      errors.push(result.reason?.message || "Unknown search error");
    }
  }

  // Sort by date descending
  results.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return { results, errors };
}

export function buildResultUrl(result: SearchResult): string {
  switch (result.contentType) {
    case "news":
      return `news/${result.slug}`;
    case "ushare":
      return `ushare/${result.slug}`;
    case "whats-in":
      return `whats-in/${result.slug}`;
    case "roadmap":
      return `roadmap/${result.year}/${result.slug}`;
    case "roadshow":
      return `roadshow/${result.year}/${result.slug}`;
    case "proseries":
      return `proseries/${result.year}/${result.slug}`;
    case "seminar":
      return `exclusive-events/${result.year}/${result.slug}`;
  }
}
