# Human AI Agent — Static Supabase Reader

Bộ static web này dựng theo bố cục gần giống ảnh mẫu anh gửi:
- hero lớn bên trái + text mạnh bên phải
- services cards
- about section
- portfolio/process cards
- testimonial
- contact CTA
- downloads + request form
- footer sáng màu teal

## Chạy localhost

Cách nhanh nhất:

### Python
```bash
python -m http.server 8080
```
Sau đó mở:
```bash
http://localhost:8080
```

## Cách đọc dữ liệu

Web có 2 mode:

1. **Fallback local**
   - Không cần Supabase
   - Dùng dữ liệu mẫu trong `script.js`

2. **Supabase Reader**
   - Điền `url` và `anonKey` vào `supabase-config.js`
   - Chạy SQL trong `supabase/schema.sql`
   - Import seed data từ `data/content-seed.json` hoặc copy từng bảng

## Bảng Supabase dùng
- `site_profile`
- `site_nav`
- `site_socials`
- `site_services`
- `site_projects`
- `site_testimonials`
- `site_downloads`

## Lưu ý
- Đây là **reader frontend**. Form request hiện là demo localStorage.
- Nếu muốn ghi request về Supabase, em có thể làm thêm bản writer sau.
