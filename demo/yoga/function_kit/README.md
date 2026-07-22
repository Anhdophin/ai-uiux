# Landing Page Function Kit

Bộ này là một **kit JS/CSS thuần** để gắn nhanh vào landing page.
Mục tiêu:
- Dễ chép vào bất kỳ web tĩnh nào
- Không phụ thuộc framework
- Có comment để sửa tay dễ
- Tập trung vào các function phổ biến của landing page

## Các nhóm function có sẵn

1. Sticky CTA bar
2. FAQ accordion
3. Lead popup
4. Toast message
5. Form demo xử lý phía front-end
6. Gallery lightbox
7. Section navigation / active anchor
8. Reveal on scroll
9. Booking link helper
10. Contact action helper
11. Simple tabs
12. Copy text helper

## Cấu trúc folder

- `js/landing-kit.js` → logic chính
- `css/landing-kit.css` → style căn bản cho các function
- `examples/demo-landing.html` → file demo để xem cách gắn

## Cách dùng nhanh

### Bước 1: Chép folder này vào web của anh
Ví dụ:
`/shared/landingpage_function_kit/`

### Bước 2: Gắn CSS và JS vào trang
```html
<link rel="stylesheet" href="./shared/landingpage_function_kit/css/landing-kit.css">
<script defer src="./shared/landingpage_function_kit/js/landing-kit.js"></script>
```

### Bước 3: Thêm HTML theo data-attribute mẫu trong file demo
Kit này dùng nhiều `data-*` để giảm phải sửa JS.

---

## Cách hoạt động

Khi trang load, JS sẽ tự scan các block có data-attribute phù hợp rồi bật function.

Ví dụ:
- `data-faq-item` → FAQ accordion
- `data-open-popup="lead-popup"` → mở popup
- `data-lightbox-gallery` → gallery click xem lớn
- `data-booking-url` → nút đặt lịch
- `data-copy-text="..."` → copy text

---

## Những gì bộ này KHÔNG làm

- Không lưu dữ liệu vào database
- Không tự gửi form tới server thật
- Không sync Google Calendar thật bằng API
- Không có auth/login

Bộ này chỉ làm lớp **giao tiếp và tương tác phía user nhìn thấy**.
Muốn nối backend thì chỉ cần sửa chỗ callback trong JS.

---

## Điểm nên sửa khi dùng thật

### 1. Form submit
Trong file JS, tìm:
`handleLeadFormSubmit(form)`

Anh có thể đổi đoạn mock submit thành:
- gọi API thật
- gửi tới Google Apps Script
- gửi tới webhook
- gửi tới form handler service

### 2. Booking
Anh chỉ cần đổi `data-booking-url` thành link đặt lịch thật:
- Google Calendar appointment schedule
- Calendly
- link form đặt lịch riêng

### 3. Contact
Các nút gọi điện, email, Zalo, Messenger có thể sửa trực tiếp ở HTML.

---

## Gợi ý đặt vào dự án lớn

Nếu web của anh có shared folder:

```text
/web
  /shared
    /landingpage_function_kit
      /css
      /js
```

Nếu là từng mini app độc lập:

```text
/app-a
  index.html
  /assets
  /landingpage_function_kit
```

---

## Lưu ý

- Tên class được đặt khá trung tính để anh sửa tiếp dễ.
- Bộ CSS này là style nền, không ép anh phải dùng nguyên xi.
- Có thể đổi toàn bộ màu bằng CSS variable ở đầu file CSS.
