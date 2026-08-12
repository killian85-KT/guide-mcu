"use client";

import { useState } from "react";
import type { ScoreResult } from "@/lib/score";

export default function ScoreFormula({ result }: { result: ScoreResult }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mx-auto block font-mono text-[11px] uppercase tracking-wider text-neutral-500 underline decoration-dotted underline-offset-4"
        aria-expanded={open}
      >
        Comment c&rsquo;est calculé
      </button>
      {open && (
        <div className="mt-3 rounded-md border border-neutral-800 bg-neutral-900 px-4 py-3 text-[12.5px] leading-relaxed text-neutral-400">
          <p className="font-mono text-[11px] text-neutral-300">
            Score = round(100 × poids vu ÷ poids total)
          </p>
          <p className="mt-2">
            {result.weightSeen} / {result.weightTotal} de poids narratif coché, sur les
            unités du parcours Essentiel uniquement. Les œuvres hors parcours n&rsquo;entrent
            jamais dans ce calcul, même cochées.
          </p>
        </div>
      )}
    </div>
  );
}
