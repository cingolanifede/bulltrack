type BadgeProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "neutral";
};

export function Badge({
  children,
  className = "",
  variant = "default",
}: BadgeProps) {
  const styles =
    variant === "neutral"
      ? "bg-zinc-100 text-zinc-700"
      : "bg-zinc-900 text-white";
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${styles} ${className}`}
    >
      {children}
    </span>
  );
}
