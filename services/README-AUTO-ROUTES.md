# Auto Route System

## Anh dùng như này

1. Copy thêm một folder trang con bất kỳ, miễn trong folder đó có `index.html`.
2. Nếu muốn chỉnh tên hiển thị trên menu, tạo thêm file `page.meta.json` cạnh `index.html`.
3. Chạy:

```bash
python scan_routes.py
```

## Hệ thống tự làm

- scan toàn bộ folder con có `index.html`
- tạo lại `data/site-map.json`
- tự sửa lại đường dẫn chuẩn cho `styles.css`, `shared/subpage-components.css`, `shared/subpage-components.js` ở các subpage có header/footer dùng chung
- menu header/footer của trang con sẽ tự đọc từ `data/site-map.json`
- root path cho header/footer tự suy ra từ chính đường dẫn script hiện tại

## page.meta.json mẫu

```json
{
  "title": "Thiết Kế Web",
  "short_title": "Thiết Kế Web",
  "nav_label": "Thiết Kế Web",
  "show_in_nav": false,
  "nav_order": 25,
  "section": "services",
  "template": "service-detail"
}
```

## Gợi ý dùng lâu dài

- Trang cấp 1 như `about`, `services`, `projects`, `downloads`, `workflow` nên để `show_in_nav: true`
- Trang chi tiết bên trong thường nên để `show_in_nav: false`
- Mỗi lần thêm folder mới chỉ cần chạy lại `scan_routes.py`
