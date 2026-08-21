import type { ScoreResult } from "@/lib/score";
import { MIN_UNITS_FOR_SCORE } from "@/lib/score";

export default function ScoreDisplay({ result }: { result: ScoreResult }) {
  if (result.belowMinimum) {
    return (
      <div className="rounded-lg border border-hairline bg-paper-warm px-5 py-8 text-center">
        <p className="text-sm text-ink-2">
          Coche au moins {MIN_UNITS_FOR_SCORE} œuvres pour calculer ton score.
        </p>
        <p className="mt-1 font-mono text-[11px] text-ink-3">
          {result.unitsSeen}/{MIN_UNITS_FOR_SCORE} coché{result.unitsSeen > 1 ? "s" : ""}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <div className="font-mono text-6xl tabular-nums text-gold">
        {result.score}%
      </div>
      <p className="text-[13px] text-ink-2">
        Calculé sur {result.unitsTotal} unités du parcours Essentiel.
      </p>
    </div>
  );
}
