import pathsData from "@/data/paths.json";
import dropoffData from "@/data/dropoff-presets.json";
import type { Path, DropoffPreset } from "./types";

const ALL_PATHS = pathsData.paths as unknown as Path[];

export function getAllPaths(): Path[] {
  return ALL_PATHS;
}

/** Le parcours actif par défaut : celui marqué is_default:true dans paths.json.
 *  Aucun id de parcours n'est supposé en dur (paths.json v2.0 : sprint/recommande/films). */
export function getDefaultPath(): Path {
  const def = ALL_PATHS.find((p) => p.is_default);
  if (!def) {
    throw new Error("Aucun parcours is_default:true dans data/paths.json");
  }
  return def;
}

export function getPathById(id: string): Path {
  const p = ALL_PATHS.find((p) => p.id === id);
  if (!p) {
    throw new Error(`Parcours '${id}' introuvable dans data/paths.json`);
  }
  return p;
}

export function getDropoffPresets(): DropoffPreset[] {
  return dropoffData.presets as unknown as DropoffPreset[];
}
