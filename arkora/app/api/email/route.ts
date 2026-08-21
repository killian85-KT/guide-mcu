import { NextResponse } from "next/server";

/**
 * Capture email (F6, §15). Un seul déclencheur en V1 : sauvegarde de progression.
 * La clé Brevo ne quitte jamais le serveur — ce fichier n'est jamais envoyé au client
 * (Route Handler, pas un composant "use client").
 * Un échec ici ne doit jamais bloquer l'accès au produit (§18, É2) : le client
 * continue quoi qu'il arrive, cette route ne fait que renvoyer succès/échec.
 */

interface EmailRequestBody {
  email?: unknown;
  score?: unknown;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: EmailRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    // Pas de clé configurée pour cet environnement : échec propre, pas un crash.
    return NextResponse.json({ ok: false, error: "brevo_not_configured" }, { status: 500 });
  }

  const listIdRaw = process.env.BREVO_LIST_ID;
  const listIds = listIdRaw ? [Number(listIdRaw)] : undefined;

  try {
    const res = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        email,
        listIds,
        updateEnabled: true,
        attributes: typeof body.score === "number" ? { SCORE_ARKORA: body.score } : undefined,
      }),
    });

    if (res.ok) {
      return NextResponse.json({ ok: true });
    }

    // Brevo renvoie 400 "duplicate_parameter" quand le contact existe déjà : avec
    // updateEnabled=true c'est un succès du point de vue du produit, pas une erreur.
    const payload: unknown = await res.json().catch(() => null);
    const code =
      payload && typeof payload === "object" && "code" in payload
        ? (payload as { code?: unknown }).code
        : undefined;
    if (res.status === 400 && code === "duplicate_parameter") {
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: false, error: "brevo_error" }, { status: 502 });
  } catch {
    return NextResponse.json({ ok: false, error: "brevo_unreachable" }, { status: 502 });
  }
}
