"use client";

import type { BullWithScore } from "@/lib/types";
import type { ViewMode } from "@/components/organisms/SearchAndViewBar";
import { BullCard } from "@/components/organisms/BullCard";

type BullTableProps = {
  bulls: BullWithScore[];
  isFavorite: (bullId: number) => boolean;
  onToggleFavorite: (bullId: number) => void;
  isFavoritePending: boolean;
  onViewDetails?: (bullId: number) => void;
  viewMode?: ViewMode;
  selectedIds?: Set<number>;
  onSelect?: (bullId: number, checked: boolean) => void;
};

export function BullTable({
  bulls,
  isFavorite,
  onToggleFavorite,
  isFavoritePending,
  onViewDetails,
  viewMode = "list",
  selectedIds,
  onSelect,
}: BullTableProps) {
  return (
    <div
      className={
        viewMode === "grid"
          ? "grid grid-cols-1 gap-3 sm:grid-cols-2 min-[1440px]:grid-cols-3"
          : "flex flex-col gap-3"
      }
      role="list"
      aria-label="Resultados de clasificación"
    >
      {bulls.map((bull, index) => (
        <BullCard
          key={bull.id}
          bull={bull}
          rank={index + 1}
          isFavorite={isFavorite(bull.id)}
          onToggleFavorite={() => onToggleFavorite(bull.id)}
          isFavoritePending={isFavoritePending}
          onViewDetails={onViewDetails}
          viewMode={viewMode}
          selected={selectedIds?.has(bull.id) ?? false}
          onSelect={
            onSelect ? (checked) => onSelect(bull.id, checked) : undefined
          }
        />
      ))}
    </div>
  );
}
