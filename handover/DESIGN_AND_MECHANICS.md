# Design And Mechanics

## Brand Direction

EMT Foods Exports should feel like a real Zambian export company: calm, credible, premium, and operationally clear.

The website must welcome:

- international buyers,
- local buyers,
- Zambian producers,
- future service expansion.

It should not feel locked to only one product or one future service.

## Visual System

- Core palette: blue and white with restrained supporting tones.
- Light mode: clean white, pale blue, and steel accents.
- Dark mode: black/deep neutral foundations with blue accents.
- Navigation: stable surface background; follows light/dark only.
- Product sections: use local section colors, not global page rewrites.
- Category visuals: static campaign-style image panels with product messaging.

## Current Navigation

- Home
- Products
- Export Services
- Solutions
- About
- Contact
- Login/Profile

Admin is separate and runs from its own app/server.

## Public Workflows

- Product catalog reads from `products`.
- Product detail modal can add logged-in users' items to cart.
- Cart submits to `purchase_requests`.
- Export support form submits to `quote_requests`.
- Contact form submits to `contact_messages`.
- Tracking reads from `export_orders` and `export_status_updates`.

## Admin Workflows

- Admin login uses Supabase Auth.
- Admin access requires `profiles.is_admin = true`.
- Admin dashboard can manage products, quotes, purchase requests, messages, and export order status.

## Next Improvements

- Add edit product flow, not just add/delete.
- Add real production images for each product category.
- Add deployment configuration once hosting target is selected.
