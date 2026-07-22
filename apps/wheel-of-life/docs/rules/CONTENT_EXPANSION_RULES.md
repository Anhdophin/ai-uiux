# Content Expansion Rules

> Dùng khi thêm keyword, persona, feeling, life area hoặc AI mode.

## Mandatory
- Không thêm node mới nếu chưa biết nó thuộc parent nào.
- Không thêm persona mới nếu chưa định nghĩa pressure / goals / blind spots.
- Không map node vào wheel nếu không giải thích được bằng evidence.
- Không dùng từ khóa quá rộng nếu chưa có nhánh đi sâu hơn.
- Không sửa `id` cũ để đổi nghĩa; phải tạo id mới và migration note.

## Preferred
- Ưu tiên node có `short_meaning`, `long_meaning`, `reflection_prompts`, `clarifying_prompts`.
- Ưu tiên persona có `priority_life_areas` và `recommended_entry_keywords`.
- Ưu tiên wheel area có `sub_areas` và `evidence_rule_note`.

## Anti-patterns
- node chỉ có label nhưng không có meaning
- persona chỉ là demographic label
- wheel chỉ có score mà không có evidence ids
- AI mode nói rộng nhưng không có boundaries
