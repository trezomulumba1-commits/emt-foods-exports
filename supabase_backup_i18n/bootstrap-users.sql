-- Run this after you have created auth users in Supabase.
-- Replace the placeholder UUIDs with real auth.users.id values.

-- Regular user profile
insert into public.profiles (
  id,
  full_name,
  company_name,
  phone_number,
  shipping_address,
  is_admin
)
values (
  '00000000-0000-0000-0000-000000000001',
  'Regular User',
  'Regular User Company',
  null,
  null,
  false
)
on conflict (id) do update set
  full_name = excluded.full_name,
  company_name = excluded.company_name,
  phone_number = excluded.phone_number,
  shipping_address = excluded.shipping_address,
  is_admin = excluded.is_admin;

-- Admin profile
insert into public.profiles (
  id,
  full_name,
  company_name,
  phone_number,
  shipping_address,
  is_admin
)
values (
  '00000000-0000-0000-0000-000000000002',
  'Admin User',
  'EMT Foods Exports',
  null,
  null,
  true
)
on conflict (id) do update set
  full_name = excluded.full_name,
  company_name = excluded.company_name,
  phone_number = excluded.phone_number,
  shipping_address = excluded.shipping_address,
  is_admin = excluded.is_admin;
