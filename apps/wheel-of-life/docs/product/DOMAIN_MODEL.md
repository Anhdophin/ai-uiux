# Domain Model

## 1. Identity Context Domain
Chứa tuổi, giới tính, giai đoạn sống, giai đoạn nghề, mục tiêu, concern.

## 2. Feeling Entry Domain
Chứa cảm nhận đầu vào, intensity, frequency, note.

## 3. Keyword Exploration Domain
Chứa keyword graph, parent-child relation, related nodes, prompts, life area weights.

## 4. Reflection Domain
Chứa các ghi chú, self-rating, personal tags, snippets.

## 5. Wheel of Life Domain
Chứa life areas, scores, evidence, imbalance preview.

## 6. AI Coaching Domain
Chứa prompt builder, AI mode, output validator, AI turn shape.

## 7. Audit Domain
Chứa integrity checks, orphan detection, contradictory linkage, stale mapping.

## Domain boundary notes
- Feeling không được tự suy ra wheel nếu không đi qua mapping engine.
- Keyword graph là curated seed, không để UI tự bịa cấu trúc.
- AI chỉ đọc snapshot chuẩn hóa.
