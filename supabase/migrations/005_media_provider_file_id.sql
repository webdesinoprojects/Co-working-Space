alter table public.media_assets
  add column if not exists provider_file_id text;

create unique index if not exists idx_media_assets_provider_file_id
  on public.media_assets (provider, provider_file_id)
  where provider_file_id is not null;
