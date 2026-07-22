# Keyword Tree Design

## Mục tiêu
Keyword tree dùng để dẫn người dùng đi từng lớp, không phải chỉ để liệt kê tag.

## Cấu trúc node
- id
- label
- depth
- kind
- parent_ids
- child_ids
- related_node_ids
- life_area_weights
- persona_tags
- clarifying_prompts
- audit_flags

## Nguyên tắc thiết kế
- Node cấp trên là cửa vào, node cấp dưới cụ thể hơn.
- Child nodes nên đủ gần để user tự nhận ra.
- Related nodes mở góc nhìn khác nhưng không phá flow chính.
- Node nào map sang wheel phải có evidence trace.
