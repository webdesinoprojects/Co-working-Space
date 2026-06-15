create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  interest text,
  message text not null,
  source_path text not null default '/',
  status text not null default 'new' check (status in ('new', 'viewed', 'in_progress', 'resolved', 'spam')),
  admin_notes text,
  assigned_to uuid references public.admin_profiles(id) on delete set null,
  viewed_at timestamptz,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_contact_messages_status_created_at
  on public.contact_messages (status, created_at desc);

create index if not exists idx_contact_messages_email
  on public.contact_messages (email);

create trigger trg_contact_messages_updated_at
before update on public.contact_messages
for each row
execute function public.set_updated_at();
