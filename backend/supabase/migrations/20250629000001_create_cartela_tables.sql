-- Create cartela group status type
create type public.cartela_group_status as enum ('active', 'inactive');

-- Create cartela_groups table
create table public.cartela_groups (
  id uuid not null primary key default gen_random_uuid(),
  name text not null,
  status cartela_group_status not null default 'active',
  created_at timestamptz not null default now()
);

-- Create cartela status type
create type public.cartela_status as enum ('available', 'sold', 'claimed');

-- Create cartelas table
create table public.cartelas (
  id uuid not null primary key default gen_random_uuid(),
  cartela_number integer not null,
  status cartela_status not null default 'available',
  cartela_group_id uuid not null references public.cartela_groups(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(cartela_number, cartela_group_id)
);

-- Enable RLS
alter table public.cartela_groups enable row level security;
alter table public.cartelas enable row level security;

-- Policies for cartela_groups
create policy "Allow all users to read cartela groups" on public.cartela_groups for select using (true);
create policy "Allow admin users to manage cartela groups" on public.cartela_groups for all using (
  (select role from public.users where id = auth.uid()) = 'admin'
) with check (
  (select role from public.users where id = auth.uid()) = 'admin'
);

-- Policies for cartelas
create policy "Allow all users to read cartelas" on public.cartelas for select using (true);
create policy "Allow admin users to manage cartelas" on public.cartelas for all using (
  (select role from public.users where id = auth.uid()) = 'admin'
) with check (
  (select role from public.users where id = auth.uid()) = 'admin'
);
