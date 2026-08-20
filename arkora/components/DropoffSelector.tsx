"use client";

import { useRouter } from "next/navigation";
import { getDropoffPresets, getDefaultPath } from "@/lib/paths";
import { loadProgress, applyPreset, saveProgress } from "@/lib/progress";

export default function DropoffSelector() {
  const router = useRouter();
  const presets = getDropoffPresets();
  const unitCount = getDefaultPath().unit_count; // dérivé de paths.json, jamais en dur

  function handleSelect(seasonIds: string[]) {
    const current = loadProgress();
    const next = applyPreset(current, seasonIds);
    saveProgress(next);
    router.push("/score");
  }

  return (
    <div className="flex flex-col gap-2.5" role="radiogroup" aria-label="Sélecteur de décrochage">
      {presets.map((preset) => (
        <button
          key={preset.id}
          type="button"
          onClick={() => handleSelect(preset.precheck_season_ids)}
          className="flex flex-col items-start gap-1 rounded-lg border border-hairline bg-warm px-4 py-3.5 text-left transition-colors hover:border-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy"
        >
          <span className="text-[15px] font-semibold text-ink">{preset.label}</span>
          <span className="text-[13px] leading-snug text-ink-soft">{preset.description}</span>
          <span className="mt-1 font-mono text-[10px] uppercase tracking-wider text-signature">
            {preset.precheck_season_ids.length}/{unitCount} unités pré-cochées
          </span>
        </button>
      ))}
    </div>
  );
}
