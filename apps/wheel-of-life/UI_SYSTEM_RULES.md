# UI System Rules

## Design intention
UI phải tạo cảm giác: bình tĩnh, có cấu trúc, mở dần, không quá tải.

## Core principles
- Icon-first, card-first, reveal-progressively.
- Màn hình đầu không được dồn quá nhiều thứ.
- User phải luôn thấy ngữ cảnh hiện tại qua trail.
- Có thể quay lui mà không vỡ flow.

## Visual rules
- Dùng token cho spacing, radius, color, shadow, typography.
- Trạng thái selected / expanded / muted / disabled phải rõ.
- Responsive trước, desktop mở rộng sau.

## Interaction rules
- Một bước chỉ mở số lựa chọn vừa đủ.
- Chọn node phải cập nhật trail và panel chi tiết.
- AI panel là lớp hỗ trợ, không được chiếm toàn bộ trải nghiệm.
- Wheel chỉ hiện khi có đủ evidence.

## Component layers
- Base: button, chip, pill, tag, input, textarea, card, panel.
- Composite: step header, context trail, keyword lane, reflection sheet.
- Domain: keyword explorer, wheel preview board, AI deepen panel, audit cards.

## Naming rules
- CSS class prefix: `ct-`
- JS hook selector: ưu tiên `data-role`, `data-action`, `data-node-id`.
- Tên component phải theo vai trò, không theo màu hoặc vị trí ngẫu hứng.


## Additional UX rules
- Selection-first components are core primitives, not optional helpers.
- Context setup should favor select/chip/card patterns over text fields.
- Reflection textareas must stay secondary and visually lighter than primary choice modules.
