# Coaching Tools Foundation Scaffold v2

Bộ khung nền cho app coaching / self-reflection dạng mở từ khóa từng bước.

## Mục tiêu
- Khóa kiến trúc, luật nền, contract dữ liệu, và AI boundary ngay từ đầu.
- Giữ scaffold đủ chặt để AI không phá hướng, nhưng đủ mềm để scale và đổi stack về sau.
- Tách raw data / derived data / AI data để audit được.
- Chuẩn bị sẵn flow, engine, test, script check seed integrity.

## Triết lý
1. Bắt đầu từ cảm nhận thật.
2. Mở ngữ cảnh dần theo từng lớp.
3. Không để AI nhảy cóc khỏi context.
4. Mọi mapping phải truy vết được.
5. Mọi mở rộng sau này phải đi qua docs + schema + tests.

## Cấu trúc chính
- `docs/` khóa tư duy, product truth, rules, contract, ux.
- `src/content/seed/` dữ liệu nền versioned.
- `src/backend/` FastAPI scaffold + engine + validator + services.
- `src/frontend/` HTML/CSS/JS scaffold theo kiểu reveal progressively.
- `scripts/` script kiểm tra integrity.
- `tests/` unit / integration / audit tests.


## Foundation supplements added
- `docs/data/KEYWORD_NODE_SPEC.md`
- `docs/data/PERSONA_MATRIX_SPEC.md`
- `docs/data/WHEEL_MAPPING_SPEC.md`
- `docs/rules/AUDIT_RULES_SPEC.md`
- `docs/architecture/FOUNDATION_LOCK_ORDER.md`
- `src/content/schemas/*.schema.json`
- `src/backend/app/schemas/persona.py`
- `src/backend/app/schemas/audit.py`

## Quick start
### Backend
```bash
cd src/backend
python -m venv .venv
# Windows: .venv\Scriptsctivate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
Mở `src/frontend/index.html` bằng local server. Có thể dùng Live Server trong VS Code.

## Lưu ý
- Đây là scaffold nền đã được mở rộng, chưa phải app production.
- Trước khi AI sửa code, phải đọc lần lượt:
  1. `docs/product/PRODUCT_TRUTH.md`
  2. `docs/product/DOMAIN_MODEL.md`
  3. `docs/product/USER_FLOW.md`
  4. `docs/product/AI_BOUNDARY.md`
  5. `AI_AGENT_ENFORCER.md`
  6. `MANDATORY_APP_SCAFFOLD_RULES.md`
  7. `UI_SYSTEM_RULES.md`
  8. `DATA_AND_AI_RULES.md`


## Foundation add-on: content contracts and validation
- Added seed manifest and JSON schema contracts for all curated seed bundles.
- Added backend seed validator and stronger audit engine.
- Added routes: `/api/seed/manifest` and `/api/seed/validate`.
- Added scripts: `scripts/validate_content_bundle.py` and updated `seed_integrity_check.py`.
- Goal: keep content meaning locked before feature growth.


## Foundation lock extensions (v5)
- ontology bundles for keyword / persona / wheel
- coverage audit report for node, persona, and wheel gaps
- richer persona seed fields (`age_band`, `life_stage_key`, `career_stage_key`, `ai_tone_hints`)
- sub-area taxonomy injected into wheel seed

### New routes
- `GET /api/ontology/overview`
- `GET /api/audit/coverage`


## Foundation lock extensions (v6)
- multilingual architecture spec with semantic-key-first design
- user reality context layer separated from persona matrix
- selection-first UX rules added as a hard product rule
- locale seed + user-context option seed added to manifest
- backend locale/context snapshot scaffolds prepared for future AI integration

### New routes
- `GET /api/locales`
- `GET /api/user-context/options`
- `POST /api/context/snapshot`


## v7 foundation additions

- locale content bundles for `en` and `vi`
- semantic label registry
- context-aware selectable prompt packs
- locale resolution + prompt pack matching on backend


## v8 session foundation
- selection-first session model
- saveable context trail
- AI option-to-keyword resolution contract

## v9 foundation additions
- session analytics config and derived analytics routes
- trail compaction strategy with auditable compaction snapshots
- long-session resume plan generation


## v11 privacy / retention / identity
- memory privacy and retention scaffold
- pseudonymous identity linking preview + commit
- account-ready storage boundary layer



## v12 account lifecycle / export / delete / consent
- account lifecycle scaffold added
- export/delete preview + commit flows added
- consent audit event model added
- local append-only audit store added
