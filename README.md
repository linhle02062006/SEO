# TechZone — Website đặt hàng trực tuyến phụ kiện điện thoại & công nghệ

> Đồ án cuối kỳ: **TỐI ƯU HÓA CÔNG CỤ TÌM KIẾM WEBSITE ĐẶT HÀNG TRỰC TUYẾN**
> Website bán phụ kiện điện thoại, cáp sạc, củ sạc, tai nghe, sạc dự phòng, kính cường lực… xây dựng bằng Next.js 15 + TypeScript + Tailwind CSS, có quản trị Admin đầy đủ.
>
> **Định hướng:** đây là **một website bán hàng trực tuyến bình thường**. SEO chỉ được triển khai ở mức **Technical SEO cơ bản** (URL thân thiện, title, meta description, H1/H2, alt ảnh, canonical, sitemap.xml, robots.txt, Open Graph, breadcrumb, Schema JSON-LD) nhằm phục vụ môn học. Toàn bộ số liệu phân tích (keyword, traffic, ranking, backlink) được thu thập **bên ngoài** bằng Google Search Console, Google Analytics, Google Keyword Planner và Google PageSpeed Insights.

---

## 1. Công nghệ sử dụng

| Lớp | Công nghệ |
|---|---|
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Database | Drizzle ORM + **PGlite** (local file DB, không cần cài server) hoặc **PostgreSQL/Supabase** qua `DATABASE_URL` |
| Auth | JWT (`jose`) ký cookie httpOnly + bcryptjs hash mật khẩu |
| API | Next.js Server Actions + Route Handlers (`/api/orders`, `/api/track`) |
| Validation | Zod (validate mọi form, server action và API) |
| Ảnh | `next/image` (WebP/AVIF, responsive, lazy loading) + `sharp` sinh ảnh mẫu |
| Analytics | GA4 (`gtag`) + GTM + bảng `seo_events` nội bộ |

---

## 2. Cài đặt & chạy local

### 2.1. Yêu cầu
- Node.js 18.18+ (khuyến nghị 20/22)
- npm 9+

### 2.2. Các bước

```bash
# 1) Cài dependency
npm install

# 2) Tạo file biến môi trường
cp .env.example .env.local      # Windows: copy .env.example .env.local

# 3) Áp dụng schema + sinh ảnh + nạp dữ liệu mẫu
npm run setup
#    hoặc chạy từng bước:
#    npm run db:push            # tạo bảng
#    npm run images:covers      # dựng ảnh cover blog + banner danh mục
#    npm run images:icons       # sinh apple-touch-icon + icon PWA
#    npm run db:seed            # nạp dữ liệu mẫu (38 sản phẩm + ảnh thật)

# 4) Chạy dev server
npm run dev
```

Mở http://localhost:3000

**Đăng nhập quản trị:** http://localhost:3000/admin/dang-nhap

| Vai trò | Email | Mật khẩu |
|---|---|---|
| Quản trị viên | `admin@techzone.vn` | `Admin@12345` |

> Thông tin tài khoản demo chỉ được ghi tại đây (README), **không hiển thị trên giao diện đăng nhập**.

> Lưu ý: PGlite là DB dạng file, **chỉ một tiến trình được mở tại một thời điểm**. Khi chạy `npm run db:seed` hoặc `npm run db:push`, hãy dừng dev server trước. Với production (PostgreSQL) không có giới hạn này.

### 2.3. Các lệnh npm

| Lệnh | Mô tả |
|---|---|
| `npm run dev` | Chạy development server |
| `npm run build` | Build production |
| `npm run start` | Chạy production server |
| `npm run lint` | ESLint |
| `npm run db:push` | Tạo/cập nhật schema (PGlite hoặc Postgres) |
| `npm run db:seed` | Nạp dữ liệu mẫu (idempotent — chạy lại được) |
| `npm run db:reset` | Xoá sạch DB local rồi tạo lại từ đầu (dùng khi DB bị hỏng) |
| `npm run db:check` | Kiểm tra kết nối DB (driver, số bảng, số bản ghi) |
| `npm run db:clean-fake` | **Dọn dữ liệu ảo** (rating/số bán/lượt xem/SĐT/địa chỉ giả) khỏi DB |
| `npm run smtp:fake` | Chạy SMTP server giả lập để test form liên hệ (không cần Gmail thật) |
| `npm run db:generate` | Sinh migration SQL (Drizzle Kit) |
| `npm run db:studio` | Mở Drizzle Studio để xem/sửa dữ liệu |
| `npm run images:generate` | Sinh ảnh minh họa cho sản phẩm & bài viết (chỉ khi thiếu ảnh thật) |
| `npm run images:scrape` | Quét + tải ảnh sản phẩm thật từ cellphoneS.com.vn |
| `npm run images:covers` | Dựng ảnh cover blog (1200×630) + banner danh mục (1200×675) |
| `npm run images:icons` | Sinh `apple-touch-icon.png`, `icon-192.png`, `icon-512.png` |
| `npm run setup` | `db:push` + `images:generate` + `images:covers` + `images:icons` + `db:seed` |
| `npm run verify` | Kiểm tra tự động toàn bộ: lint + route/ảnh + ảnh sản phẩm + link nội bộ + luồng chức năng |
| `npm run verify:routes` | Crawl mọi route + file ảnh, kiểm tra HTTP 200 |
| `npm run verify:images` | Kiểm tra mọi ảnh được tham chiếu trên mọi trang + 38 sản phẩm đủ 2 ảnh |
| `npm run verify:links` | Quét link nội bộ & thẻ `<img>` (alt) trong HTML đã render |
| `npm run verify:flows` | 18 luồng chức năng end-to-end (tìm kiếm, lọc, giỏ, checkout, admin…) |

### 2.4. Nguyên tắc: KHÔNG bịa thông tin thương hiệu

Website **không hiển thị** bất kỳ thông tin nào chưa được xác nhận là thật:

| Thông tin | Cơ chế |
|---|---|
| Điểm đánh giá & số đánh giá | Chỉ hiện khi `products.rating_count > 0` (có dòng trong bảng `product_reviews`). Không có -> hiện *"Chưa có đánh giá"*. |
| "Đã bán N" | Chỉ hiện khi `products.sold_count > 0` (đã có đơn hàng thật). Không có -> ẩn hoàn toàn. |
| Lượt xem | Chỉ tính từ sự kiện `view_item` thật trong `seo_events`. |
| Option sắp xếp "Bán chạy nhất" / "Đánh giá cao" | Ẩn nếu shop chưa có đơn hàng / đánh giá thật. |
| Bộ lọc "Đánh giá từ ★" | Ẩn nếu chưa có đánh giá thật. |
| Badge "Bán chạy" / "Hot" | Không seed. Admin tự tay đặt khi có căn cứ. |
| Section "Sản phẩm bán chạy nhất" (trang chủ) | Ẩn nếu không có sản phẩm nào có `sold_count > 0`. |
| Số điện thoại / địa chỉ showroom | **Đã gỡ khỏi toàn bộ codebase, seed và DB.** Chỉ hiện email liên hệ. |
| Hồ sơ mạng xã hội | Không seed. Admin tự thêm trong Cài đặt → Hồ sơ mạng xã hội. |

> Nếu bạn muốn bật lại các mục trên, chỉ cần nhập dữ liệu thật vào DB
> (đơn hàng, đánh giá, hồ sơ MXH) — UI tự hiện, không cần sửa code.
>
> Chạy `npm run db:clean-fake` để dọn dữ liệu ảo còn sót trong DB.

### 2.5. Tự phục hồi database local (PGlite)

`database/db.ts` tự xử lý 3 tình huống thường gặp với PGlite local:

| Tình huống | Cơ chế xử lý |
|---|---|
| **Data dir trống** (clone repo mới, chưa `db:push`) | Tự tạo schema + nạp dữ liệu mẫu ngay khi app khởi động |
| **File lock/pid sót lại** sau khi bị kill | Dọn file lock cũ nếu tiến trình giữ lock đã chết |
| **WAL hỏng** (`PANIC: could not locate a valid checkpoint` → `RuntimeError: Aborted()`) | Xoá data dir hỏng, tạo lại schema + seed lại từ `database/seed-data/*` |

Ngoài ra, PGlite là DB dạng file nên **chỉ một tiến trình được mở tại một thời điểm**.
App ghi PID chủ sở hữu vào `.pglite/.pglite.owner`; nếu bạn chạy script (`db:seed`,
`db:push`, …) trong khi server đang chạy, sẽ nhận thông báo lỗi rõ ràng thay vì
làm hỏng dữ liệu:

```text
Error: PGlite local (./.pglite) đang được tiến trình khác (PID 12345) sử dụng.
Hãy dừng server đang chạy trước khi chạy script trên cùng database.
```

> 💡 Nếu vẫn muốn reset sạch: `npm run db:reset` (xoá `.pglite` + `db:push` + `db:seed`).
>
> 💡 Với production (PostgreSQL/Supabase) **không có giới hạn này** — mọi tính năng
> phục hồi tự động ở trên chỉ áp dụng cho PGlite local.

### 2.6. Dữ liệu demo của dashboard quản trị

Dashboard mặc định lọc theo **"Tháng này" / "7 ngày gần nhất" / "Hôm nay"**.
Vì vậy dữ liệu demo (khách hàng, đơn hàng, lưu lượng) được ghi với **mốc thời
gian tương đối** so với lúc chạy seed — nằm trong `database/seed-data/demo.ts`:

| Nhóm | Số lượng | Mốc thời gian |
|---|---|---|
| Khách hàng | 5 | tạo 45 ngày trước |
| Đơn hàng (`TZ-DEMO-1001`…`1007`) | 7 | 1 → 32 ngày trước (3 đơn nằm trong "Tháng này") |
| Sự kiện analytics (`seo_events`) | 810 | 30 ngày gần nhất, ~27 sự kiện/ngày |

Nhờ vậy dashboard **luôn hiển thị số liệu thực** (doanh thu, đơn hàng, khách
hàng, tỷ lệ chuyển đổi, biểu đồ doanh thu, top sản phẩm được xem) thay vì toàn
số 0 — kể cả khi DB local được tự phục hồi tự động. Chạy `npm run db:seed`
lại được nhiều lần (idempotent) và mốc thời gian luôn được tính lại.

> ⚠️ **Dữ liệu demo KHÔNG được dùng để hiển thị trên website công cộng.**
> Đơn demo có mã `TZ-DEMO-*` nên `sold_count` trên sản phẩm được tính lại
> **loại trừ** đơn demo (xem `npm run db:clean-fake`). Nhờ vậy số "Đã bán"
> trên website luôn khớp với đơn hàng thật.

---

## 3. Biến môi trường (`.env.local`)

```env
# Database — để TRỐNG để dùng PGlite local file DB
# hoặc điền URL PostgreSQL thật (xem mục 3.1 bên dưới)
DATABASE_URL=

# Số connection tối đa trong pool (chỉ dùng khi có DATABASE_URL thật)
DATABASE_POOL_MAX=10

# URL gốc của website (không có dấu / cuối) — dùng cho sitemap, canonical, OG, schema
NEXT_PUBLIC_SITE_URL=https://techzone.vn

# Google Search Console (chỉ mã html-tag)
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=

# Google Analytics 4 — đo dạng G-XXXXXXXXXX
NEXT_PUBLIC_GA_ID=

# Google Tag Manager — đo dạng GTM-XXXXXXX
NEXT_PUBLIC_GTM_ID=

# Secret ký session cookie — sinh bằng: openssl rand -base64 32
AUTH_SECRET=

# Tài khoản admin tạo khi seed
ADMIN_EMAIL=admin@techzone.vn
ADMIN_PASSWORD=Admin@12345

# Email nhận yêu cầu tư vấn từ form liên hệ
CONTACT_EMAIL=1350080137@sv.hcmunre.edu.vn
NEXT_PUBLIC_CONTACT_EMAIL=

# SMTP — BẮT BUỘC để form liên hệ gửi được email thật
# (Gmail: bật 2FA rồi tạo App Password tại https://myaccount.google.com/apppasswords)
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
MAIL_FROM=
```

Website **không lỗi** khi để trống `NEXT_PUBLIC_GA_ID` / `NEXT_PUBLIC_GTM_ID` / `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` — các script tương ứng chỉ được inject khi có ID.

> ⚠️ **Form liên hệ chỉ báo "gửi thành công" khi SMTP thực sự gửi được email.**
> Nếu thiếu/sai `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` thì API trả về lỗi và
> website hiển thị *"Không thể gửi yêu cầu lúc này. Vui lòng thử lại sau."*

### 3.0.1. Test form liên hệ mà không cần Gmail thật

Project có sẵn **SMTP server giả lập** để kiểm tra luồng gửi email:

```bash
# 1) Mở terminal 1 — chạy SMTP giả (nhận email vào ./.tmp-smtp/*.eml)
npm run smtp:fake

# 2) Mở terminal 2 — chạy website với cấu hình trỏ về SMTP giả
#    Windows PowerShell:
$env:SMTP_HOST="127.0.0.1"; $env:SMTP_PORT="2525"; $env:SMTP_SECURE="false"
$env:SMTP_USER="test@techzone.local"; $env:SMTP_PASS="test-pass"
$env:MAIL_FROM="TechZone <test@techzone.local>"
$env:CONTACT_EMAIL="1350080137@sv.hcmunre.edu.vn"
npm run dev

# 3) Gửi form -> mở file .tmp-smtp/*.eml để xem nội dung email
```

Nếu API trả `200` + *"Cảm ơn bạn! Yêu cầu tư vấn đã được gửi thành công."*
thì hệ thống email đã hoạt động đúng.

---

### 3.1. Gắn DATABASE THẬT (PostgreSQL)

> **Không dùng được với MongoDB.** Project này dùng **Drizzle ORM + `drizzle-orm/pg-core`** với
> kiểu cột `pgEnum`, `serial()`, `numeric()`, `text[]` và các truy vấn SQL thuần
> (`date_trunc`, `GREATEST`, `COALESCE`, `ILIKE`). Đó là ngôn ngữ **PostgreSQL** —
> chuyển sang MongoDB sẽ phải viết lại toàn bộ schema, 20+ service và 4 route API.

#### Bước 1 — Tạo database

**Cách A: Supabase (miễn phí, dễ nhất)**

1. Vào <https://supabase.com> → **New project**.
2. *Settings → Database → Connection string → URI* → chọn **Session pooler** (port `5432`).
3. Lấy `User`, `Password`, `Database`.

**Cách B: Neon (miễn phí)**

1. Vào <https://neon.tech> → **Create project**.
2. Copy **Connection string** (dạng `postgresql://user:pass@ep-xxx.region.neon.tech/neondb?sslmode=require`).

**Cách C: PostgreSQL cài local**

```bash
# Ubuntu / Debian
sudo apt install postgresql
sudo -u postgres createuser -s techzone
createdb techzone
# connection string:
# postgresql://techzone:matkhau@localhost:5432/techzone
```

#### Bước 2 — Điền vào `.env.local`

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE
DATABASE_POOL_MAX=10
```

| Provider | URL mẫu |
|---|---|
| Supabase (session pooler) | `postgresql://postgres.xxx:PASS@db.xxxx.supabase.co:5432/postgres` |
| Supabase (transaction pooler) | `postgresql://postgres.xxx:PASS@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true` |
| Neon | `postgresql://user:PASS@ep-xxx.region.neon.tech/neondb` |
| Local | `postgresql://postgres:postgres@localhost:5432/techzone` |

> ⚠️ **Mật khẩu có ký tự đặc biệt phải URL-encode**: `@` → `%40`, `#` → `%23`, `:` → `%3A`, `/` → `%2F`.
> Ví dụ mật khẩu `p@ss:word#1` → `p%40ss%3Aword%231`.
>
> ⚠️ **Không cần thêm `?sslmode=require`** — ứng dụng tự cấu hình SSL đúng cách
> (`database/db.ts` → `resolvePgConnection()` bỏ `sslmode` khỏi URL và tự truyền
> `ssl: { rejectUnauthorized: false }` cho managed Postgres dùng CA riêng).
> Nếu dùng Transaction pooler của Supabase thì **giữ nguyên** `?pgbouncer=true`.

#### Bước 3 — Tạo bảng + nạp dữ liệu mẫu

```bash
npm run db:check    # kiểm tra kết nối (in ra driver, số bảng, số bản ghi)
npm run db:push     # tạo bảng + enum
npm run db:seed     # nạp dữ liệu mẫu (idempotent — chạy lại được)
npm run db:check    # xác nhận products/orders/blog_posts đã có dữ liệu
```

#### Bước 4 — Chạy

```bash
npm run dev
```

> 💡 Khi đã có `DATABASE_URL`, **giới hạn "PGlite chỉ 1 process" của PGlite không còn áp dụng** —
> mở `npm run dev`, `npm run build`, `npm run db:seed` cùng lúc cũng OK.
>
> 💡 `npm run db:seed` chạy lại được (idempotent): sản phẩm/danh mục/blog được update theo slug,
> admin được reset mật khẩu, đơn hàng demo chỉ tạo 1 lần.

#### Xem & sửa dữ liệu trực quan

```bash
npm run db:studio   # mở Drizzle Studio (web UI)
```

#### Vấn đề thường gặp

| Triệu chứng | Nguyên nhân | Cách sửa |
|---|---|---|
| `getaddrinfo ENOTFOUND` | Sai hostname | Copy lại connection string từ provider |
| `password authentication failed` | Sai mật khẩu / chưa URL-encode | URL-encode ký tự đặc biệt |
| `self-signed certificate in certificate chain` | SSL verify | Đã xử lý tự động; nếu vẫn lỗi thì kiểm tra proxy/firewall |
| `too many connections` | Pool quá lớn | Giảm `DATABASE_POOL_MAX` (serverless nên để `1`–`2`) |
| `prepared statement does not exist` | Dùng Transaction pooler sai cách | Thêm `?pgbouncer=true` vào URL, hoặc dùng Session pooler (port 5432) |
| `relation "products" does not exist` | Chưa tạo bảng | Chạy `npm run db:push` |

---

## 4. Cấu trúc website (URL thân thiện SEO)

```text
/                              Trang chủ
/san-pham                      Danh sách sản phẩm (lọc, sắp xếp, phân trang)
/san-pham/[slug]               Chi tiết sản phẩm   /san-pham/cap-sac-nhanh-20w-type-c-ho-tro-pd-30
/danh-muc                      Tất cả danh mục
/danh-muc/[slug]               Trang danh mục      /danh-muc/cap-sac
/thuong-hieu                   Tất cả thương hiệu
/thuong-hieu/[slug]            Trang thương hiệu   /thuong-hieu/baseus
/tim-kiem                      Tìm kiếm (noindex)
/gio-hang                      Giỏ hàng (noindex)
/dat-hang                      Checkout (noindex)
/dat-hang/thanh-cong/[code]    Trang xác nhận đơn (noindex)
/blog                          Danh sách bài viết
/blog/[slug]                   Chi tiết bài viết    /blog/cach-chon-cap-sac
/gioi-thieu                    Giới thiệu
/lien-he                       Liên hệ
/chinh-sach                    Trang chính sách
/chinh-sach/[slug]             Nội dung chính sách
/huong-dan-mua-hang            Hướng dẫn mua hàng
/sitemap.xml                   Sitemap động (tự sinh từ DB)
/robots.txt                    Robots động
/admin                         Quản trị (noindex, yêu cầu đăng nhập)
```

Không có bất kỳ URL dạng `/product?id=123` nào.

---

## 5. Phần 1 — Hạ tầng

### 5.1. Domain & URL gốc
Toàn bộ URL tuyệt đối (canonical, OG, sitemap, robots, JSON-LD) đều sinh từ `getSiteUrl()` → `NEXT_PUBLIC_SITE_URL`. Không hard-code `localhost`.

### 5.2. Sitemap động — `app/sitemap.ts`
Sinh tự động từ database:
- Trang tĩnh: trang chủ, sản phẩm, blog, giới thiệu, liên hệ, chính sách, hướng dẫn
- Tất cả danh mục, thương hiệu, sản phẩm (chỉ `status = active`), bài viết (chỉ `isPublished`)
- **Không** chứa `/admin`, `/admin/dang-nhap`, `/gio-hang`, `/dat-hang`, `/tim-kiem`

Khai báo `lastModified` theo `updatedAt` thực tế của bản ghi.

### 5.3. Robots động — `app/robots.ts`
```text
User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /api/
Disallow: /gio-hang
Disallow: /dat-hang
Disallow: /tim-kiem

Sitemap: https://<site-url>/sitemap.xml
```
Ngoài ra route `robots.txt` được render động theo `NEXT_PUBLIC_SITE_URL`.

### 5.4. Google Search Console
Meta tag xác minh được inject tự động khi có `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` (xem `app/layout.tsx`).

### 5.5. GA4 & GTM
- `components/analytics/Analytics.tsx` — nạp gtag.js + `PageViewTracker` (gửi `page_view` mỗi lần điều hướng, kể cả SPA).
- `components/analytics/GtmScript.tsx` — nạp GTM container (kèm `noscript` iframe fallback).
- Events GA4 đầy đủ: `page_view`, `view_item`, `search`, `add_to_cart`, `begin_checkout`, `purchase`.

---

## 6. Phần 2 — Từ khóa & kế hoạch nội dung

### 6.1. Bảng `keywords` (dữ liệu tham chiếu)
Bảng lưu kế hoạch từ khóa phục vụ **bài báo cáo**, quản lý trực tiếp qua DB (Drizzle Studio / SQL), **không có màn hình quản trị riêng** trong website.

| Trường | Ý nghĩa |
|---|---|
| `keyword` | Từ khóa chính |
| `intent` | `informational` / `commercial` / `transactional` / `navigational` |
| `topicGroup` | Nhóm chủ đề (Ví dụ: “Cáp sạc”, “Sạc dự phòng”, “Mua & thanh toán”) |
| `targetUrl` | Trang mục tiêu |
| `priority` | `high` / `medium` / `low` |
| `searchVolume`, `difficulty`, `position` | Số liệu theo dõi (nhập tay sau khi có GSC) |
| `notes` | Ghi chú |

Dữ liệu mẫu: **40 từ khóa** phân bố đủ 4 intent.

### 6.2. Blog CMS — 10 bài viết SEO
Mỗi bài có: title, slug, meta title, meta description, H1/H2/H3, nội dung, ảnh cover + alt, internal link, bài liên quan, CTA.

1. Cách chọn củ sạc nhanh phù hợp
2. Cách chọn cáp sạc tốt và bền
3. Có nên sử dụng sạc nhanh?
4. Cách bảo vệ pin điện thoại
5. Cách chọn sạc dự phòng
6. USB-C là gì?
7. PD và QC khác nhau thế nào?
8. Cách chọn tai nghe Bluetooth
9. Cách chọn kính cường lực
10. Những phụ kiện điện thoại cần thiết

Quản lý tại `/admin/blog` (thêm / sửa / xoá / publish).

---

## 7. Phần 3 — SEO On-page

| Hạng mục | Cách thực hiện |
|---|---|
| Title riêng từng trang | `buildMetadata()` trong `lib/seo.ts`, template `%s \| TechZone` ở `app/layout.tsx`. `normalizeTitle()` tự cắt hậu tố trùng lặp. |
| Meta description riêng | Lấy từ `seoDescription` trong DB, fallback sinh tự động theo loại trang. |
| Heading | 1 H1 duy nhất, H2 theo section, H3 cho FAQ. |
| Image SEO | Mọi ảnh qua `next/image`: `alt`, `fill`/`width`+`height`, `sizes`, `loading="lazy"`, `priority` cho ảnh LCP. |
| Internal link | Trang chủ → danh mục → sản phẩm; Blog → sản phẩm/danh mục; Sản phẩm → sản phẩm liên quan + bài liên quan; Bài viết → bài liên quan. |
| Canonical | `alternates.canonical` = URL tuyệt đối chuẩn hóa (bỏ query, bỏ trailing slash) cho mọi trang. |
| Open Graph | `og:title`, `og:description`, `og:image`, `og:url`, `og:site_name`, `og:locale` + Twitter Card. |
| Breadcrumb | Component `Breadcrumb` hiển thị + `BreadcrumbList` JSON-LD. |
| Noindex | `/gio-hang`, `/dat-hang`, `/tim-kiem`, `/dat-hang/thanh-cong/*`, toàn bộ `/admin`. |

### 7.1. Structured Data (JSON-LD) — `lib/schema.ts`
| Schema | Nơi dùng |
|---|---|
| `WebSite` + `SearchAction` | Mọi trang (layout) |
| `Organization` (+ `sameAs` social profiles) | Mọi trang, dữ liệu đồng nhất từ bảng `social_profiles` |
| `Product` + `Offer` + `AggregateRating` + `Review` | Trang sản phẩm, dữ liệu lấy từ DB |
| `BreadcrumbList` | Mọi trang có breadcrumb |
| `Article` (+ `Article` author/publisher) | Trang bài viết |
| `FAQPage` | Trang sản phẩm có FAQ, trang liên hệ |
| `ItemList` | Trang danh mục, blog index |

---

## 9. Phần 4 — Đo lường & đánh giá

### 9.1. Tracking nội bộ (bảng `seo_events`)
Mọi event được ghi vào DB (kể cả khi chưa cấu hình GA4), nên có thể đối chiếu với GA4:

| Event | Nơi phát |
|---|---|
| `page_view` | `components/analytics/Analytics.tsx` |
| `view_item` | `components/analytics/ViewItemTracker.tsx` (trang sản phẩm) |
| `search` | `components/search/SearchBar.tsx` |
| `add_to_cart` | `AddToCartButton.tsx`, `ProductCard.tsx` |
| `begin_checkout` | `components/checkout/CheckoutForm.tsx` |
| `purchase` | Server action checkout (nội bộ) + `components/analytics/PurchaseTracker.tsx` (GA4) |

### 9.2. Dashboard quản trị (`/admin`)
- Bộ lọc theo **Hôm nay / 7 ngày / Tháng này**
- Doanh thu, đơn hàng, khách hàng, số sản phẩm đang bán, bài viết đã xuất bản
- Biểu đồ doanh thu theo ngày (SVG, không phụ thuộc thư viện ngoài)
- **Tỷ lệ chuyển đổi** = `purchase / page_view`
- **Sản phẩm được xem nhiều** (theo `view_item`)
- Bảng sự kiện đo lường chi tiết
- Đơn hàng gần đây, sản phẩm bán chạy nhất

### 9.3. Đối chiếu GSC
Số liệu thực tế (`position`, `searchVolume`, `difficulty`) được lấy **bên ngoài** từ Google Search Console / Keyword Planner, rồi nhập tay vào bảng `keywords` (qua Drizzle Studio) để theo dõi tiến độ theo từ khóa.

---

## 10. Quản trị (`/admin`)

| Menu | Chức năng |
|---|---|
| **Dashboard** | Doanh thu, đơn hàng, khách hàng, biểu đồ, lưu lượng khách hàng, tỷ lệ chuyển đổi, top sản phẩm xem nhiều |
| **Sản phẩm** | CRUD đầy đủ (tên, slug, giá, giá sale, tồn kho, ảnh, thuộc tính, FAQ, SEO title/description, trạng thái) |
| **Đơn hàng** | Danh sách, lọc theo trạng thái, chi tiết đơn, cập nhật trạng thái (`pending` → `confirmed` → `shipped` → `delivered` / `cancelled`) |
| **Khách hàng** | Danh sách khách, số đơn, tổng chi tiêu, phân trang |
| **Danh mục** | CRUD danh mục (9 danh mục mẫu) |
| **Thương hiệu** | CRUD thương hiệu (7 thương hiệu mẫu) |
| **Blog** | CMS: thêm / sửa / xoá / publish bài viết |
| **Cài đặt** | Thông tin thương hiệu, NAP, SEO mặc định, thông tin merchant, hồ sơ mạng xã hội |

Bảo vệ: layout `/admin` kiểm tra session, không đăng nhập → redirect `/admin/dang-nhap`. Mọi server action đều gọi `requireAdmin()` trước khi thực thi.

---

## 11. Database

17 bảng (Drizzle schema tại `database/schema.ts`):

```text
users              users              → quản trị viên / tài khoản (role: admin|customer)
customers          customers          → khách hàng (snapshot địa chỉ, tổng chi tiêu)
brands             brands             → thương hiệu
categories         categories         → danh mục (parentId tự tham chiếu)
products           products           → sản phẩm (FK category, brand)
product_reviews    product_reviews    → đánh giá sản phẩm
orders             orders             → đơn hàng (mã đơn TZ…, trạng thái, thanh toán)
order_items        order_items        → chi tiết đơn (snapshot tên/giá/ảnh tại thời điểm mua)
coupons            coupons            → mã giảm giá
blog_posts         blog_posts         → bài viết CMS
keywords           keywords           → kế hoạch từ khóa (tham chiếu cho bài báo cáo)
social_profiles    social_profiles    → Social Entity (sameAs)
backlinks          backlinks          → theo dõi backlink (tham chiếu)
seo_audits         seo_audits         → lịch sử audit SEO (không còn UI, giữ dữ liệu)
seo_events         seo_events         → event tracking nội bộ
contact_messages   contact_messages   → tin nhắn liên hệ
settings           settings           → cấu hình site (key-value)
```

Quan hệ chính:
```text
categories (self) ──< products >── brands
products ──< order_items >── orders >── customers ──> users
products ──< product_reviews
categories ──< blog_posts >── users (author)
```

Dữ liệu mẫu: **38 sản phẩm**, **9 danh mục**, **7 thương hiệu**, **10 bài viết**, **40 từ khóa**, **6 social profile**, **7 đơn hàng demo**, **settings**.

---

## 12. Kiến trúc thư mục

```text
app/
  layout.tsx            Root layout: metadata template, fonts, Header/Footer, Analytics, GTM
  sitemap.ts robots.ts  Động theo DB
  page.tsx              Trang chủ
  san-pham/             list + [slug]
  danh-muc/ thuong-hieu/ blog/ tim-kiem/
  gio-hang/ dat-hang/ dat-hang/thanh-cong/[code]/
  gioi-thieu/ lien-he/ chinh-sach/ huong-dan-mua-hang/
  api/orders/ api/track/
  admin/
    (bang-dieu)/        Các route quản trị (có auth guard)
    (xac-thuc)/         Route đăng nhập (tránh vòng lặp redirect)
    dang-nhap/
components/
  layout/ product/ cart/ checkout/ blog/ search/ contact/
  common/ analytics/ admin/ ui/
lib/
  seo.ts        buildMetadata, normalizeTitle, metadataTemplate
  schema.ts     Schema.org JSON-LD builders
  site.ts       SITE config, getSiteUrl, absoluteUrl, ROUTES
  analytics-client.ts  Gửi event GA4 + nội bộ
  auth.ts       Session JWT (jose)
  policies.ts   Nội dung chính sách
services/
  catalog-service.ts product-service.ts order-service.ts
  checkout-service.ts admin-service.ts
  seo-service.ts        Events + analytics summary + social profiles
database/
  schema.ts      Drizzle schema (17 bảng)
  schema-sql.ts  SQL tạo bảng (dùng chung cho migrate + auto-repair runtime)
  db.ts          Dual driver: PGlite (local) ↔ node-postgres (prod) + tự phục hồi
  seed-data/     products, posts, keywords, catalog, demo
scripts/
  migrate.ts seed.ts reset-db.ts generate-images.ts
  crawl-check.mjs  link-check.mjs  smoke-test.mjs   ← kiểm tra tự động
  check-images.mjs  check-product-images.mjs       ← kiểm tra ảnh toàn site
```

---

## 13. Hiệu năng

- **Ảnh**: `next/image` tự sinh WebP/AVIF, `sizes` responsive, `loading="lazy"` (trừ ảnh LCP dùng `priority`), blur placeholder cho ảnh lớn.
- **Font**: `next/font/google` (Inter) — tự host, `display: swap`, `preload`, không render-blocking.
- **Code splitting**: Server Components mặc định; component client chỉ ở nơi cần tương tác (giỏ hàng, filter, form admin).
- **Cache**: `revalidate = 60` cho các trang catalog; `dynamic = "force-dynamic"` cho admin & trang cá nhân.
- **Database**: index đầy đủ trên `slug`, `categoryId`, `brandId`, `orderId`, `createdAt`; truy vấn dùng `select` cột cần thiết + `limit`; PGlite là DB in-process nên cực nhanh ở local.
- **Core Web Vitals**: LCP ưu tiên ảnh sản phẩm đầu tiên, CLS ổn định nhờ layout cố định (`aspect-square`), INP thấp nhờ JS tối thiểu ở các trang tĩnh.

---

## 14. Responsive

Đã kiểm thử ở `360px`, `390px`, `768px`, `1024px`, `1440px`.
- Header: menu drawer mobile, thanh tìm kiếm thu gọn, giỏ hàng có badge số lượng
- Grid sản phẩm: 2 cột (mobile) → 3 cột (tablet) → 4 cột (desktop)
- Bảng admin: chuyển sang dạng card/stack trên màn hình nhỏ
- Checkout: 1 cột → 2 cột (`lg:grid-cols-[1fr_380px]`), sidebar sticky

---

## 15. Bảo mật

- **Không hard-code** mật khẩu / API key / DATABASE_URL / secret trong source. Toàn bộ nằm trong `.env.local`; `.env.example` chỉ chứa giá trị mẫu rỗng.
- Mật khẩu admin lưu bằng **bcrypt hash**, session lưu trong cookie **httpOnly + sameSite=lax** ký bằng `AUTH_SECRET`.
- Route admin và mọi server action đều kiểm tra session (`requireAdmin()`).
- Validate input bằng **Zod** ở server action và API route (tên, SĐT, email, địa chỉ, số lượng, giá).
- Kiểm tra tồn kho & tính lại giá ở **server** khi tạo đơn — không tin giá từ client.
- `robots.txt` chặn `/admin` và `/api`; các trang admin đều `noindex, nofollow`.
- Route `/api/track` chỉ nhận event trong whitelist.

---

## 16. Triển khai production (GitHub → Vercel → Supabase → Domain)

### 16.1. Chuẩn bị Supabase / Neon / Postgres
1. Tạo project, lấy **Connection string** (Session pooler port 5432 — khuyến nghị; Transaction pooler 6543 cần thêm `?pgbouncer=true`).
2. Điền `DATABASE_URL` vào `.env.local`, rồi kiểm tra: `npm run db:check`.
3. Chạy `npm run db:push` với `DATABASE_URL` trỏ tới DB đó (migrate schema).
4. Chạy `npm run db:seed` một lần để nạp dữ liệu mẫu (tuỳ chọn).

### 16.2. Đẩy code lên GitHub
```bash
git init
git add .
git commit -m "TechZone - website dat hang truc tuyen"
git branch -M main
git remote add origin https://github.com/<user>/techzone.git
git push -u origin main
```

### 16.3. Deploy lên Vercel
1. Import repository từ GitHub.
2. Thêm Environment Variables:

| Key | Value |
|---|---|
| `DATABASE_URL` | connection string của Supabase/Neon (bắt buộc) |
| `DATABASE_POOL_MAX` | `1` hoặc `2` (serverless — tránh tràn connection) |
| `NEXT_PUBLIC_SITE_URL` | `https://techzone.vn` (domain thật) |
| `AUTH_SECRET` | chuỗi ngẫu nhiên ≥ 32 ký tự |
| `NEXT_PUBLIC_GA_ID` | `G-XXXXXXXXXX` |
| `NEXT_PUBLIC_GTM_ID` | `GTM-XXXXXXX` |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | mã xác minh GSC |

3. Deploy. Vercel tự chạy `npm run build` → `npm run start`.

> **Lưu ý:** Production **phải** dùng PostgreSQL. PGlite chỉ dùng cho local (filesystem của serverless function không bền vững).
>
> **Lưu ý build:** `npm run build` prerender các trang sản phẩm/blog bằng cách đọc DB → cần `DATABASE_URL`
> có sẵn lúc build và phải truy cập được từ môi trường Vercel (không phải `localhost`).

### 16.4. Trỏ domain
- Vercel → Settings → Domains → thêm `techzone.vn` + `www.techzone.vn`
- Trỏ DNS CNAME theo hướng dẫn của Vercel
- Cập nhật `NEXT_PUBLIC_SITE_URL` = `https://techzone.vn` và redeploy (canonical/sitemap/robots dùng biến này)

### 16.5. Sau khi deploy
1. Google Search Console → thêm property → xác minh bằng HTML tag → submit `https://techzone.vn/sitemap.xml`
2. GA4 → Admin → Property → Web stream → nhập URL + Measurement ID
3. GTM → tạo container → nhập `GTM-XXXXXXX`
4. Kiểm tra Rich Results Test cho `/san-pham/[slug]` và `/blog/[slug]`

---

## 17. Checklist kiểm tra cuối

**Hạ tầng**
- [x] Website chạy local & production build thành công
- [x] Không hard-code domain — dùng `NEXT_PUBLIC_SITE_URL`
- [x] `/sitemap.xml` sinh động từ DB (không chứa `/admin`)
- [x] `/robots.txt` chặn `/admin`, `/api`, giỏ hàng, checkout; khai báo sitemap
- [x] Hỗ trợ xác minh GSC bằng meta tag
- [x] GA4 + GTM tích hợp, không lỗi khi thiếu ID

**Từ khóa & nội dung**
- [x] 40 từ khóa trong DB, đủ 4 Search Intent, có nhóm chủ đề + URL mục tiêu + ưu tiên
- [x] Cấu trúc silo: Trang chủ → Danh mục → Sản phẩm; Trang chủ → Blog
- [x] 10 bài viết SEO đầy đủ (H1/H2/H3, ảnh + alt, internal link, bài liên quan, CTA)
- [x] CMS quản lý bài viết trong `/admin/blog`

**On-page**
- [x] Title + meta description riêng cho từng trang (không trùng lặp hậu tố)
- [x] Đúng 1 H1, có H2/H3 theo cấu trúc
- [x] Mọi ảnh có `alt`, kích thước, `loading`
- [x] Mạng lưới internal link chủ động
- [x] Canonical chính xác mọi trang
- [x] Open Graph + Twitter Card đầy đủ
- [x] Breadcrumb hiển thị + JSON-LD
- [x] Schema.org: WebSite, Organization, Product, Offer, BreadcrumbList, Article, FAQPage

**Off-page**
- [x] Social Entity quản lý tập trung tại `/admin/cai-dat`, đồng nhất, có `sameAs`
- [x] Bảng `backlinks` giữ đầy đủ trường dữ liệu để theo dõi (quản lý bên ngoài)
- [x] Không có backlink giả/spam

**Đo lường**
- [x] Đủ 6 event GA4 + bảng `seo_events` nội bộ
- [x] Dashboard lọc theo ngày / tuần / tháng
- [x] Biểu đồ doanh thu, tỷ lệ chuyển đổi, sản phẩm xem nhiều
- [x] Dữ liệu có thể xuất/đối chiếu

**Giao diện**
- [x] Giao diện khách hàng không hiển thị SEO Score / Keyword Ranking / Backlink Count / SEO Audit
- [x] Quản trị tập trung quản lý cửa hàng: Dashboard, Sản phẩm, Đơn hàng, Khách hàng, Danh mục, Thương hiệu, Blog, Cài đặt
- [x] Thông tin tài khoản demo chỉ nằm trong README, không hiển thị trên trang đăng nhập

---

## 18. Công cụ kiểm tra

```bash
# Type check
npx tsc --noEmit

# Lint
npm run lint

# Build production
npm run build

# Kiểm tra tự động toàn bộ (cần server đang chạy ở localhost:3000)
npm run verify          # = lint + verify:routes + verify:images + verify:links + verify:flows
npm run verify:routes   # 94 route + 102 ảnh: HTTP 200 hết
npm run verify:images   # mọi ảnh trên mọi trang + 38 sản phẩm đủ 2 ảnh thật
npm run verify:links    # mọi link nội bộ & ảnh trong HTML: không có link gãy
npm run verify:flows    # 18 luồng chức năng (tìm kiếm không dấu, lọc, giỏ, checkout, admin…)

# Kiểm tra nhanh các route chính
curl -I http://localhost:3000/sitemap.xml
curl -I http://localhost:3000/robots.txt
curl -I http://localhost:3000/san-pham/cap-sac-nhanh-20w-type-c-ho-tro-pd-30
```

---

## 19. Giấy phép & phụ thuộc

MIT — sử dụng cho mục đích học tập.

### Ảnh sản phẩm

Ảnh trong `public/products/`, `public/blog/`, `public/categories/` được lấy từ
**cellphones.com.vn** và dựng lại về kích thước vuông 1000×1000 (JPG, nền trắng)
bằng `sharp` — mỗi sản phẩm có đúng 2 ảnh (`{slug}.jpg` và `{slug}-2.jpg`).

Tên, thương hiệu, thông số kỹ thuật và giá của mỗi sản phẩm đã được đồng bộ
1-1 với ảnh thật tương ứng, nên không có tình trạng "ảnh một đằng, tên một nẻo".

| Lệnh | Tác dụng |
|---|---|
| `npm run images:scrape` | Quét catalog + tải ảnh gốc từ cellphoneS vào `media/catalog/product/` |
| `npm run images:generate` | Sinh ảnh minh họa (chỉ dùng khi thiếu ảnh thật) |
| `npm run images:covers` | Dựng ảnh cover blog (1200×630) và banner danh mục (1200×675) |
| `npm run images:icons` | Sinh `apple-touch-icon.png`, `icon-192.png`, `icon-512.png` |

> ⚠️ Ảnh tải về từ cellphoneS thuộc bản quyền của họ. Với mục đích học tập /
> demo nội bộ thì ổn; nếu đưa lên chạy thật thì nên thay bằng ảnh của chính
> cửa hàng bạn hoặc dùng nguồn ảnh miễn phí (Unsplash/Pexels).
