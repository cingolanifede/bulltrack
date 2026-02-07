"use client";

import { Icon } from "@/components/atoms/Icon";

type FavoriteButtonProps = {
  bullId: number;
  isFavorite: boolean;
  onToggle: () => void;
  disabled?: boolean;
};

export function FavoriteButton({
  isFavorite,
  onToggle,
  disabled,
}: FavoriteButtonProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        onToggle();
      }}
      disabled={disabled}
      className="rounded p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-red-500 disabled:opacity-50"
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      {isFavorite ? (
        <Icon name="heart-filled" className="h-5 w-5 text-red-500" />
      ) : (
        <Icon name="heart-outline" className="h-5 w-5" />
      )}
    </button>
  );
}
