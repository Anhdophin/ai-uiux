# AGENTS.md

## Read first
Before changing code in this project, read these files in order:
1. `AGENTS.md`
2. `.cursorrules`
3. `AI-EDIT-PRECHECK.md`
4. The file(s) you plan to edit

If you are an AI assistant, your first code task is to identify:
- which file controls the feature
- where the data comes from
- which event triggers the logic
- where the style lives
- what clone-sensitive values exist: slug, title, path, href, category mapping, media path

## Project priorities
- Keep the source static, simple, and easy to run on localhost.
- Prefer small targeted edits over broad refactors.
- Keep backward compatibility with the existing source as much as possible.
- Keep code easy to read, easy to edit by hand, and easy to clone to another project.

## Working rules
- Read the current code before editing.
- Do not rename files, folders, classes, ids, functions, or variables unless necessary.
- Do not delete older code unless you are sure it is unused.
- If a fix may affect other places, patch the exact failing point and preserve the old logic.
- When data already exists in meta/json/catalog, do not hardcode slug, path, category, title, or media path.
- Always add safe null/undefined fallbacks when reading dynamic data.

## Routing and clone-sensitive checks
When the issue involves navigation, slug, category, routing, path, or clone behavior, check in this order:
1. `page.meta.json`
2. generated data file (`shop/data/shop-catalog.json` or `data/site-map.json`)
3. render logic (`shop/shop-shared/catalog.js`, `shop/shop-shared/product-detail-media.js`, `shared/subpage-components.js`)
4. href/route values
5. folder path and slug mapping
6. fallback logic that might still pull old data

## Shop project map
### Main data flow
- `shop/scan_shop.py` scans category/product folders and generates `shop/data/shop-catalog.json`
- `shop/shop-shared/catalog.js` renders category cards, product cards, tabs, filters
- `shop/shop-shared/product-detail-media.js` renders main image, gallery, lightbox, gallery navigation
- `shop/shop-shared/shop-local-nav.js` renders local shop navigation on detail pages

### Clone-sensitive files
- Category page: `shop/<category-slug>/index.html`
- Category meta: `shop/<category-slug>/page.meta.json`
- Product page: `shop/<category-slug>/<product-slug>/index.html`
- Product meta: `shop/<category-slug>/<product-slug>/page.meta.json`
- Product images: `shop/<category-slug>/<product-slug>/media/`
- Category images: `shop/media/<category-slug>.*`

## HTML rules
- Use semantic HTML where reasonable.
- Keep large blocks easy to spot.
- Add short comments only where the owner will need to edit by hand later.
- Do not hardcode repeated content in many places if it can come from shared data.

## CSS rules
- Prefer reusable class names.
- Avoid leaking styles globally outside the part being changed.
- Structure styles in this order when possible: layout, component, state, responsive.
- Avoid excessive `!important`.
- Check desktop and mobile when touching layout or spacing.

## JavaScript rules
- Keep logic explicit and easy to debug.
- One function, one main job.
- Cache repeated DOM queries when useful.
- Do not hardcode path/slug/category if it can be read from data or URL.
- Prefer real item data over guessed values.

## Python scanner rules
- The scanner should sync folders and data, not hide errors.
- Prefer safe fallbacks plus clear warnings.
- Generated files should not be edited by hand.

## Output rules for AI edits
When returning changes, always state briefly:
- which file(s) were changed
- what logic was changed
- why the bug happened
- what to remember the next time a category/product is cloned
