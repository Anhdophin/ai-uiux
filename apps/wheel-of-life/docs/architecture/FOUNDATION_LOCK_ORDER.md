# Foundation Lock Order

> Purpose: xác định thứ tự khóa nền trước khi build app nặng hơn.

## Lock order
1. Product truth
2. Domain boundary
3. Keyword node spec
4. Persona matrix spec
5. Wheel mapping spec
6. Audit rules spec
7. JSON schemas and seed contracts
8. Engine contracts
9. UI patterns
10. Only then: feature implementation

## Why this order matters
Nếu làm ngược, code sẽ chạy trước khi nghĩa được khóa.
Khi đó app dễ rơi vào tình trạng: UI đẹp nhưng dữ liệu lỏng, AI nói hay nhưng không truy vết được.
