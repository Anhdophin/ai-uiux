# AI Edit Precheck

Trước khi sửa code, kiểm tra theo thứ tự:
1. File nào đang điều khiển phần này?
2. Data đang lấy từ đâu?
3. Link/href/slug/path có đang trỏ đúng route mới không?
4. Page này đang thuộc portal root, services, apps, hay shop?
5. Header/footer có đang dùng partial chung không?
6. Nếu sửa clone nhóm/sản phẩm, kiểm tra slug cũ còn sót ở HTML, JS, JSON, route, media.
7. Nếu task có viết/chỉnh nội dung, đọc `CONTENT-CORE-RULES.md` và check:
	- Nội dung có đi từ vấn đề thực tế đến takeaway chưa?
	- Có tránh giọng generic portfolio/agency và over-sell chưa?
	- Page có trả lời ít nhất 1 hidden question (why exist / what problem / what learned / what next) chưa?
	- Tiêu đề/nhãn hiển thị có đang lộ ngôn ngữ nội bộ (module/field/CMS) không?
	- Có đang viết theo mẫu [label] + [value] thay vì thông điệp đối thoại không?
