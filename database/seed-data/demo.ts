/**
 * Dữ liệu demo cho dashboard quản trị.
 *
 * VÌ SAO CẦN FILE NÀY:
 * Dashboard mặc định lọc theo "Tháng này" / "7 ngày gần nhất". Nếu dữ liệu demo
 * được ghim một ngày cố định (ví dụ 2025-01-10) thì sau vài tuần dashboard sẽ
 * hiện toàn số 0 (doanh thu 0 ₫, 0 khách hàng, biểu đồ trống) -> trông như
 * app bị lỗi dù thực ra chỉ là dữ liệu cũ.
 *
 * Vì vậy mọi mốc thời gian ở đây được tính TƯƠNG ĐỐI so với thời điểm chạy
 * seed (`daysAgo`), nhờ vậy dashboard luôn có số liệu thực tế.
 *
 * Dùng chung cho:
 *   - `scripts/seed.ts`        (seed đầy đủ bằng Drizzle)
 *   - `database/db.ts`         (tự phục hồi PGlite khi data dir bị hỏng/trống)
 */

/* ------------------------------------------------------------------ */
/* Khách hàng demo                                                     */
/* ------------------------------------------------------------------ */

export type DemoCustomer = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  district: string;
};

export const DEMO_CUSTOMERS: DemoCustomer[] = [
  {
    fullName: "Nguyễn Minh Anh",
    phone: "0901234567",
    email: "minhanh@example.com",
    address: "123 Lê Lợi",
    city: "TP. Hồ Chí Minh",
    district: "Quận 1",
  },
  {
    fullName: "Trần Thị Bình",
    phone: "0912345678",
    email: "binh.tran@example.com",
    address: "45 Nguyễn Huệ",
    city: "TP. Hồ Chí Minh",
    district: "Quận 1",
  },
  {
    fullName: "Lê Hoàng Cường",
    phone: "0934567890",
    email: "cuong.le@example.com",
    address: "78 Hai Bà Trưng",
    city: "TP. Hồ Chí Minh",
    district: "Quận 1",
  },
  {
    fullName: "Phạm Thu Hà",
    phone: "0987654321",
    email: "ha.pham@example.com",
    address: "12 Nguyễn Thị Minh Khai",
    city: "TP. Hồ Chí Minh",
    district: "Quận 3",
  },
  {
    fullName: "Võ Đức Thắng",
    phone: "0968887766",
    email: "thang.vo@example.com",
    address: "200 Võ Văn Tần",
    city: "TP. Hồ Chí Minh",
    district: "Quận 3",
  },
];

/* ------------------------------------------------------------------ */
/* Đơn hàng demo                                                       */
/* ------------------------------------------------------------------ */

export type DemoOrderStatus =
  | "pending"
  | "confirmed"
  | "shipping"
  | "delivered"
  | "cancelled";

export type DemoOrder = {
  /** Mã đơn cố định để seed idempotent (không trùng khi chạy lại). */
  orderCode: string;
  /** Vị trí trong DEMO_CUSTOMERS. */
  customerIndex: number;
  /** Slug sản phẩm (khớp với `SEED_PRODUCTS`). */
  productSlug: string;
  quantity: number;
  status: DemoOrderStatus;
  paymentMethod: "cod" | "bank_transfer";
  paymentStatus: "paid" | "unpaid";
  /** Số ngày trước hôm nay (0 = hôm nay). */
  daysAgo: number;
};

/**
 * 7 đơn hàng demo trải đều trong ~45 ngày gần nhất.
 * `daysAgo` nhỏ nhất = 1 ngày -> luôn nằm trong "Tháng này" và "7 ngày gần nhất"
 * khi seed được chạy, nên dashboard không bao giờ hiện số 0.
 */
export const DEMO_ORDERS: DemoOrder[] = [
  {
    orderCode: "TZ-DEMO-1001",
    customerIndex: 0,
    productSlug: "loa-bluetooth-sony-srs-xb100-extra-bass",
    quantity: 1,
    status: "pending",
    paymentMethod: "cod",
    paymentStatus: "unpaid",
    daysAgo: 1,
  },
  {
    orderCode: "TZ-DEMO-1002",
    customerIndex: 1,
    productSlug: "cu-sac-anker-20w-1c1a-kem-cap-type-c",
    quantity: 2,
    status: "confirmed",
    paymentMethod: "bank_transfer",
    paymentStatus: "paid",
    daysAgo: 2,
  },
  {
    orderCode: "TZ-DEMO-1003",
    customerIndex: 2,
    productSlug: "cap-baseus-dura-usb-c-to-lightning-20w-1m",
    quantity: 3,
    status: "shipping",
    paymentMethod: "cod",
    paymentStatus: "unpaid",
    daysAgo: 3,
  },
  {
    orderCode: "TZ-DEMO-1004",
    customerIndex: 3,
    productSlug: "pin-sac-du-phong-xiaomi-10000mah-22-5w",
    quantity: 1,
    status: "delivered",
    paymentMethod: "cod",
    paymentStatus: "paid",
    daysAgo: 8,
  },
  {
    orderCode: "TZ-DEMO-1005",
    customerIndex: 4,
    productSlug: "tui-chong-soc-laptop-s-case-classic-15-6-inch",
    quantity: 2,
    status: "delivered",
    paymentMethod: "cod",
    paymentStatus: "unpaid",
    daysAgo: 15,
  },
  {
    orderCode: "TZ-DEMO-1006",
    customerIndex: 0,
    productSlug: "chuot-gaming-co-day-asus-tuf-m3-gen-2",
    quantity: 1,
    status: "delivered",
    paymentMethod: "bank_transfer",
    paymentStatus: "paid",
    daysAgo: 24,
  },
  {
    orderCode: "TZ-DEMO-1007",
    customerIndex: 2,
    productSlug: "dan-kinh-cuong-luc-mipow-full-vien-iphone-17-18-pro-max",
    quantity: 1,
    status: "cancelled",
    paymentMethod: "cod",
    paymentStatus: "unpaid",
    daysAgo: 32,
  },
];

/** Ngày giờ (cục bộ) cách `daysAgo` ngày so với hiện tại. */
export function daysAgoDate(daysAgo: number, hour = 10, minute = 30): Date {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, minute, 0, 0);
  return d;
}

/* ------------------------------------------------------------------ */
/* Sự kiện analytics demo (lưu lượng khách hàng)                      */
/* ------------------------------------------------------------------ */

/** Tiền tố session id để nhận biết & xoá sạch dữ liệu demo. */
export const DEMO_SESSION_PREFIX = "demo-";

export type DemoEventType =
  | "page_view"
  | "view_item"
  | "search"
  | "add_to_cart"
  | "begin_checkout"
  | "purchase";

export type DemoEvent = {
  type: DemoEventType;
  path: string;
  label: string | null;
  /** Slug sản phẩm (dùng cho `view_item` / `add_to_cart` / `purchase`). */
  productSlug?: string;
  value: number;
  sessionId: string;
  createdAt: Date;
};

/** Các từ khóa tìm kiếm phổ biến để biểu đồ "tìm kiếm" có dữ liệu. */
const DEMO_SEARCHES = [
  "sạc dự phòng",
  "cáp type c",
  "ốp lưng iphone",
  "tai nghe bluetooth",
  "củ sạc nhanh",
  "kính cường lực",
  "bàn phím cơ",
  "giá đỡ điện thoại",
];

/**
 * Sinh lưu lượng khách hàng demo cho 30 ngày gần nhất.
 *
 * - `page_view` ~ 14 lượt/ngày
 * - `view_item` ~ 6 lượt/ngày
 * - `search` ~ 3 lượt/ngày
 * - `add_to_cart` ~ 2 lượt/ngày
 * - `begin_checkout` ~ 1 lượt/ngày
 * - `purchase` ~ 1 lượt/ngày
 *
 * `label` của `view_item` là TÊN sản phẩm (không phải slug) để khớp với
 * dữ liệu ghi thật từ `ViewItemTracker` — nhờ vậy bảng "Sản phẩm được xem
 * nhiều" hiển thị đúng tên hàng thay vì chuỗi slug.
 */
export function buildDemoEvents(
  products: Array<{ slug: string; name: string }>,
  days = 30,
): DemoEvent[] {
  const events: DemoEvent[] = [];

  // Bộ "ngẫu nhiên" có thể lặp lại (deterministic) để seed chạy lại cho kết quả giống nhau.
  let seed = 20250101;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length) % arr.length];

  for (let d = days - 1; d >= 0; d--) {
    const session = `${DEMO_SESSION_PREFIX}${d}-${Math.floor(rand() * 1000)}`;

    for (let i = 0; i < 14; i++) {
      events.push({
        type: "page_view",
        path: pick([
          "/",
          "/san-pham",
          "/danh-muc/cap-sac",
          "/danh-muc/sac-du-phong",
          "/blog",
          "/tim-kiem?q=sac",
        ]),
        label: null,
        value: 0,
        sessionId: session,
        createdAt: daysAgoDate(d, 8 + (i % 12), (i * 7) % 60),
      });
    }

    for (let i = 0; i < 6; i++) {
      const product = pick(products);
      events.push({
        type: "view_item",
        path: `/san-pham/${product.slug}`,
        label: product.name,
        productSlug: product.slug,
        value: 0,
        sessionId: session,
        createdAt: daysAgoDate(d, 9 + (i % 10), (i * 11) % 60),
      });
    }

    for (let i = 0; i < 3; i++) {
      const q = pick(DEMO_SEARCHES);
      events.push({
        type: "search",
        path: `/tim-kiem?q=${encodeURIComponent(q)}`,
        label: q,
        value: 0,
        sessionId: session,
        createdAt: daysAgoDate(d, 10 + (i % 8), (i * 13) % 60),
      });
    }

    for (let i = 0; i < 2; i++) {
      const product = pick(products);
      events.push({
        type: "add_to_cart",
        path: `/san-pham/${product.slug}`,
        label: product.name,
        productSlug: product.slug,
        value: 1,
        sessionId: session,
        createdAt: daysAgoDate(d, 11 + (i % 7), (i * 17) % 60),
      });
    }

    events.push({
      type: "begin_checkout",
      path: "/dat-hang",
      label: null,
      value: 0,
      sessionId: session,
      createdAt: daysAgoDate(d, 12, 5),
    });

    const bought = pick(products);
    events.push({
      type: "purchase",
      path: "/dat-hang/thanh-cong",
      label: bought.name,
      productSlug: bought.slug,
      value: Math.round((100000 + rand() * 2500000) / 1000) * 1000,
      sessionId: session,
      createdAt: daysAgoDate(d, 13, 15),
    });
  }

  return events;
}
