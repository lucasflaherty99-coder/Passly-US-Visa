-- Passly AI — initial schema
-- Run against a fresh Supabase project to set up all tables

-- ── leads ──────────────────────────────────────────────────────────────────
create table if not exists leads (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  name        text,
  whatsapp    text,
  locale      text not null default 'en',
  session_id  text,
  attorney_interest boolean not null default false,
  utm_source  text,
  created_at  timestamptz not null default now()
);

create unique index if not exists leads_email_idx on leads (email);
create index if not exists leads_created_at_idx on leads (created_at desc);

-- ── assessments ────────────────────────────────────────────────────────────
create table if not exists assessments (
  id            uuid primary key default gen_random_uuid(),
  session_id    text not null,
  lead_id       uuid references leads(id) on delete set null,
  locale        text not null default 'en',
  answers       jsonb not null,
  top_results   jsonb not null,
  all_results   jsonb not null,
  created_at    timestamptz not null default now()
);

create index if not exists assessments_session_id_idx on assessments (session_id);
create index if not exists assessments_lead_id_idx    on assessments (lead_id);
create index if not exists assessments_created_at_idx on assessments (created_at desc);

-- ── attorney_consultations ─────────────────────────────────────────────────
create table if not exists attorney_consultations (
  id              uuid primary key default gen_random_uuid(),
  lead_id         uuid references leads(id) on delete set null,
  assessment_id   uuid references assessments(id) on delete set null,
  name            text,
  email           text not null,
  message         text,
  preferred_time  text,
  status          text not null default 'pending',  -- pending | contacted | completed
  created_at      timestamptz not null default now()
);

create index if not exists consultations_email_idx      on attorney_consultations (email);
create index if not exists consultations_created_at_idx on attorney_consultations (created_at desc);

-- ── seo_pages ──────────────────────────────────────────────────────────────
create table if not exists seo_pages (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null,
  locale       text not null default 'en',
  visa_type    text,
  title        text not null,
  description  text,
  view_count   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create unique index if not exists seo_pages_slug_locale_idx on seo_pages (slug, locale);

-- auto-update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger seo_pages_updated_at
  before update on seo_pages
  for each row execute procedure update_updated_at_column();

-- ── Row Level Security ─────────────────────────────────────────────────────
-- All writes go through the service role key (server-side API routes only).
-- Public reads are intentionally disabled — data is served via API.

alter table leads                  enable row level security;
alter table assessments            enable row level security;
alter table attorney_consultations enable row level security;
alter table seo_pages              enable row level security;
