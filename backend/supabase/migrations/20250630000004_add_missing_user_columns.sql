-- Add missing columns to users table
alter table public.users add column if not exists name text;
alter table public.users add column if not exists phone text;
alter table public.users add column if not exists updated_at timestamptz not null default now();

-- Create a trigger to automatically update the updated_at column
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create the trigger
drop trigger if exists update_users_updated_at on public.users;
create trigger update_users_updated_at
  before update on public.users
  for each row
  execute function public.update_updated_at_column();
