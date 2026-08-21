"use client";

import { useEffect, useState } from "react";
import { getDefaultPath, getAllPaths } from "@/lib/paths";
import { loadProgress, seenSeasonIdSet } from "@/lib/progress";
import { minutesPerDayUntilTarget } from "@/lib/score";

/** Seuil au-delà duquel on suggère de basculer sur un parcours plus léger.
 *  Paramètre du produit (donné explicitement), pas un compteur du catalogue —
 *  à distinguer des comptages d'œuvres/unités qui, eux, viennent toujours de paths.json. */
const SWITCH_THRESHOLD_MIN_PER_DAY = 120;

export default function PaceIndicator() {
  // undefined = pas encore monté côté client (évite tout écart d'hydratation,
  // la progression vit dans localStorage donc n'existe pas côté serveur).
  const [minutesPerDay, setMinutesPerDay] = useState<number | null | undefined>(undefined);

  useEffect(() => {
    function tick() {
      const path = getDefaultPath();
      const seen = seenSeasonIdSet(loadProgress());
      const remaining = path.units.filter((u) => !seen.has(u.season_id));
      const minutesRemaining = remaining.reduce((sum, u) => sum + u.runtime_min, 0);
      setMinutesPerDay(minutesPerDayUntilTarget(minutesRemaining, new Date()));
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (minutesPerDay === undefined || minutesPerDay === null) return null;

  const showSwitch = minutesPerDay > SWITCH_THRESHOLD_MIN_PER_DAY;
  const lighterPath = showSwitch
    ? getAllPaths()
        .filter((p) => p.id !== getDefaultPath().id)
        .sort((a, b) => a.total_runtime_min - b.total_runtime_min)[0]
    : null;

  return (
    <div className="text-center">
      <p className="text-[13px] text-white">
        À ce rythme : <span className="font-mono text-white">{minutesPerDay} min</span> par jour
      </p>
      {showSwitch && lighterPath && (
        <p className="mt-1 text-[12px] text-white">
          {lighterPath.name} reste jouable · change de parcours
        </p>
      )}
    </div>
  );
}
