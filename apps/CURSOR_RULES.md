CURSOR RULES — MINI APP WEB ARCHITECTURE & SOURCE PROTECTION
0) Mục tiêu cốt lõi

Mọi app trong hệ thống này phải được phát triển theo nguyên tắc:

UI có thể chạy ở client
logic quan trọng phải nằm ở server
client không được giữ bí mật hệ thống
mọi quyền truy cập phải được kiểm tra ở backend
code mới phải dễ mở rộng, dễ sửa, không phá app cũ
khi thêm app mới, kiến trúc phải đồng nhất với app cũ
khi sửa app cũ, không được phá flow, naming, route, cấu trúc chung nếu không có lý do rất rõ
1) Nguyên tắc nền bắt buộc
1.1. Không đặt logic quan trọng ở frontend

AI tuyệt đối không được:

nhét business logic lõi vào JavaScript client
đặt pricing logic, scoring logic, permission logic, ownership logic, AI prompt lõi, secret config ở frontend
coi obfuscation/minify là bảo mật

Frontend chỉ được giữ:

UI rendering
local interaction
nhẹ nhàng validate UX
loading state
preview state
request/response handling
1.2. Mọi phần nhạy cảm phải nằm ở backend

Các phần sau bắt buộc nằm ở backend:

auth
permission
ownership
database access
API key
secret
AI/provider calls
business rules
export logic
audit/log logic
anti abuse logic
1.3. Không tin dữ liệu từ client

Mọi input từ client đều là không đáng tin cho đến khi backend xác thực lại.

Backend phải luôn kiểm tra:

user là ai
user có quyền gì
object có thuộc user đó không
input có hợp lệ không
request có bị spam / bypass / giả mạo không
2) Tư duy kiến trúc bắt buộc

Mỗi app phải được nhìn theo 6 tầng:

Tầng 1 — View

Phần hiển thị: HTML, layout, component, card, modal, tabs, preview

Tầng 2 — Interaction

Click, input, filter, form submission, drag/drop, UI state

Tầng 3 — API Boundary

Điểm giao tiếp giữa client và server.
Client không được vượt qua tầng này để chạm trực tiếp vào logic lõi.

Tầng 4 — Business Logic

Tính toán thật, rule thật, xử lý thật

Tầng 5 — Data Layer

Database, storage, indexing, query, ownership mapping

Tầng 6 — Security Layer

Auth, permission, validation, rate limiting, audit, anti abuse

AI phải suy nghĩ và code theo đủ 6 tầng trên, không được code kiểu dồn hết vào một file.

3) Cấu trúc thư mục chuẩn

Khi tạo app mới hoặc refactor app cũ, ưu tiên cấu trúc sau.

app-name/
├─ frontend/
│  ├─ public/
│  ├─ src/
│  │  ├─ pages/
│  │  ├─ components/
│  │  ├─ modules/
│  │  ├─ services/
│  │  ├─ utils/
│  │  └─ styles/
│  └─ ...
├─ backend/
│  ├─ app/
│  │  ├─ api/
│  │  ├─ auth/
│  │  ├─ permissions/
│  │  ├─ services/
│  │  ├─ models/
│  │  ├─ schemas/
│  │  ├─ db/
│  │  ├─ storage/
│  │  ├─ logging/
│  │  └─ main.*
│  └─ ...
├─ shared/
│  ├─ docs/
│  ├─ contracts/
│  └─ constants/
├─ .env.example
├─ README.md
└─ CHANGELOG.md

Nếu app nhỏ, có thể rút gọn, nhưng vẫn phải giữ tư duy tách lớp:

app-name/
├─ web/
│  ├─ index.html
│  ├─ styles.css
│  └─ app.js
├─ server/
│  ├─ routes.*
│  ├─ services.*
│  ├─ auth.*
│  ├─ db.*
│  └─ main.*
├─ .env.example
└─ README.md
Cấm:
để toàn bộ app trong 1 file JS duy nhất nếu app có logic thật
frontend gọi thẳng DB cho dữ liệu nhạy cảm
nhét route, logic, auth, validation, storage vào 1 file lớn
4) Quy tắc về frontend
4.1. Frontend chỉ là UI shell

Frontend phải làm các việc sau:

render UI
thu input
gọi API
hiển thị loading / success / error
giữ state hiển thị
validate UX ở mức nhẹ
4.2. Frontend không được giữ bí mật

Không được để ở frontend:

API key
secret key
admin rules
role rules thật
ownership rules
scoring engine thật
system prompt lõi
private config
4.3. Validation ở frontend chỉ để cải thiện trải nghiệm

Frontend validation không bao giờ được coi là validation thật.
Mọi validation quan trọng phải lặp lại ở backend.

4.4. Không dùng frontend để quyết định quyền

Không được coi việc:

ẩn nút
disable nút
ẩn menu
là một cơ chế bảo mật.

Ẩn nút chỉ là UX.
Bảo mật thật luôn nằm ở backend.

5) Quy tắc về backend
5.1. Backend là nơi xử lý thật

Backend phải chịu trách nhiệm:

nhận request
xác thực danh tính
kiểm tra permission
kiểm tra ownership
validate input
xử lý logic
lưu dữ liệu
trả response tối thiểu cần thiết
5.2. Mọi route phải có mục đích rõ ràng

Không tạo route mơ hồ kiểu:

/doSomething
/processData
/adminAction

Ưu tiên route rõ nghĩa:

POST /api/auth/login
GET /api/tasks
POST /api/tasks
PATCH /api/tasks/:id
POST /api/analyze/swot
POST /api/export/pdf
5.3. Tách route và service
route: nhận request, trả response
service: xử lý logic
db/model: data access
auth/permission: security checks

Không viết business logic dài bên trong controller/route nếu app có khả năng mở rộng.

5.4. Response phải tối thiểu

Backend chỉ trả dữ liệu cần cho UI.
Không trả dư:

internal note
secret config
debug detail
private field không cần hiển thị
ownership meta không cần thiết
raw provider payload nếu không cần
6) Quy tắc auth / permission / ownership
6.1. Không tin role từ client

Client gửi role=admin không có giá trị.
Backend phải tự xác minh role thật.

6.2. Không tin userId từ client cho quyền truy cập

Client có thể gửi userId, nhưng backend không được lấy đó làm nguồn sự thật cho phân quyền.
Nguồn sự thật phải đến từ:

session
token
server-side auth context
6.3. Ownership là bắt buộc

Mọi object có chủ sở hữu phải kiểm tra:

object này thuộc ai
user hiện tại có được xem / sửa / xóa không
6.4. Security order chuẩn

Mọi route nhạy cảm phải đi theo thứ tự:

auth → permission → ownership → validation → business logic → response

Không được đảo ngược.

7) Quy tắc về dữ liệu và database
7.1. Database không phải playground của client

Không để client chạm trực tiếp vào dữ liệu nhạy cảm nếu chưa có policy cực kỳ chặt.

Ưu tiên flow:
Client → Backend API → Database

7.2. Schema phải rõ

Mỗi data model nên có tối thiểu:

id
owner_id hoặc actor mapping nếu cần
created_at
updated_at
status nếu hợp lý
7.3. Không query quá rộng

AI không được viết query kiểu:

lấy toàn bộ bảng rồi filter ở client
trả full record nếu UI chỉ cần 3 field
expose thông tin của user khác
7.4. Soft delete hay hard delete phải rõ

Khi code delete:

phải xác định rõ là soft delete hay hard delete
nếu là app thật, ưu tiên soft delete hoặc archived state khi phù hợp
8) Quy tắc về file upload / export / storage
8.1. Upload phải kiểm tra ở backend

Backend phải kiểm tra:

loại file
dung lượng
định dạng
tên file an toàn
quyền upload
8.2. Không tin tên file gốc

Tên file từ user chỉ là input tham khảo.
Backend nên đổi sang tên an toàn hoặc ID-based naming.

8.3. Export phải chạy ở backend nếu có logic thật

Nếu export:

PDF
DOCX
dữ liệu tổng hợp
file chứa logic xử lý
thì việc tạo file nên chạy ở backend.
9) Quy tắc về secret và config
9.1. Secret chỉ được ở backend

Các thứ sau phải nằm trong environment variables hoặc secure config:

DB credentials
API keys
token secrets
provider secrets
admin secrets
9.2. Không commit .env

Phải có:

.gitignore
.env.example
9.3. Frontend config chỉ được chứa public config

Ví dụ:

API base URL public
feature flags không nhạy cảm
UI settings

Không được chứa:

private token
provider secret
privileged endpoint key
10) Quy tắc về code quality
10.1. Không code rác

AI không được:

duplicate logic vô tội vạ
copy-paste nhiều khối gần giống nhau mà không tách hàm/module
tạo utility mơ hồ khó đọc
patch chồng patch gây nứt flow
sửa một chỗ làm hỏng 3 chỗ khác
10.2. Ưu tiên code dễ đọc, dễ sửa

Mỗi function cần:

tên rõ
trách nhiệm rõ
input/output rõ
10.3. Không lạm dụng abstraction

Không biến app nhỏ thành mê cung abstraction.
Nhưng cũng không được viết spaghetti code.
Mức abstraction phải vừa đủ để:

sửa nhanh
thêm tính năng dễ
không lặp logic nguy hiểm
10.4. Giữ naming nhất quán

Naming phải thống nhất giữa:

folder
file
API route
model
UI label nội bộ
service name
11) Quy tắc khi sửa app cũ
11.1. Không phá flow cũ nếu chưa kiểm tra

Trước khi sửa:

xác định app hiện tại đang chạy theo flow nào
tìm các file liên quan trực tiếp
kiểm tra dependency giữa các module
không đổi cấu trúc chung chỉ vì tiện tay
11.2. Không đổi naming / path / contract bừa bãi

Nếu cần đổi:

phải update đầy đủ tất cả chỗ liên quan
phải tránh tạo path chết
phải giữ backward compatibility nếu app đang dùng thật
11.3. Ưu tiên refactor an toàn

Khi refactor:

tách nhỏ từng bước
giữ hành vi cũ ổn trước
rồi mới thêm logic mới
11.4. Không giả định app cũ “chắc không ai dùng đoạn này”

Muốn xóa hoặc đổi mạnh:

phải check call sites
check import/use
check route mapping
check UI entry points
12) Quy tắc khi thêm app mới vào folder apps
12.1. App mới phải hòa vào hệ thống chung

Mọi app mới phải tuân thủ:

naming chung
folder convention chung
auth convention chung
API convention chung
logging convention chung
security convention chung
12.2. App mới không được bypass nền hệ thống

Không vì làm nhanh mà:

bỏ auth layer
bỏ permission layer
bỏ validation backend
gọi DB trực tiếp từ client
hardcode secrets
12.3. App mới phải sẵn sàng để mở rộng

Ngay cả app MVP cũng phải có tư duy:

có thể thêm user
có thể thêm role
có thể thêm feature
có thể thêm logs
có thể tách service sau này
13) Quy tắc về API contract
13.1. Request/response phải có cấu trúc rõ

Ưu tiên JSON rõ ràng, ổn định.

Ví dụ response:

{
  "success": true,
  "data": {},
  "message": ""
}

Hoặc khi lỗi:

{
  "success": false,
  "message": "Invalid input",
  "errors": {
    "title": "Required"
  }
}
13.2. Không trả lỗi lộ nội bộ

Client không được thấy:

stack trace thật
database internals
provider secrets
server paths nội bộ
13.3. Giữ contract ổn định

Nếu thay đổi response shape:

phải update frontend tương ứng
phải tránh breaking change ngầm
14) Quy tắc về logging / monitoring / audit
14.1. Backend phải có logging cơ bản

Ít nhất cần log:

auth attempts quan trọng
create/update/delete actions
errors
abnormal requests
14.2. Audit actions quan trọng

Nếu app có dữ liệu người dùng hoặc dữ liệu quan trọng:

lưu ai đã làm gì
lúc nào
trên object nào
14.3. Không log secret

Không ghi vào log:

password
tokens
secrets
raw private payload không cần thiết
15) Quy tắc về anti-abuse
15.1. Rate limit cho route nhạy cảm

Ưu tiên áp dụng cho:

login
generate
export
upload
AI calls
password reset
search nặng
15.2. Không để route expensive mở toang

Route tốn tài nguyên phải có:

auth nếu cần
throttling
validation
timeout handling
16) Quy tắc về AI / prompt / external provider
16.1. Prompt lõi không để ở client

Nếu app dùng AI:

prompt hệ thống
logic ghép prompt
policy xử lý
token/provider secret
phải để ở backend
16.2. Provider response phải được lọc

Không trả raw provider response cho client nếu không cần.
Chỉ trả phần cần thiết cho UI.

16.3. Phải kiểm soát chi phí

Khi dùng AI/external API:

validate input trước khi gọi
tránh gọi thừa
có fallback khi lỗi
có logging tối thiểu
17) Quy tắc về UI và trải nghiệm lập trình
17.1. UI đẹp không được đổi lấy kiến trúc bẩn

Không vì cần demo nhanh mà:

viết hết logic ở client
hardcode dữ liệu nhạy cảm
bỏ lớp auth/permission
17.2. Tách UI state và domain state

UI state:

modal open
active tab
loading
toast

Domain state:

task data
result data
user data
app settings

Không trộn bừa.

17.3. Khi có thể, chia component rõ
presentational component
feature component
data-fetching/service layer
18) Quy tắc review trước khi hoàn tất

Mỗi lần AI thêm mới hoặc sửa code, phải tự kiểm tra:

Security checklist
Có đưa secret xuống frontend không?
Có để permission logic ở client không?
Có route nào bypass auth không?
Có check ownership chưa?
Có validate input ở backend chưa?
Có trả dữ liệu dư không?
Architecture checklist
Có nhét quá nhiều logic vào 1 file không?
Có tách route/service/data/auth rõ chưa?
Có giữ contract ổn định không?
Có phá cấu trúc app cũ không?
Maintainability checklist
Naming có đồng nhất không?
Folder có rõ không?
Có duplicate logic lớn không?
Chỗ sửa có ảnh hưởng app khác không?
19) Luật bắt buộc khi AI trả lời hoặc code

AI phải luôn ưu tiên:

bảo vệ người dùng
bảo vệ logic hệ thống
không để lộ mã nguồn nhạy cảm qua frontend
không phá app cũ
không làm nhanh kiểu tạm bợ nếu sẽ gây nợ kỹ thuật lớn
không tự tiện “đơn giản hóa” bằng cách bỏ lớp bảo mật
không coi frontend hiding là security
luôn nghĩ theo hướng app sẽ mở rộng về sau
20) Mệnh lệnh thực thi ngắn gọn cho AI

Khi làm việc trong repo này, AI phải tuân thủ tuyệt đối:

Never place sensitive business logic in client-side code.
Never expose secrets, provider keys, internal rules, or true permission logic to the frontend.
Always enforce auth, permission, and ownership on the backend.
Always validate critical input on the backend even if the frontend already validates.
Always separate UI concerns from business logic.
Always preserve existing architecture unless a safe refactor is intentionally performed.
Never break app flow, route contracts, or shared conventions casually.
Always prefer maintainable, modular, reviewable code over quick hacks.
Always assume client input can be manipulated.
Always protect data access through server-side checks.
BẢN RÚT GỌN ĐỂ DÁN Ở ĐẦU FILE RULE

Nếu anh muốn một bản ngắn, ép AI mạnh ngay từ đầu, anh có thể dán thêm đoạn này ở đầu:

This repo uses strict app architecture rules.

Core rule:
Frontend is UI only. Backend is the source of truth.

Never put sensitive logic, auth rules, permission rules, ownership checks, secrets, API keys, AI core prompts, or business-critical processing in client-side code.

Always enforce:
auth → permission → ownership → validation → business logic → response

Do not trust client input.
Do not expose secrets.
Do not let client-side hiding act as security.
Do not break existing app flow or shared architecture.

When editing old apps:
analyze current structure first, preserve contracts, and refactor safely.

When building new apps:
follow the shared folder, API, auth, and security conventions from the repo.

Prefer clear, modular, maintainable code.
Avoid hacks, duplication, and spaghetti patches.
GỢI Ý CÁCH DÙNG TRONG FOLDER apps

Anh có thể tổ chức như này:

apps/
├─ CURSOR_RULES.md
├─ shared/
├─ app-1/
├─ app-2/
└─ app-3/

Và nếu muốn ép từng app mạnh hơn:

app-1/
├─ APP_RULES.md
├─ frontend/
└─ backend/

Trong đó:

CURSOR_RULES.md = luật tổng của toàn bộ hệ apps
APP_RULES.md = luật riêng của từng app nếu có đặc thù