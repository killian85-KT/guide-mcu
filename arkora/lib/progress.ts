/**
 * Progression anonyme — Lot 2 : localStorage exclusivement (§11, règle T5).
 * Aucun appel serveur ici. La migration vers `progress` (Supabase) arrive au Lot 3.
 */
import type { ProgressMap, ProgressSource } from "./types";

const STORAGE_KEY = "arkora.progress.v1";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function loadProgress(): ProgressMap {
  if (!isBrowser()) return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

export function saveProgress(progress: ProgressMap): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Quota dépassé / navigation privée : échec silencieux, ne bloque jamais le produit.
  }
}

export function toggleUnit(
  progress: ProgressMap,
  seasonId: string,
  source: ProgressSource = "manual"
): ProgressMap {
  const next = { ...progress };
  if (next[seasonId]) {
    delete next[seasonId];
  } else {
    next[seasonId] = { seenAt: new Date().toISOString(), source };
  }
  return next;
}

/** Pré-cochage par preset de décrochage (§11 : point de départ ajustable, pas un résultat). */
export function applyPreset(progress: ProgressMap, seasonIds: readonly string[]): ProgressMap {
  const next = { ...progress };
  const now = new Date().toISOString();
  for (const id of seasonIds) {
    next[id] = { seenAt: now, source: "preset" };
  }
  return next;
}

export function seenSeasonIdSet(progress: ProgressMap): Set<string> {
  return new Set(Object.keys(progress));
}
