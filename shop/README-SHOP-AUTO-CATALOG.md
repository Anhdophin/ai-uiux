# Shop auto catalog

## Cách thêm sản phẩm mới
1. Copy một folder sản phẩm mới vào đúng nhóm, ví dụ: `tram-huong/san-pham-moi/`.
2. Trong folder sản phẩm cần có `index.html` và `page.meta.json`.
3. Trong `page.meta.json`, nên có ít nhất:
```json
{
  "title": "Tên sản phẩm",
  "price": "Liên hệ",
  "summary": "Mô tả ngắn",
  "experience_tags": ["quà tặng", "thiền"],
  "is_new": true,
  "updated_at": "2026-04-02"
}
```
4. Chạy `python scan_shop.py`
5. File `data/shop-catalog.json` sẽ cập nhật. Homepage, trang all và các category page tự đổi theo.

## File chính
- `index.html`: shop homepage
- `all/index.html`: all categories + all products
- `hand-made/index.html`, `linh-chi/index.html`, `tram-huong/index.html`: category pages
- `shop-shared/catalog.js`: helper render + filter
- `shop-shared/catalog.css`: style dùng chung
- `scan_shop.py`: script scan dữ liệu
