"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "submitting" | "saved" | "error" | "skipped";

/** Bouton "primaire" et bouton "secondaire" partagent la même classe de taille de
 *  police (§9 : "même taille de police que le primaire") — seule la couleur diffère. */
const BUTTON_BASE =
  "rounded-full px-6 py-3 text-[14px] font-semibold transition-colors disabled:opacity-50";

export default function EmailCapture({ score }: { score: number | null }) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!email || !consent) return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, score }),
      });
      setStatus(res.ok ? "saved" : "error");
    } catch {
      setStatus("error");
    }
  }

  function handleSkip() {
    setStatus("skipped");
  }

  if (status === "saved" || status === "error" || status === "skipped") {
    return (
      <div className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-5 py-4 text-center text-[13.5px] leading-relaxed">
        {status === "saved" && <p className="text-neutral-200">C&rsquo;est bon. Ta progression est enregistrée.</p>}
        {status === "error" && (
          <p className="text-neutral-200">
            On n&rsquo;a pas pu enregistrer ton email. Ta progression est sauvegardée sur cet
            appareil.
          </p>
        )}
        {status === "skipped" && <p className="text-neutral-200">Ta progression reste sur cet appareil.</p>}
        <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-neutral-500">
          Le parcours détaillé arrive bientôt.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="flex w-full flex-col gap-3">
      <div className="flex flex-col gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ton@email.com"
          autoComplete="email"
          className="rounded-md border border-neutral-700 bg-neutral-950 px-4 py-3 text-[14px] text-neutral-100 outline-none focus:border-red-600"
        />
        <label className="flex items-start gap-2 text-[12px] leading-snug text-neutral-400">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5"
          />
          <span>
            J&rsquo;accepte de recevoir un email pour retrouver ma progression et être prévenu
            avant Doomsday. Désinscription en un clic.
          </span>
        </label>
      </div>

      <div className="flex flex-col gap-2.5 sm:flex-row">
        <button
          type="submit"
          disabled={!email || !consent || status === "submitting"}
          className={`${BUTTON_BASE} flex-1 bg-red-600 text-white hover:bg-red-500`}
        >
          Sauvegarder ma progression
        </button>
        <button
          type="button"
          onClick={handleSkip}
          className={`${BUTTON_BASE} flex-1 border border-neutral-700 text-neutral-300 hover:border-neutral-500`}
        >
          Continuer sans sauvegarder
        </button>
      </div>
    </form>
  );
}
