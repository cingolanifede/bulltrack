"use client";

import { useState } from "react";
import { Icon } from "./Icon";

type Option<T> = {
  label: string;
  value: T;
};

type DropdownProps<T> = {
  label: string;
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
};

export function Dropdown<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: DropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const active = options.find((o) => o.value === value)?.label ?? label;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-14 w-full items-center justify-between rounded-[8px] bg-surface-elevated px-3 text-sm text-white"
      >
        <span>{active}</span>
        <Icon name="arrow-down" className="h-6 w-6" />
      </button>
      {open && (
        <div className="absolute z-20 mt-1 w-full rounded-[8px] border border-white/10 bg-surface-elevated py-1 text-sm text-white shadow-lg">
          {options.map((opt) => (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-3 py-2 text-left hover:bg-white/5 ${
                opt.value === value ? "text-primary" : ""
              }`}
            >
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
