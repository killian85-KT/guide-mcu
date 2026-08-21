#!/usr/bin/env python3
"""Génère paths.json (parcours Essentiel canonique) et legacy-title-map.json."""
import json, re, unicodedata
from pathlib import Path

D = Path(__file__).parent / "data"
LEGACY_HTML = ["protocole-doomsday.html", "guide-mcu-interactif.html", "guide-mcu-complet.html"]
LEGACY_DIR = Path("/mnt/project")

ids = json.loads((D / "ids.json").read_text(encoding="utf-8"))

# ── paths.json ─────────────────────────────────────────────────────────────
ess = []
for w in ids:
    for s in w["seasons"]:
        if s["chrono_order"] is not None:
            ess.append((s["chrono_order"], s["id"], w["id"], w["title"], s["number"],
                        s["narrative_weight"], s["runtime_min"]))
ess.sort()

paths = {
    "version": "1.0",
    "generated_for": "ARKORA V1",
    "paths": [{
        "id": "essentiel",
        "name": "Parcours Essentiel",
        "description": "Le minimum vital pour comprendre Avengers: Doomsday.",
        "universe_id": "mcu",
        "target_event_work_id": "mcu-avengers-doomsday",
        "is_default": True,
        "work_count": len({e[2] for e in ess}),
        "unit_count": len(ess),
        "total_runtime_min": sum(e[6] for e in ess),
        "total_weight": sum(e[5] for e in ess),
        "units": [{
            "position": e[0],
            "season_id": e[1],
            "work_id": e[2],
            "label": e[3] + (f" — Saison {e[4]}" if e[4] >= 1 else ""),
            "narrative_weight": e[5],
            "runtime_min": e[6],
        } for e in ess],
    }],
}
(D / "paths.json").write_text(json.dumps(paths, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")


# ── legacy-title-map.json ──────────────────────────────────────────────────
def norm(x):
    x = unicodedata.normalize("NFD", x.lower())
    x = "".join(c for c in x if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]+", "", x)


# index normalisé -> season_id (mono-saison seulement, sinon ambigu)
index = {}
# L'événement cible et les œuvres non sorties ne sont JAMAIS cochables :
# aucune progression legacy ne doit pouvoir les atteindre.
EXCLUDED = {w["id"] for w in ids if w["is_target_event"] or not w["is_released"]}
for w in ids:
    if w["id"] in EXCLUDED:
        continue
    if len(w["seasons"]) == 1:
        sid = w["seasons"][0]["id"]
        for cand in [w["title"]] + w["titles_legacy"]:
            index.setdefault(norm(cand), sid)
    else:
        # multi-saisons : on mappe chaque titre legacy portant un numéro de saison
        for cand in w["titles_legacy"]:
            m = re.search(r"S(\d+)", cand, re.I) or re.search(r"Saison\s*(\d+)", cand, re.I)
            if m:
                n = int(m.group(1))
                match = [s for s in w["seasons"] if s["number"] == n]
                if match:
                    index.setdefault(norm(cand), match[0]["id"])

# Alias manuels : variantes de titre du guide legacy sans correspondance automatique.
# Les agrégats ambigus (« Luke Cage / Iron Fist / The Defenders », « Agent Carter (S1-S2) »)
# sont volontairement laissés NON mappés : ils désignent plusieurs unités.
ALIASES = {
    "Éternals": "mcu-les-eternels-s0",
    "Ant-Man : Quantumania": "mcu-ant-man-et-la-guepe-quantumania-s0",
    "Captain America : First Avenger — 2011": "mcu-captain-america-first-avenger-s0",
    "Thor — Prologue asgardien": "mcu-thor-s0",
    "Thor (flashback Asgard)": "mcu-thor-s0",
}
for k, v in ALIASES.items():
    index.setdefault(norm(k), v)

# titres réellement présents dans les HTML legacy
found, unmatched = {}, []
for fn in LEGACY_HTML:
    p = LEGACY_DIR / fn
    if not p.exists():
        continue
    for t in re.findall(r'\{t:"(.*?)"', p.read_text(encoding="utf-8")):
        sid = index.get(norm(t))
        if sid:
            found[t] = sid
        elif t not in unmatched:
            unmatched.append(t)

mapping = {
    "version": "1.0",
    "purpose": "Récupération de la progression localStorage du guide (clé = titre) "
               "vers les season_id V1. Table FIGÉE : ne jamais régénérer après le lot 3.",
    "rules": [
        "Un titre absent de `map` est ignoré SILENCIEUSEMENT. Jamais d'erreur affichée.",
        "La correspondance se fait sur le titre normalisé (minuscules, sans accents, sans ponctuation).",
        "`unmatched` est informatif : ces titres legacy n'ont volontairement pas de cible.",
    ],
    "normalization": "NFD -> strip combining marks -> lowercase -> [^a-z0-9] removed",
    "map": dict(sorted(found.items())),
    "unmatched": sorted(unmatched),
}
(D / "legacy-title-map.json").write_text(
    json.dumps(mapping, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")

print(f"paths.json          : {paths['paths'][0]['work_count']} œuvres · "
      f"{paths['paths'][0]['unit_count']} unités · "
      f"{paths['paths'][0]['total_runtime_min']} min · "
      f"poids {paths['paths'][0]['total_weight']}")
print(f"legacy-title-map    : {len(found)} titres mappés · {len(unmatched)} non mappés")
for u in unmatched:
    print("   non mappé:", u)
