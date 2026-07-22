#!/usr/bin/env python3
"""
Blog Catalog Scanner
Scans blog/posts directory and generates blog-catalog.json

Usage: python blog/scan_blog.py
"""

import json
import os
from pathlib import Path
from datetime import datetime

def scan_blog_posts():
    """Scan blog/posts directory and generate catalog"""
    
    script_dir = Path(__file__).parent
    posts_dir = script_dir / "posts"
    
    if not posts_dir.exists():
        print(f"Error: {posts_dir} not found")
        return
    
    # Load existing catalog to preserve categories and tags
    catalog_file = script_dir / "data" / "blog-catalog.json"
    categories = []
    tags = []
    
    if catalog_file.exists():
        with open(catalog_file, 'r', encoding='utf-8') as f:
            existing = json.load(f)
            categories = existing.get('categories', [])
            tags = existing.get('tags', [])
    
    posts = []
    
    # Scan each folder in posts directory (except _template)
    for item in sorted(posts_dir.iterdir()):
        if not item.is_dir() or item.name.startswith('_'):
            continue
        
        meta_file = item / "page.meta.json"
        
        if not meta_file.exists():
            print(f"⚠️  Skipping {item.name}: no page.meta.json found")
            continue
        
        try:
            with open(meta_file, 'r', encoding='utf-8') as f:
                meta = json.load(f)
            
            # Validate required fields
            required_fields = [
                'slug', 'title', 'short_title', 'category', 'excerpt',
                'tags', 'author', 'publish_date', 'featured_image',
                'read_time', 'status'
            ]
            
            missing = [f for f in required_fields if f not in meta]
            if missing:
                print(f"⚠️  {item.name}: missing fields: {', '.join(missing)}")
                continue
            
            # Build post object
            category_slug = meta['category']
            category = next((c for c in categories if c['slug'] == category_slug), None)
            
            if not category:
                print(f"⚠️  {item.name}: category '{category_slug}' not found in categories")
                continue
            
            post = {
                'slug': meta['slug'],
                'title': meta['title'],
                'short_title': meta['short_title'],
                'route': f"/blog/{meta['slug']}/",
                'category_slug': category_slug,
                'category_title': category['title'],
                'excerpt': meta['excerpt'],
                'tags': meta['tags'],
                'author': meta['author'],
                'publish_date': meta['publish_date'],
                'updated_date': meta.get('updated_date', meta['publish_date']),
                'featured_image': meta['featured_image'],
                'read_time': meta['read_time'],
                'is_featured': meta.get('is_featured', False),
                'status': meta['status']
            }
            
            posts.append(post)
            print(f"✓ Scanned: {item.name} ({meta['title']})")
            
        except json.JSONDecodeError as e:
            print(f"✗ {item.name}: invalid JSON in page.meta.json - {e}")
        except Exception as e:
            print(f"✗ {item.name}: error reading metadata - {e}")
    
    # Sort posts by publish_date (newest first)
    posts.sort(key=lambda x: x['publish_date'], reverse=True)
    
    # Build final catalog
    catalog = {
        'generated_at': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        'root_route': '/blog/',
        'categories': categories,
        'tags': tags,
        'posts': posts
    }
    
    # Ensure data directory exists
    data_dir = script_dir / "data"
    data_dir.mkdir(parents=True, exist_ok=True)
    
    # Write catalog
    with open(catalog_file, 'w', encoding='utf-8') as f:
        json.dump(catalog, f, ensure_ascii=False, indent=2)
    
    print(f"\n✓ Generated blog-catalog.json with {len(posts)} posts")
    print(f"  Categories: {len(categories)}")
    print(f"  Tags: {len(tags)}")

def initialize_blog_categories():
    """Initialize blog with default categories if not exists"""
    catalog_file = Path(__file__).parent / "data" / "blog-catalog.json"
    
    if catalog_file.exists():
        return
    
    default_catalog = {
        'generated_at': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        'root_route': '/blog/',
        'categories': [
            {
                'slug': 'design',
                'title': 'Design & UX',
                'description': 'Các bài viết về design, UX/UI, và trải nghiệm người dùng.',
                'accent': '#7cb6de',
                'icon': '🎨'
            },
            {
                'slug': 'technology',
                'title': 'Technology',
                'description': 'Các bài viết về công nghệ, lập trình, và phát triển web.',
                'accent': '#5fa3d0',
                'icon': '⚙️'
            },
            {
                'slug': 'business',
                'title': 'Business',
                'description': 'Các bài viết về kinh doanh, khởi nghiệp, và chiến lược.',
                'accent': '#4a8fb5',
                'icon': '💼'
            },
            {
                'slug': 'lifestyle',
                'title': 'Lifestyle',
                'description': 'Các bài viết về cuộc sống, suy ngẫm, và trải nghiệm cá nhân.',
                'accent': '#9d7a4f',
                'icon': '✨'
            }
        ],
        'tags': [
            'design thinking', 'ux/ui', 'web design', 'mobile', 'accessibility',
            'javascript', 'python', 'web development', 'frontend', 'backend',
            'startup', 'marketing', 'strategy', 'productivity', 'mindset',
            'travel', 'reflection', 'culture', 'learning', 'creativity'
        ],
        'posts': []
    }
    
    catalog_file.parent.mkdir(parents=True, exist_ok=True)
    
    with open(catalog_file, 'w', encoding='utf-8') as f:
        json.dump(default_catalog, f, ensure_ascii=False, indent=2)
    
    print("✓ Initialized blog with default categories and tags")

if __name__ == '__main__':
    print("🔍 Starting blog catalog scan...\n")
    initialize_blog_categories()
    scan_blog_posts()
    print("\n✓ Done!")
