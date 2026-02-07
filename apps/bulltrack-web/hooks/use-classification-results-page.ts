"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { BullWithScore } from "@/lib/types";
import { useBulls } from "@/hooks/use-bulls";
import { useToggleFavorite } from "@/hooks/use-favorites";
import { useFilters } from "@/lib/filters-context";
import type { ViewMode } from "@/components/organisms/SearchAndViewBar";

export type UseClassificationResultsPageResult = {
  bulls: BullWithScore[];
  total: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  isFavorite: (bullId: number) => boolean;
  toggleFavorite: (bullId: number) => void;
  isFavoritePending: boolean;
  favoriteError: Error | null;
  clearFavoriteError: () => void;
  page: number;
  limit: number;
  onPageChange: (p: number) => void;
  search: string;
  setSearch: (s: string) => void;
  viewMode: ViewMode;
  setViewMode: (m: ViewMode) => void;
  selectedIds: Set<number>;
  onSelect: (bullId: number, checked: boolean) => void;
};

export function useClassificationResultsPage(): UseClassificationResultsPageResult {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const { origen, paraVaquillona, pelaje, sortByScore } = useFilters();

  const params = useMemo(
    () => ({
      page,
      limit,
      search: search || undefined,
      origen,
      paraVaquillona: paraVaquillona || undefined,
      pelaje,
      sortByScore,
    }),
    [page, limit, search, origen, paraVaquillona, pelaje, sortByScore]
  );

  const { data: bulls, total, isLoading, error, refetch } = useBulls(params);
  const {
    isFavorite,
    toggle,
    isPending: isFavoritePending,
    favoriteError,
    clearFavoriteError,
  } = useToggleFavorite();

  const onPageChange = useCallback((p: number) => setPage(p), []);

  const onSelect = useCallback((bullId: number, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(bullId);
      else next.delete(bullId);
      return next;
    });
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, origen, paraVaquillona, pelaje, sortByScore]);

  return {
    bulls,
    total,
    isLoading,
    error: error ?? null,
    refetch,
    isFavorite,
    toggleFavorite: toggle,
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
  };
}
