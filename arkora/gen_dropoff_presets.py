#!/usr/bin/env python3
"""Génère data/dropoff-presets.json à partir des 6 presets validés par l'utilisateur
(validation explicite, hors Master Execution). Valide chaque season_id contre
paths.json (doit appartenir au parcours Essentiel, jamais Doomsday, jamais hors
parcours). Ne pas relancer sans revalidation explicite des cutoffs.
"""
import json
from pathlib import Path

D = Path(__file__).parent / "data"
OUT = D / "dropoff-presets.json"

paths = json.loads((D / "paths.json").read_text(encoding="utf-8"))
essentiel = next(p for p in paths["paths"] if p["id"] == "essentiel")
ESSENTIEL_IDS = [u["season_id"] for u in essentiel["units"]]  # ordre canonique
ESSENTIEL_SET = set(ESSENTIEL_IDS)

# Cutoffs = position (1-indexée) dans l'ordre paths.json jusqu'à laquelle chaque
# preset pré-coche. Reprend exactement la validation de l'utilisateur.
CUTOFFS = {
    "zero-vu": 0,
    "post-avengers-2012": 2,
    "post-homecoming": 4,
    "post-endgame": 6,
    "post-no-way-home": 9,
    "quasi-a-jour": 13,
}

LABELS = {
    "zero-vu": "Je pars de zéro",
    "post-avengers-2012": "Je me suis arrêté après Avengers",
    "post-homecoming": "Je me suis arrêté après Spider-Man: Homecoming",
    "post-endgame": "Je me suis arrêté après Endgame",
    "post-no-way-home": "Je me suis arrêté après No Way Home",
    "quasi-a-jour": "Je suis presque à jour",
}

DESCRIPTIONS = {
    "zero-vu": "Aucune unité pré-cochée : tu démarres le parcours Recommandé depuis le début.",
    "post-avengers-2012": "Tu as vu les débuts Iron Man et le premier Avengers, rien après.",
    "post-homecoming": "Tu as suivi la guerre civile et l'arrivée de Spider-Man, rien après.",
    "post-endgame": "Tu as vécu la fin de la Saga de l'Infini, rien depuis.",
    "post-no-way-home": "Tu as suivi Peter jusqu'à No Way Home et vu Loki Saison 1, rien depuis.",
    "quasi-a-jour": "J'ai suivi presque tout le parcours essentiel.",
}

# Ordre d'affichage = du moins avancé au plus avancé
ORDER = ["zero-vu", "post-avengers-2012", "post-homecoming", "post-endgame",
         "post-no-way-home", "quasi-a-jour"]

presets = []
for pid in ORDER:
    n = CUTOFFS[pid]
    precheck = ESSENTIEL_IDS[:n]
    presets.append({
        "id": pid,
        "label": LABELS[pid],
        "description": DESCRIPTIONS[pid],
        "precheck_season_ids": precheck,
    })

# ── Contrôles ──────────────────────────────────────────────────────────────
doc = {
    "version": "1.0",
    "purpose": "6 presets de décrochage (É1). Points de départ ajustables (§11), "
               "pas une reconstitution fidèle de l'historique réel de visionnage. "
               "Proposés par l'agent, validés explicitement par l'utilisateur — "
               "absents du document ARKORA-V1-MASTER-EXECUTION lui-même.",
    "source_path_id": "essentiel",
    "presets": presets,
}

for p in presets:
    ids = p["precheck_season_ids"]
    assert len(ids) == len(set(ids)), f"doublon dans {p['id']}"
    for sid in ids:
        assert sid in ESSENTIEL_SET, f"{sid} hors parcours Essentiel ({p['id']})"
    assert "mcu-avengers-doomsday-s0" not in ids, f"Doomsday coché dans {p['id']}"
    # ordre canonique respecté (préfixe de ESSENTIEL_IDS)
    assert ids == ESSENTIEL_IDS[: len(ids)], f"ordre non canonique dans {p['id']}"

# strictement croissant du moins avancé au plus avancé
counts = [len(p["precheck_season_ids"]) for p in presets]
assert counts == sorted(counts), "presets non ordonnés du moins au plus avancé"
assert len(set(p["id"] for p in presets)) == 6

OUT.write_text(json.dumps(doc, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")

for p in presets:
    print(f"{p['id']:22s} {len(p['precheck_season_ids']):2d} unités  "
          f"dernière = {p['precheck_season_ids'][-1] if p['precheck_season_ids'] else '—'}")
print(f"\n✅ {OUT} écrit, {len(presets)} presets, tous validés contre paths.json")
