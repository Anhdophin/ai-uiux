# Blog Clone & Maintenance Checklist

## After Cloning or Modifying Blog

Before and after making changes to blog structure, verify:

### Core Files Check
- [ ] `blog/index.html` exists and loads correctly
- [ ] `blog/page.meta.json` has correct metadata
- [ ] `blog/data/blog-catalog.json` is valid JSON
- [ ] `blog/blog-shared/blog-catalog.css` exists
- [ ] `blog/blog-shared/blog-functions.js` exists
- [ ] `blog/README.md` is up-to-date

### Navigation Integration
- [ ] `partials/header.html` includes blog link with `data-nav-link="blog"`
- [ ] `shared/subpage-components.js` includes `blog: ${prefix}blog/` in buildRoutes()
- [ ] `services/shared/subpage-components.js` includes blog route
- [ ] `data/portal.json` includes `"blog_route": "blog/"`
- [ ] `blog/page.meta.json` has correct nav_order value

### Data Structure Check
- [ ] All posts in `blog-catalog.json` have valid category_slug matching a category
- [ ] All posts use tags that exist in the tags array
- [ ] No duplicate post slugs
- [ ] All featured images referenced in posts exist or have valid paths
- [ ] At least one post has `is_featured: true`

### Browser Testing
- [ ] Blog home page loads without console errors
- [ ] Featured post displays in hero section
- [ ] Post list shows all published posts
- [ ] Category filtering works
- [ ] Tag filtering works (can select multiple)
- [ ] Recent posts sidebar updates when filters change
- [ ] Navigation links work from blog to other sections
- [ ] Responsive layout works on mobile (blog-grid converts to single column)

### Adding New Content
When adding new posts:
- [ ] Post slug is URL-safe (lowercase, hyphens only)
- [ ] Post route matches slug pattern `/blog/slug/`
- [ ] Category slug matches existing category
- [ ] All tags exist in tags array
- [ ] featured_image path is correct (e.g., `/blog/media/image.jpg`)
- [ ] publish_date is in format YYYY-MM-DD
- [ ] read_time is realistic estimate
- [ ] excerpt is concise (150-300 chars recommended)

### Adding New Categories
- [ ] Category slug is URL-safe
- [ ] Category has unique title and description
- [ ] Category has assigned accent color (hex code)
- [ ] Category has emoji icon assigned
- [ ] At least 1 post maps to new category's slug

### Adding New Tags
- [ ] Tag is lowercase, space-separated if multi-word
- [ ] Tag is used by at least 1 post
- [ ] No duplicate tags in array

### Post Detail Pages (Future)
When creating individual post pages:
- [ ] Create folder: `blog/<post-slug>/index.html`
- [ ] Include proper header/footer structure
- [ ] Link from post list item to detail page using route from JSON
- [ ] Use same style variables and imported CSS files
- [ ] Include back-navigation to blog home

### File Size & Performance
- [ ] `blog-catalog.json` stays under 500KB (current: ~5KB)
- [ ] `blog-functions.js` is not duplicated across pages
- [ ] CSS is consolidated in one file (blog-catalog.css)

### Version Control
- [ ] Changes to `blog-catalog.json` are committed
- [ ] New media files are added to `.gitignore` or committed appropriately
- [ ] File paths use forward slashes (/) for cross-platform compatibility

## Common Issues & Solutions

### Posts not showing
1. Check console for JSON parsing errors
2. Verify all category_slug values match categories array
3. Check that posts have `status: "published"`

### Filters not working
1. Verify blog-functions.js is loaded
2. Check browser console for JavaScript errors
3. Ensure tags exist in tags array

### Sidebar not rendering
1. Verify `#blogSidebar` div exists in HTML
2. Check CSS is loaded (blog-catalog.css)
3. Look for JavaScript errors in console

### Navigation not working
1. Verify header partial is loaded (check #subpage-header)
2. Check that buildRoutes includes blog
3. Verify nav_order in blog/page.meta.json

### Images not loading
1. Verify image path starts with `/blog/media/`
2. Check media folder structure exists
3. Verify image file extensions are correct
