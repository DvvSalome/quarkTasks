-- ============================================================
-- QUARK TASKING — Supabase Schema
-- Run this in the Supabase SQL Editor (quark project)
-- ============================================================

-- ── PROFILES ──────────────────────────────────────────────
create table if not exists public.profiles (
  id     uuid references auth.users(id) on delete cascade primary key,
  name   text not null default 'User',
  color  text not null default 'violet',
  created_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select" on public.profiles;
drop policy if exists "profiles_insert" on public.profiles;
drop policy if exists "profiles_update" on public.profiles;

create policy "profiles_select" on public.profiles
  for select to authenticated using (true);
create policy "profiles_insert" on public.profiles
  for insert to authenticated with check (auth.uid() = id);
create policy "profiles_update" on public.profiles
  for update to authenticated using (auth.uid() = id);

-- Auto-create profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  colors text[] := array['violet','cyan','amber','rose','green'];
begin
  insert into public.profiles (id, name, color)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    colors[1 + (floor(random() * 5))::int]
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ── TASKS ─────────────────────────────────────────────────
create table if not exists public.tasks (
  id           uuid default gen_random_uuid() primary key,
  title        text not null,
  description  text default '',
  project_name text default 'Quark',
  code         text default '',
  status       text not null default 'backlog'
                 check (status in ('backlog','doing','review','done')),
  priority     text not null default 'med',
  tags         text[]   default '{}',
  due          text     default null,
  blocked      boolean  default false,
  block_reason text     default null,
  stuck        boolean  default false,
  stuck_days   int      default 0,
  ai_note      text     default null,
  assignee_ids uuid[]   default '{}',
  checklist    jsonb    default '[]',   -- [{text, done}]
  created_by   uuid references auth.users(id) on delete set null,
  created_at   timestamptz default now() not null,
  updated_at   timestamptz default now() not null
);

alter table public.tasks enable row level security;

drop policy if exists "tasks_select" on public.tasks;
drop policy if exists "tasks_insert" on public.tasks;
drop policy if exists "tasks_update" on public.tasks;
drop policy if exists "tasks_delete" on public.tasks;

create policy "tasks_select" on public.tasks for select to authenticated using (true);
create policy "tasks_insert" on public.tasks for insert to authenticated with check (auth.uid() = created_by);
create policy "tasks_update" on public.tasks for update to authenticated using (true);
create policy "tasks_delete" on public.tasks for delete to authenticated using (auth.uid() = created_by);

-- Auto-bump updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists tasks_set_updated_at on public.tasks;
create trigger tasks_set_updated_at
  before update on public.tasks
  for each row execute procedure public.set_updated_at();


-- ── TASK COMMENTS ──────────────────────────────────────────
create table if not exists public.task_comments (
  id       uuid default gen_random_uuid() primary key,
  task_id  uuid references public.tasks(id) on delete cascade not null,
  user_id  uuid references auth.users(id) on delete set null,
  content  text not null,
  created_at timestamptz default now() not null
);

alter table public.task_comments enable row level security;

drop policy if exists "comments_select" on public.task_comments;
drop policy if exists "comments_insert" on public.task_comments;

create policy "comments_select" on public.task_comments for select to authenticated using (true);
create policy "comments_insert" on public.task_comments for insert to authenticated with check (auth.uid() = user_id);


-- ── REALTIME ──────────────────────────────────────────────
-- Enable realtime for live collaboration
alter publication supabase_realtime add table public.tasks;
alter publication supabase_realtime add table public.task_comments;
alter publication supabase_realtime add table public.profiles;
