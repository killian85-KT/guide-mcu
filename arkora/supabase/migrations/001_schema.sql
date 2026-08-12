-- ARKORA V1 — 001_schema.sql
-- Source : ARKORA-V1-MASTER-EXECUTION.md §10 — 6 tables, pas une de plus.

-- ── A1 · work ────────────────────────────────────────────────────────────
create table work (
  id              text primary key,
  universe_id     text not null default 'mcu',
  title           text not null,
  kind            text not null,          -- film | series | oneshot | special
  year            int,
  synopsis        text,
  is_released     boolean not null default true,
  is_target_event boolean not null default false,
  chrono_order    int,
  created_at      timestamptz default now()
);
create index on work(chrono_order);

-- ── A2 · season — L'UNITÉ DE PROGRESSION ─────────────────────────────────
create table season (
  id                  text primary key,   -- {work_id}-s{number}
  work_id             text not null references work(id) on delete cascade,
  number              int  not null,      -- 0 = film/one-shot/spécial
  title               text,
  episodes            int,
  runtime_min         int,
  runtime_is_estimate boolean not null default true,
  narrative_weight    int,                -- 0..100, null hors Essentiel
  chrono_order        int,
  unique (work_id, number),
  constraint weight_range check (narrative_weight is null
                                 or narrative_weight between 0 and 100)
);

-- ── A3 · progress — L'ACTIF CENTRAL ──────────────────────────────────────
create table progress (
  user_id   uuid not null references auth.users(id) on delete cascade,
  season_id text not null references season(id) on delete cascade,
  seen_at   timestamptz not null default now(),
  source    text not null default 'manual',  -- manual | preset | legacy_import
  primary key (user_id, season_id)
);
create index on progress(user_id);
alter table progress enable row level security;
create policy "lecture propre"  on progress for select using (auth.uid() = user_id);
create policy "écriture propre" on progress for all    using (auth.uid() = user_id);

-- ── A4 · profile ─────────────────────────────────────────────────────────
create table profile (
  user_id       uuid primary key references auth.users(id) on delete cascade,
  email         text,
  dropoff       text,                     -- preset de décrochage déclaré
  active_path   text default 'essentiel',
  utm_source    text,
  utm_medium    text,
  utm_campaign  text,
  utm_content   text,
  first_seen_at timestamptz default now(),
  created_at    timestamptz default now()
);
alter table profile enable row level security;
create policy "profil propre" on profile for all using (auth.uid() = user_id);

-- ── A5 · event_log — ANALYTICS ───────────────────────────────────────────
create table event_log (
  id          bigserial primary key,
  user_id     uuid references auth.users(id) on delete cascade,
  anon_id     text,                       -- avant compte
  name        text not null,
  props       jsonb not null default '{}',
  occurred_at timestamptz not null default now()
);
create index on event_log(user_id, occurred_at desc);
create index on event_log(name, occurred_at desc);

-- ── A6 · after_block ─────────────────────────────────────────────────────
create table after_block (
  id             text primary key,
  work_id        text not null references work(id) on delete cascade,
  block_type     text not null,   -- understanding|connection|missed|question|theory
  position       int  not null,
  title          text,
  body           text not null,
  status         text not null,   -- canon|deduction|analysis|theory|unconfirmed
  requires_seen  text[] not null default '{}',
  created_at     timestamptz default now()
);
create index on after_block(work_id, position);
