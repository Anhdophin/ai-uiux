# AI Agent Enforcer

READ FIRST:
rules/MANDATORY_RULES_ENTRY.md
rules/AI_AGENT_ENFORCER_REFLECTION_SYSTEM.md

> File này dành cho AI agent, coding assistant, Cursor, Copilot, hoặc bất kỳ công cụ sinh code nào làm việc trong project này.

## Mandatory reading order
1. `docs/product/PRODUCT_TRUTH.md`
2. `docs/product/DOMAIN_MODEL.md`
3. `docs/product/USER_FLOW.md`
4. `docs/product/AI_BOUNDARY.md`
5. `MANDATORY_APP_SCAFFOLD_RULES.md`
6. `UI_SYSTEM_RULES.md`
7. `DATA_AND_AI_RULES.md`
8. `docs/architecture/AI_INTERACTION_CONTRACT.md`

## Non-negotiable enforcement
- Không được viết business logic vào UI presentational component.
- Không được cho UI gọi AI provider trực tiếp.
- Không được ghi đè raw user input bằng AI output.
- Không được tạo file ngoài scaffold mà không có lý do ghi vào docs.
- Không được đổi nghĩa `id`, route, schema, seed key một cách ngẫu hứng.
- Không được bỏ qua validator khi thêm field AI response.
- Không được thêm node mới mà không chạy audit integrity.
- Không được tách flow mới mà không cập nhật `USER_FLOW.md`.

## Required behavior when editing
- Nếu thêm domain: cập nhật `DOMAIN_MODEL.md`.
- Nếu thêm flow: cập nhật `USER_FLOW.md`.
- Nếu thêm AI mode: cập nhật `AI_BOUNDARY.md` và `src/content/seed/ai-modes.v1.json`.
- Nếu thêm schema persistent: cập nhật `DATA_AND_AI_RULES.md` và `src/backend/app/schemas/`.
- Nếu thêm seed: cập nhật script `scripts/seed_integrity_check.py` nếu cần.

## Output discipline
- Ưu tiên diff nhỏ, rõ, có comment đầu file.
- Nếu chưa chắc domain, giữ nguyên code và ghi TODO cụ thể.
- Nếu thêm dependency, ghi lý do trong comment hoặc docs.


## v6 additions
- Treat semantic keys as language-neutral source of truth.
- Do not make visible labels the primary ids of any entity.
- Prefer selection-first UX; free text remains secondary and optional.
- AI must operate on context snapshots, not raw chat alone.
- Persona matrix and user reality context are separate layers and must not be merged into one flat object.
