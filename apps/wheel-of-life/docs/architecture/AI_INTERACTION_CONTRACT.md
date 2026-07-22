# AI Interaction Contract

## Pipeline chuẩn
1. User tạo raw selections.
2. Context Engine chuẩn hóa snapshot.
3. Mapping Engine thêm wheel evidence nếu có.
4. Prompt Builder lắp prompt từ snapshot.
5. AI provider hoặc stub trả output.
6. Output Validator kiểm tra contract.
7. UI render ngắn gọn, có trace.

## Input contract
AI chỉ nhận:
- persona summary
- feeling summary
- selected keyword ids/labels
- reflection snippet
- wheel preview
- current mode

## Output contract
AI phải trả tối thiểu:
- `summary`
- `possible_patterns`
- `follow_up_questions`
- `next_keyword_paths`
- `confidence_note`

## Safety notes
- Ưu tiên câu hỏi trước kết luận.
- Nếu thiếu context, phải nói rõ thiếu context.
- Phải bám vào keyword user đã chọn.
