import Countdown from "@/components/Countdown";
import PaceIndicator from "@/components/PaceIndicator";
import DropoffSelector from "@/components/DropoffSelector";
import { getDefaultPath } from "@/lib/paths";

export default function AccueilPage() {
  const path = getDefaultPath();
  const hours = Math.round((path.total_runtime_min / 60) * 10) / 10;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center gap-8 px-5 py-12 text-center">
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-col items-center gap-1.5">
          <h1 className="font-serif text-[2.5rem] font-semibold leading-tight text-ink">
            Avengers : Doomsday
          </h1>
          <p className="text-sm text-ink-2">Ton parcours de rattrapage personnalisé</p>
        </div>
        <h2 className="font-serif text-3xl font-semibold leading-tight text-ink">
          Ne sois plus jamais largué.
        </h2>
        <p className="max-w-xs text-sm leading-relaxed text-ink-2">
          Dis-nous où tu t&rsquo;es arrêté. On te donne ton score de préparation
          réelle et ton parcours pour rattraper le reste.
        </p>
      </div>

      <Countdown />
      <PaceIndicator />

      <div className="grid w-full grid-cols-3 gap-2">
        <div className="rounded-md border border-hairline bg-paper-warm px-2 py-3">
          <div className="font-mono text-lg text-ink">{path.unit_count}</div>
          <div className="mt-0.5 text-[10px] uppercase tracking-wide text-ink-3">
            unités clés
          </div>
        </div>
        <div className="rounded-md border border-hairline bg-paper-warm px-2 py-3">
          <div className="font-mono text-lg text-ink">{hours}h</div>
          <div className="mt-0.5 text-[10px] uppercase tracking-wide text-ink-3">
            pour tout voir
          </div>
        </div>
        <div className="rounded-md border border-hairline bg-paper-warm px-2 py-3">
          <div className="font-mono text-lg text-ink">Gratuit</div>
          <div className="mt-0.5 text-[10px] uppercase tracking-wide text-ink-3">
            sans inscription
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-3 text-left">
        <p className="text-center font-mono text-[10px] uppercase tracking-widest text-ink-3">
          Où t&rsquo;es-tu arrêté ?
        </p>
        <DropoffSelector />
      </div>
    </main>
  );
}
