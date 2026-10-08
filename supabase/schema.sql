create extension if not exists "pgcrypto";

-- 1. Create Role Enum
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum (
      'guest',
      'customer',
      'supplier',
      'support_admin',
      'content_admin',
      'operations_admin',
      'finance_admin',
      'super_admin'
    );
  end if;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  full_name text,
  company_name text,
  phone_number text,
  shipping_address text,
  role public.user_role not null default 'customer'
);

-- Ensure role column exists on existing databases (migration-safe)
alter table public.profiles
  add column if not exists role public.user_role not null default 'customer';

-- Drop is_admin if it existed previously
do $$
begin
  if exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'is_admin') then
    alter table public.profiles drop column is_admin;
  end if;
end $$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    full_name,
    company_name,
    phone_number,
    shipping_address,
    role
  )
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'company_name',
    new.raw_user_meta_data->>'phone_number',
    new.raw_user_meta_data->>'shipping_address',
    coalesce((new.raw_app_meta_data->>'role')::public.user_role, 'customer'::public.user_role)
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    company_name = excluded.company_name,
    phone_number = excluded.phone_number,
    shipping_address = excluded.shipping_address;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Audit Logs Table
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  table_name text not null,
  record_id uuid,
  action text not null,
  old_data jsonb,
  new_data jsonb,
  performed_by uuid references auth.users(id) on delete set null
);

create or replace function public.log_audit_event()
returns trigger
language plpgsql
security definer
as $$
declare
  old_rec jsonb := null;
  new_rec jsonb := null;
  rec_id uuid := null;
begin
  if TG_OP = 'UPDATE' or TG_OP = 'DELETE' then
    old_rec := to_jsonb(OLD);
    rec_id := OLD.id;
  end if;
  if TG_OP = 'INSERT' or TG_OP = 'UPDATE' then
    new_rec := to_jsonb(NEW);
    rec_id := NEW.id;
  end if;

  insert into public.audit_logs (table_name, record_id, action, old_data, new_data, performed_by)
  values (TG_TABLE_NAME, rec_id, TG_OP, old_rec, new_rec, auth.uid());

  if TG_OP = 'DELETE' then
    return OLD;
  end if;
  return NEW;
end;
$$;

-- Products Table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  sku text not null unique,
  name text not null,
  description text not null,
  category text not null,
  image text not null,
  price numeric(12,2) not null default 0,
  "qualityGrade" text not null default 'Pending',
  "moisturePercent" numeric(5,2),
  "batchNumber" text not null,
  warehouse text not null,
  "inspectionNotes" text,
  "harvestDate" date not null default current_date,
  supplier text not null,
  "expiryDate" date
);

drop trigger if exists audit_products on public.products;
create trigger audit_products
after insert or update or delete on public.products
for each row execute function public.log_audit_event();

-- Quote Requests
create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  product_name text,
  requested_quantity numeric(12,2),
  destination_country text,
  message text,
  status text not null default 'Pending'
);

drop trigger if exists audit_quote_requests on public.quote_requests;
create trigger audit_quote_requests
after insert or update or delete on public.quote_requests
for each row execute function public.log_audit_event();

-- Contact Messages
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null
);

-- Purchase Requests
create table if not exists public.purchase_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  shipping_address text,
  items text not null,
  total_value numeric(12,2) not null default 0,
  status text not null default 'Pending',
  notes text
);

drop trigger if exists audit_purchase_requests on public.purchase_requests;
create trigger audit_purchase_requests
after insert or update or delete on public.purchase_requests
for each row execute function public.log_audit_event();

-- Export Orders
create table if not exists public.export_orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  order_reference text not null unique,
  customer_name text not null,
  customer_email text,
  customer_phone text,
  destination_country text not null,
  export_status text not null default 'Pending',
  carrier_name text,
  carrier_tracking_number text,
  expected_delivery date,
  notes text
);

drop trigger if exists audit_export_orders on public.export_orders;
create trigger audit_export_orders
after insert or update or delete on public.export_orders
for each row execute function public.log_audit_event();

-- Export Status Updates
create table if not exists public.export_status_updates (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  export_order_id uuid not null references public.export_orders(id) on delete cascade,
  status text not null,
  remarks text,
  updated_by text
);

-- Role Checking Function
create or replace function public.current_user_has_role(allowed_roles text[])
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role::text = any(allowed_roles)
  ) or coalesce((auth.jwt() -> 'app_metadata' ->> 'role')::text = any(allowed_roles), false);
$$;

-- RLS
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.quote_requests enable row level security;
alter table public.contact_messages enable row level security;
alter table public.purchase_requests enable row level security;
alter table public.export_orders enable row level security;
alter table public.export_status_updates enable row level security;
alter table public.audit_logs enable row level security;

-- Profiles Policies
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin" on public.profiles
for select using (id = auth.uid() or public.current_user_has_role(array['super_admin', 'support_admin']));

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin" on public.profiles
for update using (id = auth.uid() or public.current_user_has_role(array['super_admin']));

-- Products Policies
drop policy if exists "products_public_read" on public.products;
create policy "products_public_read" on public.products
for select using (true);

drop policy if exists "products_admin_write" on public.products;
create policy "products_admin_write" on public.products
for all using (public.current_user_has_role(array['super_admin', 'content_admin']))
with check (public.current_user_has_role(array['super_admin', 'content_admin']));

-- Quote Requests Policies
drop policy if exists "quote_requests_public_insert" on public.quote_requests;
create policy "quote_requests_public_insert" on public.quote_requests
for insert with check (true);

drop policy if exists "quote_requests_admin_read" on public.quote_requests;
create policy "quote_requests_admin_read" on public.quote_requests
for select using (public.current_user_has_role(array['super_admin', 'support_admin', 'operations_admin']));

drop policy if exists "quote_requests_admin_update" on public.quote_requests;
create policy "quote_requests_admin_update" on public.quote_requests
for update using (public.current_user_has_role(array['super_admin', 'support_admin', 'operations_admin']));

-- Contact Messages
drop policy if exists "contact_messages_public_insert" on public.contact_messages;
create policy "contact_messages_public_insert" on public.contact_messages
for insert with check (true);

drop policy if exists "contact_messages_admin_read" on public.contact_messages;
create policy "contact_messages_admin_read" on public.contact_messages
for select using (public.current_user_has_role(array['super_admin', 'support_admin']));

-- Purchase Requests
drop policy if exists "purchase_requests_public_insert" on public.purchase_requests;
create policy "purchase_requests_public_insert" on public.purchase_requests
for insert with check (true);

drop policy if exists "purchase_requests_admin_read" on public.purchase_requests;
create policy "purchase_requests_admin_read" on public.purchase_requests
for select using (public.current_user_has_role(array['super_admin', 'finance_admin', 'operations_admin']));

drop policy if exists "purchase_requests_admin_manage" on public.purchase_requests;
create policy "purchase_requests_admin_manage" on public.purchase_requests
for all using (public.current_user_has_role(array['super_admin', 'finance_admin']))
with check (public.current_user_has_role(array['super_admin', 'finance_admin']));

-- Export Orders
drop policy if exists "export_orders_public_track" on public.export_orders;
create policy "export_orders_public_track" on public.export_orders
for select using (true);

drop policy if exists "export_orders_admin_write" on public.export_orders;
create policy "export_orders_admin_write" on public.export_orders
for all using (public.current_user_has_role(array['super_admin', 'operations_admin']))
with check (public.current_user_has_role(array['super_admin', 'operations_admin']));

-- Export Status Updates
drop policy if exists "export_status_updates_public_track" on public.export_status_updates;
create policy "export_status_updates_public_track" on public.export_status_updates
for select using (true);

drop policy if exists "export_status_updates_admin_write" on public.export_status_updates;
create policy "export_status_updates_admin_write" on public.export_status_updates
for all using (public.current_user_has_role(array['super_admin', 'operations_admin']))
with check (public.current_user_has_role(array['super_admin', 'operations_admin']));

-- Audit Logs RLS
drop policy if exists "audit_logs_super_admin" on public.audit_logs;
create policy "audit_logs_super_admin" on public.audit_logs
for select using (public.current_user_has_role(array['super_admin']));

-- STORAGE CONFIGURATION
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "product_images_public_read" on storage.objects;
create policy "product_images_public_read" on storage.objects
for select using (bucket_id = 'product-images');

drop policy if exists "product_images_admin_insert" on storage.objects;
create policy "product_images_admin_insert" on storage.objects
for insert with check (
  bucket_id = 'product-images' 
  and public.current_user_has_role(array['super_admin', 'content_admin'])
);

drop policy if exists "product_images_admin_update" on storage.objects;
create policy "product_images_admin_update" on storage.objects
for update using (
  bucket_id = 'product-images'
  and public.current_user_has_role(array['super_admin', 'content_admin'])
);

drop policy if exists "product_images_admin_delete" on storage.objects;
create policy "product_images_admin_delete" on storage.objects
for delete using (
  bucket_id = 'product-images'
  and public.current_user_has_role(array['super_admin', 'content_admin'])
);
