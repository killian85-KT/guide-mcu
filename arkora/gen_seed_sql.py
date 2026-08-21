#!/usr/bin/env python3
"""Génère supabase/migrations/002_seed.sql depuis data/ids.json.
Aucune donnée inventée : uniquement les champs présents dans ids.json.
"""
import json
from pathlib import Path

D = Path(__file__).parent / "data"
OUT = Path(__file__).parent / "supabase/migrations/002_seed.sql"

ids = json.loads((D / "ids.json").read_text(encoding="utf-8"))


def sql_str(x):
    if x is None:
        return "null"
    return "'" + str(x).replace("'", "''") + "'"


def sql_bool(x):
    return "true" if x else "false"


def sql_int(x):
    return "null" if x is None else str(x)


lines = [
    "-- ARKORA V1 — 002_seed.sql",
    "-- Généré depuis data/ids.json (95 works, 117 seasons). Ne pas éditer à la main :",
    "-- régénérer avec gen_seed_sql.py si ids.json change (ids sont gelés après ce lot).",
    "",
    "insert into work (id, universe_id, title, kind, year, synopsis, is_released, is_target_event, chrono_order) values",
]

work_rows = []
for w in ids:
    work_rows.append(
        "  ("
        f"{sql_str(w['id'])}, {sql_str(w['universe_id'])}, {sql_str(w['title'])}, "
        f"{sql_str(w['kind'])}, null, null, "
        f"{sql_bool(w['is_released'])}, {sql_bool(w['is_target_event'])}, null)"
    )
lines.append(",\n".join(work_rows) + ";")
lines.append("")

lines.append(
    "insert into season (id, work_id, number, title, episodes, runtime_min, "
    "runtime_is_estimate, narrative_weight, chrono_order) values"
)
season_rows = []
for w in ids:
    for s in w["seasons"]:
        season_rows.append(
            "  ("
            f"{sql_str(s['id'])}, {sql_str(w['id'])}, {sql_int(s['number'])}, null, null, "
            f"{sql_int(s['runtime_min'])}, {sql_bool(s['runtime_is_estimate'])}, "
            f"{sql_int(s['narrative_weight'])}, {sql_int(s['chrono_order'])})"
        )
lines.append(",\n".join(season_rows) + ";")
lines.append("")

OUT.write_text("\n".join(lines), encoding="utf-8")

n_work = len(ids)
n_season = sum(len(w["seasons"]) for w in ids)
print(f"002_seed.sql écrit : {n_work} works · {n_season} seasons")
