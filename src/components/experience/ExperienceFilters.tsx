"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Province {
  id: number;
  name: string;
  slug: string;
}

interface ExperienceFiltersProps {
  categories: Category[];
  provinces: Province[];
}

export default function ExperienceFilters({
  categories,
  provinces,
}: ExperienceFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentQuery = searchParams.get("q") ?? "";
  const currentCategory = searchParams.get("category") ?? "";
  const currentProvince = searchParams.get("province") ?? "";
  const currentSort = searchParams.get("sort") ?? "score";

  const [searchValue, setSearchValue] = useState(currentQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasFilters = currentQuery || currentCategory || currentProvince || currentSort !== "score";

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      // Reset to page 1 when filters change
      params.delete("page");

      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }

      router.push(`/explore?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (searchValue !== currentQuery) {
        updateParams({ q: searchValue });
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchValue, currentQuery, updateParams]);

  // Sync input when URL changes externally
  useEffect(() => {
    setSearchValue(currentQuery);
  }, [currentQuery]);

  const clearFilters = () => {
    setSearchValue("");
    router.push("/explore", { scroll: false });
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-charcoal/40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search experiences, destinations..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white pl-12 pr-4 py-3.5 text-sm text-brand-charcoal placeholder:text-gray-400 transition-colors focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none"
        />
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => updateParams({ category: "" })}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            !currentCategory
              ? "bg-brand-blue text-white"
              : "bg-gray-100 text-brand-charcoal/70 hover:bg-gray-200"
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() =>
              updateParams({
                category: currentCategory === cat.slug ? "" : cat.slug,
              })
            }
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              currentCategory === cat.slug
                ? "bg-brand-blue text-white"
                : "bg-gray-100 text-brand-charcoal/70 hover:bg-gray-200"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Province + Sort row */}
      <div className="flex flex-col sm:flex-row gap-4">
        <select
          value={currentProvince}
          onChange={(e) => updateParams({ province: e.target.value })}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-brand-charcoal transition-colors focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%23207796%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-10 sm:w-64"
        >
          <option value="">All Provinces</option>
          {provinces.map((p) => (
            <option key={p.id} value={p.slug}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          value={currentSort}
          onChange={(e) => updateParams({ sort: e.target.value })}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-brand-charcoal transition-colors focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%23207796%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-10 sm:w-52"
        >
          <option value="score">Highest Rated</option>
          <option value="newest">Newest First</option>
          <option value="title">A-Z</option>
        </select>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-sm font-medium text-brand-blue hover:underline underline-offset-4 py-2.5"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
