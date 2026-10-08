# EMT Foods Exports — Quota Handoff & Next Steps

Date: 2026-07-09

This file is a working handoff for the current redesign effort so the project can continue even if the session quota ends.

## Current Direction

We are turning the site into a more premium, real export-company experience with:

- animated looping visual sections for product categories,
- a calm blue-and-white brand system,
- dark mode support that stays consistent with the light theme,
- a stronger “we are a real business” message before the product sections,
- a future path toward a local ticketing / transport style service without making the site feel limited to one service,
- an admin dashboard,
- and the Supabase backend needed to support the data flows.

## Visual Direction

### Animated category sections

We want the static generated images to become short looping video-style visuals.

Planned behavior:

- **Seeds / grains / agricultural products**
  - keep the same seed image composition,
  - make the seeds drift slowly in and out of frame,
  - create a gentle continuous loop,
  - use a background tone that blends into the section.

- **Dry foods**
  - make items move like a falling loop,
  - as one item exits the bottom, another appears at the top,
  - keep it subtle and premium, not cartoonish,
  - make the background match the section so the loop feels native.

- **Fabrics**
  - make fabrics move in soft wave/flag motion,
  - fill the frame with several layered textiles,
  - keep the motion elegant and slow.

### Color system

The site should stay blue-first, but every section can transition through a unique, muted supporting tone.

Goals:

- no sudden color jumps,
- no bright or loud palette shifts,
- keep the blue-and-white identity present everywhere,
- each section should subtly blend into the next,
- dark mode should use the same structure with deeper muted equivalents.

Suggested section tone sequence:

1. Home intro — deep blue / cool white
2. Dry foods — slate blue / pale steel
3. Seeds — muted teal-blue / mist
4. Fabrics — indigo / soft navy
5. About / credibility — charcoal blue / ivory
6. Contact / CTA — calm accent blue / fog

### Brand message before products

The site should lead with:

- what the company does,
- that it serves both international buyers and local users,
- that it supports export now,
- and that the platform can later grow into other services like transport/tickets without looking fragmented.

We should avoid making the app feel like it only serves one narrow export use case.

## Product / UX Direction

### Main homepage flow

Before the category sections appear, the homepage should communicate:

- who EMT Foods Exports is,
- what kinds of goods it handles,
- how buyers can work with the company,
- and why the company is trustworthy.

### Future service expansion

The app should be designed so future local services can be added cleanly:

- bus tickets,
- local logistics,
- local trade,
- booking or request systems.

That should be treated as a future project or expansion layer, not forced into the current UI if it makes the site feel cluttered.

## Admin Dashboard

The next major build should include an admin dashboard for:

- viewing products,
- adding / editing / removing products,
- reviewing quote requests,
- checking contact messages,
- monitoring shipment/tracking data,
- managing users or staff access if needed,
- and viewing activity status.

## Supabase Work Needed

We need the database and app wiring for:

- `products`
- `quote_requests`
- `shipments`
- `shipment_updates`
- `contact_messages`

Likely next backend work:

- confirm table schemas,
- confirm row-level security rules,
- confirm insert/select policies,
- wire the forms to Supabase cleanly,
- and make sure admin access is separated from public access.

## Suggested Build Order

1. Rewrite the homepage message and section flow.
2. Add the animated looping visual treatment for product categories.
3. Make the blue/white color system transition smoothly across sections.
4. Add dark mode matching for the same transitions.
5. Build the admin dashboard UI.
6. Wire the dashboard and forms to Supabase.
7. Audit deployment and production readiness.

## Notes For The Next Session

- Keep the design premium and restrained.
- Do not make the palette too colorful.
- Keep motion subtle and loop-friendly.
- Treat the current site as a real export brand, not a generic template.
- If the local ticketing idea becomes a full feature, split it into a separate project unless it fits naturally without clutter.

