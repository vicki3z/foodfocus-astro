import { useState, useEffect } from "react";
import { Tag } from "../ui/Tag";
import {
  fetchSearchResults,
  buildResultUrl,
  type SearchResult,
} from "../../lib/search-client";

interface Props {
  graphqlUrl: string;
  baseUrl: string;
}

const ITEMS_PER_PAGE = 12;

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ");
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Bangkok",
  });
}

// --- Sub-components ---

function SearchResultCard({
  result,
  baseUrl,
}: {
  result: SearchResult;
  baseUrl: string;
}) {
  const url = `${baseUrl}${buildResultUrl(result)}`;
  const image = result.image || `${baseUrl}images/placeholder.png`;
  const excerpt = result.excerpt ? stripHtml(result.excerpt) : "";
  const formattedDate = result.date ? formatDate(result.date) : "";

  return (
    <a href={url} className="group block bg-white rounded-lg overflow-hidden p-4">
      <div className="overflow-hidden">
        <img
          src={image}
          alt={result.imageAlt || result.title}
          className="m-auto group-hover:scale-105 transition-transform duration-300 rounded-md"
          loading="lazy"
        />
      </div>
      <div className="py-4">
        {result.categoryLabel && (
          <Tag variant="primary" size="sm" className="mb-3">
            {result.categoryLabel}
          </Tag>
        )}
        <h3 className="font-semibold text-lg text-[var(--color-text-dark)] line-clamp-2 mb-3 group-hover:text-[var(--color-primary)] transition-colors">
          {result.title}
        </h3>
        {excerpt && (
          <p className="text-sm text-[var(--color-text-muted)] line-clamp-3 mb-2 tracking-wide">
            {excerpt}
          </p>
        )}
        {formattedDate && (
          <time
            className="text-xs text-[var(--color-text-muted)]"
            dateTime={result.date}
          >
            {formattedDate}
          </time>
        )}
      </div>
    </a>
  );
}

function SearchPagination({
  currentPage,
  totalPages,
  query,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  query: string;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const handleClick = (e: React.MouseEvent, page: number) => {
    e.preventDefault();
    const url = `?query=${encodeURIComponent(query)}&page=${page}`;
    history.pushState(null, "", url);
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav aria-label="Search results pagination" className="flex items-center justify-center gap-2 mt-8">
      {/* Previous button */}
      {currentPage <= 1 ? (
        <span className="px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded-md cursor-not-allowed">
          Previous
        </span>
      ) : (
        <a
          href={`?query=${encodeURIComponent(query)}&page=${currentPage - 1}`}
          onClick={(e) => handleClick(e, currentPage - 1)}
          className="px-4 py-2 text-sm font-medium text-[var(--color-text-dark)] bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-[var(--color-primary)] transition-colors"
        >
          Previous
        </a>
      )}

      {/* Page numbers (hidden on mobile) */}
      <div className="hidden sm:flex items-center gap-2">
        {pageNumbers.map((page, idx) =>
          typeof page === "string" ? (
            <span key={`ellipsis-${idx}`} className="px-3 py-2 text-sm text-[var(--color-text-muted)]">
              ...
            </span>
          ) : page === currentPage ? (
            <span key={page} className="px-3 py-2 text-sm font-medium text-white bg-[var(--color-primary)] rounded-md">
              {page}
            </span>
          ) : (
            <a
              key={page}
              href={`?query=${encodeURIComponent(query)}&page=${page}`}
              onClick={(e) => handleClick(e, page)}
              className="px-3 py-2 text-sm font-medium text-[var(--color-text-dark)] bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-[var(--color-primary)] transition-colors"
            >
              {page}
            </a>
          )
        )}
      </div>

      {/* Mobile page indicator */}
      <span className="sm:hidden px-3 py-2 text-sm font-medium text-[var(--color-text-dark)]">
        Page {currentPage} of {totalPages}
      </span>

      {/* Next button */}
      {currentPage >= totalPages ? (
        <span className="px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded-md cursor-not-allowed">
          Next
        </span>
      ) : (
        <a
          href={`?query=${encodeURIComponent(query)}&page=${currentPage + 1}`}
          onClick={(e) => handleClick(e, currentPage + 1)}
          className="px-4 py-2 text-sm font-medium text-[var(--color-text-dark)] bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-[var(--color-primary)] transition-colors"
        >
          Next
        </a>
      )}
    </nav>
  );
}

function SkeletonCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg overflow-hidden p-4 animate-pulse">
          <div className="bg-gray-200 rounded-md aspect-video" />
          <div className="py-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-16" />
            <div className="h-5 bg-gray-200 rounded w-full" />
            <div className="h-5 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

// --- Main component ---

export function SearchResults({ graphqlUrl, baseUrl }: Props) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValue, setInputValue] = useState("");

  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);
  const paginatedResults = results.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const { results: searchResults, errors } =
        await fetchSearchResults(graphqlUrl, searchQuery);
      setResults(searchResults);
      if (errors.length > 0 && searchResults.length === 0) {
        setError(errors.join("; "));
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("query") || "";
    const page = parseInt(params.get("page") || "1", 10);
    setQuery(q);
    setInputValue(q);
    setCurrentPage(page > 0 ? page : 1);
    if (q) {
      performSearch(q);
    }
  }, []);

  const handleRefineSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    setQuery(trimmed);
    setCurrentPage(1);
    const url = `?query=${encodeURIComponent(trimmed)}&page=1`;
    history.pushState(null, "", url);
    performSearch(trimmed);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRetry = () => {
    if (query) {
      performSearch(query);
    }
  };

  // No query provided
  if (!query && !loading) {
    return (
      <div className="text-center py-16">
        <svg
          className="mx-auto w-16 h-16 text-gray-300 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <p className="text-lg text-[var(--color-text-muted)]">
          Enter a search term to find articles, news, and events
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Search refinement input */}
      <form onSubmit={handleRefineSearch} className="mb-8">
        <div className="relative max-w-xl">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Refine your search..."
            className="w-full pl-4 pr-12 py-3 text-sm bg-white border border-gray-300 rounded-full text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
            aria-label="Search"
          >
            <svg
              className="w-5 h-5 text-gray-400 hover:text-[var(--color-primary)] transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </form>

      {/* Loading state */}
      {loading && <SkeletonCards />}

      {/* Error state */}
      {!loading && error && (
        <div className="text-center py-16">
          <p className="text-lg text-red-600 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="px-6 py-2 text-sm font-medium text-white bg-[var(--color-primary)] rounded-md hover:opacity-90 transition-opacity"
          >
            Try again
          </button>
        </div>
      )}

      {/* No results */}
      {!loading && !error && query && results.length === 0 && (
        <div className="text-center py-16">
          <p className="text-lg text-[var(--color-text-muted)]">
            No results found for &lsquo;{query}&rsquo;
          </p>
        </div>
      )}

      {/* Results */}
      {!loading && !error && results.length > 0 && (
        <>
          <p className="text-sm text-[var(--color-text-muted)] mb-6">
            {results.length} result{results.length !== 1 ? "s" : ""} found for
            &lsquo;{query}&rsquo;
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedResults.map((result, idx) => (
              <SearchResultCard
                key={`${result.contentType}-${result.slug}-${idx}`}
                result={result}
                baseUrl={baseUrl}
              />
            ))}
          </div>

          <SearchPagination
            currentPage={currentPage}
            totalPages={totalPages}
            query={query}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
