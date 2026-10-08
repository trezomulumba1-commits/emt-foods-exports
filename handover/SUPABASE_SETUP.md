# Supabase Setup

## Required Keys

Frontend keys:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Server-only setup key:

- `SUPABASE_SERVICE_ROLE_KEY`

Database migration keys:

- `DATABASE_URL`
- `DIRECT_URL`

Do not expose `SUPABASE_SERVICE_ROLE_KEY` in browser code.

## Tables

The current schema creates:

- `profiles`
- `products`
- `quote_requests`
- `contact_messages`
- `purchase_requests`
- `export_orders`
- `export_status_updates`

The schema also creates a signup trigger so new auth users get a matching `profiles` row automatically.

## Create User And Admin Accounts

Add these values to a local, uncommitted `.env` file:

```env
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SEED_USER_EMAIL=user@example.com
SEED_USER_PASSWORD=replace-with-a-strong-password
SEED_USER_NAME="EMT Client User"
SEED_USER_COMPANY="Client Account"
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=replace-with-a-strong-password
SEED_ADMIN_NAME="EMT Admin User"
SEED_ADMIN_COMPANY="EMT Foods Exports"
```

Then run:

```powershell
cmd /c npm run create:accounts
```

The script creates or updates both auth users, sets `app_metadata.is_admin = true` for the admin account, and upserts their profile rows.

## Manual Admin Promotion

If an auth user already exists, promote them with:

```sql
update public.profiles
set is_admin = true
where id = 'PUT-AUTH-USER-UUID-HERE';
```

If the profile table is already using auth metadata only, you can also promote by updating the user in Supabase Auth and setting `app_metadata.is_admin = true`.
