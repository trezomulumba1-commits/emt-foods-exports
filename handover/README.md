# EMT Foods Exports Handover

Date: 2026-07-10

This folder is the single handover point for the project. Older notes are kept in `archive/`, but this file is the current source of truth.

## Current State

- Public website: React/Vite app in `src/`, served from `dist` by `server.js`.
- Admin dashboard: separate React/Vite app in `admin/`, served from `dist-admin` by `admin/server.js`.
- Public server port: `3003`.
- Admin server port: `3001`.
- One-click local run file: `run_app.bat`.
- Supabase schema: `supabase/schema.sql`.
- Account bootstrap script: `scripts/create-accounts.mjs`.
- Admin dashboard has a simple mode for phone use and stays separate from the public site.

## What Was Stabilized

- Removed the scroll-driven global color interpolation that made text unreadable.
- Kept light/dark theme changes global and reliable.
- Made product section colors local to each section.
- Stabilized the navigation so it follows light/dark theme rather than scroll-section colors.
- Replaced animation-first category visuals with campaign-style static product panels.
- Added a real `purchase_requests` table and public insert policy.
- Added admin listing and status management for purchase requests.
- Added a server-only account creation script for user and admin accounts.

## Run Locally

```powershell
cmd /c npm install
cmd /c npm run build
cmd /c npm run build:admin
cmd /c npm run dev
cmd /c npm run dev:admin
```

Or double-click `run_app.bat`.

## Verify

```powershell
cmd /c npm run lint
cmd /c npm run build
cmd /c npm run build:admin
```

## Account Status

The local uncommitted `.env.local` now carries the service key and seed account values needed for account bootstrap.

Run:

```powershell
cmd /c npm run create:accounts
```

Seeded accounts:

- `user@emtfoods.local`
- `admin@emtfoods.local`

The admin account uses `app_metadata.is_admin = true`.

## Deployment Prep

Before deployment:

- Apply `supabase/schema.sql` to the Supabase project.
- Add production env vars to the hosting provider.
- Run `cmd /c npm run build` and `cmd /c npm run build:admin`.
- Confirm admin login with the seeded admin account.
- Confirm public signup creates a profile row.
- Confirm quote, contact, purchase request, and tracking flows write/read correctly.
