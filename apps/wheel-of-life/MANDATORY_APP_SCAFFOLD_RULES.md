# Mandatory App Scaffold Rules

## 1. Architecture first
- Domain-first, feature-second, UI-last.
- Engine layer là bắt buộc cho flow logic, mapping logic, AI logic, audit logic.
- Integration layer phải đứng ngoài domain để tránh coupling ngầm.

## 2. Source of truth
- `docs/product/*.md` là nguồn sự thật của sản phẩm.
- `src/content/seed/*.json` là nguồn sự thật dữ liệu nền curated.
- `src/backend/app/schemas/` là nguồn sự thật cho contract API.
- `src/backend/app/engine/` là nơi điều phối logic.

## 3. Separation rules
- API route phải mỏng, không chứa orchestration dài.
- Presentational UI không biết business rule.
- Prompt text và prompt assembly không nằm trong UI.
- Derived data phải tách khỏi raw data.

## 4. Scalability rules
- Mỗi domain đủ lớn phải có tối thiểu: models/types, services, validators hoặc tương đương.
- Seed phải versioned.
- Mapping phải có reverse lookup hoặc evidence trace.

## 5. Flexibility rules
- Ưu tiên input/output chuẩn hóa.
- Thay AI provider, storage, hoặc frontend không được làm gãy domain model.
- Mọi engine phải có thể test độc lập.

## 6. Documentation rules
- Mỗi file cần comment đầu file: purpose + boundary.
- Mọi quyết định kiến trúc quan trọng nên ghi rõ “tại sao”.


## Mandatory additions for multilingual + selection-first foundation
1. All domain entities must keep stable English-oriented semantic keys.
2. Locale bundles must be versioned separately from semantic bundles.
3. Primary user interaction must remain selectable.
4. Long free-text capture must not become the default onboarding or journey path.
5. Context snapshot builders are mandatory before AI calls.
