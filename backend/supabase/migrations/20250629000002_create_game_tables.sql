-- Create game status type
create type public.game_status as enum ('pending', 'active', 'finished', 'cancelled');

-- Create games table
create table public.games (
  id uuid not null primary key default gen_random_uuid(),
  shop_id uuid not null references public.users(id) on delete cascade,
  status game_status not null default 'pending',
  settings jsonb,
  drawn_numbers integer[],
  winning_pattern jsonb,
  stake numeric(10, 2),
  created_at timestamptz not null default now()
);

-- Create game_cartelas table (junction table)
create table public.game_cartelas (
  game_id uuid not null references public.games(id) on delete cascade,
  cartela_id uuid not null references public.cartelas(id) on delete cascade,
  primary key (game_id, cartela_id),
  is_winner boolean not null default false,
  claimed_at timestamptz
);

-- Enable RLS
alter table public.games enable row level security;
alter table public.game_cartelas enable row level security;

-- Policies for games
create policy "Allow users to see games from their shop" on public.games for select using (
  shop_id = (select id from public.users where id = auth.uid() and role in ('shop', 'cashier'))
);
create policy "Allow shop users to manage their own games" on public.games for all using (
  shop_id = (select id from public.users where id = auth.uid() and role = 'shop')
) with check (
  shop_id = (select id from public.users where id = auth.uid() and role = 'shop')
);
create policy "Allow admin to manage all games" on public.games for all using (
  (select role from public.users where id = auth.uid()) = 'admin'
) with check (
  (select role from public.users where id = auth.uid()) = 'admin'
);

-- Policies for game_cartelas
create policy "Allow users to interact with cartelas in their games" on public.game_cartelas for all using (
  game_id in (select id from public.games where shop_id = (select id from public.users where id = auth.uid()))
);
create policy "Allow admin to manage all game cartelas" on public.game_cartelas for all using (
  (select role from public.users where id = auth.uid()) = 'admin'
) with check (
  (select role from public.users where id = auth.uid()) = 'admin'
);
