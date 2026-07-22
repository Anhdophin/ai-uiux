# Audit Rules Spec

> Purpose: biến app thành hệ có thể kiểm tra, không chỉ "chạy được".  
> Audit rules phải bảo vệ ngữ cảnh, quan hệ dữ liệu, và hành vi AI.

## 1. Audit layer cần check gì
- content integrity
- graph integrity
- persona coverage
- wheel traceability
- AI contract compliance
- UI flow consistency

## 2. Content integrity rules
- mọi node phải có id ổn định
- mọi node phải có long meaning hoặc short meaning tối thiểu
- mọi node phải có ít nhất 1 reflection hoặc clarifying prompt
- mọi persona phải có pressure profile

## 3. Graph integrity rules
- non-root node phải có parent
- child phải có reverse parent link
- missing related ids phải bị flag
- depth logic không được đi lùi sai cấp
- merge candidates nên được note khi trùng nghĩa mạnh

## 4. Persona coverage rules
- mỗi age band phải có coverage tối thiểu
- mỗi gender bucket phải có fallback persona
- mỗi life stage phải có entry paths hợp lệ
- persona gần nhau phải có lý do tách

## 5. Wheel traceability rules
- mọi wheel score cần evidence
- mọi evidence cần tồn tại trong seed
- reverse lookup phải chạy được
- area confidence cần có lý do

## 6. AI contract rules
- AI output phải bám mode
- AI output không được overwrite raw user data
- AI output phải reference selected nodes hoặc session context
- AI không được nhảy sang advice mạnh khi context còn mỏng

## 7. UI consistency rules
- bước đầu không overload quá nhiều lựa chọn
- user luôn nhìn thấy trail hoặc history tối thiểu
- state save phải tách raw / derived / AI
- empty state phải có lý do rõ

## 8. Severity levels
- `critical`: phá dữ liệu, phá traceability, sai contract nặng
- `major`: gây hiểu sai flow hoặc mapping
- `minor`: thiếu metadata, phrasing yếu, coverage mỏng
- `info`: cảnh báo để cải thiện

## 9. Audit output shape gợi ý
```json
{
  "ok": false,
  "summary": {"critical": 1, "major": 2, "minor": 5},
  "issues": [
    {
      "severity": "major",
      "domain": "keyword_graph",
      "entity_id": "ud_future",
      "rule_id": "graph.reverse_parent_required",
      "message": "Child points to parent but parent missing child reverse link"
    }
  ]
}
```

## 10. Mandatory audit checkpoints
- trước khi thêm seed lớn
- trước khi release phiên bản mới
- sau khi AI agent sửa content mapping
- trước khi đổi prompt contract
