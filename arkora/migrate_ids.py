#!/usr/bin/env python3
"""ARKORA — Migration ids.v0.json -> ids.json (V1, IDs gelés).

M-A  Fusion Loki : mcu-loki-saison-1/-2 -> mcu-loki + s1 + s2
M-B  19 séries mono-saison : s0 -> s1
M-C  Enrichissement work (kind, is_released, is_target_event, universe_id)
     + season (number, runtime_min, narrative_weight, chrono_order)

Idempotent. Ne touche jamais ids.v0.json.
"""
import json, re, unicodedata, sys
from pathlib import Path

D = Path(__file__).parent / "data"
SRC = D / "ids.v0.json"
OUT = D / "ids.json"

# ── M-B : séries mono-saison actuellement en s0 -> s1 ───────────────────────
SERIES_S0_TO_S1 = {
    "mcu-wandavision", "mcu-falcon-et-le-soldat-de-l-hiver", "mcu-hawkeye",
    "mcu-moon-knight", "mcu-ms-marvel", "mcu-she-hulk-avocate",
    "mcu-secret-invasion", "mcu-echo", "mcu-agatha-all-along", "mcu-ironheart",
    "mcu-marvel-zombies", "mcu-eyes-of-wakanda", "mcu-wonder-man",
    "mcu-visionquest", "mcu-your-friendly-neighborhood-spider-man",
    "fox-x-men-97", "tv-the-defenders", "tv-inhumans", "tv-helstrom",
}

# ── kind : tout ce qui n'est pas listé ici est déduit (voir infer_kind) ─────
ONESHOTS = {
    "mcu-the-consultant", "mcu-item-47", "mcu-all-hail-the-king",
    "mcu-a-funny-thing-happened-on-the-way-to-thor-s-", "tv-agent-carter-one-shot",
}
SPECIALS = {"mcu-werewolf-by-night", "mcu-les-gardiens-special-fetes"}

NOT_RELEASED = {"mcu-avengers-doomsday", "mcu-visionquest"}
TARGET_EVENT = {"mcu-avengers-doomsday"}

# ── Parcours Essentiel : poids + durées, au niveau UNITÉ ────────────────────
# narrative_weight : repris de protocole-doomsday.html (source legacy figée).
# runtime_min : durées publiques. 🟡 À vérifier avant mise en production.
ESSENTIEL = [
    # (season_id, chrono_order, narrative_weight, runtime_min, runtime_is_estimate)
    ("mcu-iron-man-s0",                                 1,  96, 126, False),
    ("mcu-avengers-s0",                                 2,  88, 143, False),
    ("mcu-captain-america-civil-war-s0",                3,  90, 147, False),
    ("mcu-spider-man-homecoming-s0",                    4,  84, 133, False),
    ("mcu-avengers-infinity-war-s0",                    5,  98, 149, False),
    ("mcu-avengers-endgame-s0",                         6,  99, 181, False),
    ("mcu-spider-man-far-from-home-s0",                 7,  86, 129, False),
    ("mcu-loki-s1",                                     8,  94, 288, True),
    ("mcu-spider-man-no-way-home-s0",                   9,  97, 148, False),
    ("mcu-doctor-strange-multiverse-of-madness-s0",    10,  87, 126, False),
    ("mcu-loki-s2",                                    11,  92, 300, True),
    ("fox-deadpool-wolverine-s0",                      12,  89, 128, False),
    ("mcu-thunderbolts-s0",                            13,  91, 127, False),
    ("f4-les-4-fantastiques-premiers-pas-s0",          14,  95, 115, True),
    ("mcu-spider-man-brand-new-day-s0",                15,  93, 120, True),
]
ESS_MAP = {sid: (co, w, rt, est) for sid, co, w, rt, est in ESSENTIEL}


def infer_kind(work_id, seasons):
    if work_id in ONESHOTS:
        return "oneshot"
    if work_id in SPECIALS:
        return "special"
    if seasons[0]["number"] >= 1:
        return "series"
    return "film"


def migrate():
    works = json.loads(SRC.read_text(encoding="utf-8"))
    out, log = [], []

    # ── M-A : fusion Loki ──────────────────────────────────────────────────
    loki = [w for w in works if w["id"].startswith("mcu-loki-saison-")]
    if loki:
        works = [w for w in works if not w["id"].startswith("mcu-loki-saison-")]
        merged = {
            "id": "mcu-loki",
            "title": "Loki",
            "titles": ["Loki (Saison 1)", "Loki (Saison 2)"],
            "seasons": [
                {"id": "mcu-loki-s1", "number": 1},
                {"id": "mcu-loki-s2", "number": 2},
            ],
        }
        # réinsertion à la position du premier fragment
        idx = next(i for i, w in enumerate(
            json.loads(SRC.read_text(encoding="utf-8"))) if w["id"] == "mcu-loki-saison-1")
        works.insert(min(idx, len(works)), merged)
        log.append("M-A  Loki fusionné -> mcu-loki (s1, s2)")

    for w in works:
        wid = w["id"]

        # ── M-B : s0 -> s1 ─────────────────────────────────────────────────
        if wid in SERIES_S0_TO_S1:
            s = w["seasons"][0]
            if s["number"] == 0:
                s["number"] = 1
                s["id"] = f"{wid}-s1"
                log.append(f"M-B  {wid}: s0 -> s1")

        # ── M-C : enrichissement ───────────────────────────────────────────
        new = {
            "id": wid,
            "universe_id": "mcu",
            "title": w["title"],
            "kind": infer_kind(wid, w["seasons"]),
            "is_released": wid not in NOT_RELEASED,
            "is_target_event": wid in TARGET_EVENT,
            "titles_legacy": w["titles"],   # éditorial. JAMAIS de logique dessus.
            "seasons": [],
        }
        for s in w["seasons"]:
            co, wt, rt, est = ESS_MAP.get(s["id"], (None, None, None, True))
            new["seasons"].append({
                "id": s["id"],
                "number": s["number"],
                "runtime_min": rt,
                "runtime_is_estimate": est,
                "narrative_weight": wt,
                "chrono_order": co,
            })
        out.append(new)

    # ── Contrôles ──────────────────────────────────────────────────────────
    wids = [w["id"] for w in out]
    sids = [s["id"] for w in out for s in w["seasons"]]
    assert len(wids) == len(set(wids)), "work.id dupliqué"
    assert len(sids) == len(set(sids)), "season.id dupliqué"
    for w in out:
        for s in w["seasons"]:
            assert s["id"] == f"{w['id']}-s{s['number']}", f"convention: {s['id']}"
    missing = set(ESS_MAP) - set(sids)
    assert not missing, f"unités Essentiel introuvables: {missing}"
    weighted = [s for w in out for s in w["seasons"] if s["narrative_weight"] is not None]
    assert len(weighted) == 15, f"poids attendus: 15, obtenus {len(weighted)}"
    for s in weighted:
        assert 0 <= s["narrative_weight"] <= 100

    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")

    print("\n".join(log))
    print(f"\n✅ {len(out)} works · {len(sids)} unités · {len(weighted)} unités pondérées")
    print(f"   Σ poids Essentiel = {sum(s['narrative_weight'] for s in weighted)}")
    print(f"   Σ durées Essentiel = {sum(s['runtime_min'] for s in weighted)} min")
    return out


if __name__ == "__main__":
    migrate()
