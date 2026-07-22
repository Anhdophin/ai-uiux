# Coverage Audit Reports

> Purpose: định nghĩa loại report dùng để biết nền nội dung đã phủ được tới đâu và đang hở chỗ nào.

## 1. Coverage report trả lời gì
- keyword graph đã phủ đủ depth chưa
- persona matrix đang thiếu nhóm người nào
- wheel đang yếu ở area nào
- node nào đang dồn quá nhiều vào một area
- persona nào chưa có entry keyword hợp lệ

## 2. Coverage report không làm gì
- không thay judgment của coach
- không tự sửa dữ liệu
- không tự merge node

## 3. Các nhóm report v1
### Keyword coverage
- count theo depth
- count theo kind
- root count / leaf count
- area coverage count
- persona tag coverage count

### Persona coverage
- count theo gender
- count theo age band
- count theo life stage
- count theo career stage
- completeness của recommended entry keywords

### Wheel coverage
- số area có evidence node
- số area có sub-area taxonomy
- area nào coverage thấp
- area nào đang quá lệch về node count

## 4. Gaps / warnings
Report nên tách rõ:
- `critical gaps`
- `major gaps`
- `advisory gaps`

## 5. Rule dùng report
- dùng trước khi mở rộng seed lớn
- dùng trước khi scale AI prompts
- dùng sau khi AI agent thêm branch mới
