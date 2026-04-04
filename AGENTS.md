# iAppLab Project Rules

Luôn đọc `AI-EDIT-PRECHECK.md` trước khi sửa.

Kiến trúc hiện tại:
- `/` = portal iAppLab
- `/services/` = dịch vụ cá nhân của Anhdophin (legacy bundle đã đổi tên)
- `/shop/` = shop public của portal
- `/apps/` = bộ sưu tập apps
- `/services/about/` = trang about chính

Quy tắc quan trọng:
- Không hardcode slug/path cũ khi clone nhóm hoặc sản phẩm.
- Header/footer dùng `partials/header.html` và `partials/footer.html` xuyên suốt.
- Page con dùng `shared/subpage-components.js` hoặc `services/shared/subpage-components.js` để inject shell chung.
- Nếu sửa shop, kiểm tra: `page.meta.json` -> `shop/data/shop-catalog.json` -> `route/href` -> `media/`.
