# Content Validation Flow

> Flow này giữ cho dữ liệu nghĩa không bị nứt khi AI hoặc dev thêm nội dung mới.

```text
Edit seed JSON
-> Validate by JSON Schema
-> Validate by semantic integrity script
-> Run audit engine
-> Run automated tests
-> Only then expose to frontend / AI
```

## Validation responsibilities
- **JSON Schema**: đúng hình dạng dữ liệu.
- **Seed integrity**: đúng liên kết chéo.
- **Audit engine**: đúng nghĩa ở mức hệ thống.
- **Tests**: đúng contract của route / engine.

## Typical failure classes
- duplicate ids
- keyword node thiếu trường nghĩa
- persona tag không tồn tại
- life area weight ngoài khoảng 0..1
- keyword depth sai so với parent
- wheel mapping không có evidence
