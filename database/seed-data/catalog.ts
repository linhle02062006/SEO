import type { SpecItem, FaqItem } from "@/types";

export type SeedProduct = {
  name: string;
  slug: string;
  sku: string;
  category: string;
  brand: string;
  price: number;
  salePrice?: number;
  stock: number;
  /**
   * KHÔNG dùng `soldCount` / `ratingAverage` / `ratingCount` ở seed.
   * Số lượt bán và điểm đánh giá chỉ được phản ánh khi có dữ liệu thực tế
   * từ đơn hàng / bảng `product_reviews`. Nếu không có, UI ẩn hoàn toàn
   * thay vì hiển thị số giả.
   */
  badge?: string;
  isFeatured?: boolean;
  shortDescription: string;
  description: string;
  specs: SpecItem[];
  faq?: FaqItem[];
};

export const SEED_BRANDS = [
  {
    name: "Anker",
    slug: "anker",
    description:
      "Anker là thương hiệu sạc và pin dự phòng hàng đầu thế giới, nổi tiếng với công nghệ PowerIQ, MultiProtect và các dòng hub USB-C đa năng.",
    isFeatured: true,
  },
  {
    name: "Baseus",
    slug: "baseus",
    description:
      "Baseus tập trung vào phụ kiện điện thoại thông minh với thiết kế hiện đại, giá tốt và chất lượng ổn định: cáp sạc, củ sạc, sạc dự phòng.",
    isFeatured: true,
  },
  {
    name: "Samsung",
    slug: "samsung",
    description:
      "Samsung là nhà sản xuất phụ kiện chính hãng cho Galaxy, bao gồm củ sạc, ốp lưng và miếng dán bảo vệ màn hình.",
    isFeatured: true,
  },
  {
    name: "Ugreen",
    slug: "ugreen",
    description:
      "Ugreen nổi tiếng với củ sạc GaN, sạc dự phòng không dây Qi2 và hub đa năng, đạt chứng nhận an toàn quốc tế.",
    isFeatured: true,
  },
  {
    name: "Sony",
    slug: "sony",
    description:
      "Sony mang đến tai nghe gaming Inzone với công nghệ 360 Spatial Sound và loa Bluetooth Extra Bass dòng SRS-X.",
    isFeatured: true,
  },
  {
    name: "Asus",
    slug: "asus",
    description:
      "Asus và ROG sở hữu tai nghe không dây ROG Cetra cùng dòng chuột gaming TUF M3 dành cho game thủ nghiêm túc.",
    isFeatured: true,
  },
  {
    name: "Mchose",
    slug: "mchose",
    description:
      "Mchose chuyên sản xuất bàn phím cơ không dây Tri-Mode và chuột gaming với sensor độ phân giải cao, giá cạnh tranh.",
    isFeatured: true,
  },
  {
    name: "Logitech",
    slug: "logitech",
    description:
      "Logitech chuyên chuột không dây im lặng và phụ kiện làm việc, nổi tiếng với độ bền và pin sử dụng lâu.",
    isFeatured: true,
  },
  {
    name: "Dareu",
    slug: "dareu",
    description:
      "Dareu sản xuất tay cầm chơi game đa kết nối với cần analog chính xác, motor rung và pin lithium bền bỉ.",
  },
  {
    name: "Goojodoq",
    slug: "goojodoq",
    description:
      "Goojodoq chuyên giá đỡ điện thoại, giá đỡ iPad và tripod chụp ảnh gọn nhẹ, thiết kế tản nhiệt rỗng thông minh.",
  },
  {
    name: "Xiaomi",
    slug: "xiaomi",
    description:
      "Xiaomi cung cấp pin sạc dự phòng dung lượng lớn với cáp tích hợp, sạc nhanh và đèn LED báo dung lượng.",
  },
  {
    name: "Mipow",
    slug: "mipow",
    description:
      "Mipow nổi tiếng với ốp lưng trong suốt chống sốc, dây cáp bền bỉ và miếng dán kính cường lực full viền.",
  },
  {
    name: "Mophie",
    slug: "mophie",
    description:
      "Mophie là thương hiệu phụ kiện Apple được tin dùng, nổi bật với dòng cáp sạc nhanh công suất lớn và thiết kế bền bỉ.",
  },
  {
    name: "Aukey",
    slug: "aukey",
    description:
      "Aukey nổi tiếp với đế sạc không dây chuẩn Qi2 nam châm từ tính, hỗ trợ sạc nhanh lên tới 25W.",
  },
  {
    name: "Havit",
    slug: "havit",
    description:
      "Havit cung cấp tai nghe True Wireless giá rẻ với chống nước IPX4, thời lượng pin ổn định và micro tích hợp.",
  },
  {
    name: "Cuktech",
    slug: "cuktech",
    description:
      "Cuktech nổi tiếp với dòng pin sạc dự phòng CP series dung lượng 20000mAh, sạc nhanh và cáp USB-C tích hợp.",
  },
  {
    name: "Zagg",
    slug: "zagg",
    description:
      "ZAGG là chuyên gia miếng dán bảo vệ màn hình với dòng InvisibleShield và công nghệ ClearPrint tự xóa vân tay.",
  },
  {
    name: "Zeelot",
    slug: "zeelot",
    description:
      "Zeelot sản xuất miếng dán bảo vệ camera viền kim loại cho iPhone, kết hợp chống xước và chống va đập.",
  },
  {
    name: "Wiwu",
    slug: "wiwu",
    description:
      "Wiwu chuyên phụ kiện xe hơi với giá đỡ điện thoại hút từ trường mạnh, xoay 360 độ và thiết kế gập gọn.",
  },
  {
    name: "Hyperwork",
    slug: "hyperwork",
    description:
      "Hyperwork là thương hiệu đèn bàn LED dùng học tập và làm việc với nhiều nhiệt độ màu, điều chỉnh linh hoạt.",
  },
  {
    name: "S-case",
    slug: "s-case",
    description:
      "S-Case chuyên túi và ốp chống sốc cho laptop với thiết kế gọn nhẹ, bảo vệ tốt trong mọi chuyến đi.",
  },
  {
    name: "Araree",
    slug: "araree",
    description:
      "Araree chuyên ốp lưng trong suốt dòng Core với cấu trúc ốp trong kết hợp khung chống sốc cho iPhone.",
  },
];

export const SEED_CATEGORIES = [
  {
    name: "Ốp lưng",
    slug: "op-lung",
    description:
      "Ốp lưng điện thoại chống sốc, chống trầy xước cho iPhone, Samsung Galaxy và các dòng máy phổ biến.",
    icon: "ShieldCheck",
    position: 1,
    isFeatured: true,
  },
  {
    name: "Cáp sạc",
    slug: "cap-sac",
    description:
      "Cáp sạc nhanh Type-C, Lightning và Micro USB cho điện thoại, máy tính bảng với nhiều mức công suất.",
    icon: "Cable",
    position: 2,
    isFeatured: true,
  },
  {
    name: "Củ sạc",
    slug: "cu-sac",
    description:
      "Củ sạc nhanh, củ sạc GaN, củ sạc không dây chính hãng hỗ trợ sạc nhanh PD, QC.",
    icon: "Plug",
    position: 3,
    isFeatured: true,
  },
  {
    name: "Tai nghe",
    slug: "tai-nghe",
    description:
      "Tai nghe Bluetooth, tai nghe có dây, tai nghe gaming cho điện thoại, laptop và máy tính.",
    icon: "Headphones",
    position: 4,
    isFeatured: true,
  },
  {
    name: "Sạc dự phòng",
    slug: "sac-du-phong",
    description:
      "Pin sạc dự phòng, sạc dự phòng không dây dung lượng lớn dành cho điện thoại và máy tính bảng.",
    icon: "BatteryCharging",
    position: 5,
    isFeatured: true,
  },
  {
    name: "Kính cường lực",
    slug: "kinh-cuong-luc",
    description:
      "Kính cường lực điện thoại chống xước, chống vân tay, full màn hình cho iPhone và Samsung.",
    icon: "ScanLine",
    position: 6,
    isFeatured: true,
  },
  {
    name: "Giá đỡ điện thoại",
    slug: "gia-do-dien-thoai",
    description:
      "Giá đỡ điện thoại để bàn, kẹp xe, tripod chân linh cho livestream, học tập và xem phim.",
    icon: "Smartphone",
    position: 7,
    isFeatured: true,
  },
  {
    name: "Phụ kiện laptop",
    slug: "phu-kien-laptop",
    description:
      "Phụ kiện laptop: cổng mở rộng, hub USB-C, sạc, túi chống sốc, chuột và bàn phím.",
    icon: "Laptop",
    position: 8,
    isFeatured: true,
  },
  {
    name: "Phụ kiện gaming",
    slug: "phu-kien-gaming",
    description:
      "Phụ kiện gaming: tai nghe chơi game, chuột, bàn phím cơ, tay cầm và đèn LED cho góc gaming.",
    icon: "Gamepad2",
    position: 9,
    isFeatured: true,
  },
];
