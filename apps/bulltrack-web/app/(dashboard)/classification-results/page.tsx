"use client";

import { useState, useEffect } from "react";
import { BullTable } from "@/components/organisms/BullTable";
import { BullTableSkeleton } from "@/components/organisms/BullTableSkeleton";
import { Pagination } from "@/components/organisms/Pagination";
import { SearchAndViewBar } from "@/components/organisms/SearchAndViewBar";
import { useClassificationResultsPage } from "@/hooks/use-classification-results-page";
import { useFilters } from "@/lib/filters-context";
import { CollapsibleSection } from "@/components/molecules/CollapsibleSection";
import { Icon } from "@/components/atoms/Icon";
import { formatRelativeTime } from "@/lib/format-relative-time";

export default function ClassificationResultsPage() {
  const {
    bulls,
    total,
    isLoading,
    error,
    refetch,
    dataUpdatedAt,
    isFavorite,
    toggleFavorite,
    isFavoritePending,
    favoriteError,
    clearFavoriteError,
    page,
    limit,
    onPageChange,
    search,
    setSearch,
    viewMode,
    setViewMode,
    selectedIds,
    onSelect,
  } = useClassificationResultsPage();

  const [relativeTimeKey, setRelativeTimeKey] = useState(0);
  useEffect(() => {
    if (dataUpdatedAt <= 0) return;
    const interval = setInterval(
      () => setRelativeTimeKey((k) => k + 1),
      60_000
    );
    return () => clearInterval(interval);
  }, [dataUpdatedAt]);

  const { origen } = useFilters();

  return (
    <div className="flex h-full min-h-0 flex-col space-y-3">
      <div className="shrink-0 space-y-6">
        <div className="space-y-2">
          {dataUpdatedAt > 0 && (
            <div
              className="flex items-center gap-2 text-sm text-text-body pb-4"
              key={relativeTimeKey}
            >
              <Icon name="cloud-sync" className="h-4 w-4 text-surface-ink" />
              <span>
                Datos actualizados {formatRelativeTime(dataUpdatedAt)}
              </span>
            </div>
          )}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold text-text-body sm:text-[32px] sm:leading-5">
              Resultados de la clasificación
            </h1>
          </div>
          <p className="text-sm text-text-body sm:text-base">
            Los resultados están ordenados por Bulltrack Score que reflejan tus
            objetivos de producción.
          </p>
        </div>

        <div className="space-y-3">
          <CollapsibleSection title="Criterios del ranking">
            <p className="text-sm text-text-body">
              Los criterios del ranking se basan en el Bull Score y las
              características destacadas de cada toro según tus objetivos de
              producción.
            </p>
          </CollapsibleSection>

          <SearchAndViewBar
            value={search}
            onChange={setSearch}
            placeholder="Busca por caravana o nombre"
            resultCount={total}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            debounceMs={300}
          />
        </div>
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-800">
              {error instanceof Error ? error.message : "Failed to load bulls."}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-2 text-sm font-medium text-red-700 underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}
        {favoriteError && (
          <div
            className="flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4"
            role="alert"
          >
            <p className="text-sm text-amber-800">{favoriteError.message}</p>
            <button
              type="button"
              onClick={clearFavoriteError}
              className="shrink-0 text-sm font-medium text-amber-700 underline hover:no-underline"
              aria-label="Dismiss"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>

      <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto">
        {isLoading && <BullTableSkeleton />}

        {!isLoading && !error && bulls.length === 0 && (
          <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center text-zinc-500">
            {origen === "favoritos"
              ? "No favorites yet. Add bulls from the list to your favorites."
              : "No bulls match the current filters."}
          </div>
        )}

        {!isLoading && !error && bulls.length > 0 && (
          <BullTable
            bulls={bulls}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            onViewDetails={(id) => console.log(id)}
            isFavoritePending={isFavoritePending}
            viewMode={viewMode}
            selectedIds={selectedIds}
            onSelect={onSelect}
          />
        )}
      </div>

      {!isLoading && !error && bulls.length > 0 && (
        <div className="shrink-0">
          <Pagination
            page={page}
            limit={limit}
            total={total}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
