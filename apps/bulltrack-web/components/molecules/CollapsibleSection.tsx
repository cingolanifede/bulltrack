"use client";

import { useId, useState } from "react";
import { Icon } from "@/components/atoms/Icon";

type CollapsibleSectionProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  ariaLabel?: string;
  className?: string;
};

export function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  ariaLabel,
  className = "",
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <div
      className={`overflow-hidden rounded-lg bg-surface-light ${className}`}
      data-state={isOpen ? "open" : "closed"}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-border-light focus:ring-inset"
        aria-expanded={isOpen}
        aria-controls={contentId}
        aria-label={ariaLabel ?? title}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span
            className="flex shrink-0 items-center justify-center text-text-body"
            aria-hidden="true"
          >
            <Icon name="info" className="h-5 w-5" />
          </span>
          <span className="font-bold text-text-body text-base">{title}</span>
        </div>
        <span
          className={`shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <Icon name="chevron-down" className="h-6 w-6 text-text-body" />
        </span>
      </button>
      <div
        id={contentId}
        role="region"
        aria-label={title}
        hidden={!isOpen}
        className={isOpen ? "border-t border-border-light px-4 py-3" : "hidden"}
      >
        {children}
      </div>
    </div>
  );
}
