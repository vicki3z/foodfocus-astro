import { getBaseUrl } from "../../lib/utils";

interface YearSelectorProps {
  years: string[];
  defaultYear?: string;
  baseHref?: string;
  onYearChange?: (year: string) => void;
}

const baseUrl = getBaseUrl();
export function YearSelector({
  years,
  defaultYear,
  baseHref,
  onYearChange,
}: YearSelectorProps) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const year = event.target.value;

    // If baseHref is provided, navigate to the dynamic route
    if (baseHref) {
      const targetUrl = `${baseUrl}${baseHref}/${year}`

      window.location.href = targetUrl;
    } else {
      // Legacy behavior: use query string
      const url = new URL(window.location.href);
      url.searchParams.set("year", year);
      window.location.replace(url.toString());
    }

    onYearChange?.(year);
  };

  return (
    <div className="mb-6">
      <select
        value={defaultYear || years[0] || ""}
        onChange={handleChange}
        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-[var(--color-text-dark)] bg-white hover:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors"
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}
