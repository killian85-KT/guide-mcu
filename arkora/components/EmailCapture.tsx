"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "submitting" | "saved" | "error" | "skipped";

/** Bouton "primaire" et bouton "secondaire" partagent la même classe de taille de
 *  police (§9 : "même taille de police que le primaire") — seule la couleur diffère.
 *  Radius 5px imposé par la charte (rounded-btn), jamais de rouge ni de cyan. */
const BUTTON_BASE = "rounded-btn px-6 py-3 text-[14px] font-semibold transition-colors disabled:opacity-50";

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
      <div className="w-full rounded-lg border border-hairline bg-warm px-5 py-4 text-center text-[13.5px] leading-relaxed">
        {status === "saved" && <p className="text-ink">C&rsquo;est bon. Ta progression est enregistrée.</p>}
        {status === "error" && (
          <p className="text-ink">
            On n&rsquo;a pas pu enregistrer ton email. Ta progression est sauvegardée sur cet
            appareil.
          </p>
        )}
        {status === "skipped" && <p className="text-ink">Ta progression reste sur cet appareil.</p>}
        <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-signature">
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
          className="rounded-btn border border-hairline bg-white px-4 py-3 text-[14px] text-ink outline-none focus:border-navy"
        />
        <label className="flex items-start gap-2 text-[12px] leading-snug text-ink-soft">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 accent-navy"
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
          className={`${BUTTON_BASE} flex-1 bg-navy text-white hover:bg-navy/90`}
        >
          Sauvegarder ma progression
        </button>
        <button
          type="button"
          onClick={handleSkip}
          className={`${BUTTON_BASE} flex-1 border border-navy text-navy hover:bg-navy/5`}
        >
          Continuer sans sauvegarder
        </button>
      </div>
    </form>
  );
}
