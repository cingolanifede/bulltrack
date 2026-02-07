export const BULL_SCORE_WEIGHTS = {
  crecimiento: 0.3,
  facilidad_parto: 0.25,
  reproduccion: 0.2,
  moderacion: 0.15,
  carcasa: 0.1,
} as const;

export function computeBullScore(stats: {
  crecimiento: number;
  facilidad_parto: number;
  reproduccion: number;
  moderacion: number;
  carcasa: number;
}): number {
  const { crecimiento, facilidad_parto, reproduccion, moderacion, carcasa } =
    stats;
  const w = BULL_SCORE_WEIGHTS;
  return (
    crecimiento * w.crecimiento +
    facilidad_parto * w.facilidad_parto +
    reproduccion * w.reproduccion +
    moderacion * w.moderacion +
    carcasa * w.carcasa
  );
}

export function bullScoreSqlExpression(alias: string): string {
  const w = BULL_SCORE_WEIGHTS;
  return `(
    (${alias}.stats->>'crecimiento')::numeric * ${w.crecimiento} +
    (${alias}.stats->>'facilidad_parto')::numeric * ${w.facilidad_parto} +
    (${alias}.stats->>'reproduccion')::numeric * ${w.reproduccion} +
    (${alias}.stats->>'moderacion')::numeric * ${w.moderacion} +
    (${alias}.stats->>'carcasa')::numeric * ${w.carcasa}
  )`;
}
