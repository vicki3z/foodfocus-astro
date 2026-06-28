import { useEffect, useState } from "react";
import { Tag } from "../ui/Tag";
import { getBaseUrl, getPlaceHolderImageSrc } from "../../lib/utils";

interface LatestPost {
  title: string;
  slug: string;
  image: string;
  imageAlt: string;
  excerpt: string;
}

const SHOW = 3;
const CATEGORY_LABEL = "news";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ");
}

// Derive the current article slug from the URL so this island carries NO
// per-page props — its server-rendered output is identical on every article
// page, which is what keeps publishing a post from churning all pages.
function currentSlugFromPath(): string {
  const parts = window.location.pathname.split("/").filter(Boolean);
  const idx = parts.indexOf("news");
  return idx >= 0 && parts[idx + 1] ? parts[idx + 1] : "";
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg overflow-hidden p-4 animate-pulse">
      <div className="bg-gray-200 rounded-md aspect-video" />
      <div className="py-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-16" />
        <div className="h-5 bg-gray-200 rounded w-full" />
        <div className="h-5 bg-gray-200 rounded w-3/4" />
      </div>
    </div>
  );
}

export function NewsOtherArticlesLive({ title = "Other Articles" }: { title?: string }) {
  const baseUrl = getBaseUrl();
  // null = still loading (show skeleton); [] = loaded but nothing to show (hide).
  const [posts, setPosts] = useState<LatestPost[] | null>(null);

  useEffect(() => {
    let active = true;
    fetch(`${baseUrl}news/latest.json`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data: LatestPost[]) => {
        if (!active) return;
        const current = currentSlugFromPath();
        setPosts(data.filter((p) => p.slug !== current).slice(0, SHOW));
      })
      .catch(() => {
        if (active) setPosts([]);
      });
    return () => {
      active = false;
    };
  }, [baseUrl]);

  // Once we know there's nothing to show, drop the sidebar entirely.
  if (posts !== null && posts.length === 0) return null;

  return (
    <aside className="bg-[var(--color-bg-light)] rounded-lg p-6">
      <h3 className="text-lg font-bold text-[var(--color-text-dark)] mb-4">
        {title}
      </h3>

      <div className="space-y-4">
        {posts === null
          ? Array.from({ length: SHOW }).map((_, i) => <SkeletonCard key={i} />)
          : posts.map((p) => {
              const excerpt = p.excerpt ? stripHtml(p.excerpt) : "";
              return (
                <a
                  key={p.slug}
                  href={`${baseUrl}news/${p.slug}`}
                  className="group block bg-white rounded-lg overflow-hidden p-4"
                >
                  <div className="overflow-hidden">
                    <img
                      src={p.image || getPlaceHolderImageSrc()}
                      alt={p.imageAlt || p.title}
                      className="m-auto group-hover:scale-105 transition-transform duration-300 rounded-md"
                      loading="lazy"
                    />
                  </div>
                  <div className="py-4">
                    <Tag variant="primary" size="sm" className="mb-3">
                      {CATEGORY_LABEL}
                    </Tag>
                    <h3 className="font-semibold text-lg text-[var(--color-text-dark)] line-clamp-2 mb-3 group-hover:text-[var(--color-primary)] transition-colors">
                      {p.title}
                    </h3>
                    {excerpt && (
                      <p className="text-sm text-[var(--color-text-muted)] line-clamp-3 mb-2 tracking-wide">
                        {excerpt}
                      </p>
                    )}
                  </div>
                </a>
              );
            })}
      </div>
    </aside>
  );
}
