## Rule first
- Trước khi sửa code, đọc `../AGENTS.md`, `../.cursorrules`, `../AI-EDIT-PRECHECK.md`.
- Nếu dùng Cursor, giữ `.cursor/rules/` trong project để AI luôn nạp rule trước khi sửa.

# Clone checklist cho shop

## Clone 1 sản phẩm mới
1. Copy 1 folder sản phẩm mẫu vào đúng nhóm.
2. Đổi tên folder sản phẩm mới theo slug mong muốn.
3. Sửa `page.meta.json` trong folder sản phẩm mới:
   - title
   - short_title
   - nav_label
   - summary
   - price
   - badge
   - experience_tags
   - is_new
   - updated_at
4. Bỏ ảnh vào `media/`:
   - `main.*` = ảnh cover
   - các ảnh còn lại = gallery
5. Chạy `python shop/scan_shop.py`

## Clone 1 nhóm mới
1. Copy 1 folder nhóm mẫu.
2. Đổi tên folder nhóm mới theo slug mong muốn.
3. Sửa `shop/<group>/page.meta.json` của nhóm mới.
4. Sửa `page.meta.json` của từng sản phẩm bên trong.
5. Thêm ảnh nhóm tại `shop/media/<slug-nhom>.*` nếu muốn card nhóm có ảnh riêng.
6. Chạy `python shop/scan_shop.py`

## Quan trọng
- Không sửa tay `shop/data/shop-catalog.json`.
- Nếu clone nhóm mà vẫn thấy nhóm cũ, hãy kiểm tra HTML/JS của nhóm mới có còn text/slug cũ không.
- Với bản mới này, category slug của sản phẩm được scanner lấy theo folder cha để giảm lỗi copy sót.
