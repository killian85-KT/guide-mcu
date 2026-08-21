export type WorkKind = "film" | "series" | "oneshot" | "special";

export interface Season {
  id: string;
  number: number;
  runtime_min: number | null;
  runtime_is_estimate: boolean;
  narrative_weight: number | null;
  chrono_order: number | null;
}

export interface Work {
  id: string;
  universe_id: string;
  title: string;
  kind: WorkKind;
  is_released: boolean;
  is_target_event: boolean;
  titles_legacy: string[];
  seasons: Season[];
}

export interface PathUnit {
  position: number;
  season_id: string;
  work_id: string;
  label: string;
  narrative_weight: number;
  runtime_min: number;
}

export interface Path {
  id: string;
  name: string;
  description: string;
  universe_id: string;
  target_event_work_id: string;
  is_default: boolean;
  work_count: number;
  unit_count: number;
  total_runtime_min: number;
  total_weight: number;
  units: PathUnit[];
}

export interface DropoffPreset {
  id: string;
  label: string;
  description: string;
  precheck_season_ids: string[];
}

export type ProgressSource = "manual" | "preset" | "legacy_import";

export interface ProgressEntry {
  seenAt: string;
  source: ProgressSource;
}

/** season_id -> entrée de progression. Miroir client de la table `progress` (§10). */
export type ProgressMap = Record<string, ProgressEntry>;
