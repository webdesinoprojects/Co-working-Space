# Supabase Migration Notes

Run these files in order:

1. `001_base_admin_backend.sql`
2. `002_homepage_sections.sql`
3. `003_contact_messages.sql`
4. `004_row_level_security.sql`
5. `005_media_provider_file_id.sql`

## Media Scope

This admin backend is `image only`.

Do not build support for:

- GIF uploads
- video uploads

## First Admin Bootstrap

After creating the first admin user in Supabase Auth, insert a matching profile row:

```sql
insert into public.admin_profiles (id, email, display_name, role, is_active)
values (
  'SUPABASE_AUTH_USER_ID_HERE',
  'admin@example.com',
  'Primary Admin',
  'owner',
  true
);
```

Use the actual user ID from `auth.users`.
