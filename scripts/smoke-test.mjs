import fs from "node:fs";

const BASE = "http://localhost:3000";
const results = [];
const ok = (name, cond, extra = "") =>
  results.push({ name, pass: !!cond, extra });

async function text(url) {
  const r = await fetch(BASE + url);
  return { status: r.status, body: await r.text() };
}

/* 1. Tìm kiếm không dấu ("sac" phải ra "Sạc Anker") */
{
  const { status, body } = await text("/tim-kiem?q=sac");
  const hasAnker = /Sạc Anker/i.test(body);
  ok("search 'sac' (không dấu) trả về sản phẩm có dấu", status === 200 && hasAnker);
}
/* 2. Tìm kiếm có dấu */
{
  const { status, body } = await text("/tim-kiem?q=sạc");
  ok("search 'sạc' (có dấu)", status === 200 && /Sạc Anker/i.test(body));
}
/* 3. Gợi ý tìm kiếm API */
{
  const r = await fetch(BASE + "/api/products/suggest?q=tai");
  const j = await r.json();
  ok("API gợi ý tìm kiếm", r.status === 200 && j.ok && Array.isArray(j.data) && j.data.length > 0, `${j.data?.length} gợi ý`);
}
/* 4. Tìm kiếm API không dấu */
{
  const r = await fetch(BASE + "/api/products/suggest?q=cap");
  const j = await r.json();
  ok("API gợi ý không dấu ('cap')", r.status === 200 && j.data.length > 0, `${j.data?.length} gợi ý`);
}
/* 5. Danh mục lọc theo brand */
{
  const { status, body } = await text("/san-pham?thuong-hieu=anker");
  ok("Lọc theo thương hiệu", status === 200 && /Anker/i.test(body));
}
/* 6. Lọc theo danh mục */
{
  const { status, body } = await text("/danh-muc/op-lung");
  const count = (body.match(/Thêm vào giỏ/g) || []).length;
  ok("Trang danh mục có sản phẩm", status === 200 && count > 0, `${count} sản phẩm`);
}
/* 7. Sắp xếp */
{
  const { status, body } = await text("/san-pham?sort=price-asc");
  ok("Sắp xếp giá tăng dần", status === 200 && body.length > 5000);
}
/* 8. Giỏ hàng */
{
  const { status, body } = await text("/gio-hang");
  ok("Trang giỏ hàng", status === 200 && /Giỏ hàng/i.test(body));
}
/* 9. Đặt hàng */
{
  const { status, body } = await text("/dat-hang");
  ok("Trang đặt hàng", status === 200 && /Thông tin/i.test(body));
}
/* 10. Liên hệ + form API */
{
  const r = await fetch(BASE + "/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      fullName: "Kiểm thử tự động",
      email: "test@example.com",
      phone: "0900000000",
      subject: "Kiểm tra",
      content: "Nội dung kiểm thử tự động để xác nhận form hoạt động.",
    }),
  });
  const j = await r.json().catch(() => ({}));
  const okBody = j.ok === true;
  const failBody =
    j.ok === false &&
    j.message === "Không thể gửi yêu cầu lúc này. Vui lòng thử lại sau.";
  if (okBody) {
    ok(
      "API gửi liên hệ (SMTP đã cấu hình)",
      r.status === 200 &&
        j.message === "Cảm ơn bạn! Yêu cầu tư vấn đã được gửi thành công.",
      JSON.stringify(j).slice(0, 120),
    );
  } else {
    // Chưa cấu hình SMTP -> phải báo thất bại, KHÔNG được báo "gửi thành công".
    ok(
      "API gửi liên hệ (chưa cấu hình SMTP -> báo lỗi đúng)",
      r.status >= 500 && failBody,
      JSON.stringify(j).slice(0, 120),
    );
  }
}
/* 11. Ghi sự kiện tracking (POST) */
{
  const r = await fetch(BASE + "/api/track", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ type: "page_view", path: "/", value: 0 }),
  });
  const j = await r.json().catch(() => ({}));
  ok("API ghi sự kiện tracking", r.status === 200 && j.ok === true, `status ${r.status}`);
}
/* 12. Trang 404 */
{
  const { status } = await text("/khong-ton-tai-abcxyz");
  ok("Trang 404 trả về 404", status === 404, `status ${status}`);
}
/* 13. Admin login page */
{
  const { status, body } = await text("/admin/dang-nhap");
  ok("Trang đăng nhập admin", status === 200 && /password/i.test(body));
}
/* 14. Sitemap & robots */
{
  const s = await text("/sitemap.xml");
  const r = await text("/robots.txt");
  ok("sitemap.xml + robots.txt", s.status === 200 && s.body.includes("<urlset") && r.status === 200);
}
/* 15. Blog + chính sách */
{
  const b = await text("/blog");
  const c = await text("/chinh-sach/chinh-sach-bao-hanh");
  ok("Trang blog + chính sách", b.status === 200 && c.status === 200);
}
/* 16. Trang thương hiệu */
{
  const { status, body } = await text("/thuong-hieu/anker");
  ok("Trang thương hiệu", status === 200 && /Anker/i.test(body));
}
/* 17. OG image / manifest */
{
  const m = await fetch(BASE + "/manifest.webmanifest");
  ok("manifest.webmanifest", m.status === 200);
}
/* 18. Icons */
{
  const paths = ["/apple-touch-icon.png", "/icon-192.png", "/icon-512.png", "/logo.svg", "/og-default.jpg"];
  let good = 0;
  for (const p of paths) if ((await fetch(BASE + p)).status === 200) good++;
  ok("PWA icons + logo + og image", good === paths.length, `${good}/${paths.length}`);
}

let fail = 0;
for (const r of results) {
  console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name}${r.extra ? "  (" + r.extra + ")" : ""}`);
  if (!r.pass) fail++;
}
console.log(`\n${results.length - fail}/${results.length} passed`);
process.exit(fail ? 1 : 0);
