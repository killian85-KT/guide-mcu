"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadProgress, seenSeasonIdSet } from "@/lib/progress";
import { computeScore, computeThreeNumbers, type ScoreResult, type ThreeNumbers as ThreeNumbersResult } from "@/lib/score";
import ScoreDisplay from "@/components/ScoreDisplay";
import ScoreFormula from "@/components/ScoreFormula";
import ThreeNumbers from "@/components/ThreeNumbers";
import EmailCapture from "@/components/EmailCapture";

export default function ScorePage() {
  // null tant que la lecture localStorage (client uniquement) n'a pas eu lieu.
  const [state, setState] = useState<{ score: ScoreResult; numbers: ThreeNumbersResult } | null>(null);

  useEffect(() => {
    const seen = seenSeasonIdSet(loadProgress());
    setState({ score: computeScore(seen), numbers: computeThreeNumbers(seen) });
  }, []);

  if (!state) {
    return <main className="mx-auto max-w-md px-5 py-12 text-center text-sm text-ink-3">Calcul en cours…</main>;
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center gap-7 px-5 py-12">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold">Ton score</p>
      <h1 className="font-serif text-xl font-semibold text-ink">Ta préparation avant Doomsday</h1>

      <ScoreDisplay result={state.score} />

      {!state.score.belowMinimum && (
        <>
          <ScoreFormula result={state.score} />
          <ThreeNumbers numbers={state.numbers} />
        </>
      )}

      <EmailCapture score={state.score.score} />

      <Link href="/" className="text-[12px] text-ink-3 underline underline-offset-4">
        Changer mon point de départ
      </Link>
    </main>
  );
}
