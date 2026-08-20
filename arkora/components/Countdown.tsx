"use client";

import { useEffect, useState } from "react";
import { TARGET_EVENT_DATE_ISO } from "@/lib/constants";

interface Parts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  passed: boolean;
}

function computeParts(now: Date): Parts {
  const target = new Date(TARGET_EVENT_DATE_ISO);
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, passed: true };
  }
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    passed: false,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function Countdown() {
  // null tant que le composant n'a pas monté côté client : évite tout écart
  // d'hydratation entre le rendu serveur et l'heure réelle du navigateur.
  const [parts, setParts] = useState<Parts | null>(null);

  useEffect(() => {
    setParts(computeParts(new Date()));
    const id = setInterval(() => setParts(computeParts(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  if (parts?.passed) {
    return (
      <p className="text-sm uppercase tracking-widest text-ink-soft">
        Avengers : Doomsday est sorti.
      </p>
    );
  }

  const units: Array<[string, number | undefined]> = [
    ["Jours", parts?.days],
    ["Heures", parts?.hours],
    ["Min", parts?.minutes],
    ["Sec", parts?.seconds],
  ];

  return (
    <div className="flex gap-px" aria-label="Compte à rebours avant Avengers : Doomsday">
      {units.map(([label, value]) => (
        <div key={label} className="min-w-[64px] border border-hairline bg-warm px-3 py-2.5 text-center first:rounded-l-md last:rounded-r-md">
          <div className="font-mono text-2xl tabular-nums text-gold">
            {value === undefined ? "—" : pad(value)}
          </div>
          <div className="mt-1 font-mono text-[9px] uppercase tracking-widest text-signature">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}
