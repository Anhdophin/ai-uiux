# Keyword Ontology Spec

> Purpose: khóa taxonomy và logic phân loại cho keyword graph để sau này mở rộng mà không vỡ nghĩa.

## 1. Ontology này dùng để làm gì
- chuẩn hóa `depth`, `kind`, `status`, `audit_tags`
- giữ cho node mới được thêm vào đúng hệ phân loại
- cho audit engine biết một node đang thuộc lớp nghĩa nào
- hỗ trợ AI prompt builder gọi đúng loại node

## 2. Keyword ontology không làm gì
- không thay thế keyword graph
- không tự sinh flow
- không quyết định tuyệt đối user phải đi theo nhánh nào

## 3. Taxonomy v1
### Depth taxonomy
- `0`: feeling / entry
- `1`: problem cluster
- `2`: sub-issue / situation pattern
- `3`: root-cause hypothesis

### Kind taxonomy
- `feeling`
- `problem`
- `sub_issue`
- `root_cause`

### Status taxonomy
- `active`
- `draft`
- `deprecated`
- `experimental`

### Core audit tags
- `core`
- `entry`
- `bridge`
- `structural`
- `persona_sensitive`
- `low_confidence`

## 4. Relation ontology
- `parent_child`: quan hệ mở nhánh chính
- `related`: quan hệ gợi ý chéo
- `evidence_to_wheel`: quan hệ mapping sang life area
- `persona_priority`: quan hệ ưu tiên hiển thị theo persona

## 5. Rule khóa nghĩa
1. `depth` và `kind` phải phù hợp nhau.
2. Node `depth=0` gần như luôn là `feeling`.
3. Node `root_cause` không nên là default entry.
4. Node `deprecated` phải có migration note trong seed expansion plan.
5. `audit_tags` không được thay thế `status`.

## 6. Rule mở rộng
- thêm kind mới chỉ khi docs, schema, audit, UI đều đã hỗ trợ
- thêm depth mới chỉ khi flow engine, breadcrumb, và AI contract đã được cập nhật
- node experimental phải bị audit riêng
