import type { ThreeNumbers as ThreeNumbersResult } from "@/lib/score";

export default function ThreeNumbers({ numbers }: { numbers: ThreeNumbersResult }) {
  return (
    <div className="grid w-full grid-cols-3 gap-2">
      <Stat value={numbers.unitsRemaining} label="œuvres restantes" />
      <Stat value={`${numbers.hoursRemaining}h`} label="restantes" />
      <Stat
        value={numbers.minutesPerDay === null ? "—" : `${numbers.minutesPerDay}`}
        label="min / jour"
      />
    </div>
  );
}

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-md border border-hairline bg-paper-warm px-2 py-3 text-center">
      <div className="font-mono text-lg tabular-nums text-ink">{value}</div>
      <div className="mt-0.5 text-[10px] uppercase tracking-wide text-ink-3">{label}</div>
    </div>
  );
}
