# Keyword Node Spec

> Purpose: khóa chuẩn ngữ nghĩa cho từng node trước khi mở rộng dữ liệu.  
> This file is normative. Khi seed data và code conflict với file này, file này thắng.

## 1. Vai trò của keyword node
Keyword node là đơn vị nghĩa nhỏ nhất mà app dùng để:
- cho user tự nhận diện bản thân
- mở tiếp nhánh ngữ cảnh
- liên kết sang wheel of life
- cung cấp evidence cho AI phản chiếu
- phục vụ audit về coverage, trùng nghĩa, và đứt mạch

Keyword node không phải chỉ là một label để hiển thị.
Nó là một entity có nghĩa, có quan hệ, có trọng số, và có khả năng truy vết.

## 2. Nguyên tắc thiết kế
1. Label phải dễ nhận diện với người dùng phổ thông.
2. Một node chỉ nên đại diện cho một ý chính.
3. Node không được quá rộng đến mức nuốt nhiều nghĩa khác nhau.
4. Node không được quá hẹp đến mức khó dùng ngoài một case rất hiếm.
5. Node phải hỗ trợ được cả user flow lẫn AI traceability.
6. Mọi node phải có đường đi ngược về context ban đầu.

## 3. Cấp độ node
- `depth = 0`: feeling / entry state
- `depth = 1`: problem cluster
- `depth = 2`: sub-issue / situation pattern
- `depth = 3`: root-cause hypothesis / structural blocker
- `depth >= 4`: reserved, chỉ mở khi hệ audit và UI đã đủ mạnh

## 4. Bắt buộc phải có ở mỗi node
```json
{
  "id": "string_stable_slug",
  "label": "string_user_facing",
  "short_meaning": "one-line plain meaning",
  "long_meaning": "expanded meaning for AI and docs",
  "depth": 0,
  "kind": "feeling|problem|sub_issue|root_cause",
  "parent_ids": [],
  "child_ids": [],
  "related_node_ids": [],
  "life_area_weights": {"career": 0.4},
  "persona_tags": ["all"],
  "reflection_prompts": ["..."],
  "clarifying_prompts": ["..."],
  "ai_hints": ["..."],
  "ambiguity_note": "string",
  "audit_tags": ["core"],
  "status": "active",
  "version": "1.0.0"
}
```

## 5. Ý nghĩa của từng field
### `id`
- ổn định lâu dài
- không phụ thuộc label hiển thị
- không đổi trừ khi có migration plan

### `label`
- gần với cách user tự gọi vấn đề
- không dùng jargon
- không mang tính phán xét

### `short_meaning`
- giải thích cực ngắn cho UI, tooltips, preview card

### `long_meaning`
- giải thích chuẩn ngữ nghĩa để AI và audit hiểu đúng node

### `kind`
- khóa loại node để flow engine biết mở tiếp thế nào

### `parent_ids` / `child_ids`
- tạo quan hệ khám phá chính
- phải có reverse link đúng

### `related_node_ids`
- dùng cho liên kết chéo giữa các vấn đề gần nhau
- không thay thế parent-child

### `life_area_weights`
- là bằng chứng mapping, không phải score cuối cùng
- tổng weight không bắt buộc bằng 1 nhưng nên có logic rõ

### `persona_tags`
- không khóa cứng đối tượng được dùng
- chỉ là tín hiệu ưu tiên hiển thị / gợi ý

### `reflection_prompts`
- câu hỏi để user tự nghĩ
- không mang tính phán quyết

### `clarifying_prompts`
- câu hỏi để phân biệt các hướng nghĩa gần nhau

### `ai_hints`
- metadata cho AI, không show trực tiếp mặc định

### `ambiguity_note`
- dùng để cảnh báo khi node có nguy cơ bị hiểu sai

### `audit_tags`
- giúp audit coverage, strategic nodes, experimental nodes

## 6. Những field nên có thêm khi hệ lớn hơn
- `contraindicated_with`
- `evidence_examples`
- `session_entry_priority`
- `default_followup_modes`
- `merge_candidates`
- `deprecation_note`

## 7. Quy tắc đặt label
Đúng:
- "Không thấy tương lai"
- "Sợ apply job mới"
- "Thiếu vùng đệm tài chính"

Không đúng:
- "Khủng hoảng hiện sinh hậu hiện đại"
- "Mất phương hướng trong mô hình xã hội tăng tốc"
- "Tôi là người thất bại"

## 8. Quy tắc liên kết
- Mỗi node non-root phải có ít nhất 1 parent.
- Mỗi root phải có ít nhất 2 child để đủ ý nghĩa khám phá.
- Related link nên có 1 phần reverse lookup, nhưng không bắt buộc tuyệt đối nếu có lý do rõ.
- Node depth 3 không nên có child nếu chưa có UI đủ tốt để mở tiếp.

## 9. Quy tắc audit tối thiểu
Node bị coi là chưa đạt nếu:
- không có long_meaning
- không có life_area_weights
- không có reflection_prompts
- không có parent trong khi depth > 0
- trùng nghĩa mạnh với node khác mà chưa có merge note

## 10. Quy tắc versioning
- thay label nhỏ: patch
- thêm field non-breaking: minor
- đổi nghĩa / đổi relation / đổi mapping trọng yếu: major hoặc migration note
