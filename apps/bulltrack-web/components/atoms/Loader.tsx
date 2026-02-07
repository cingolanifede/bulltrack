"use client";

type LoaderSize = "sm" | "md" | "lg";
type LoaderVariant = "light" | "dark" | "onPrimary";

type LoaderProps = {
  size?: LoaderSize;
  label?: string;
  variant?: LoaderVariant;
  fullPage?: boolean;
  className?: string;
};

const sizeClasses: Record<LoaderSize, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-10 w-10 border-[3px]",
};

const variantClasses: Record<LoaderVariant, string> = {
  light: "border-zinc-300 border-t-zinc-600",
  dark: "border-border-muted border-t-primary",
  onPrimary: "border-surface-deep/20 border-t-surface-deep",
};

export function Loader({
  size = "md",
  label,
  variant = "dark",
  fullPage = false,
  className = "",
}: LoaderProps) {
  const content = (
    <div
      className={`inline-flex flex-col items-center gap-3 ${className}`}
      role="status"
      aria-label={label ?? "Loading"}
    >
      <div
        className={`animate-spin rounded-full ${sizeClasses[size]} ${variantClasses[variant]}`}
      />
      {label && (
        <span
          className={
            variant === "dark" || variant === "onPrimary"
              ? "text-sm text-zinc-400"
              : "text-sm text-zinc-500"
          }
        >
          {label}
        </span>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex min-h-dvh items-center justify-center p-4">
        {content}
      </div>
    );
  }

  return content;
}
