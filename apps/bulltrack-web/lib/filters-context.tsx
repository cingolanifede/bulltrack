"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { OrigenFilter, PelajeFilter, SortByScore } from "./types";

type FiltersContextValue = {
  origen: OrigenFilter | undefined;
  setOrigen: (value: OrigenFilter | undefined) => void;
  paraVaquillona: boolean;
  setParaVaquillona: (value: boolean) => void;
  pelaje: PelajeFilter | undefined;
  setPelaje: (value: PelajeFilter | undefined) => void;
  sortByScore: SortByScore;
  setSortByScore: (value: SortByScore) => void;
};

const FiltersContext = createContext<FiltersContextValue | undefined>(
  undefined
);

export function FiltersProvider({ children }: { children: React.ReactNode }) {
  const [origen, setOrigen] = useState<OrigenFilter | undefined>(undefined);
  const [paraVaquillona, setParaVaquillona] = useState(false);
  const [pelaje, setPelaje] = useState<PelajeFilter | undefined>(undefined);
  const [sortByScore, setSortByScore] = useState<SortByScore>("desc");

  const value = useMemo<FiltersContextValue>(
    () => ({
      origen,
      setOrigen,
      paraVaquillona,
      setParaVaquillona,
      pelaje,
      setPelaje,
      sortByScore,
      setSortByScore,
    }),
    [origen, paraVaquillona, pelaje, sortByScore]
  );

  return (
    <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>
  );
}

export function useFilters(): FiltersContextValue {
  const ctx = useContext(FiltersContext);
  if (!ctx) {
    throw new Error("useFilters must be used within FiltersProvider");
  }
  return ctx;
}
