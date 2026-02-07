"use client";

import { Icon } from "@/components/atoms/Icon";

type BullCardActionsProps = {
  bullId: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  isFavoritePending?: boolean;
  onViewDetails?: (bullId: number) => void;
  className?: string;
};

const actionButtonClass =
  "box-border flex shrink-0 items-center justify-center bg-surface-ink text-white opacity-100 transition-opacity hover:opacity-90 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2";
const actionButtonStyle = {
  width: 40,
  height: 40,
  borderRadius: "var(--radius-sm)",
  padding: 8,
};

export function BullCardActions({
  bullId,
  isFavorite,
  onToggleFavorite,
  isFavoritePending = false,
  onViewDetails,
  className = "",
}: BullCardActionsProps) {
  return (
    <div
      className={`flex shrink-0 flex-col items-end justify-center gap-4 ${className}`}
    >
      {onViewDetails && (
        <button
          type="button"
          onClick={() => onViewDetails(bullId)}
          className={actionButtonClass}
          style={actionButtonStyle}
          aria-label="Ver detalle"
        >
          <Icon name="eye" className="h-6 w-6 shrink-0 text-white" />
        </button>
      )}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          onToggleFavorite();
        }}
        disabled={isFavoritePending}
        className={actionButtonClass}
        style={actionButtonStyle}
        aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
      >
        {isFavorite ? (
          <Icon name="heart-filled" className="h-6 w-6 shrink-0 text-white" />
        ) : (
          <Icon name="heart-outline" className="h-6 w-6 shrink-0 text-white" />
        )}
      </button>
    </div>
  );
}
