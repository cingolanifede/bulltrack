"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { isMockDataEnabled, getMockPaginatedBulls } from "@/lib/mock-data";
import type { BullsQueryParams, PaginatedBulls } from "@/lib/types";

function buildSearchParams(params: BullsQueryParams): string {
  const sp = new URLSearchParams();
  if (params.page != null) sp.set("page", String(params.page));
  if (params.limit != null) sp.set("limit", String(params.limit));
  if (params.search?.trim()) sp.set("search", params.search.trim());
  if (params.origen) sp.set("origen", params.origen);
  if (params.paraVaquillona === true) sp.set("paraVaquillona", "true");
  if (params.pelaje) sp.set("pelaje", params.pelaje);
  if (params.sortByScore) sp.set("sortByScore", params.sortByScore);
  const q = sp.toString();
  return q ? `?${q}` : "";
}

export function useBulls(params: BullsQueryParams) {
  const useMock = isMockDataEnabled();
  const query = useQuery({
    queryKey: ["bulls", params, useMock],
    queryFn: () =>
      useMock
        ? getMockPaginatedBulls(params)
        : apiClient<PaginatedBulls>(`/bulls${buildSearchParams(params)}`),
    enabled: true,
  });
  return {
    data: query.data?.data ?? [],
    total: query.data?.total ?? 0,
    page: query.data?.page ?? 1,
    limit: query.data?.limit ?? 10,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
    dataUpdatedAt: query.dataUpdatedAt,
  };
}
