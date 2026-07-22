# Wheel Ontology Spec

> Purpose: khóa taxonomy của wheel of life để mapping có cấu trúc, không thành hình minh họa rỗng.

## 1. Wheel ontology gồm gì
- life areas
- sub-areas
- evidence categories
- confidence levels
- traceability rules

## 2. Life area taxonomy v1
- `career`
- `finance`
- `capability`
- `inner_system`
- `environment`
- `health`
- `direction`
- `life_system`

## 3. Sub-area principle
Mỗi life area nên có danh sách sub-area gợi ý, dù UI v1 chưa cần hiển thị hết.

## 4. Evidence ontology
- `keyword_evidence`
- `reflection_evidence`
- `persona_adjustment`
- `session_frequency_signal`

## 5. Confidence ontology
- `low`
- `medium`
- `high`

## 6. Traceability rule
Mọi area score phải truy ngược được về ít nhất một source evidence cụ thể.

## 7. Rule mở rộng
- thêm area mới: major change
- thêm sub-area: minor change nếu không phá mapping cũ
- đổi nghĩa area: cần migration note và audit pass
