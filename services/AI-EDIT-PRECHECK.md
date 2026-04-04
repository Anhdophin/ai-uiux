# AI Edit Precheck

Use this before changing code.

## Step 1 — Read rules
- Read `AGENTS.md`
- Read `.cursorrules`
- If using Cursor, `.cursor/rules/*.mdc` should also be loaded

## Step 2 — Map the feature
Write down before editing:
- controlling file
- data source
- event trigger
- style file
- clone-sensitive values: slug, title, path, href, category mapping, media path

## Step 3 — Pick the smallest fix
- Patch the exact failing point
- Keep old logic unless the bug comes from that logic
- Add fallback if data may be missing

## Step 4 — Clone safety check
If the task touches category/product clone behavior, verify:
- category slug
- category title
- folder path
- product route
- `category_slug`
- detail link
- media folder
- generated catalog after scan

## Step 5 — Return summary
When done, explain briefly:
- files changed
- logic changed
- root cause
- what the owner must remember when cloning next time
