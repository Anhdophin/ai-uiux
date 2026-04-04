CÁCH THÊM TRANG CON MỚI
1. Copy nguyên folder này sang đúng section cần dùng, ví dụ:
   /services/ten-trang-moi/
2. Sửa file data.json cho nội dung trang.
3. Sửa theme.css để đổi màu bằng vài dòng CSS variables.
4. Mở file data/services.json, data/downloads.json hoặc data/projects.json
   rồi thêm 1 object card mới trỏ tới folder vừa tạo.



Chỗ đổi màu nhanh:

:root{
  --page-accent:#ff4f7a;
  --page-accent-2:#83d8ff;
  --page-accent-3:#ffd24a;
  --page-ink:#163d73;
}

Nếu anh muốn gắn trực tiếp vào template cũ của anh, thì phần cần thay là toàn bộ nội dung bên trong:

<article class="detail-wrap">
  ...
</article>






Cách thêm trang mới sau này:

copy folder templates/detail-page-template
dán vào đúng mục, ví dụ services/ten-trang-moi/
sửa data.json
sửa theme.css
thêm 1 object card vào:
data/services.json
hoặc data/downloads.json
hoặc data/projects.json

Chỗ đổi màu nhanh nằm ở từng file:

services/.../theme.css
downloads/.../theme.css
projects/.../theme.css