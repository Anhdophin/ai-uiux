# Persona Ontology Spec

> Purpose: khóa taxonomy cho persona matrix để app hiểu bối cảnh người dùng theo trục thay vì theo nhãn rời rạc.

## 1. Thành phần ontology persona
- age band
- gender bucket
- life stage
- career stage
- goal tags
- pressure tags
- blind spot tags
- AI tone hints

## 2. Age band taxonomy v1
- `20s_early`
- `20s_late`
- `30s_early`
- `30s_late`
- `40s_plus`

## 3. Gender taxonomy v1
- `male`
- `female`
- `unspecified`

## 4. Life stage taxonomy v1
- `studying`
- `graduating_soon`
- `new_to_work`
- `working_stable`
- `transitioning`
- `building_business`
- `rebuilding`

## 5. Career stage taxonomy v1
- `exploration`
- `foundation`
- `growth`
- `plateau`
- `pivot`
- `builder`

## 6. Persona matrix dùng ontology như thế nào
- mỗi persona record là một tổ hợp được chọn từ taxonomy
- không phải mọi tổ hợp đều cần tồn tại ở v1
- nhưng mọi record phải dùng giá trị có trong taxonomy

## 7. Coverage thinking
- v1 cần có coverage tối thiểu cho từng age band, gender bucket, life stage quan trọng
- thiếu coverage không nhất thiết là lỗi critical, nhưng phải hiện ra trong audit

## 8. Rule mở rộng
- chỉ thêm taxonomy value mới khi có use-case rõ và audit/report hỗ trợ
- không thêm tag chỉ vì cảm giác “nghe hay”
