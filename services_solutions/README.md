# Dynamic CV V1 Scaffold

## Cách chạy
Vì app đọc dữ liệu từ các file JSON bằng `fetch()`, anh nên chạy bằng local server.

Ví dụ nhanh:
- VS Code Live Server
- hoặc Python: `python -m http.server 8000`

Sau đó mở:
- `http://localhost:8000`

## Đã có trong V1
- role cards ở đầu trang
- chọn role để dựng info stage
- block nhóm thông tin bay lên theo stagger
- info bars bay lên với random nhẹ có kiểm soát
- chuyển role A -> B với fade out / rebuild
- nút `!` mở side panel chi tiết
- detail panel render rich blocks, list, quote, image

## Các file chính
- `index.html`
- `assets/css/`
- `assets/js/`
- `data/*.json`

## Chỗ nên chỉnh tiếp
- đổi title role cho sát thị trường hơn
- thêm `items.json` để mở rộng nhóm nội dung
- thêm `details.json` cho các thanh bar cần giải thích sâu
- thay ảnh minh hoạ trong `assets/images/`
- đổi CV thật ở `assets/files/cv.pdf`
