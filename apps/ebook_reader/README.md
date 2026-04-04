# Anhdophin Ebook Reader PWA Demo

## Mục tiêu
- Web HTML/CSS/JS kiểu PWA
- Mobile-first, responsive, icon-first
- Local Python server tự quét thư mục sách
- Mỗi file ZIP trong `library/zips/` sẽ được tự giải nén thành một thư mục con trong `library/books/`
- App tự tạo chỉ mục thư viện qua API `/api/library-index`

## Cách chạy
### Windows
- double click `start.bat`
- mở `http://127.0.0.1:8766`

### Mac / Linux
```bash
./start.sh
```
hoặc
```bash
python3 app.py
```

## Cấu trúc dữ liệu
```text
library/
  zips/
    sample-book.zip
  books/
    sample-book/
      metadata/metadata.json
      texts/*.txt
```

## Cách thêm sách mới
1. Copy file zip metadata-export vào `library/zips/`
2. Refresh trang hoặc restart server
3. App sẽ tự giải nén và quét index mới

## Chỗ dễ sửa UI
- `assets/styles.css`
- `assets/app.js`
- `index.html`

## Ghi chú
- Footer đang dùng brand Anhdophin và web site đã có. Có thể sửa trực tiếp trong `web/index.html`.
- Nếu sau này anh đổi cấu trúc folder, chỉ cần sửa logic scan trong `app.py`.


## Cập nhật cấu trúc mới
- Phần giao diện web đã được đưa ra thư mục gốc: `index.html`, `assets/`, `manifest.webmanifest`, `service-worker.js`, `DownloadLibrary/`.
- Không còn phụ thuộc việc chạy giao diện từ folder `web/`.
- `app.py` mới phục vụ toàn bộ project từ thư mục gốc và giữ API `/api/library-index`.
