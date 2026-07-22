# iAppLab Project Rules

Luôn đọc `AI-EDIT-PRECHECK.md` trước khi sửa.
Nếu task có viết/chỉnh nội dung, đọc thêm `CONTENT-CORE-RULES.md` trước khi viết copy.

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

Quy tắc nội dung (bắt buộc khi viết copy):
- Website là "living workshop", không phải portfolio kiểu showcase.
- Viết theo giọng creator thực tế: calm, thoughtful, practical; không corporate buzzwords.
- Tránh overclaim và các từ: "best", "professional", "leading", "innovative".
- Mỗi section nên đi theo flow: vấn đề thật -> vì sao có vấn đề -> góc nhìn khác -> cách xử lý -> takeaway.
- Mỗi page phải trả lời ít nhất 1 hidden question: why exist / why this design / what problem solved / what learned / what next experiment.
- Phân biệt ngôn ngữ nội bộ và ngôn ngữ hiển thị: không đưa tên module/field/schema/CMS/component ra giao diện người dùng.
- Không dùng tiêu đề kiểu nhãn phân loại (focus, expertise, process, capabilities...) làm heading hiển thị mặc định.
