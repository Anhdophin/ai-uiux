# APPS SCAN WORKFLOW

## Mục đích
- Quét folder `apps/`
- Tự tạo JSON để trang `apps/index.html` đọc
- Đồng thời mirror dữ liệu ra root `data/` để trang chủ iAppLab có thể lấy app feed

## Chạy cập nhật
```bash
python apps/scan_apps.py
```

## App nào được tính là hợp lệ
Scanner sẽ ưu tiên tìm entry theo thứ tự:
1. `index.html`
2. `web/index.html`
3. `frontend/index.html`
4. `app/index.html`

## Nếu muốn chỉnh tay cho 1 app
Tạo file:
```txt
apps/<app-slug>/app.meta.json
```

Ví dụ:
```json
{
  "title": "Tên app hiển thị",
  "summary": "Mô tả ngắn của app",
  "category": "Prototype",
  "tags": ["ui", "camera"],
  "order": 2,
  "cover": "/apps/<app-slug>/media/cover.jpg"
}
```

## Rule ảnh cover
Scanner ưu tiên:
- `media/cover.*`
- `media/main.*`
- `assets/cover.*`
- `assets/main.*`
- `assets/favicon.*`
- fallback sang ảnh đầu tiên phù hợp trong `assets/` hoặc `media/`

## Shared header/footer
- app page nên có:
  - `#site-header`
  - `#site-footer`
  - `<script type="module" src="../../js/modules.js"></script>` hoặc path tương ứng
- nếu app chưa có, scanner vẫn scan nhưng sẽ warning

## File đầu ra
- `apps/data/apps-catalog.json`
- `apps/data/apps-home-feed.json`
- `data/apps-portal.json` nếu root `data/` có tồn tại
- `data/apps-home-feed.json` nếu root `data/` có tồn tại
