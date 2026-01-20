interface MonthYearSelectorProps {
  months: string[];
  years: string[];
  defaultMonth?: string;
  defaultYear?: string;
  baseHref?: string;
  onFilterChange?: (month: string, year: string) => void;
}

export function MonthYearSelector({
  months,
  years,
  defaultMonth,
  defaultYear,
  baseHref,
  onFilterChange,
}: MonthYearSelectorProps) {
  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const month = event.target.value;
    const year = defaultYear || years[0];

    if (baseHref) {
      const url = new URL(window.location.href);
      url.searchParams.set("month", month);
      url.searchParams.set("year", year);
      window.location.href = url.toString();
    }

    onFilterChange?.(month, year);
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const year = event.target.value;
    const month = defaultMonth || months[0];

    if (baseHref) {
      const url = new URL(window.location.href);
      url.searchParams.set("month", month);
      url.searchParams.set("year", year);
      window.location.href = url.toString();
    }

    onFilterChange?.(month, year);
  };

  return (
    <div className="flex gap-4 mb-6">
      <select
        value={defaultMonth || months[0] || ""}
        onChange={handleMonthChange}
        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-[var(--color-text-dark)] bg-white hover:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors"
      >
        {months.map((month) => (
          <option key={month} value={month}>
            {month.toUpperCase()}
          </option>
        ))}
      </select>

      <select
        value={defaultYear || years[0] || ""}
        onChange={handleYearChange}
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
