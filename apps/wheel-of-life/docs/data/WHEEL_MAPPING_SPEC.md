# Wheel Mapping Spec

> Purpose: định nghĩa cách chuyển từ keyword journey sang wheel of life có nghĩa.  
> Wheel không phải đồ trang trí. Nó là bản đồ tổng hợp có evidence.

## 1. Mục tiêu
Wheel mapping phải giúp trả lời 3 câu hỏi:
1. Khu vực nào đang bị tác động?
2. Vì sao khu vực đó bị tác động?
3. Mức độ chắc chắn đến đâu, dựa trên evidence nào?

## 2. Mô hình life area v1
- `career`
- `finance`
- `capability`
- `inner_system`
- `environment`
- `health`
- `direction`
- `life_system`

## 3. Mô hình sub-area
Mỗi area nên có sub-area để tránh mapping quá thô.

Ví dụ:
### career
- progression
- market_value
- role_fit

### finance
- income_stability
- buffer
- risk_management

### inner_system
- self_trust
- emotional_load
- resilience

## 4. Dữ liệu vào cho mapping
- selected keyword ids
- user persona snapshot
- session notes / reflection
- optional self-ratings

## 5. Dữ liệu ra
```json
{
  "life_area_id": "career",
  "sub_areas": [
    {"id": "progression", "score": 0.71}
  ],
  "score": 0.64,
  "evidence": [
    {"node_id": "ud_future", "weight": 0.5}
  ],
  "confidence": 0.78,
  "notes": ["Multiple nodes point to blocked progression"]
}
```

## 6. Nguyên tắc mapping
1. Mapping dựa trên evidence node, không suy diễn tự do.
2. Một node có thể chạm nhiều area.
3. Score area không đồng nghĩa area đó "tệ"; nó là độ tác động / độ lệch cần xem xét.
4. Confidence phải tách khỏi score.
5. Reflection của user có thể nâng hoặc hạ confidence.

## 7. Quy tắc score
- weight node là input cơ bản
- repeated patterns tăng confidence, không nên nhân score vô tội vạ
- conflicting evidence giảm confidence
- persona chỉ điều chỉnh nhẹ, không lật kết quả

## 8. Reverse trace bắt buộc
Mọi score area đều phải truy về được:
- node nào đóng góp
- weight bao nhiêu
- rule nào áp dụng

## 9. Khi nào không nên map mạnh
- user mới chọn quá ít node
- node đang còn ambiguity cao
- reflection còn trống
- persona chưa rõ

Trong các case này, wheel nên hiển thị:
- low confidence
- need more exploration

## 10. Quy tắc UI
- hiển thị area score + evidence count
- cho click để xem evidence nodes
- không tô đậm kiểu phán quyết "anh đang thất bại ở X"
- phrasing nên là: "khu vực đang chịu tác động" hoặc "khu vực cần xem kỹ"

## 11. Quy tắc audit
Mapping bị coi là yếu nếu:
- có score nhưng không có evidence
- confidence luôn cao bất thường
- node map sang quá nhiều area mà không có note
- không có reverse lookup

## 12. Roadmap về sau
- thêm temporal comparison giữa nhiều session
- thêm sub-area visualization
- thêm contradiction detection giữa reflection và keyword path
