"use client";

import type { BullWithScore } from "@/lib/types";
import type { ViewMode } from "@/components/organisms/SearchAndViewBar";
import { Icon } from "@/components/atoms/Icon";
import { BullCardActions } from "@/components/molecules/BullCardActions";
import Image from "next/image";

type BullCardProps = {
  bull: BullWithScore;
  rank: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  isFavoritePending?: boolean;
  onViewDetails?: (bullId: number) => void;
  selected?: boolean;
  onSelect?: (checked: boolean) => void;
  imageUrl?: string | null;
  viewMode?: ViewMode;
};

const MOCK_BULL_IMAGES = [
  "/mocks/bull_1.png",
  "/mocks/bull_2.png",
  "/mocks/bull_3.png",
] as const;

function getMockImageSrc(bullId: number): string {
  const index = Math.abs(bullId) % MOCK_BULL_IMAGES.length;
  return MOCK_BULL_IMAGES[index];
}

function normalizeScore(score: number): number {
  return score > 1 ? Math.min(100, score) / 100 : Math.min(1, score);
}

function radarPoints(
  stats: BullWithScore["stats"],
  size: number,
  maxRadius?: number
): string {
  const keys: (keyof BullWithScore["stats"])[] = [
    "crecimiento",
    "facilidad_parto",
    "reproduccion",
    "moderacion",
    "carcasa",
  ];
  const cx = size / 2;
  const cy = size / 2;
  const max = 100;
  const R = maxRadius ?? size / 2 - 4;
  const points = keys.map((key, i) => {
    const value = stats[key];
    const r = (typeof value === "number" ? Math.min(max, value) / max : 0) * R;
    const angle = (-90 + i * 72) * (Math.PI / 180);
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    return `${x},${y}`;
  });
  return points.join(" ");
}

export function BullCard({
  bull,
  rank,
  isFavorite,
  onToggleFavorite,
  isFavoritePending = false,
  onViewDetails,
  selected = false,
  onSelect,
  imageUrl,
  viewMode = "list",
}: BullCardProps) {
  const isCompact = viewMode === "grid";
  const scoreNorm = normalizeScore(bull.bullScore);
  const scoreDisplay = scoreNorm.toFixed(1);
  const chartSize = 88;

  const tag1 = bull.origen
    ? bull.origen.charAt(0).toUpperCase() + bull.origen.slice(1).toLowerCase()
    : null;
  const tag2 = bull.uso ? bull.uso : null;

  return (
    <article
      className={
        isCompact
          ? "flex min-w-0 min-h-[192px] flex-col items-stretch gap-4 overflow-hidden rounded-[24px] bg-white p-4"
          : "flex min-w-0 min-h-[192px] flex-wrap items-stretch gap-4 overflow-hidden rounded-[24px] bg-white p-4 min-[1025px]:flex-nowrap min-[1025px]:items-center min-[1025px]:gap-6 min-[1025px]:p-6"
      }
      role="article"
      aria-label={`Bull ${bull.caravana} ${bull.nombre}`}
    >
      <div
        className={
          isCompact
            ? "flex min-w-0 basis-full flex-wrap items-center gap-2"
            : "flex min-w-0 basis-full flex-wrap items-center gap-2 min-[1025px]:basis-auto min-[1025px]:flex-1 min-[1025px]:flex-nowrap min-[1025px]:gap-6"
        }
      >
        <div
          className={
            isCompact
              ? "flex shrink-0 items-center gap-2"
              : "flex shrink-0 items-center gap-2 min-[1025px]:gap-6"
          }
        >
          {onSelect ? (
            <button
              type="button"
              onClick={() => onSelect(!selected)}
              className="box-border flex h-6 w-6 shrink-0 items-center justify-center rounded-[8px] border-[1.5px] border-accent bg-transparent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 data-checked:border-accent data-checked:bg-accent"
              aria-label={selected ? "Deselect" : "Select"}
              data-checked={selected ? "true" : undefined}
            >
              {selected && (
                <svg
                  className="h-3.5 w-3.5 text-white"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 6l2.5 2.5L10 4" />
                </svg>
              )}
            </button>
          ) : (
            <span
              className="box-border block h-6 w-6 shrink-0 rounded-[8px] border-[1.5px] border-accent"
              aria-hidden="true"
            />
          )}
          <span className="flex h-5 w-9 shrink-0 items-center font-semibold text-text-rank text-xl lg:text-2xl leading-[20px]">
            #{rank}
          </span>
        </div>

        <div className="flex min-w-0 flex-1 flex-row items-center gap-3 py-2 min-[1025px]:gap-6">
          <div className="relative h-[72px] w-[83px] shrink-0 overflow-hidden rounded-[8px] bg-surface-light">
            <Image
              src={imageUrl ?? getMockImageSrc(bull.id)}
              alt=""
              width={83}
              height={72}
              className="object-cover"
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col items-start gap-2 overflow-hidden min-[1025px]:gap-4">
            <div className="min-w-0 flex flex-col items-start gap-1 min-[1025px]:gap-2">
              <p
                className="truncate font-semibold text-text-body text-sm sm:text-2xl leading-[20px]"
                title={`Toro #${bull.caravana}`}
              >
                Toro #{bull.caravana}
              </p>
              <p className="truncate font-medium text-text-body text-sm leading-[20px]">
                {bull.raza} · {bull.edadMeses} meses
              </p>
            </div>
            <div className="flex min-w-0 flex-row flex-wrap items-start gap-2">
              {tag1 && (
                <span
                  className="box-border flex shrink-0 items-center justify-center rounded-[8px] border-[1.5px] border-primary bg-surface-success px-2 py-1.5 font-semibold text-success"
                  style={{ fontSize: "10px", lineHeight: "12px" }}
                >
                  {tag1}
                </span>
              )}
              {tag2 && (
                <span
                  className="box-border flex shrink-0 items-center justify-center rounded-[8px] border-[1.5px] border-accent-lavender bg-surface-accent px-2 py-1.5 font-semibold text-accent"
                  style={{ fontSize: "10px", lineHeight: "12px" }}
                >
                  Para {tag2}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className={
          isCompact
            ? "hidden"
            : "hidden h-[144px] w-px shrink-0 bg-border-light min-[1025px]:block"
        }
        aria-hidden="true"
      />

      <div
        className={
          isCompact
            ? "flex min-w-0 basis-full flex-col gap-3"
            : "flex min-w-0 basis-full flex-col gap-3 min-[1025px]:basis-auto min-[1025px]:min-w-0 min-[1025px]:flex-1 min-[1025px]:flex-row min-[1025px]:items-center min-[1025px]:gap-6"
        }
      >
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 overflow-hidden">
          <div className="flex flex-row items-center justify-between gap-2 min-[1025px]:gap-6">
            <p
              className="shrink-0 font-medium uppercase tracking-[0.04em] text-text-body"
              style={{ fontSize: "14px", lineHeight: "20px" }}
            >
              Bull score
            </p>
            <span
              className="shrink-0 font-semibold text-text-body"
              style={{ fontSize: "24px", lineHeight: "20px" }}
            >
              {scoreDisplay}
            </span>
          </div>
          <div className="relative h-[8.5px] w-full min-w-0 overflow-hidden rounded-[8px] bg-surface-light">
            <div
              className="absolute inset-y-0 left-0 rounded-[8px] bg-primary"
              style={{ width: `${Math.round(scoreNorm * 100)}%` }}
            />
          </div>
          {bull.caracteristicaDestacada && (
            <p
              className={`min-w-0 wrap-break-word font-normal text-text-body ${isCompact ? "line-clamp-2" : "line-clamp-2 min-[1025px]:line-clamp-none"}`}
              style={{ fontSize: "16px", lineHeight: "20px" }}
              title={bull.caracteristicaDestacada}
            >
              {bull.caracteristicaDestacada}
            </p>
          )}
        </div>

        <div
          className={
            isCompact
              ? "hidden"
              : "relative mx-auto hidden h-[88px] w-[88px] shrink-0 min-[1025px]:mx-0 min-[1025px]:block"
          }
        >
          <Image
            src="/icons/radar.png"
            alt=""
            width={88}
            height={88}
            className="object-contain"
          />
        </div>
      </div>

      <div
        className={
          isCompact
            ? "flex min-w-0 basis-full flex-row items-center justify-between gap-4"
            : "flex min-w-0 basis-full flex-row items-center justify-between gap-4 min-[1025px]:hidden"
        }
      >
        <div className="w-10 shrink-0" aria-hidden="true" />
        <div className="relative flex flex-1 items-center justify-center">
          <Image
            src="/icons/radar.png"
            alt=""
            width={88}
            height={88}
            className="object-contain"
          />
        </div>
        <BullCardActions
          bullId={bull.id}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
          isFavoritePending={isFavoritePending}
          onViewDetails={onViewDetails}
        />
      </div>

      <div
        className={
          isCompact
            ? "hidden"
            : "hidden h-[144px] w-px shrink-0 bg-border-light min-[1025px]:block"
        }
        aria-hidden="true"
      />

      <div className={isCompact ? "hidden" : "hidden min-[1025px]:flex"}>
        <BullCardActions
          bullId={bull.id}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
          isFavoritePending={isFavoritePending}
          onViewDetails={onViewDetails}
        />
      </div>
    </article>
  );
}
