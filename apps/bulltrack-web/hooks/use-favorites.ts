"use client";

import { useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
  isMockDataEnabled,
  getMockFavoriteBullIds,
  addMockFavorite,
  removeMockFavorite,
} from "@/lib/mock-data";

type FavoritesResponse = { bullIds: number[] };

export function useFavoriteIds() {
  const useMock = isMockDataEnabled();
  return useQuery({
    queryKey: ["favorites", useMock],
    queryFn: () =>
      useMock
        ? getMockFavoriteBullIds()
        : apiClient<FavoritesResponse>("/favorites"),
  });
}

export function useAddFavorite() {
  const queryClient = useQueryClient();
  const useMock = isMockDataEnabled();
  return useMutation({
    mutationFn: (bullId: number) =>
      useMock
        ? addMockFavorite(bullId)
        : apiClient(`/favorites/${bullId}`, { method: "POST" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["bulls"] });
    },
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();
  const useMock = isMockDataEnabled();
  return useMutation({
    mutationFn: (bullId: number) =>
      useMock
        ? removeMockFavorite(bullId)
        : apiClient(`/favorites/${bullId}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["bulls"] });
    },
  });
}

export function useToggleFavorite() {
  const { data } = useFavoriteIds();
  const favoriteIds = new Set(data?.bullIds ?? []);
  const add = useAddFavorite();
  const remove = useRemoveFavorite();
  const [favoriteError, setFavoriteError] = useState<Error | null>(null);

  const clearFavoriteError = useCallback(() => setFavoriteError(null), []);

  async function toggle(bullId: number) {
    setFavoriteError(null);
    try {
      if (favoriteIds.has(bullId)) {
        await remove.mutateAsync(bullId);
      } else {
        await add.mutateAsync(bullId);
      }
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to update favorite");
      console.error("[useToggleFavorite] Failed to toggle favorite:", err);
      setFavoriteError(error);
      throw err;
    }
  }

  return {
    isFavorite: (bullId: number) => favoriteIds.has(bullId),
    addFavorite: add.mutateAsync,
    removeFavorite: remove.mutateAsync,
    toggle,
    isPending: add.isPending || remove.isPending,
    favoriteError,
    clearFavoriteError,
  };
}
