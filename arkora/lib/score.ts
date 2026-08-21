/**
 * SEUL endroit où la formule du Score existe (§17, règle T1).
 * Score = round(100 × Σ poids des unités VUES du parcours actif / Σ poids du parcours actif)
 * Le dénominateur vient toujours de paths.json (règle R3) — jamais d'une constante.
 * "Parcours actif" = celui marqué is_default:true dans paths.json (paths.json v2.0).
 */
import { getDefaultPath } from "./paths";
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
  const path = getDefaultPath();
  const units = path.units; // unités du parcours actif uniquement (règle R4)
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
  /** "œuvres restantes" au sens du §9 : unités du parcours actif non vues. */
  unitsRemaining: number;
  hoursRemaining: number;
  minutesRemaining: number;
  /** null si la date cible est déjà passée. */
  minutesPerDay: number | null;
}

export function computeThreeNumbers(
  seenSeasonIds: ReadonlySet<string>,
  now: Date = new Date()
): ThreeNumbers {
  const path = getDefaultPath();
  const remaining = path.units.filter((u) => !seenSeasonIds.has(u.season_id));
  const unitsRemaining = remaining.length;
  const minutesRemaining = remaining.reduce((sum, u) => sum + u.runtime_min, 0);
  const hoursRemaining = Math.round((minutesRemaining / 60) * 10) / 10;
  const minutesPerDay = minutesPerDayUntilTarget(minutesRemaining, now);

  return { unitsRemaining, hoursRemaining, minutesRemaining, minutesPerDay };
}

/** jours_restants = Math.ceil(diff_ms / 86400000) ; minutes_par_jour = round(minutes / jours).
 *  null si la date cible est déjà passée (aucun jour restant sur lequel répartir). */
export function minutesPerDayUntilTarget(minutesRemaining: number, now: Date = new Date()): number | null {
  const target = new Date(TARGET_EVENT_DATE_ISO);
  const msRemaining = target.getTime() - now.getTime();
  if (msRemaining <= 0) return null;
  const daysRemaining = Math.ceil(msRemaining / 86_400_000);
  return Math.round(minutesRemaining / daysRemaining);
}
