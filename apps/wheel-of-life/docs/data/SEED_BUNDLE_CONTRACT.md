# Seed Bundle Contract

> Purpose: khóa chuẩn cho toàn bộ curated content trước khi build feature sâu hơn.

## Bundle layers
1. **Schema layer** — JSON Schema cho từng nhóm seed.
2. **Content layer** — seed JSON versioned, không dùng blob ad-hoc.
3. **Validation layer** — script kiểm tra schema + quan hệ chéo.
4. **Audit layer** — engine phát hiện orphan, coverage lệch, mapping yếu.

## Bundle rules
- Mỗi file seed phải có `version`, `updated_at`, `source_note`.
- Mọi entity phải có `id` ổn định và không reuse nghĩa khác.
- Tất cả liên kết chéo phải reverse-check được.
- Dữ liệu AI sinh ra không được ghi đè curated seed.
- Khi mở rộng V2/V3, file mới phải cùng contract rồi mới thêm node.

## Required seed groups
- `personas.v1.json`
- `feelings.v1.json`
- `keyword-tree.v1.json`
- `wheel-map.v1.json`
- `ai-modes.v1.json`
- `sample-session.v1.json`

## Before feature expansion
Phải chạy:
1. schema validation
2. seed integrity check
3. seed audit report
4. tests liên quan route / engine
