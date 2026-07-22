# Thổ Kim Realty — Structure Notes

## Architecture
- Static multi-page front-end.
- Shared header/footer loaded from `/components` through `component-loader.js`.
- Reusable card data stored in `/data/site-content.js`.
- CSS split into tokens, base, layout, components, utilities, responsive.
- JS split into component loading, navigation logic, interactions and main init.

## Extension paths
- Replace static forms with Formspree, Tally, Supabase or custom backend.
- Move `site-content.js` to headless CMS or JSON API.
- Expand `properties.html` into project detail pages.
- Add multilingual layer by splitting copy into a dedicated content file.
