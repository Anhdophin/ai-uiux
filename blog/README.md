# Blog Management System

## Overview

The blog uses a **folder-based structure** similar to the shop system. Each blog post is a separate folder with its own metadata and content. Adding or removing posts is as simple as copying/deleting folders.

## Quick Start

### 1. Create a New Blog Post

```bash
# Copy the template folder and rename it
cp -r blog/posts/_template blog/posts/my-first-post

# Edit the post metadata
# Edit the post content
# Add featured image to media/

# Scan and generate catalog
python blog/scan_blog.py
```

### 2. Edit Post Settings

Edit `blog/posts/<post-slug>/page.meta.json`:

```json
{
  "slug": "my-first-post",
  "title": "My First Post Title",
  "short_title": "First Post",
  "category": "design",
  "excerpt": "Brief summary (150-300 characters)",
  "tags": ["tag1", "tag2", "tag3"],
  "author": "Anhdophin",
  "publish_date": "2026-04-07",
  "updated_date": "2026-04-07",
  "featured_image": "./media/featured.jpg",
  "read_time": 8,
  "is_featured": false,
  "status": "published"
}
```

### 3. Edit Post Content

Edit `blog/posts/<post-slug>/index.html` - write your post content directly in the HTML.

### 4. Add Images

Place images in `blog/posts/<post-slug>/media/` and reference them as:
```html
<img src="./media/image-name.jpg" alt="Description" />
```

### 5. Generate Catalog

Run the scanner to update `blog-catalog.json`:
```bash
python blog/scan_blog.py
```

The blog home page will automatically show all published posts.

---

## File Structure

```
blog/
├── index.html                    # Blog home (lists all posts)
├── page.meta.json               # Navigation metadata
├── scan_blog.py                 # ⭐ Scanner script (run after changes)
├── data/
│   └── blog-catalog.json        # Auto-generated catalog (don't edit)
├── posts/                        # All blog posts
│   ├── _template/               # Template folder (copy this to create new posts)
│   │   ├── page.meta.json
│   │   ├── index.html
│   │   ├── media/
│   │   └── README.md
│   ├── my-first-post/           # Example: actual post
│   │   ├── page.meta.json
│   │   ├── index.html
│   │   ├── media/
│   │   │   └── featured.jpg
│   │   └── README.md
│   └── another-post/
│       ├── page.meta.json
│       ├── index.html
│       └── media/
└── blog-shared/
    ├── blog-catalog.css         # Blog styling
    └── blog-functions.js        # Blog logic (filtering, rendering)
```

---

## Managing Categories & Tags

### Categories

Categories are defined in `blog-catalog.json`. To add a new category:

**Edit** `blog/data/blog-catalog.json`:

```json
"categories": [
  {
    "slug": "new-category",
    "title": "New Category Title",
    "description": "Category description",
    "accent": "#color-code",
    "icon": "😊"
  },
  ...
]
```

Then use this category slug in post's `page.meta.json`:
```json
{
  "category": "new-category",
  ...
}
```

### Tags

Tags are defined in `blog-catalog.json`. To add new tags:

**Edit** `blog/data/blog-catalog.json`:

```json
"tags": [
  "existing-tags...",
  "new-tag-name",
  ...
]
```

Then use these tags in post's `page.meta.json`:
```json
{
  "tags": ["new-tag-name", "existing-tag"],
  ...
}
```

---

## Post Status

- **published**: Shows on blog home, sidebar, and filtered results
- **draft**: Hidden from blog home (useful for work in progress)
- **archived**: Hidden but kept in history

To hide a post, change status:
```json
{
  "status": "draft"
}
```

Then run `python blog/scan_blog.py` again.

---

## Featured Post

Only **one** post should have `"is_featured": true`. This post will display in the hero section at the top of the blog home.

To change featured post:

1. Open old featured post's `page.meta.json` → change `"is_featured": false`
2. Open new featured post's `page.meta.json` → change `"is_featured": true`
3. Run `python blog/scan_blog.py`

---

## Creating Post Detail Pages

Each post folder has an `index.html` which serves as the post detail page.

**When you run `python blog/scan_blog.py`**, it automatically generates:
- `route`: `/blog/<post-slug>/` - direct URL for the post

Users can click "Read More" on the blog home to navigate to the detail page.

### Post Detail Page Structure

The template includes:
- Header with metadata (date, read time, author)
- Featured image
- Main content area (edit freely)
- Footer with back link to blog

---

## Workflow for Content Updates

### Adding a Post

1. Copy `blog/posts/_template/` → `blog/posts/your-slug/`
2. Edit `page.meta.json` (metadata only)
3. Edit `index.html` (content)
4. Add images to `media/`
5. Run `python blog/scan_blog.py`
6. Done! Post appears on blog home

### Editing a Post

1. Edit `page.meta.json` if needed (title, tags, excerpt, etc.)
2. Edit `index.html` if needed (content, images)
3. Run `python blog/scan_blog.py`
4. Changes appear automatically

### Deleting a Post

1. Delete the entire post folder
2. Run `python blog/scan_blog.py`
3. Post disappears from blog home

### Archiving a Post

1. Edit post's `page.meta.json`
2. Change `"status": "published"` → `"status": "archived"`
3. Run `python blog/scan_blog.py`
4. Post hidden but folder kept for historical reference

---

## Blog Catalog (Auto-Generated)

**Do NOT manually edit** `blog/data/blog-catalog.json` - it's auto-generated by the scanner.

The scanner reads:
- All `blog/posts/*/page.meta.json` files
- Combines them with categories and tags
- Generates `blog-catalog.json`

This catalog is used by `blog/index.html` to render posts, categories, tags, and recent posts.

---

## Scanner Script

### Run the Scanner

```bash
# From project root
python blog/scan_blog.py
```

### What It Does

1. Checks all folders in `blog/posts/`
2. Reads each folder's `page.meta.json`
3. Validates required fields
4. Checks category exists
5. Generates `blog-catalog.json`
6. Outputs status for each post

### Scanner Output Example

```
🔍 Starting blog catalog scan...

✓ Scanned: my-first-post (My First Post Title)
✓ Scanned: another-post (Another Post)

✓ Generated blog-catalog.json with 2 posts
  Categories: 4
  Tags: 20
```

---

## Field Reference

### page.meta.json Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| slug | string | ✓ | URL-safe (lowercase, hyphens only) |
| title | string | ✓ | Full post title |
| short_title | string | ✓ | Short version for sidebar |
| category | string | ✓ | Must match a category slug |
| excerpt | string | ✓ | 150-300 character summary |
| tags | array | ✓ | Use existing tags from blog-catalog.json |
| author | string | ✓ | Post author name |
| publish_date | string | ✓ | Format: YYYY-MM-DD |
| updated_date | string | ✓ | Format: YYYY-MM-DD |
| featured_image | string | ✓ | Path relative to post folder (./media/...) |
| read_time | number | ✓ | Estimated reading time in minutes |
| is_featured | boolean | ✓ | Only one should be true |
| status | string | ✓ | published, draft, or archived |

---

## Tips & Best Practices

✅ **DO:**
- Keep slugs short and descriptive (e.g., `design-thinking-101` not `my-awesome-article-about-design`)
- Use meaningful image filenames (e.g., `hero.jpg` not `image1.jpg`)
- Run scanner after every major change
- Use semantic HTML and headings in content (h2, h3, p)
- Add alt text to all images for accessibility

❌ **DON'T:**
- Edit `blog-catalog.json` manually
- Use uppercase or spaces in slug
- Put images anywhere except `media/` folder
- Delete `_template` folder
- Use categories/tags that don't exist (scanner will warn)

---

## Troubleshooting

### Posts not showing after running scanner?

- Check `page.meta.json` has all required fields
- Verify category slug matches a category in `blog-catalog.json`
- Look at scanner output for error messages
- Open browser console (F12) for JavaScript errors

### Featured post not showing in hero?

- Only one post should have `"is_featured": true`
- If multiple posts have `is_featured: true`, first one wins
- Run scanner to regenerate catalog

### Images not loading?

- Check image path in `page.meta.json`: should be `./media/filename.jpg`
- Verify image file exists in the `media/` folder
- Check file name for typos (case-sensitive!)

### Sidebar shows wrong categories/tags?

- Categories and tags come from `blog-catalog.json`
- Edit them directly in that file
- Run scanner to regenerate posts list

### Scanner says "category not found"?

- Post's `category` field doesn't match any category slug
- Add the category to `blog-catalog.json` before running scanner
- Or change post's category to match existing one

