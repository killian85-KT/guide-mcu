import pathsData from "@/data/paths.json";
import dropoffData from "@/data/dropoff-presets.json";
import type { Path, DropoffPreset } from "./types";

const ALL_PATHS = pathsData.paths as unknown as Path[];

/** Le parcours Essentiel — seul parcours livré en V1 (§6 : Recommandé/Puriste/Intégrale = V1.1). */
export function getEssentielPath(): Path {
  const essentiel = ALL_PATHS.find((p) => p.id === "essentiel");
  if (!essentiel) {
    throw new Error("Parcours 'essentiel' introuvable dans data/paths.json");
  }
  return essentiel;
}

export function getDropoffPresets(): DropoffPreset[] {
  return dropoffData.presets as unknown as DropoffPreset[];
}
