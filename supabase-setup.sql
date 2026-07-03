-- ============================================================
-- PTO KS1 MATHS SKILLS CHECK - SUPABASE SETUP
-- ------------------------------------------------------------
-- Run this ONCE in your Supabase project:
--   Supabase dashboard > SQL Editor > New query > paste > Run.
--
-- What it does:
--   * Creates one table to store each completed Skills Check.
--   * Turns on Row Level Security (RLS).
--   * Allows the public website to ADD results only.
--     The public cannot read, change or delete anyone's data.
--   * You read the results yourself in the Supabase dashboard
--     (Table Editor), which uses a secure key, not the website.
-- ============================================================

create table if not exists public.skills_check_sessions (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),

  -- Parent details
  parent_name      text not null,
  parent_email     text not null,
  consent          boolean not null default false,

  -- Child details
  child_name       text,
  child_age        integer,

  -- Which assessment this was (future-proofs results when KS2/3/4 are added)
  assessment_name     text default 'KS1 Maths Skills Check',
  assessment_version  text default 'v1.0',       -- version of the QUESTION SET
  status              text default 'completed',  -- MVP: always 'completed'

  -- Assessment outcome
  started_at       timestamptz,
  completed_at     timestamptz,
  total_questions  integer,
  total_correct    integer,
  percentage       integer,                       -- 0-100, saved at submission
  duration_seconds integer,                       -- time spent on the maths questions
  child_confidence text,                          -- child's self-rating: easy / ok / quite_difficult / very_difficult
  parent_independence text,                       -- parent's rating: independent / a_little_help / a_lot_of_help

  -- Friendly reference shown to the parent, e.g. PTO-2026-000123
  reference        text,

  -- Detail (kept as JSON so it's easy to store now and analyse later)
  strand_summary   jsonb,   -- per-strand correct/total/level
  responses        jsonb,   -- every question, the answer chosen, and whether it was right

  app_version      text
);

-- Turn on Row Level Security.
alter table public.skills_check_sessions enable row level security;

-- Safe to re-run: add any missing columns if an older table already exists.
alter table public.skills_check_sessions add column if not exists assessment_name    text default 'KS1 Maths Skills Check';
alter table public.skills_check_sessions add column if not exists assessment_version text default 'v1.0';
alter table public.skills_check_sessions add column if not exists status             text default 'completed';
alter table public.skills_check_sessions add column if not exists percentage         integer;
alter table public.skills_check_sessions add column if not exists reference          text;
alter table public.skills_check_sessions add column if not exists duration_seconds   integer;
alter table public.skills_check_sessions add column if not exists child_confidence   text;
alter table public.skills_check_sessions add column if not exists parent_independence text;

-- Allow anonymous visitors (the public website) to INSERT only.
-- No SELECT / UPDATE / DELETE policy exists for them, so they cannot
-- read or alter stored data. This protects collected emails.
drop policy if exists "Public can add results" on public.skills_check_sessions;
create policy "Public can add results"
  on public.skills_check_sessions
  for insert
  to anon
  with check (true);

-- Helpful index for browsing recent results in the dashboard.
create index if not exists idx_scs_created_at
  on public.skills_check_sessions (created_at desc);
