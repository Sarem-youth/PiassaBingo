-- Create user roles type
create type public.user_role as enum ('admin', 'agent', 'shop', 'cashier');

-- Create user status type
create type public.user_status as enum ('active', 'locked');

-- Create users table
create table public.users (
  id uuid not null primary key references auth.users(id) on delete cascade,
  username text not null unique,
  email text not null unique,
  role user_role not null default 'cashier',
  status user_status not null default 'active',
  balance numeric(10, 2) not null default 0.00,
  commission_rate numeric(5, 2) not null default 0.00,
  created_at timestamptz not null default now(),
  parent_id uuid references public.users(id) -- For agent -> shop relationship
);

-- Enable RLS
alter table public.users enable row level security;

-- Policies for users table
create policy "Allow authenticated users to read their own data" on public.users for select using (auth.uid() = id);
create policy "Allow admin users to manage all users" on public.users for all using (
  (select role from public.users where id = auth.uid()) = 'admin'
) with check (
  (select role from public.users where id = auth.uid()) = 'admin'
);
create policy "Allow agents to see their shops" on public.users for select using (
  ((select role from public.users where id = auth.uid()) = 'agent' and parent_id = auth.uid()) OR id = auth.uid()
);
