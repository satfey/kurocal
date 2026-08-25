-- KuroCal ♡ — Supabase schema
-- Run this once in your Supabase project's SQL Editor (Project > SQL Editor > New query).

create table if not exists public.food_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  name text not null,
  calories integer not null check (calories >= 0),
  protein integer not null default 0 check (protein >= 0),
  meal text not null check (meal in ('breakfast', 'lunch', 'dinner', 'snack')),
  time text not null default '',
  note text,
  created_at timestamptz not null default now()
);

create index if not exists food_entries_user_date_idx on public.food_entries (user_id, date);

alter table public.food_entries enable row level security;

create policy "Users can view their own food entries"
  on public.food_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert their own food entries"
  on public.food_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own food entries"
  on public.food_entries for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own food entries"
  on public.food_entries for delete
  using (auth.uid() = user_id);

--------------------------------------------------------------------------------

create table if not exists public.user_settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  calorie_goal integer not null default 1800 check (calorie_goal > 0),
  protein_goal integer not null default 100 check (protein_goal > 0),
  dark_mode boolean not null default false,
  notifications boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.user_settings enable row level security;

create policy "Users can view their own settings"
  on public.user_settings for select
  using (auth.uid() = user_id);

create policy "Users can insert their own settings"
  on public.user_settings for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own settings"
  on public.user_settings for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own settings"
  on public.user_settings for delete
  using (auth.uid() = user_id);
