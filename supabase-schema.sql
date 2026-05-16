-- ============================================================
-- Rofimain Drilling — Supabase Schema
-- Run this once in Supabase SQL Editor.
-- After running, also create a PUBLIC storage bucket named "media".
-- ============================================================

create extension if not exists "uuid-ossp";

-- ── PROJECTS ──────────────────────────────────────────────
create table if not exists projects (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  title text not null,
  subtitle text default '',
  slug text not null unique,
  category text default '',
  location text default '',
  depth text default '',
  diameter text default '',
  piles int default 0,
  duration text default '',
  year int default extract(year from now()),
  status text default 'completed' check (status in ('completed','ongoing','upcoming')),
  client text default '',
  description text default '',
  full_description text default '',
  cover_image text,
  images text[] default '{}',
  tags text[] default '{}',
  featured boolean default false
);

-- ── SERVICES ──────────────────────────────────────────────
create table if not exists services (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  title text not null,
  subtitle text default '',
  slug text not null unique,
  description text default '',
  full_description text default '',
  icon text default 'Drill',
  cover_image text,
  features text[] default '{}',
  process jsonb default '[]',
  faq jsonb default '[]',
  featured boolean default false,
  "order" int default 0
);

-- ── ARTICLES ──────────────────────────────────────────────
create table if not exists articles (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  title text not null,
  slug text not null unique,
  excerpt text default '',
  content text default '',
  author text default 'Tim Engineering',
  author_image text,
  category text default '',
  tags text[] default '{}',
  cover_image text,
  published_at timestamptz default now(),
  featured boolean default false,
  read_time int default 5,
  published boolean default false
);

-- ── TEAM ──────────────────────────────────────────────────
create table if not exists team (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  name text not null,
  role text default '',
  bio text default '',
  image text,
  "order" int default 0,
  linkedin text,
  instagram text,
  whatsapp text
);

-- ── TESTIMONIALS ──────────────────────────────────────────
create table if not exists testimonials (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  name text not null,
  role text default '',
  company text default '',
  content text default '',
  rating int default 5 check (rating between 1 and 5),
  image text,
  project_id uuid references projects(id) on delete set null,
  featured boolean default false
);

-- ── SETTINGS ──────────────────────────────────────────────
create table if not exists settings (
  id uuid primary key default uuid_generate_v4(),
  updated_at timestamptz default now(),
  key text not null unique,
  value text default ''
);

-- ── RLS POLICIES ──────────────────────────────────────────
alter table projects     enable row level security;
alter table services     enable row level security;
alter table articles     enable row level security;
alter table team         enable row level security;
alter table testimonials enable row level security;
alter table settings     enable row level security;

-- Public read (articles only when published = true)
drop policy if exists "Public read projects"     on projects;
drop policy if exists "Public read services"     on services;
drop policy if exists "Public read articles"     on articles;
drop policy if exists "Public read team"         on team;
drop policy if exists "Public read testimonials" on testimonials;
drop policy if exists "Public read settings"     on settings;

create policy "Public read projects"     on projects     for select using (true);
create policy "Public read services"     on services     for select using (true);
create policy "Public read articles"     on articles     for select using (published = true);
create policy "Public read team"         on team         for select using (true);
create policy "Public read testimonials" on testimonials for select using (true);
create policy "Public read settings"     on settings     for select using (true);

-- Service role full access (admin via SUPABASE_SERVICE_ROLE_KEY)
drop policy if exists "Service role all projects"     on projects;
drop policy if exists "Service role all services"     on services;
drop policy if exists "Service role all articles"     on articles;
drop policy if exists "Service role all team"         on team;
drop policy if exists "Service role all testimonials" on testimonials;
drop policy if exists "Service role all settings"     on settings;

create policy "Service role all projects"     on projects     using (auth.role() = 'service_role');
create policy "Service role all services"     on services     using (auth.role() = 'service_role');
create policy "Service role all articles"     on articles     using (auth.role() = 'service_role');
create policy "Service role all team"         on team         using (auth.role() = 'service_role');
create policy "Service role all testimonials" on testimonials using (auth.role() = 'service_role');
create policy "Service role all settings"     on settings     using (auth.role() = 'service_role');

-- ── DEFAULT SETTINGS ──────────────────────────────────────
insert into settings (key, value) values
  ('site_name',     'Rofimain Drilling'),
  ('tagline',       'Spesialis Sumur Bor & Pondasi Bor Pile'),
  ('description',   'Kontraktor sumur bor & pondasi bor pile profesional. Layanan presisi, peralatan modern, dan garansi pengerjaan.'),
  ('phone',         '+62 812 3456 7890'),
  ('phone_display', '+62 812-3456-7890'),
  ('whatsapp',      '6281234567890'),
  ('email',         'halo@sumurbor.rofimain.com'),
  ('address',       'Jl. Contoh No. 123, Kebayoran Baru'),
  ('city',          'Jakarta Selatan'),
  ('region',        'DKI Jakarta'),
  ('postal_code',   '12110'),
  ('country',       'Indonesia'),
  ('business_hours','Senin–Sabtu, 08.00–17.00 WIB'),
  ('founding_year', '2015'),
  ('instagram',     ''),
  ('facebook',      ''),
  ('linkedin',      ''),
  ('youtube',       ''),
  ('tiktok',        ''),
  ('google_maps_url','https://maps.google.com/?q=-6.244,106.800')
on conflict (key) do nothing;
