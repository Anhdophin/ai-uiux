# 📝 Blog - QUICK START Guide

## ⚡ Add a New Post in 5 Steps

### Step 1: Copy Template Folder
```bash
# Navigate to project folder and run:
cp -r blog/posts/_template blog/posts/my-post-slug
```

**Name the folder using:**
- Lowercase letters
- Hyphens instead of spaces
- Example: `design-thinking-101` or `web-performance-tips`

### Step 2: Edit Post Metadata

Open: `blog/posts/my-post-slug/page.meta.json`

Change these fields:
```json
{
  "slug": "my-post-slug",
  "title": "My Post Title Here",
  "short_title": "Short Title",
  "category": "design",
  "excerpt": "Brief 150-300 character summary of post",
  "tags": ["design thinking", "ux/ui"],
  "publish_date": "2026-04-07",
  "read_time": 8,
  "is_featured": false,
  "status": "published"
}
```

**Required fields:**
- `slug`: Must match folder name
- `category`: Must exist in categories list (see categories below)
- `tags`: Must exist in tags list (see tags below)
- `publish_date`: Format YYYY-MM-DD

### Step 3: Edit Post Content

Open: `blog/posts/my-post-slug/index.html`

Replace these parts:
```html
<!-- In <title> tag -->
<title>My Post Title - Blog Anhdophin</title>

<!-- In post header -->
<h1 class="blog-post-detail-title">My Post Title Here</h1>
<p class="blog-post-detail-excerpt">My post excerpt here</p>

<!-- Update metadata -->
<span>📅 April 7, 2026</span>
<span>⏱️ 8 min read</span>

<!-- Update featured image -->
<img src="./media/featured.jpg" alt="Alt text" />

<!-- Write your content -->
<div class="blog-post-detail-content">
  <h2>Your Section Title</h2>
  <p>Your content here...</p>
</div>
```

### Step 4: Add Featured Image

1. Add your image to: `blog/posts/my-post-slug/media/`
2. Update path in `page.meta.json`:
```json
{
  "featured_image": "./media/your-image.jpg"
}
```
3. Update path in `index.html`:
```html
<img src="./media/your-image.jpg" alt="Description" />
```

### Step 5: Scan & Deploy

Run from command line:
```bash
python blog/scan_blog.py
```

**Output:**
```
✓ Scanned: my-post-slug (My Post Title Here)
✓ Generated blog-catalog.json with 1 posts
```

**Done!** Your post now appears on the blog home page.

---

## 📚 Categories (for `category` field)

Available categories in `blog-catalog.json`:

| Slug | Title | Icon |
|------|-------|------|
| `design` | Design & UX | 🎨 |
| `technology` | Technology | ⚙️ |
| `business` | Business | 💼 |
| `lifestyle` | Lifestyle | ✨ |

Use exactly these slugs in `page.meta.json`:
```json
{
  "category": "design"
}
```

### Add New Category

Edit: `blog/data/blog-catalog.json`

Add to `categories` array:
```json
{
  "slug": "new-slug",
  "title": "New Category Name",
  "description": "Description here",
  "accent": "#color-code",
  "icon": "emoji"
}
```

Then run: `python blog/scan_blog.py`

---

## 🏷️ Tags (for `tags` field)

Available tags in `blog-catalog.json`:

```
design thinking, ux/ui, web design, mobile, accessibility,
javascript, python, web development, frontend, backend,
startup, marketing, strategy, productivity, mindset,
travel, reflection, culture, learning, creativity
```

Use these in `page.meta.json`:
```json
{
  "tags": ["design thinking", "ux/ui"]
}
```

### Add New Tag

Edit: `blog/data/blog-catalog.json`

Add to `tags` array:
```json
{
  "tags": [
    "existing-tags...",
    "new-tag-name"
  ]
}
```

Then run: `python blog/scan_blog.py`

---

## ⭐ Featured Post

Only **ONE** post should have `"is_featured": true`.

This post shows in the hero section at top of blog home.

To change featured post:

1. Open old featured post's `page.meta.json` → set `"is_featured": false`
2. Open new featured post's `page.meta.json` → set `"is_featured": true`
3. Run `python blog/scan_blog.py`

---

## 📝 Post Statuses

In `page.meta.json`, use `status` field:

| Status | Behavior |
|--------|----------|
| `published` | Shows on blog (default) |
| `draft` | Hidden from blog (work in progress) |
| `archived` | Hidden but kept in history |

Example:
```json
{
  "status": "published"
}
```

---

## ❌ Remove/Hide a Post

### Hide a post (keep folder):
Edit: `blog/posts/my-post-slug/page.meta.json`
```json
{
  "status": "draft"
}
```
Run: `python blog/scan_blog.py`

### Delete a post (remove folder):
```bash
rm -r blog/posts/my-post-slug
python blog/scan_blog.py
```

---

## 🔍 Scanner Command

After any changes to posts, ALWAYS run:
```bash
python blog/scan_blog.py
```

**What it does:**
- Reads all post folders
- Validates metadata
- Checks categories exist
- Generates `blog-catalog.json`
- Displays status

**Common errors:**
```
⚠️ my-post: missing fields: slug, title
⚠️ my-post: category 'bad-slug' not found
✗ my-post: invalid JSON in page.meta.json
```

Fix these issues and run scanner again.

---

## 📂 File Structure Reference

```
blog/posts/
├── _template/                    ← Copy this folder
│   ├── page.meta.json           ← Edit metadata
│   ├── index.html               ← Edit content
│   ├── media/
│   │   └── featured.jpg         ← Add your image
│   └── README.md                ← Instructions
│
└── my-first-post/               ← Your new post
    ├── page.meta.json
    ├── index.html
    ├── media/
    │   └── featured.jpg
    └── README.md (optional)
```

---

## ✅ Checklist for Publishing

Before running `python blog/scan_blog.py`:

- [ ] Folder name is lowercase with hyphens
- [ ] `slug` in page.meta.json matches folder name
- [ ] `title` is meaningful
- [ ] `category` exists in blog-catalog.json
- [ ] `tags` all exist in blog-catalog.json
- [ ] `excerpt` is 150-300 characters
- [ ] `publish_date` is YYYY-MM-DD format
- [ ] `read_time` is realistic (e.g., 8-12 min)
- [ ] `is_featured` is true only for ONE post
- [ ] `status` is "published"
- [ ] Featured image added to media/
- [ ] Image path updated in page.meta.json
- [ ] Post content written in index.html
- [ ] Images styled with alt text

Once all checked ✓, run:
```bash
python blog/scan_blog.py
```

Done! 🎉

---

## Useful Links

- 📖 Full guide: [README.md](./README.md)
- 🔧 Maintenance: [MAINTENANCE-CHECKLIST.md](./MAINTENANCE-CHECKLIST.md)
- 📁 Template: [posts/_template/](./posts/_template/)
