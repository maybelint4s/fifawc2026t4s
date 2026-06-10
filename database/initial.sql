-- ============================================================
-- FIFA World Cup 2026 Prode - Supabase Initial Schema
-- ============================================================
-- This script sets up the complete database for the corporate
-- prediction platform including:
--   - Custom types (enums)
--   - Core tables (teams, matches, profiles, predictions, domains)
--   - Views (leaderboard, group standings)
--   - Functions (auto-calculate points, advance winners, reset)
--   - Row Level Security (RLS) policies
--   - Initial seed data (32 teams, 64 matches)
-- ============================================================

-- --------------------------------------------------------
-- 1. EXTENSIONS
-- --------------------------------------------------------
create extension if not exists "uuid-ossp"; -- or use pg_net, supabase provides uuid-ossp by default

-- --------------------------------------------------------
-- 2. CUSTOM TYPES
-- --------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'match_stage') then
    create type match_stage as enum ('FG', '8vos', 'CF', 'SF', 'F');
  end if;
  if not exists (select 1 from pg_type where typname = 'match_status') then
    create type match_status as enum ('Pending', 'Live', 'Finished');
  end if;
end
$$;

-- --------------------------------------------------------
-- 3. TABLES
-- --------------------------------------------------------

-- Teams (32 real teams)
create table if not exists teams (
  id text primary key,
  name text not null,
  flag text not null,
  group_name text not null,
  created_at timestamptz default now()
);

-- Matches (all tournament fixtures including placeholders)
create table if not exists matches (
  id text primary key,
  stage match_stage not null,
  group_name text,
  team_a_id text not null,
  team_a_name text not null,
  team_a_flag text not null default '🏳️',
  team_a_is_placeholder boolean not null default false,
  team_b_id text not null,
  team_b_name text not null,
  team_b_flag text not null default '🏳️',
  team_b_is_placeholder boolean not null default false,
  score_a integer,
  score_b integer,
  status match_status not null default 'Pending',
  match_date text not null,
  match_time text not null,
  datetime_iso timestamptz not null,
  next_match_id text,
  next_match_position text check (next_match_position in ('teamA', 'teamB')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Profiles (extends Supabase Auth users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role text not null default 'Employee',
  avatar text not null default '👤',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Predictions (user bets on matches)
create table if not exists predictions (
  id uuid primary key default gen_random_uuid(),
  match_id text not null references matches(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  predicted_score_a integer not null check (predicted_score_a >= 0),
  predicted_score_b integer not null check (predicted_score_b >= 0),
  points_earned integer not null default 0 check (points_earned in (0, 1, 3)),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(match_id, user_id)
);

-- Allowed email domains (admin-managed access control)
create table if not exists allowed_domains (
  id uuid primary key default gen_random_uuid(),
  domain text not null unique check (domain ~ E'^@[a-zA-Z0-9][-a-zA-Z0-9]*\.[a-zA-Z]+$'),
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- App settings (admin configuration key-value store)
create table if not exists app_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz default now()
);

-- --------------------------------------------------------
-- 4. INDEXES
-- --------------------------------------------------------
create index if not exists idx_matches_stage on matches(stage);
create index if not exists idx_matches_group on matches(group_name) where group_name is not null;
create index if not exists idx_matches_datetime on matches(datetime_iso);
create index if not exists idx_matches_next on matches(next_match_id);
create index if not exists idx_predictions_user on predictions(user_id);
create index if not exists idx_predictions_match on predictions(match_id);
create index if not exists idx_predictions_points on predictions(points_earned);
create index if not exists idx_teams_group on teams(group_name);

-- --------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS)
-- --------------------------------------------------------

-- Teams: read-only for everyone
alter table teams enable row level security;
create policy "Teams viewable by everyone"
  on teams for select using (true);

-- Matches: read-only for everyone, only admins can modify
alter table matches enable row level security;
create policy "Matches viewable by everyone"
  on matches for select using (true);
create policy "Only admins can insert matches"
  on matches for insert with check (
    exists (select 1 from profiles where id = auth.uid() and role = 'Admin')
  );
create policy "Only admins can update matches"
  on matches for update using (
    exists (select 1 from profiles where id = auth.uid() and role = 'Admin')
  );
create policy "Only admins can delete matches"
  on matches for delete using (
    exists (select 1 from profiles where id = auth.uid() and role = 'Admin')
  );

-- Profiles: viewable by all, insert/update own only
alter table profiles enable row level security;
create policy "Profiles viewable by everyone"
  on profiles for select using (true);
create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- Predictions: viewable by all, own CRUD only
alter table predictions enable row level security;
create policy "Predictions viewable by everyone"
  on predictions for select using (true);
create policy "Users can create own predictions"
  on predictions for insert with check (auth.uid() = user_id);
create policy "Users can update own predictions"
  on predictions for update using (auth.uid() = user_id);
create policy "Users can delete own predictions"
  on predictions for delete using (auth.uid() = user_id);

-- Allowed domains: viewable by all, admin-managed
alter table allowed_domains enable row level security;
create policy "Domains viewable by everyone"
  on allowed_domains for select using (true);
create policy "Only admins can manage domains"
  on allowed_domains for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'Admin')
  );

-- App settings: viewable by all, admin-managed
alter table app_settings enable row level security;
create policy "Settings viewable by everyone"
  on app_settings for select using (true);
create policy "Only admins can manage settings"
  on app_settings for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'Admin')
  );

-- --------------------------------------------------------
-- 6. FUNCTIONS
-- --------------------------------------------------------

-- Auto-calculate prediction points when a match result is entered
create or replace function calculate_prediction_points()
returns trigger as $$
begin
  -- Only calculate if match is finished and has valid scores
  if NEW.status = 'Finished' and NEW.score_a is not null and NEW.score_b is not null then
    update predictions
    set
      points_earned = case
        -- Exact score match = 3 points
        when predicted_score_a = NEW.score_a and predicted_score_b = NEW.score_b then 3
        -- Correct winner (or correct draw) = 1 point
        when (
          (predicted_score_a > predicted_score_b and NEW.score_a > NEW.score_b)
          or (predicted_score_a < predicted_score_b and NEW.score_a < NEW.score_b)
          or (predicted_score_a = predicted_score_b and NEW.score_a = NEW.score_b)
        ) then 1
        -- Wrong prediction = 0 points
        else 0
      end,
      updated_at = now()
    where match_id = NEW.id;
  end if;
  return NEW;
end;
$$ language plpgsql security definer;

-- Trigger: run points calculation after match update
drop trigger if exists trg_calculate_points on matches;
create trigger trg_calculate_points
  after update of score_a, score_b, status on matches
  for each row
  execute function calculate_prediction_points();

-- Auto-advance winner to next knockout match
create or replace function advance_winner_to_next_match()
returns trigger as $$
declare
  winner_id text;
  winner_name text;
  winner_flag text;
begin
  if NEW.status = 'Finished' and NEW.next_match_id is not null
     and NEW.score_a is not null and NEW.score_b is not null then

    -- Determine winner
    if NEW.score_a > NEW.score_b then
      winner_id := NEW.team_a_id;
      winner_name := NEW.team_a_name;
      winner_flag := NEW.team_a_flag;
    elsif NEW.score_b > NEW.score_a then
      winner_id := NEW.team_b_id;
      winner_name := NEW.team_b_name;
      winner_flag := NEW.team_b_flag;
    else
      -- Draw in knockout: default to team A with penalty notation
      -- In the future this can be extended with a penalty_winner column
      winner_id := NEW.team_a_id;
      winner_name := NEW.team_a_name || ' (P)';
      winner_flag := NEW.team_a_flag;
    end if;

    -- Advance to next match position
    if NEW.next_match_position = 'teamA' then
      update matches set
        team_a_id = winner_id,
        team_a_name = winner_name,
        team_a_flag = winner_flag,
        team_a_is_placeholder = false,
        updated_at = now()
      where id = NEW.next_match_id;
    elsif NEW.next_match_position = 'teamB' then
      update matches set
        team_b_id = winner_id,
        team_b_name = winner_name,
        team_b_flag = winner_flag,
        team_b_is_placeholder = false,
        updated_at = now()
      where id = NEW.next_match_id;
    end if;
  end if;
  return NEW;
end;
$$ language plpgsql security definer;

-- Trigger: advance winner after match result update
drop trigger if exists trg_advance_winner on matches;
create trigger trg_advance_winner
  after update of status, score_a, score_b on matches
  for each row
  when (
    OLD.status is distinct from NEW.status
    or OLD.score_a is distinct from NEW.score_a
    or OLD.score_b is distinct from NEW.score_b
  )
  execute function advance_winner_to_next_match();

-- Reset all match results back to initial state (admin only)
create or replace function reset_all_matches()
returns void as $$
begin
  update matches set
    score_a = null,
    score_b = null,
    status = 'Pending',
    updated_at = now();

  -- Reset all predictions points
  update predictions set
    points_earned = 0,
    updated_at = now();

  -- Reset placeholder teams in knockout stages back to TBD
  update matches set
    team_a_name = 'Por determinar',
    team_a_flag = '🏳️',
    team_a_is_placeholder = true
  where stage != 'FG' and team_a_id like 'TBD%';

  update matches set
    team_b_name = 'Por determinar',
    team_b_flag = '🏳️',
    team_b_is_placeholder = true
  where stage != 'FG' and team_b_id like 'TBD%';
end;
$$ language plpgsql security definer;

-- Group standings calculation function
create or replace function get_group_standings(p_group_name text)
returns table (
  team_id text,
  team_name text,
  team_flag text,
  played bigint,
  wins bigint,
  draws bigint,
  losses bigint,
  goals_for bigint,
  goals_against bigint,
  goal_difference bigint,
  points bigint
) as $$
begin
  return query
  with team_stats as (
    select
      t.id as tid,
      t.name as tname,
      t.flag as tflag,
      -- Games played
      count(*) filter (where m.status = 'Finished') as gp,
      -- Wins
      count(*) filter (
        where m.status = 'Finished' and
        ((m.team_a_id = t.id and m.score_a > m.score_b) or (m.team_b_id = t.id and m.score_b > m.score_a))
      ) as w,
      -- Draws
      count(*) filter (
        where m.status = 'Finished' and m.score_a = m.score_b
      ) as d,
      -- Losses
      count(*) filter (
        where m.status = 'Finished' and
        ((m.team_a_id = t.id and m.score_a < m.score_b) or (m.team_b_id = t.id and m.score_b < m.score_a))
      ) as l,
      -- Goals for
      coalesce(sum(case when m.team_a_id = t.id then m.score_a else m.score_b end) filter (where m.status = 'Finished'), 0) as gf,
      -- Goals against
      coalesce(sum(case when m.team_a_id = t.id then m.score_b else m.score_a end) filter (where m.status = 'Finished'), 0) as ga
    from teams t
    left join matches m on (m.team_a_id = t.id or m.team_b_id = t.id)
    where t.group_name = p_group_name
    group by t.id, t.name, t.flag
  )
  select
    ts.tid as team_id,
    ts.tname as team_name,
    ts.tflag as team_flag,
    ts.gp as played,
    ts.w as wins,
    ts.d as draws,
    ts.l as losses,
    ts.gf as goals_for,
    ts.ga as goals_against,
    (ts.gf - ts.ga) as goal_difference,
    (ts.w * 3 + ts.d) as points
  from team_stats ts
  order by (ts.w * 3 + ts.d) desc, (ts.gf - ts.ga) desc, ts.gf desc;
end;
$$ language plpgsql stable;

-- --------------------------------------------------------
-- 7. VIEWS
-- --------------------------------------------------------

-- Leaderboard: real-time ranking of all users
create or replace view leaderboard as
select
  p.id as user_id,
  p.name,
  p.role,
  p.avatar,
  coalesce(sum(pr.points_earned), 0) as total_points,
  count(*) filter (where pr.points_earned = 3) as exact_matches,
  count(*) filter (where pr.points_earned = 1) as winner_matches,
  count(*) filter (where pr.points_earned > 0) as total_correct
from profiles p
left join predictions pr on pr.user_id = p.id
left join matches m on m.id = pr.match_id and m.status = 'Finished'
group by p.id, p.name, p.role, p.avatar
order by total_points desc, exact_matches desc, total_correct desc;

-- --------------------------------------------------------
-- 8. SEED DATA: TEAMS (32 teams, 8 groups)
-- --------------------------------------------------------

insert into teams (id, name, flag, group_name) values
  ('MEX', 'México', '🇲🇽', 'Grupo A'),
  ('RSA', 'Sudáfrica', '🇿🇦', 'Grupo A'),
  ('KOR', 'Corea del Sur', '🇰🇷', 'Grupo A'),
  ('CZE', 'Chequia', '🇨🇿', 'Grupo A'),
  ('CAN', 'Canadá', '🇨🇦', 'Grupo B'),
  ('BIH', 'Bosnia-Herz.', '🇧🇦', 'Grupo B'),
  ('QAT', 'Catar', '🇶🇦', 'Grupo B'),
  ('SUI', 'Suiza', '🇨🇭', 'Grupo B'),
  ('BRA', 'Brasil', '🇧🇷', 'Grupo C'),
  ('MAR', 'Marruecos', '🇲🇦', 'Grupo C'),
  ('HAI', 'Haití', '🇭🇹', 'Grupo C'),
  ('SCO', 'Escocia', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'Grupo C'),
  ('USA', 'EE. UU.', '🇺🇸', 'Grupo D'),
  ('PAR', 'Paraguay', '🇵🇾', 'Grupo D'),
  ('ITA', 'Italia', '🇮🇹', 'Grupo D'),
  ('JPN', 'Japón', '🇯🇵', 'Grupo D'),
  ('ARG', 'Argentina', '🇦🇷', 'Grupo E'),
  ('FRA', 'Francia', '🇫🇷', 'Grupo E'),
  ('AUS', 'Australia', '🇦🇺', 'Grupo E'),
  ('CRC', 'Costa Rica', '🇨🇷', 'Grupo E'),
  ('GER', 'Alemania', '🇩🇪', 'Grupo F'),
  ('ESP', 'España', '🇪🇸', 'Grupo F'),
  ('CMR', 'Camerún', '🇨🇲', 'Grupo F'),
  ('URU', 'Uruguay', '🇺🇾', 'Grupo F'),
  ('POR', 'Portugal', '🇵🇹', 'Grupo G'),
  ('NED', 'Países Bajos', '🇳🇱', 'Grupo G'),
  ('SEN', 'Senegal', '🇸🇳', 'Grupo G'),
  ('IRN', 'Irán', '🇮🇷', 'Grupo G'),
  ('ENG', 'Inglaterra', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Grupo H'),
  ('BEL', 'Bélgica', '🇧🇪', 'Grupo H'),
  ('CRO', 'Croacia', '🇭🇷', 'Grupo H'),
  ('ECU', 'Ecuador', '🇪🇨', 'Grupo H')
on conflict (id) do nothing;

-- --------------------------------------------------------
-- 9. SEED DATA: MATCHES (48 group stage + 16 knockout = 64 matches)
-- --------------------------------------------------------

insert into matches (
  id, stage, group_name, team_a_id, team_a_name, team_a_flag, team_a_is_placeholder,
  team_b_id, team_b_name, team_b_flag, team_b_is_placeholder,
  score_a, score_b, status, match_date, match_time, datetime_iso,
  next_match_id, next_match_position
) values
  -- ========================
  -- GRUPO A
  -- ========================
  ('FG_A1', 'FG', 'Grupo A', 'MEX', 'México', '🇲🇽', false, 'RSA', 'Sudáfrica', '🇿🇦', false, 2, 1, 'Finished', 'Jue, jun 11', '4:00 p.m.', '2026-06-11T16:00:00', null, null),
  ('FG_A2', 'FG', 'Grupo A', 'KOR', 'Corea del Sur', '🇰🇷', false, 'CZE', 'Chequia', '🇨🇿', false, 1, 1, 'Finished', 'Vie, jun 12', '1:00 p.m.', '2026-06-12T13:00:00', null, null),
  ('FG_A3', 'FG', 'Grupo A', 'MEX', 'México', '🇲🇽', false, 'KOR', 'Corea del Sur', '🇰🇷', false, null, null, 'Pending', 'Mar, jun 17', '5:00 p.m.', '2026-06-17T17:00:00', null, null),
  ('FG_A4', 'FG', 'Grupo A', 'RSA', 'Sudáfrica', '🇿🇦', false, 'CZE', 'Chequia', '🇨🇿', false, null, null, 'Pending', 'Mar, jun 17', '8:00 p.m.', '2026-06-17T20:00:00', null, null),
  ('FG_A5', 'FG', 'Grupo A', 'MEX', 'México', '🇲🇽', false, 'CZE', 'Chequia', '🇨🇿', false, null, null, 'Pending', 'Dom, jun 22', '3:00 p.m.', '2026-06-22T15:00:00', null, null),
  ('FG_A6', 'FG', 'Grupo A', 'RSA', 'Sudáfrica', '🇿🇦', false, 'KOR', 'Corea del Sur', '🇰🇷', false, null, null, 'Pending', 'Dom, jun 22', '6:00 p.m.', '2026-06-22T18:00:00', null, null),

  -- ========================
  -- GRUPO B
  -- ========================
  ('FG_B1', 'FG', 'Grupo B', 'CAN', 'Canadá', '🇨🇦', false, 'BIH', 'Bosnia-Herz.', '🇧🇦', false, 3, 0, 'Finished', 'Vie, jun 12', '4:30 p.m.', '2026-06-12T16:30:00', null, null),
  ('FG_B2', 'FG', 'Grupo B', 'QAT', 'Catar', '🇶🇦', false, 'SUI', 'Suiza', '🇨🇭', false, null, null, 'Pending', 'Sáb, jun 13', '3:00 p.m.', '2026-06-13T15:00:00', null, null),
  ('FG_B3', 'FG', 'Grupo B', 'CAN', 'Canadá', '🇨🇦', false, 'QAT', 'Catar', '🇶🇦', false, null, null, 'Pending', 'Mié, jun 18', '5:00 p.m.', '2026-06-18T17:00:00', null, null),
  ('FG_B4', 'FG', 'Grupo B', 'BIH', 'Bosnia-Herz.', '🇧🇦', false, 'SUI', 'Suiza', '🇨🇭', false, null, null, 'Pending', 'Mié, jun 18', '8:00 p.m.', '2026-06-18T20:00:00', null, null),
  ('FG_B5', 'FG', 'Grupo B', 'CAN', 'Canadá', '🇨🇦', false, 'SUI', 'Suiza', '🇨🇭', false, null, null, 'Pending', 'Lun, jun 23', '3:00 p.m.', '2026-06-23T15:00:00', null, null),
  ('FG_B6', 'FG', 'Grupo B', 'BIH', 'Bosnia-Herz.', '🇧🇦', false, 'QAT', 'Catar', '🇶🇦', false, null, null, 'Pending', 'Lun, jun 23', '6:00 p.m.', '2026-06-23T18:00:00', null, null),

  -- ========================
  -- GRUPO C
  -- ========================
  ('FG_C1', 'FG', 'Grupo C', 'BRA', 'Brasil', '🇧🇷', false, 'MAR', 'Marruecos', '🇲🇦', false, 2, 0, 'Finished', 'Sáb, jun 13', '6:00 p.m.', '2026-06-13T18:00:00', null, null),
  ('FG_C2', 'FG', 'Grupo C', 'HAI', 'Haití', '🇭🇹', false, 'SCO', 'Escocia', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', false, null, null, 'Pending', 'Dom, jun 14', '1:00 p.m.', '2026-06-14T13:00:00', null, null),
  ('FG_C3', 'FG', 'Grupo C', 'BRA', 'Brasil', '🇧🇷', false, 'HAI', 'Haití', '🇭🇹', false, null, null, 'Pending', 'Jue, jun 19', '5:00 p.m.', '2026-06-19T17:00:00', null, null),
  ('FG_C4', 'FG', 'Grupo C', 'MAR', 'Marruecos', '🇲🇦', false, 'SCO', 'Escocia', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', false, null, null, 'Pending', 'Jue, jun 19', '8:00 p.m.', '2026-06-19T20:00:00', null, null),
  ('FG_C5', 'FG', 'Grupo C', 'BRA', 'Brasil', '🇧🇷', false, 'SCO', 'Escocia', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', false, null, null, 'Pending', 'Mar, jun 24', '3:00 p.m.', '2026-06-24T15:00:00', null, null),
  ('FG_C6', 'FG', 'Grupo C', 'MAR', 'Marruecos', '🇲🇦', false, 'HAI', 'Haití', '🇭🇹', false, null, null, 'Pending', 'Mar, jun 24', '6:00 p.m.', '2026-06-24T18:00:00', null, null),

  -- ========================
  -- GRUPO D
  -- ========================
  ('FG_D1', 'FG', 'Grupo D', 'USA', 'EE. UU.', '🇺🇸', false, 'PAR', 'Paraguay', '🇵🇾', false, 1, 1, 'Finished', 'Dom, jun 14', '4:30 p.m.', '2026-06-14T16:30:00', null, null),
  ('FG_D2', 'FG', 'Grupo D', 'ITA', 'Italia', '🇮🇹', false, 'JPN', 'Japón', '🇯🇵', false, null, null, 'Pending', 'Lun, jun 15', '1:00 p.m.', '2026-06-15T13:00:00', null, null),
  ('FG_D3', 'FG', 'Grupo D', 'USA', 'EE. UU.', '🇺🇸', false, 'ITA', 'Italia', '🇮🇹', false, null, null, 'Pending', 'Vie, jun 20', '5:00 p.m.', '2026-06-20T17:00:00', null, null),
  ('FG_D4', 'FG', 'Grupo D', 'PAR', 'Paraguay', '🇵🇾', false, 'JPN', 'Japón', '🇯🇵', false, null, null, 'Pending', 'Vie, jun 20', '8:00 p.m.', '2026-06-20T20:00:00', null, null),
  ('FG_D5', 'FG', 'Grupo D', 'USA', 'EE. UU.', '🇺🇸', false, 'JPN', 'Japón', '🇯🇵', false, null, null, 'Pending', 'Mié, jun 25', '3:00 p.m.', '2026-06-25T15:00:00', null, null),
  ('FG_D6', 'FG', 'Grupo D', 'PAR', 'Paraguay', '🇵🇾', false, 'ITA', 'Italia', '🇮🇹', false, null, null, 'Pending', 'Mié, jun 25', '6:00 p.m.', '2026-06-25T18:00:00', null, null),

  -- ========================
  -- GRUPO E
  -- ========================
  ('FG_E1', 'FG', 'Grupo E', 'ARG', 'Argentina', '🇦🇷', false, 'FRA', 'Francia', '🇫🇷', false, null, null, 'Pending', 'Lun, jun 15', '6:00 p.m.', '2026-06-15T18:00:00', null, null),
  ('FG_E2', 'FG', 'Grupo E', 'AUS', 'Australia', '🇦🇺', false, 'CRC', 'Costa Rica', '🇨🇷', false, null, null, 'Pending', 'Mar, jun 16', '1:00 p.m.', '2026-06-16T13:00:00', null, null),
  ('FG_E3', 'FG', 'Grupo E', 'ARG', 'Argentina', '🇦🇷', false, 'AUS', 'Australia', '🇦🇺', false, null, null, 'Pending', 'Sáb, jun 21', '5:00 p.m.', '2026-06-21T17:00:00', null, null),
  ('FG_E4', 'FG', 'Grupo E', 'FRA', 'Francia', '🇫🇷', false, 'CRC', 'Costa Rica', '🇨🇷', false, null, null, 'Pending', 'Sáb, jun 21', '8:00 p.m.', '2026-06-21T20:00:00', null, null),
  ('FG_E5', 'FG', 'Grupo E', 'ARG', 'Argentina', '🇦🇷', false, 'CRC', 'Costa Rica', '🇨🇷', false, null, null, 'Pending', 'Jue, jun 26', '3:00 p.m.', '2026-06-26T15:00:00', null, null),
  ('FG_E6', 'FG', 'Grupo E', 'FRA', 'Francia', '🇫🇷', false, 'AUS', 'Australia', '🇦🇺', false, null, null, 'Pending', 'Jue, jun 26', '6:00 p.m.', '2026-06-26T18:00:00', null, null),

  -- ========================
  -- GRUPO F
  -- ========================
  ('FG_F1', 'FG', 'Grupo F', 'GER', 'Alemania', '🇩🇪', false, 'ESP', 'España', '🇪🇸', false, null, null, 'Pending', 'Mar, jun 16', '6:00 p.m.', '2026-06-16T18:00:00', null, null),
  ('FG_F2', 'FG', 'Grupo F', 'CMR', 'Camerún', '🇨🇲', false, 'URU', 'Uruguay', '🇺🇾', false, null, null, 'Pending', 'Mié, jun 17', '1:00 p.m.', '2026-06-17T13:00:00', null, null),
  ('FG_F3', 'FG', 'Grupo F', 'GER', 'Alemania', '🇩🇪', false, 'CMR', 'Camerún', '🇨🇲', false, null, null, 'Pending', 'Dom, jun 22', '8:00 p.m.', '2026-06-22T20:00:00', null, null),
  ('FG_F4', 'FG', 'Grupo F', 'ESP', 'España', '🇪🇸', false, 'URU', 'Uruguay', '🇺🇾', false, null, null, 'Pending', 'Lun, jun 23', '1:00 p.m.', '2026-06-23T13:00:00', null, null),
  ('FG_F5', 'FG', 'Grupo F', 'GER', 'Alemania', '🇩🇪', false, 'URU', 'Uruguay', '🇺🇾', false, null, null, 'Pending', 'Vie, jun 27', '3:00 p.m.', '2026-06-27T15:00:00', null, null),
  ('FG_F6', 'FG', 'Grupo F', 'ESP', 'España', '🇪🇸', false, 'CMR', 'Camerún', '🇨🇲', false, null, null, 'Pending', 'Vie, jun 27', '6:00 p.m.', '2026-06-27T18:00:00', null, null),

  -- ========================
  -- GRUPO G
  -- ========================
  ('FG_G1', 'FG', 'Grupo G', 'POR', 'Portugal', '🇵🇹', false, 'NED', 'Países Bajos', '🇳🇱', false, null, null, 'Pending', 'Jue, jun 18', '1:00 p.m.', '2026-06-18T13:00:00', null, null),
  ('FG_G2', 'FG', 'Grupo G', 'SEN', 'Senegal', '🇸🇳', false, 'IRN', 'Irán', '🇮🇷', false, null, null, 'Pending', 'Jue, jun 18', '4:30 p.m.', '2026-06-18T16:30:00', null, null),
  ('FG_G3', 'FG', 'Grupo G', 'POR', 'Portugal', '🇵🇹', false, 'SEN', 'Senegal', '🇸🇳', false, null, null, 'Pending', 'Lun, jun 23', '8:00 p.m.', '2026-06-23T20:00:00', null, null),
  ('FG_G4', 'FG', 'Grupo G', 'NED', 'Países Bajos', '🇳🇱', false, 'IRN', 'Irán', '🇮🇷', false, null, null, 'Pending', 'Mar, jun 24', '1:00 p.m.', '2026-06-24T13:00:00', null, null),
  ('FG_G5', 'FG', 'Grupo G', 'POR', 'Portugal', '🇵🇹', false, 'IRN', 'Irán', '🇮🇷', false, null, null, 'Pending', 'Sáb, jun 28', '3:00 p.m.', '2026-06-28T15:00:00', null, null),
  ('FG_G6', 'FG', 'Grupo G', 'NED', 'Países Bajos', '🇳🇱', false, 'SEN', 'Senegal', '🇸🇳', false, null, null, 'Pending', 'Sáb, jun 28', '6:00 p.m.', '2026-06-28T18:00:00', null, null),

  -- ========================
  -- GRUPO H
  -- ========================
  ('FG_H1', 'FG', 'Grupo H', 'ENG', 'Inglaterra', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', false, 'BEL', 'Bélgica', '🇧🇪', false, null, null, 'Pending', 'Vie, jun 19', '1:00 p.m.', '2026-06-19T13:00:00', null, null),
  ('FG_H2', 'FG', 'Grupo H', 'CRO', 'Croacia', '🇭🇷', false, 'ECU', 'Ecuador', '🇪🇨', false, null, null, 'Pending', 'Vie, jun 19', '4:30 p.m.', '2026-06-19T16:30:00', null, null),
  ('FG_H3', 'FG', 'Grupo H', 'ENG', 'Inglaterra', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', false, 'CRO', 'Croacia', '🇭🇷', false, null, null, 'Pending', 'Mar, jun 24', '8:00 p.m.', '2026-06-24T20:00:00', null, null),
  ('FG_H4', 'FG', 'Grupo H', 'BEL', 'Bélgica', '🇧🇪', false, 'ECU', 'Ecuador', '🇪🇨', false, null, null, 'Pending', 'Jue, jun 25', '1:00 p.m.', '2026-06-25T13:00:00', null, null),
  ('FG_H5', 'FG', 'Grupo H', 'ENG', 'Inglaterra', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', false, 'ECU', 'Ecuador', '🇪🇨', false, null, null, 'Pending', 'Dom, jun 29', '3:00 p.m.', '2026-06-29T15:00:00', null, null),
  ('FG_H6', 'FG', 'Grupo H', 'BEL', 'Bélgica', '🇧🇪', false, 'CRO', 'Croacia', '🇭🇷', false, null, null, 'Pending', 'Dom, jun 29', '6:00 p.m.', '2026-06-29T18:00:00', null, null)
on conflict (id) do nothing;

-- ========================
-- KNOCKOUT STAGE
-- ========================

insert into matches (
  id, stage, group_name, team_a_id, team_a_name, team_a_flag, team_a_is_placeholder,
  team_b_id, team_b_name, team_b_flag, team_b_is_placeholder,
  score_a, score_b, status, match_date, match_time, datetime_iso,
  next_match_id, next_match_position
) values
  -- Octavos de Final (8 partidos)
  ('R16_1', '8vos', null, '1A', '1° Grupo A', '🏳️', true, '2B', '2° Grupo B', '🏳️', true, null, null, 'Pending', 'Sáb, jun 28', '3:00 p.m.', '2026-06-28T15:00:00', 'CF_1', 'teamA'),
  ('R16_2', '8vos', null, '1C', '1° Grupo C', '🏳️', true, '2D', '2° Grupo D', '🏳️', true, null, null, 'Pending', 'Sáb, jun 28', '6:00 p.m.', '2026-06-28T18:00:00', 'CF_1', 'teamB'),
  ('R16_3', '8vos', null, '1E', '1° Grupo E', '🏳️', true, '2F', '2° Grupo F', '🏳️', true, null, null, 'Pending', 'Dom, jun 29', '3:00 p.m.', '2026-06-29T15:00:00', 'CF_2', 'teamA'),
  ('R16_4', '8vos', null, '1G', '1° Grupo G', '🏳️', true, '2H', '2° Grupo H', '🏳️', true, null, null, 'Pending', 'Dom, jun 29', '6:00 p.m.', '2026-06-29T18:00:00', 'CF_2', 'teamB'),
  ('R16_5', '8vos', null, '1B', '1° Grupo B', '🏳️', true, '2A', '2° Grupo A', '🏳️', true, null, null, 'Pending', 'Lun, jun 30', '3:00 p.m.', '2026-06-30T15:00:00', 'CF_3', 'teamA'),
  ('R16_6', '8vos', null, '1D', '1° Grupo D', '🏳️', true, '2C', '2° Grupo C', '🏳️', true, null, null, 'Pending', 'Lun, jun 30', '6:00 p.m.', '2026-06-30T18:00:00', 'CF_3', 'teamB'),
  ('R16_7', '8vos', null, '1F', '1° Grupo F', '🏳️', true, '2E', '2° Grupo E', '🏳️', true, null, null, 'Pending', 'Mar, jul 1', '3:00 p.m.', '2026-07-01T15:00:00', 'CF_4', 'teamA'),
  ('R16_8', '8vos', null, '1H', '1° Grupo H', '🏳️', true, '2G', '2° Grupo G', '🏳️', true, null, null, 'Pending', 'Mar, jul 1', '6:00 p.m.', '2026-07-01T18:00:00', 'CF_4', 'teamB'),

  -- Cuartos de Final (4 partidos)
  ('CF_1', 'CF', null, 'W49', 'Por determinar', '🏳️', true, 'W50', 'Por determinar', '🏳️', true, null, null, 'Pending', 'Vie, jul 3', '3:00 p.m.', '2026-07-03T15:00:00', 'SF_1', 'teamA'),
  ('CF_2', 'CF', null, 'W51', 'Por determinar', '🏳️', true, 'W52', 'Por determinar', '🏳️', true, null, null, 'Pending', 'Vie, jul 3', '6:00 p.m.', '2026-07-03T18:00:00', 'SF_1', 'teamB'),
  ('CF_3', 'CF', null, 'W53', 'Por determinar', '🏳️', true, 'W54', 'Por determinar', '🏳️', true, null, null, 'Pending', 'Sáb, jul 4', '3:00 p.m.', '2026-07-04T15:00:00', 'SF_2', 'teamA'),
  ('CF_4', 'CF', null, 'W55', 'Por determinar', '🏳️', true, 'W56', 'Por determinar', '🏳️', true, null, null, 'Pending', 'Sáb, jul 4', '6:00 p.m.', '2026-07-04T18:00:00', 'SF_2', 'teamB'),

  -- Semifinales (2 partidos)
  ('SF_1', 'SF', null, 'W57', 'Por determinar', '🏳️', true, 'W58', 'Por determinar', '🏳️', true, null, null, 'Pending', 'Mar, jul 7', '3:00 p.m.', '2026-07-07T15:00:00', 'F_1', 'teamA'),
  ('SF_2', 'SF', null, 'W59', 'Por determinar', '🏳️', true, 'W60', 'Por determinar', '🏳️', true, null, null, 'Pending', 'Mié, jul 8', '3:00 p.m.', '2026-07-08T15:00:00', 'F_1', 'teamB'),

  -- Finales (2 partidos)
  ('F_1', 'F', null, 'W61', 'Por determinar', '🏳️', true, 'W62', 'Por determinar', '🏳️', true, null, null, 'Pending', 'Dom, jul 12', '3:00 p.m.', '2026-07-12T15:00:00', null, null),
  ('F_3rd', 'F', null, 'L61', 'Por determinar', '🏳️', true, 'L62', 'Por determinar', '🏳️', true, null, null, 'Pending', 'Sáb, jul 11', '3:00 p.m.', '2026-07-11T15:00:00', null, null)
on conflict (id) do nothing;

-- --------------------------------------------------------
-- 10. APP SETTINGS DEFAULTS
-- --------------------------------------------------------

insert into app_settings (key, value) values
  ('tournament_name', 'Copa Mundial FIFA 2026'),
  ('tournament_year', '2026'),
  ('simulated_time', '2026-06-11T12:00:00'),
  ('predictions_locked', 'false')
on conflict (key) do nothing;

-- --------------------------------------------------------
-- 11. SUPABASE AUTH INTEGRATION NOTES
-- --------------------------------------------------------

/*
  USER REGISTRATION FLOW (to implement in your app):
  ===================================================

  1. SIGN UP:
     - Call supabase.auth.signUp({ email, password })
     - Extract domain from email: @empresa.com
     - Check: SELECT * FROM allowed_domains WHERE domain = '@empresa.com'
     - If no rows AND allowed_domains has rows → reject signup
     - If allowed_domains is empty → allow (open mode)
     - After signup, insert into profiles(id, name, role, avatar)

  2. AUTO-CREATE PROFILE (recommended):
     Create a Supabase Edge Function or use a database trigger
     that listens to auth.users inserts and auto-creates a profile:

     create or replace function public.handle_new_user()
     returns trigger as $$
     declare
       user_domain text;
     begin
       user_domain := '@' || split_part(new.email, '@', 2);

       -- Check if domain restriction is active
       if exists (select 1 from allowed_domains limit 1) then
         if not exists (
           select 1 from allowed_domains where domain = user_domain
         ) then
           raise exception 'Domain not allowed: %', user_domain;
         end if;
       end if;

       insert into public.profiles (id, name, role, avatar)
       values (
         new.id,
         coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
         'Employee',
         '👤'
       );
       return new;
     end;
     $$ language plpgsql security definer;

     -- Trigger (run this in Supabase SQL editor if needed):
     -- create trigger on_auth_user_created
     --   after insert on auth.users
     --   for each row execute function public.handle_new_user();

  3. ADMIN SETUP:
     After creating the first user via Supabase Auth,
     manually update their role in profiles:
     UPDATE profiles SET role = 'Admin', avatar = '🛡️' WHERE id = 'USER_UUID';

  4. CONNECTION CONFIG (for your .env):
     VITE_SUPABASE_URL=https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key

  RLS NOTES:
  ==========
  - The "Only admins can modify matches" policy checks profiles.role = 'Admin'
  - Make sure to create at least one admin profile after first signup
  - All read policies are open (public data) except admin-managed tables

  FUNCTIONS AVAILABLE:
  ====================
  - reset_all_matches()            → Call to reset all results to Pending
  - get_group_standings('Grupo A') → Returns complete group table
  - leaderboard (view)             → Real-time ranking with points
*/

-- --------------------------------------------------------
-- 12. GRANTS (ensure public access for authenticated users)
-- --------------------------------------------------------

grant usage on schema public to anon, authenticated;
grant select on all tables in schema public to anon, authenticated;
grant insert, update, delete on table predictions to authenticated;
grant insert on table profiles to authenticated;
grant update on table profiles to authenticated;
grant execute on function get_group_standings(text) to anon, authenticated;

-- --------------------------------------------------------
-- END OF INITIAL SCHEMA
-- --------------------------------------------------------
