# Data and AI Rules

## Data classes
### Raw data
Dữ liệu user trực tiếp chọn / nhập.

### Derived data
Dữ liệu engine suy ra từ raw + curated seed.

### AI data
Dữ liệu do AI sinh ra sau khi nhận context snapshot chuẩn hóa.

> Ba lớp này không được nhập nhằng trong cùng một object gốc mà không đánh dấu nguồn.

## Persistence rules
- Record persistent nên có `id`, `version`, `source_type`, `created_at`, `updated_at` khi phù hợp.
- Raw user text không được ghi đè bởi AI summary.
- Derived record phải có evidence hoặc source reference.
- AI record phải có `mode`, `provider` hoặc `provider_stub`, và `context_snapshot_id` nếu có persistence.

## Schema rules
- Không dùng JSON blob mơ hồ nếu đã biết cấu trúc.
- Mọi schema mới phải có mô tả ngắn trong file.
- Mapping phải truy ngược được evidence.

## AI rules
- AI chỉ nhận snapshot đã chuẩn hóa.
- AI output phải validate trước khi render.
- Nếu thiếu context, AI phải nói thiếu context thay vì bịa.
- AI insight phải chỉ ra nó bám vào feeling, keyword, reflection, hoặc wheel evidence nào.

## Prompt versioning
- Prompt mode phải có version.
- Khi đổi cấu trúc prompt, tăng version và ghi changelog ngắn trong docs hoặc commit.


## Additional data and AI rules
- Raw semantic bundles and locale bundles must be stored separately.
- AI-generated locale text is derived content until reviewed.
- User reality context selections are raw user data.
- AI must reference `locale`, `persona`, and `user_reality_context` in prompt contracts.
- Validation must fail when AI output locale does not match requested locale.
