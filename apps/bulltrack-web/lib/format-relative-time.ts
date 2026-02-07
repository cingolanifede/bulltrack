/**
 * Returns a short Spanish relative time string (e.g. "hace 2 min").
 * @param timestampMs - Unix timestamp in milliseconds (e.g. from React Query dataUpdatedAt)
 */
export function formatRelativeTime(timestampMs: number): string {
  if (!timestampMs || timestampMs <= 0) return "";
  const now = Date.now();
  const diffMs = now - timestampMs;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffH = Math.floor(diffMin / 60);

  if (diffSec < 10) return "hace un momento";
  if (diffSec < 60) return `hace ${diffSec} s`;
  if (diffMin === 1) return "hace 1 min";
  if (diffMin < 60) return `hace ${diffMin} min`;
  if (diffH === 1) return "hace 1 h";
  if (diffH < 24) return `hace ${diffH} h`;
  return "hace más de un día";
}
