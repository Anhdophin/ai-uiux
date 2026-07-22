# Blog Post Template

## How to Use This Template

1. **Copy this folder** and rename it to your post slug (e.g., `my-first-post`)
2. **Edit `page.meta.json`**:
   - `slug`: URL-friendly identifier (lowercase, hyphens only)
   - `title`: Full post title
   - `category`: Choose from defined categories in blog-catalog.json
   - `tags`: Use existing tags or add new ones to blog-catalog.json
   - `excerpt`: 150-300 character summary
   - `publish_date`: Date in YYYY-MM-DD format
   - `read_time`: Estimated reading time in minutes
   - `is_featured`: Set to `true` to show in hero (only one should be true)

3. **Edit `index.html`**:
   - Update the `<title>` tag with your post title
   - Replace "Post Title Goes Here" in the `<h1>` tag
   - Update metadata (date, read time, author)
   - Replace the featured image path in `<img>` src
   - Write your post content in the `.blog-post-detail-content` div

4. **Add media**:
   - Place images in the `media/` folder
   - Reference them as `./media/image-name.jpg`

5. **Run the scanner**:
   - After creating your post folder, run: `python blog/scan_blog.py`
   - This will update `blog-catalog.json` automatically

## File Structure

```
blog/posts/my-first-post/
├── page.meta.json          # Post metadata
├── index.html              # Post content
├── media/
│   └── featured.jpg        # Featured image and other images
└── README.md              # Optional: Post notes
```

## Post Meta Fields

| Field | Type | Required | Example |
|-------|------|----------|---------|
| slug | string | ✓ | `my-first-post` |
| title | string | ✓ | `My First Post` |
| short_title | string | ✓ | `First Post` |
| category | string | ✓ | `design` |
| excerpt | string | ✓ | `Brief summary...` |
| tags | array | ✓ | `["design", "ux"]` |
| author | string | ✓ | `Anhdophin` |
| publish_date | string | ✓ | `2026-04-07` |
| updated_date | string | ✓ | `2026-04-07` |
| featured_image | string | ✓ | `./media/featured.jpg` |
| read_time | number | ✓ | `8` |
| is_featured | boolean | ✓ | `false` |
| status | string | ✓ | `published` |

## Tips

- Keep excerpt under 300 characters for better display
- Use realistic read time (typically 200 words = 1 minute)
- Add alt text to all images for accessibility
- Use semantic headings (h2, h3) for content structure
- Link back to blog home in footer for navigation
