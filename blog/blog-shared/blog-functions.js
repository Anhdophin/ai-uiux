/**
 * Blog Catalog Functions
 * Handles category/tag filtering and sidebar interactions
 */

let blogCatalog = null;
let selectedCategory = null;
let selectedTags = new Set();

/**
 * Initialize blog catalog
 */
async function initBlogCatalog() {
  try {
    const response = await fetch('./data/blog-catalog.json', {
      cache: 'no-store'
    });
    blogCatalog = await response.json();
    
    renderBlogHome();
    renderSidebar();
    attachEventListeners();
  } catch (error) {
    console.error('Error loading blog catalog:', error);
  }
}

/**
 * Render blog home with hero and post list
 */
function renderBlogHome() {
  const container = document.getElementById('blogPostsContainer');
  if (!container) return;

  // Get featured posts
  const featuredPost = blogCatalog.posts.find(p => p.is_featured);
  
  let html = '';

  // Render hero with featured post if available
  if (featuredPost) {
    html += `
      <article class="blog-card blog-hero-card">
        <div class="blog-hero-inner">
          <div class="blog-hero-copy">
            <div>
              <p class="blog-hero-kicker">Featured Story</p>
              <h1 class="blog-hero-title">${featuredPost.title}</h1>
              <div class="blog-hero-meta">
                <span>📅 ${formatDate(featuredPost.publish_date)}</span>
                <span>⏱️ ${featuredPost.read_time} min read</span>
              </div>
              <div class="blog-hero-actions">
                <a class="blog-btn dark" href="#posts-list">View all posts</a>
              </div>
            </div>
          </div>
          <div class="blog-hero-visual">
            <span class="blog-hero-orb" aria-hidden="true"></span>
            <img src="${featuredPost.featured_image}" alt="${featuredPost.title}" />
          </div>
        </div>
      </article>
    `;
  }

  // Render post list
  html += `<div id="posts-list">`;
  
  const postsToShow = filterPosts();
  
  if (postsToShow.length === 0) {
    html += `
      <article class="blog-card pad" style="text-align: center; padding: 40px 22px;">
        <p style="color: var(--blog-muted); font-size: 14px;">No posts found matching your filters.</p>
      </article>
    `;
  } else {
    postsToShow.forEach(post => {
      const category = blogCatalog.categories.find(c => c.slug === post.category_slug);
      html += `
        <article class="blog-card blog-post-card">
          <div class="blog-post-header">
            <span class="blog-post-category">${category?.title || 'Uncategorized'}</span>
            <span class="blog-post-date">${formatDate(post.publish_date)}</span>
          </div>
          
          <h2 class="blog-post-title">${post.title}</h2>
          <p class="blog-post-excerpt">${post.excerpt}</p>
          
          <div class="blog-post-footer">
            <div class="blog-post-meta">
              <span>${post.author}</span>
              <span>${post.read_time} min read</span>
            </div>
            <a href="${post.route}" class="blog-post-read-more">
              Read More →
            </a>
          </div>
        </article>
      `;
    });
  }

  html += `</div>`;
  container.innerHTML = html;
}

/**
 * Filter posts based on selected category and tags
 */
function filterPosts() {
  return blogCatalog.posts.filter(post => {
    // Category filter
    if (selectedCategory && post.category_slug !== selectedCategory) {
      return false;
    }

    // Tag filter - include post if it has any of the selected tags
    if (selectedTags.size > 0) {
      const hasMatchingTag = Array.from(selectedTags).some(tag =>
        post.tags.includes(tag)
      );
      if (!hasMatchingTag) return false;
    }

    return true;
  });
}

/**
 * Render sidebar with categories, tags, and recent posts
 */
function renderSidebar() {
  const sidebar = document.getElementById('blogSidebar');
  if (!sidebar) return;

  let html = '';

  // Categories section
  html += `
    <div class="blog-card">
      <div class="blog-sidebar-section">
        <h3 class="blog-sidebar-title">Categories</h3>
        <div class="blog-categories-list">
  `;

  blogCatalog.categories.forEach(category => {
    const count = blogCatalog.posts.filter(p => p.category_slug === category.slug).length;
    const isActive = selectedCategory === category.slug;
    
    html += `
      <div class="blog-category-item ${isActive ? 'is-active' : ''}" 
           data-category="${category.slug}">
        <span>${category.icon} ${category.title}</span>
        <span class="blog-category-count">${count}</span>
      </div>
    `;
  });

  html += `
        </div>
        <button style="
          width: 100%;
          margin-top: 12px;
          padding: 10px;
          border: 1px solid var(--blog-line);
          background: #fff;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s ease;
        " 
        onclick="clearFilters()"
        id="clearCategoryBtn">
          View All
        </button>
      </div>
    </div>
  `;

  // Tags section
  html += `
    <div class="blog-card">
      <div class="blog-sidebar-section">
        <h3 class="blog-sidebar-title">Tags</h3>
        <div class="blog-tags-list">
  `;

  blogCatalog.tags.forEach(tag => {
    const isActive = selectedTags.has(tag);
    html += `
      <button class="blog-tag ${isActive ? 'is-active' : ''}" 
              data-tag="${tag}"
              onclick="toggleTag('${tag}')">
        ${tag}
      </button>
    `;
  });

  html += `
        </div>
      </div>
    </div>
  `;

  // Recent posts section
  const recentPosts = blogCatalog.posts.slice(0, 3);
  html += `
    <div class="blog-card">
      <div class="blog-sidebar-section">
        <h3 class="blog-sidebar-title">Recent Posts</h3>
        <div class="blog-recent-posts">
  `;

  recentPosts.forEach(post => {
    html += `
      <a href="${post.route}" style="text-decoration: none; color: inherit;">
        <div class="blog-recent-item">
          <strong>${post.short_title}</strong>
          <small>${formatDate(post.publish_date)}</small>
        </div>
      </a>
    `;
  });

  html += `
        </div>
      </div>
    </div>
  `;

  sidebar.innerHTML = html;
  updateCategoryButtons();
}

/**
 * Update category buttons styling
 */
function updateCategoryButtons() {
  document.querySelectorAll('.blog-category-item').forEach(btn => {
    btn.classList.remove('is-active');
    if (btn.dataset.category === selectedCategory) {
      btn.classList.add('is-active');
    }
  });
}

/**
 * Toggle tag filter
 */
function toggleTag(tag) {
  if (selectedTags.has(tag)) {
    selectedTags.delete(tag);
  } else {
    selectedTags.add(tag);
  }
  renderBlogHome();
  renderSidebar();
}

/**
 * Clear all filters
 */
function clearFilters() {
  selectedCategory = null;
  selectedTags.clear();
  renderBlogHome();
  renderSidebar();
}

/**
 * Attach event listeners to category buttons
 */
function attachEventListeners() {
  document.addEventListener('click', function(e) {
    if (e.target.closest('.blog-category-item')) {
      const category = e.target.closest('.blog-category-item').dataset.category;
      selectedCategory = selectedCategory === category ? null : category;
      selectedTags.clear(); // Clear tags when changing category
      renderBlogHome();
      renderSidebar();
    }
  });
}

/**
 * Format date to readable format
 */
function formatDate(dateStr) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString('vi-VN', options);
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initBlogCatalog);
