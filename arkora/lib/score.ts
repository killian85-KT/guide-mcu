/**
 * SEUL endroit où la formule du Score existe (§17, règle T1).
 * Score = round(100 × Σ poids des unités Essentiel VUES / Σ poids des unités Essentiel)
 * Le dénominateur vient toujours de paths.json (règle R3) — jamais d'une constante.
 */
import { getEssentielPath } from "./paths";
import { TARGET_EVENT_DATE_ISO } from "./constants";

/** R6 : sous ce seuil, on n'affiche pas de score. */
export const MIN_UNITS_FOR_SCORE = 3;

export interface ScoreResult {
  /** null tant que le seuil minimum (R6) n'est pas atteint. */
  score: number | null;
  unitsSeen: number;
  unitsTotal: number;
  weightSeen: number;
  weightTotal: number;
  belowMinimum: boolean;
}

export function computeScore(seenSeasonIds: ReadonlySet<string>): ScoreResult {
  const path = getEssentielPath();
  const units = path.units; // unités du parcours Essentiel uniquement (règle R4)
  const unitsTotal = units.length;
  const weightTotal = path.total_weight;

  const seenUnits = units.filter((u) => seenSeasonIds.has(u.season_id));
  const unitsSeen = seenUnits.length;
  const weightSeen = seenUnits.reduce((sum, u) => sum + u.narrative_weight, 0);

  if (unitsSeen < MIN_UNITS_FOR_SCORE) {
    return { score: null, unitsSeen, unitsTotal, weightSeen, weightTotal, belowMinimum: true };
  }

  const score = Math.round((100 * weightSeen) / weightTotal);
  return { score, unitsSeen, unitsTotal, weightSeen, weightTotal, belowMinimum: false };
}

export interface ThreeNumbers {
  /** "œuvres restantes" au sens du §9 : unités Essentiel non vues. */
  unitsRemaining: number;
  hoursRemaining: number;
  /** null si la date cible est déjà passée. */
  minutesPerDay: number | null;
}

export function computeThreeNumbers(
  seenSeasonIds: ReadonlySet<string>,
  now: Date = new Date()
): ThreeNumbers {
  const path = getEssentielPath();
  const remaining = path.units.filter((u) => !seenSeasonIds.has(u.season_id));
  const unitsRemaining = remaining.length;
  const minutesRemaining = remaining.reduce((sum, u) => sum + u.runtime_min, 0);
  const hoursRemaining = Math.round((minutesRemaining / 60) * 10) / 10;

  const target = new Date(TARGET_EVENT_DATE_ISO);
  const msRemaining = target.getTime() - now.getTime();
  const daysRemaining = msRemaining > 0 ? msRemaining / 86_400_000 : 0;
  const minutesPerDay = daysRemaining > 0 ? Math.round(minutesRemaining / daysRemaining) : null;

  return { unitsRemaining, hoursRemaining, minutesPerDay };
}
