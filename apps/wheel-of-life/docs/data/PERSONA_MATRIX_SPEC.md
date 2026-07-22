# Persona Matrix Spec

> Purpose: định nghĩa lớp lọc ngữ cảnh con người để app không đối xử mọi user như nhau.  
> Persona matrix là lớp ưu tiên ngữ cảnh, không phải công cụ gắn nhãn cứng cho con người.

## 1. Persona matrix dùng để làm gì
- ưu tiên node nào nên hiện trước
- thay đổi cách AI hỏi tiếp
- hỗ trợ mapping sang wheel theo bối cảnh sống
- giúp audit coverage cho các nhóm user khác nhau

## 2. Persona matrix không dùng để làm gì
- không dùng để phán xét bản chất người dùng
- không dùng để đóng khung số phận
- không dùng để loại trừ hoàn toàn một nhánh khỏi user khác

## 3. Cấu trúc persona
Một persona nên là tổ hợp của nhiều trục:
- age band
- gender
- life stage
- career stage
- dominant goal
- dominant pressure

## 4. Trục tối thiểu v1
### Age band
- `20s_early`
- `20s_late`
- `30s_early`
- `30s_late`
- `40s_plus`

### Gender
- `male`
- `female`
- `unspecified`

### Life stage
- `studying`
- `graduating_soon`
- `new_to_work`
- `working_stable`
- `transitioning`
- `building_business`
- `rebuilding`

### Career stage
- `exploration`
- `foundation`
- `growth`
- `plateau`
- `pivot`
- `builder`

## 5. Persona record mẫu
```json
{
  "id": "male_20s_late_new_to_work",
  "age_band": "20s_late",
  "gender": "male",
  "life_stage": "new_to_work",
  "career_stage": "foundation",
  "dominant_goals": ["prove_myself", "increase_income"],
  "dominant_pressures": ["comparison", "income_pressure"],
  "likely_blind_spots": ["overfocus_on_speed", "weak_long_term_view"],
  "priority_life_areas": ["career", "finance", "direction"],
  "suggested_entry_keyword_ids": ["pressure", "unclear_direction"],
  "ai_tone_hints": ["grounded", "non-patronizing"],
  "version": "1.0.0"
}
```

## 6. Các nhóm trường bắt buộc
### Identity banding
- age_band
- gender

### Situation banding
- life_stage
- career_stage

### Pressure profile
- dominant_goals
- dominant_pressures
- likely_blind_spots

### Guidance profile
- priority_life_areas
- suggested_entry_keyword_ids
- ai_tone_hints

## 7. Logic dùng trong app
- persona không quyết định duy nhất một flow
- persona chỉ tạo `priority weights`
- user vẫn có quyền đi sang nhánh khác
- AI phải ưu tiên các cách hỏi phù hợp persona nhưng không được khóa chết

## 8. Quy tắc xây persona
1. Dựa vào bối cảnh sống, không dựa vào định kiến rỗng.
2. Mỗi persona phải đủ khác biệt để có giá trị vận hành.
3. Không tạo persona thừa nếu chưa có khác biệt logic rõ.
4. Persona phải giúp mở ngữ cảnh chứ không làm hẹp user.

## 9. Quy tắc audit
Persona bị coi là yếu nếu:
- chỉ có nhãn mà không có pressure profile
- không có priority life areas
- không có entry keyword suggestions
- quá giống persona khác nhưng chỉ đổi tên

## 10. Mối quan hệ với keyword và wheel
- persona ảnh hưởng `entry priority`
- persona ảnh hưởng `mapping confidence`
- persona ảnh hưởng `AI deepen mode suggestion`
- persona không được sửa raw user data
