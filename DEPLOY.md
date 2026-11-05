# ===== HƯỚNG DẪN NHANH: TẠO DB SUPABASE + DEPLOY VERCEL =====

> Đọc file này khi bạn cần làm lại từ đầu.

---

## Phần 1 — Tạo database trên Supabase (5 phút)

1. Mở <https://supabase.com> → **Sign In** (Google/GitHub nhanh nhất) → **New project**.
2. Đặt tên project: `techzone`
   - **Organization**: cá nhân của bạn
   - **Database Password**: bấm **Generate a password** → **Copy** và lưu lại vào note.
     > ⚠️ Mật khẩu này **không hiện lại lần 2**. Lưu kỹ.
   - **Region**: chọn **Singapore** (`ap-southeast-1`) — gần Việt Nam nhất.
   - **Pricing Plan**: **Free**
3. Chờ ~2 phút để project được provision.
4. Vào **Project Settings → Database → Connection string → URI**:
   - Bảng **Session pooler** (port `5432`) → dùng cái này:
     ```
     postgresql://postgres.<project-ref>:<PASSWORD>@aws-0-<region>.pooler.supabase.com:5432/postgres
     ```
   - Bảng **Transaction pooler** (port `6543`) → dùng khi bị "too many connections":
     ```
     postgresql://postgres.<project-ref>:<PASSWORD>@aws-0-<region>.pooler.supabase.com:6543/postgres?pgbouncer=true
     ```
5. **URL-encode mật khẩu** trước khi chèn vào URL:
   | Ký tự | Mã |
   |---|---|
   | `@` | `%40` |
   | `#` | `%23` |
   | `:` | `%3A` |
   | `/` | `%2F` |

6. *(Khuyến nghị)* Vào **Authentication → Policies** → thêm policy cho `anon`:
   ```sql
   CREATE POLICY "Allow public read" ON products FOR SELECT TO anon USING (true);
   ```
   > Chỉ cần nếu bạn muốn đọc bảng `products` từ ngoài. Website này dùng server-side nên **không bắt buộc**.

---

## Phần 2 — Điền `.env.local` rồi chạy thử local

```env
DATABASE_URL=postgresql://postgres.xxxx:<PASSWORD_ENCODED>@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
DATABASE_POOL_MAX=10
NEXT_PUBLIC_SITE_URL=http://localhost:3000
AUTH_SECRET=<dán chuỗi ngẫu nhiên ở dưới>
ADMIN_EMAIL=admin@techzone.vn
ADMIN_PASSWORD=Admin@12345
```

Sinh `AUTH_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Chạy:
```bash
npm run db:check    # phải báo "Driver: PostgreSQL (node-postgres)"
npm run db:push     # tạo bảng
npm run db:seed     # nạp dữ liệu mẫu
npm run db:check    # xác nhận products=38, orders=7, blog_posts=10
npm run dev
```

---

## Phần 3 — Push code lên GitHub

```bash
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main
```

> Nếu repo đã có sẵn commit khác, dùng:
> ```bash
> git remote add origin https://github.com/<user>/<repo>.git
> git fetch origin
> git reset --soft origin/main   # giữ lại code của bạn
> git add -A && git commit -m "TechZone"
> git push -u origin main
> ```

---

## Phần 4 — Deploy lên Vercel

### Cách A — Vercel CLI (nhanh)

```bash
vercel login
vercel link            # chọn project có sẵn hoặc tạo mới
vercel env add DATABASE_URL production
vercel env add DATABASE_POOL_MAX production
vercel env add NEXT_PUBLIC_SITE_URL production
vercel env add AUTH_SECRET production
vercel env add NEXT_PUBLIC_GA_ID production        # optional
vercel env add NEXT_PUBLIC_GTM_ID production       # optional
vercel env add NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION production  # optional
vercel --prod
```

### Cách B — Vercel Dashboard

1. <https://vercel.com/new> → **Import** repository GitHub vừa push.
2. Framework: **Next.js** (tự detect) — Build Command `npm run build`, Output `.next`.
3. **Environment Variables** — thêm:

   | Key | Value | Applies to |
   |---|---|---|
   | `DATABASE_URL` | connection string Supabase | Production + Preview |
   | `DATABASE_POOL_MAX` | `1` | Production |
   | `NEXT_PUBLIC_SITE_URL` | `https://<domain-cua-ban>` | Production |
   | `AUTH_SECRET` | chuỗi ngẫu nhiên | Production |
   | `NEXT_PUBLIC_GA_ID` | `G-XXXXXXX` | Production |
   | `NEXT_PUBLIC_GTM_ID` | `GTM-XXXXXXX` | Production |
   | `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | mã GSC | Production |

4. **Deploy**.

> ⚠️ **Bắt buộc**: `DATABASE_URL` phải có sẵn **lúc build** (Vercel build đọc DB để prerender 38 trang sản phẩm + 10 trang blog).
> Nếu thiếu, build vẫn xong nhưng các trang đó sẽ rỗng.

---

## Phần 5 — Sau khi deploy

1. **Migrate + seed DB production** (chạy từ máy local, trỏ tới cùng DB):
   ```bash
   # DATABASE_URL trong .env.local đã trỏ tới Supabase rồi
   npm run db:push
   npm run db:seed
   ```

2. **Trỏ domain** (nếu có):
   - Vercel → Project → **Settings → Domains** → thêm `techzone.vn` + `www.techzone.vn`
   - Trỏ DNS CNAME theo hướng dẫn của Vercel
   - Cập nhật `NEXT_PUBLIC_SITE_URL` = `https://techzone.vn` → **Redeploy**
     (canonical / sitemap / robots đều dùng biến này)

3. **Google Search Console**:
   - <https://search.google.com/search-console> → Add property → Domain → xác minh bằng DNS hoặc HTML tag
   - Dán mã vào `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` → redeploy
   - **Sitemaps** → submit `https://<domain>/sitemap.xml`

4. **Google Analytics 4**:
   - Admin → Property → Web stream → nhập URL → lấy **Measurement ID** (`G-XXXXXXX`)
   - Set `NEXT_PUBLIC_GA_ID` → redeploy

---

## Xử lý sự cố nhanh

| Triệu chứng | Nguyên nhân | Cách sửa |
|---|---|---|
| Trang sản phẩm rỗng sau khi deploy | `DATABASE_URL` chưa set lúc build | Set env var → Redeploy |
| `self-signed certificate` | SSL | Đã xử lý tự động trong `database/db.ts`; nếu vẫn lỗi → kiểm tra URL có `sslmode=require` không |
| `password authentication failed` | Mật khẩu sai / chưa encode | URL-encode lại mật khẩu |
| `too many connections` | Pool lớn | `DATABASE_POOL_MAX=1` trên Vercel; hoặc dùng Transaction pooler `?pgbouncer=true` |
| `relation "products" does not exist` | Chưa migrate | Chạy `npm run db:push` trỏ tới DB production |
| `ENOTFOUND` | Sai hostname | Copy lại connection string từ Supabase dashboard |
| Admin login không được | `AUTH_SECRET` khác giữa lúc set cookie và verify | Redeploy sau khi set `AUTH_SECRET` |
| 404 tất cả route | Build không có `DATABASE_URL` | Redeploy với env var đầy đủ |
