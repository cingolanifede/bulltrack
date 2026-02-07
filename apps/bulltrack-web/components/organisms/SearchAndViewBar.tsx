"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/atoms/Icon";

export type ViewMode = "list" | "grid";

type SearchAndViewBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  resultCount: number;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  debounceMs?: number;
};

export function SearchAndViewBar({
  value,
  onChange,
  placeholder = "Busca por caravana o nombre",
  resultCount,
  viewMode,
  onViewModeChange,
  debounceMs = 300,
}: SearchAndViewBarProps) {
  const [local, setLocal] = useState(value);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  useEffect(() => {
    const t = setTimeout(() => onChange(local), debounceMs);
    return () => clearTimeout(t);
  }, [local, debounceMs, onChange]);

  return (
    <div className="flex flex-col gap-3 rounded-lg bg-surface-light p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4">
      <div className="relative w-full min-w-0 sm:max-w-[514px] sm:flex-1">
        <input
          type="search"
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg bg-white py-2.5 pl-3 pr-10 text-sm text-text-body placeholder-text-body shadow-sm focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 sm:text-base"
          aria-label="Buscar por caravana o nombre"
        />
        <span
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"
          aria-hidden="true"
        >
          <Icon name="search" className="h-4 w-4 sm:h-5 sm:w-5" />
        </span>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-4 flex-1">
        <span
          className="text-text-body text-base sm:text-xl"
          style={{ lineHeight: "20px" }}
        >
          <span className="font-bold">{resultCount}</span>{" "}
          <span>resultado{resultCount !== 1 ? "s" : ""}</span>
        </span>

        <div
          className="flex flex-row flex-nowrap items-stretch overflow-hidden rounded-lg bg-text-body"
          style={{ gap: 0 }}
          role="group"
          aria-label="Vista de resultados"
        >
          <button
            type="button"
            onClick={() => onViewModeChange("list")}
            className={`inline-flex h-10 min-w-[56px] shrink-0 items-center justify-center rounded-l-lg px-4 opacity-100 transition-colors sm:min-w-[72px] ${
              viewMode === "list"
                ? "bg-surface-ink text-white"
                : "bg-surface-inactive text-text-body"
            }`}
            aria-label="Vista en lista"
            aria-pressed={viewMode === "list"}
          >
            <Icon
              name="list-view"
              className={`h-5 w-5 shrink-0 ${viewMode === "list" ? "text-white" : "text-text-body"}`}
            />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            className={`inline-flex h-10 min-w-[56px] shrink-0 items-center justify-center rounded-r-lg px-4 opacity-100 transition-colors sm:min-w-[72px] ${
              viewMode === "grid"
                ? "bg-surface-ink text-white"
                : "bg-surface-inactive text-text-body"
            }`}
            aria-label="Vista en grilla"
            aria-pressed={viewMode === "grid"}
          >
            <Icon
              name="grid-view"
              className={`h-5 w-5 shrink-0 ${viewMode === "grid" ? "text-white" : "text-text-body"}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
