export function BullTableSkeleton() {
  const rows = 5;
  return (
    <div className="scrollbar-thin overflow-x-auto rounded-xl border border-zinc-200 bg-white">
      <div className="animate-pulse min-w-[600px]">
        <div className="flex border-b border-zinc-200 bg-zinc-50 px-3 py-3 sm:px-4">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
              key={i}
              className="h-4 flex-1 rounded bg-zinc-200 last:w-12"
              style={{ maxWidth: i === 1 ? 80 : i === 7 ? 48 : undefined }}
            />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, r) => (
          <div
            key={r}
            className="flex gap-4 border-b border-zinc-100 px-3 py-3 last:border-0 sm:px-4"
          >
            <div className="h-4 w-12 rounded bg-zinc-100" />
            <div className="h-4 flex-1 max-w-[140px] rounded bg-zinc-100" />
            <div className="h-4 w-16 rounded bg-zinc-100" />
            <div className="h-4 w-14 rounded bg-zinc-100" />
            <div className="h-4 w-14 rounded bg-zinc-100" />
            <div className="h-4 w-10 rounded bg-zinc-100" />
            <div className="h-4 w-8 rounded bg-zinc-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
