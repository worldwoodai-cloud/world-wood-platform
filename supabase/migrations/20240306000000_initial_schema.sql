-- NEXA SCREEN Initial Schema

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Define Roles Enum
create type user_role as enum ('admin', 'curator', 'studio', 'audience');
create type film_status as enum ('pending', 'approved', 'rejected');
create type content_rating as enum ('G', '12+', '16+', '18+');
create type event_type as enum ('premiere', 'festival', 'themed_week', 'special', 'encore');

-- USERS Table (Extends Supabase Auth)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  display_name text,
  role user_role default 'audience',
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- STUDIOS Table
create table public.studios (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  slug text unique not null,
  description text,
  logo_url text,
  banner_url text,
  is_verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- HALLS Table
create table public.halls (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  banner_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- FILMS Table
create table public.films (
  id uuid primary key default uuid_generate_v4(),
  studio_id uuid references public.studios(id) on delete cascade not null,
  hall_id uuid references public.halls(id) on delete set null,
  title text not null,
  slug text unique not null,
  description text,
  runtime_minutes integer,
  video_url text,
  poster_url text,
  trailer_url text,
  status film_status default 'pending',
  rating content_rating default 'G',
  content_descriptors text[],
  badges text[],
  is_ai_native boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- EVENTS Table (Premiere Scheduling)
create table public.events (
  id uuid primary key default uuid_generate_v4(),
  film_id uuid references public.films(id) on delete cascade not null,
  hall_id uuid references public.halls(id) on delete cascade not null,
  scheduled_at timestamp with time zone not null,
  ends_at timestamp with time zone,
  type event_type default 'premiere',
  audience_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CHAT Table
create table public.chat_messages (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references public.events(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete set null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- FOLLOWERS Table
create table public.followers (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  studio_id uuid references public.studios(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, studio_id)
);

-- REVIEWS Table
create table public.reviews (
  id uuid primary key default uuid_generate_v4(),
  film_id uuid references public.films(id) on delete cascade not null,
  reviewer_id uuid references public.profiles(id) on delete set null,
  status film_status not null,
  feedback text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS POLICIES (Example)
alter table public.profiles enable row level security;
alter table public.studios enable row level security;
alter table public.films enable row level security;
alter table public.halls enable row level security;
alter table public.events enable row level security;
alter table public.chat_messages enable row level security;

-- Profiles: Anyone can view, only owner can edit
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- Films: Anyone can view approved films, studios can view their own
create policy "Approved films are viewable by everyone." on films for select using (status = 'approved');
create policy "Studios can view their own films" on films for select using (studio_id in (select id from studios where owner_id = auth.uid()));
