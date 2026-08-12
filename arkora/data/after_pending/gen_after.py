#!/usr/bin/env python3
"""Génère les 6 fichiers AFTER V1 (structure + requires_seen).

RÈGLE CENTRALE : un bloc n'est rendu QUE si requires_seen ⊆ progression.
Ordre des blocs figé par DELTA V1.2 §D4.
Le champ `body` vaut null = À RÉDIGER PAR KILLIAN. Aucun texte inventé ici.
"""
import json
from pathlib import Path

D = Path(__file__).parent / "data" / "after"
D.mkdir(parents=True, exist_ok=True)

# position -> block_type, imposé par DELTA §D4
BLOCK_ORDER = [
    (1, "understanding", "Ce que tu peux maintenant comprendre", 0.30),
    (2, "connection",    "Connexions avec ce que tu as vu",      0.30),
    (3, "missed",        "Ce que tu as peut-être raté",          0.25),
    (4, "question",      "Questions fréquentes",                 0.10),
    (5, "theory",        "Théorie",                              0.05),
]

# work_id -> plan de blocs : (position, [requires_seen], slug, status)
# requires_seen = season_id que l'utilisateur DOIT avoir cochés pour voir le bloc.
# [] = toujours visible.
PLANS = {
    "mcu-iron-man": {
        "title": "Iron Man",
        "unit": "mcu-iron-man-s0",
        "blocks": [
            (1, [], "fondation-mcu", "canon"),
            (1, ["mcu-avengers-endgame-s0"], "mort-de-tony-relecture", "analysis"),
            (2, [], "dix-anneaux-amorce", "canon"),
            (2, ["mcu-avengers-s0"], "obadiah-vers-initiative", "canon"),
            (3, [], "post-credit-fury", "canon"),
            (4, [], "faq-ordre-de-visionnage", "canon"),
            (5, ["mcu-avengers-endgame-s0"], "theorie-echo-doom", "theory"),
        ],
    },
    "mcu-avengers-endgame": {
        "title": "Avengers : Endgame",
        "unit": "mcu-avengers-endgame-s0",
        "blocks": [
            (1, ["mcu-avengers-infinity-war-s0"], "cout-du-snap", "canon"),
            (1, ["mcu-iron-man-s0"], "arc-tony-boucle", "analysis"),
            (2, ["mcu-avengers-s0"], "bataille-de-new-york-revisitee", "canon"),
            (2, [], "consequences-temporelles", "deduction"),
            (3, [], "details-manques", "canon"),
            (4, [], "faq-branches-temporelles", "deduction"),
            (5, [], "theorie-vers-le-multivers", "theory"),
        ],
    },
    "mcu-loki": {
        "title": "Loki — Saison 1",
        "unit": "mcu-loki-s1",
        "blocks": [
            (1, [], "tva-et-chronologie-sacree", "canon"),
            (1, ["mcu-avengers-endgame-s0"], "variant-2012", "canon"),
            (2, ["mcu-avengers-s0"], "loki-du-tesseract", "canon"),
            (2, [], "celui-qui-demeure", "canon"),
            (3, [], "indices-de-la-saison", "canon"),
            (4, [], "faq-multivers-regles", "deduction"),
            (5, [], "theorie-branches", "theory"),
        ],
    },
    "mcu-spider-man-no-way-home": {
        "title": "Spider-Man : No Way Home",
        "unit": "mcu-spider-man-no-way-home-s0",
        "blocks": [
            (1, ["mcu-doctor-strange-s0"], "sort-rate-mecanique", "canon"),
            (1, ["mcu-spider-man-far-from-home-s0"], "consequence-identite", "canon"),
            (2, ["raimi-spider-man-s0"], "connexion-raimi", "canon"),
            (2, ["webb-the-amazing-spider-man-s0"], "connexion-webb", "canon"),
            (2, ["mcu-loki-s1"], "incursions-et-tva", "deduction"),
            (3, [], "details-manques", "canon"),
            (4, [], "faq-peter-efface", "canon"),
            (5, [], "theorie-brand-new-day", "theory"),
        ],
    },
    "fox-deadpool-wolverine": {
        "title": "Deadpool & Wolverine",
        "unit": "fox-deadpool-wolverine-s0",
        "blocks": [
            (1, ["mcu-loki-s1"], "tva-reprise", "canon"),
            (1, [], "ancrage-narratif", "canon"),
            (2, ["fox-logan-s0"], "connexion-logan", "canon"),
            (2, ["mcu-loki-s2"], "etat-du-multivers", "deduction"),
            (3, [], "cameos-manques", "canon"),
            (4, [], "faq-fox-dans-le-mcu", "deduction"),
            (5, [], "theorie-mutants-doomsday", "theory"),
        ],
    },
    "mcu-thunderbolts": {
        "title": "Thunderbolts*",
        "unit": "mcu-thunderbolts-s0",
        "blocks": [
            (1, [], "nouveaux-avengers", "canon"),
            (1, ["mcu-avengers-endgame-s0"], "vide-laisse-par-les-avengers", "analysis"),
            (2, ["mcu-captain-america-civil-war-s0"], "bucky-trajectoire", "canon"),
            (2, [], "valentina-role", "canon"),
            (3, [], "details-manques", "canon"),
            (4, [], "faq-sentry", "canon"),
            (5, [], "theorie-role-doomsday", "theory"),
        ],
    },
}


def build():
    index = []
    for work_id, plan in PLANS.items():
        blocks = []
        for pos, req, slug, status in sorted(plan["blocks"]):
            _, _, label, _ = next(b for b in BLOCK_ORDER if b[0] == pos)
            blocks.append({
                "id": f"{work_id}--{slug}",
                "work_id": work_id,
                "block_type": next(b[1] for b in BLOCK_ORDER if b[0] == pos),
                "section_label": label,
                "position": pos,
                "title": None,          # ⬅ à rédiger
                "body": None,           # ⬅ à rédiger
                "status": status,
                "requires_seen": req,
                "reveals_about": None,
            })
        doc = {
            "work_id": work_id,
            "work_title": plan["title"],
            "trigger_season_id": plan["unit"],
            "block_order": [{"position": p, "type": t, "label": l, "effort_share": e}
                            for p, t, l, e in BLOCK_ORDER],
            "blocks": blocks,
        }
        (D / f"{work_id}.json").write_text(
            json.dumps(doc, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
        index.append({"work_id": work_id, "title": plan["title"],
                      "blocks": len(blocks),
                      "gated_blocks": sum(1 for b in blocks if b["requires_seen"])})

    (D / "_index.json").write_text(json.dumps({
        "version": "1.0",
        "scope": "AFTER V1 — 6 œuvres uniquement. Le reste du catalogue n'a pas d'AFTER.",
        "rendering_rule": "SELECT * FROM after_block WHERE work_id=$1 AND requires_seen <@ "
                          "(SELECT coalesce(array_agg(season_id),'{}') FROM progress WHERE user_id=$2) "
                          "ORDER BY position",
        "absence_not_blur": "Un bloc non éligible N'APPARAÎT PAS. Jamais de flou, jamais de "
                            "mention qu'un contenu est masqué : le signaler serait déjà spoiler.",
        "works": index,
    }, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")

    total = sum(i["blocks"] for i in index)
    gated = sum(i["gated_blocks"] for i in index)
    print(f"AFTER : 6 œuvres · {total} blocs · {gated} conditionnés par requires_seen")
    for i in index:
        print(f"   {i['work_id']:38} {i['blocks']} blocs ({i['gated_blocks']} gated)")


if __name__ == "__main__":
    build()
