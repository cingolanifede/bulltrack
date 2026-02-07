"use client";

import { useState } from "react";
import { Toggle } from "@/components/molecules/Toggle";
import { Checkbox } from "@/components/atoms/Checkbox";
import { Dropdown } from "@/components/atoms/Dropdown";
import type { OrigenFilter, PelajeFilter, SortByScore } from "@/lib/types";
import { Icon } from "@/components/atoms/Icon";

type SidebarFiltersProps = {
  origen: OrigenFilter | undefined;
  onOrigenChange: (value: OrigenFilter | undefined) => void;
  paraVaquillona: boolean;
  onParaVaquillonaChange: (value: boolean) => void;
  pelaje: PelajeFilter | undefined;
  onPelajeChange: (value: PelajeFilter | undefined) => void;
  sortByScore: SortByScore;
  onSortByScoreChange: (value: SortByScore) => void;
};

type OrigenOption =
  | { key: "all"; label: string; value: undefined }
  | { key: OrigenFilter; label: string; value: OrigenFilter };

const ORIGEN_OPTIONS: OrigenOption[] = [
  { key: "all", label: "Todos", value: undefined },
  { key: "propio", label: "Toros propios", value: "propio" },
  { key: "catalogo", label: "Catálogo", value: "catalogo" },
  { key: "favoritos", label: "Favoritos", value: "favoritos" },
];

const PELAJE_LABELS: { value: PelajeFilter | undefined; label: string }[] = [
  { value: undefined, label: "Todos" },
  { value: "negro", label: "Negro" },
  { value: "colorado", label: "Colorado" },
];

export function SidebarFilters({
  origen,
  onOrigenChange,
  paraVaquillona,
  onParaVaquillonaChange,
  pelaje,
  onPelajeChange,
  sortByScore,
  onSortByScoreChange,
}: SidebarFiltersProps) {
  const [pelajeOpen, setPelajeOpen] = useState(false);

  const currentPelajeLabel =
    PELAJE_LABELS.find((p) => p.value === pelaje)?.label ?? "Todos";

  const currentOrderLabel =
    sortByScore === "desc" ? "Score mejor a peor" : "Score peor a mejor";

  return (
    <div className="space-y-6 text-white">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase leading-5 tracking-[0.04em] text-white">
            Filtros activos
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-[14px] leading-5 text-white">Origen</p>
          <div className="space-y-2">
            {ORIGEN_OPTIONS.map((opt) => {
              const isSelected =
                opt.value === undefined ? !origen : origen === opt.value;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() =>
                    onOrigenChange(
                      opt.value === undefined ? undefined : opt.value
                    )
                  }
                  className={`flex h-14 w-full items-center justify-between rounded-[8px] bg-surface-elevated px-3 text-left text-sm transition-colors ${
                    isSelected
                      ? "border border-primary"
                      : "border border-transparent hover:border-white/20"
                  }`}
                >
                  <span>{opt.label}</span>
                  <Checkbox checked={isSelected} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-white" />

      <div className="space-y-3">
        <p className="text-sm font-medium uppercase leading-5 tracking-[0.04em] text-white">
          Filtros productivos
        </p>
        <div className="space-y-1 rounded-[8px] bg-surface-elevated px-3 py-2">
          <Toggle
            label={
              <div className="space-y-1 flex flex-col">
                <span className="text-sm font-medium text-white">
                  Para vaquillona
                </span>
                <p className="text-xs text-white">Facilidad de parto</p>
              </div>
            }
            checked={paraVaquillona}
            onChange={onParaVaquillonaChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[14px] leading-5 text-white">Pelaje</p>
        <Dropdown
          label="Todos"
          value={pelaje ?? ("__all" as any)}
          options={[
            { label: "Todos", value: "__all" as any },
            { label: "Negro", value: "negro" },
            { label: "Colorado", value: "colorado" },
          ]}
          onChange={(v) =>
            onPelajeChange(v === "__all" ? undefined : (v as PelajeFilter))
          }
        />
      </div>

      <div className="space-y-2">
        <p className="text-[12px] font-medium uppercase leading-5 tracking-[0.04em] text-white">
          Ordenamiento
        </p>
        <Dropdown
          label={currentOrderLabel}
          value={sortByScore}
          options={[
            { label: "Score mejor a peor", value: "desc" },
            { label: "Score peor a mejor", value: "asc" },
          ]}
          onChange={(v) => onSortByScoreChange(v as SortByScore)}
        />
      </div>

      <div className="h-px w-full bg-white" />

      <div className="space-y-3 rounded-[8px] border border-border-sidebar bg-surface-elevated p-4 flex flex-col items-center justify-center">
        <div className="space-y-2">
          <p className="text-[14px] font-semibold leading-5 text-white">
            Objetivo actual
          </p>
          <p className="text-[14px] font-light leading-5 text-white">
            Maximizar la ganancia de peso (destete) manteniendo facilidad de
            parto.
          </p>
        </div>
        <button
          type="button"
          className="max-w-44 mt-2 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-primary bg-surface-panel text-[14px] font-semibold text-primary"
        >
          <Icon name="arrow-left" className="h-6 w-6" />
          Editar criterios
        </button>
      </div>
    </div>
  );
}
