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
  soldCount?: number;
  ratingAverage?: number;
  ratingCount?: number;
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
      "Anker là thương hiệu sạc và pin dự phòng hàng đầu thế giới, nổi tiếng với công nghệ PowerIQ và PowerCore.",
    isFeatured: true,
  },
  {
    name: "Baseus",
    slug: "baseus",
    description:
      "Baseus tập trung vào phụ kiện điện thoại thông minh với thiết kế hiện đại, giá tốt và chất lượng ổn định.",
    isFeatured: true,
  },
  {
    name: "Samsung",
    slug: "samsung",
    description:
      "Samsung là nhà sản xuất phụ kiện chính hãng cho Galaxy, bao gồm củ sạc, cáp sạc và sạc dự phòng.",
    isFeatured: true,
  },
  {
    name: "Apple",
    slug: "apple",
    description:
      "Apple cung cấp phụ kiện chính hãng cho iPhone và iPad: cáp, củ sạc, tai nghe và sạc dự phòng.",
    isFeatured: true,
  },
  {
    name: "Ugreen",
    slug: "ugreen",
    description:
      "Ugreen nổi tiếng với cáp sạc, củ sạc GaN và hub đa năng, đạt chứng nhận an toàn quốc tế.",
    isFeatured: true,
  },
  {
    name: "Logitech",
    slug: "logitech",
    description:
      "Logitech chuyên tai nghe, bàn phím và chuột cho làm việc lẫn gaming.",
  },
  {
    name: "Razer",
    slug: "razer",
    description:
      "Razer là thương hiệu phụ kiện gaming được game thủ tin dùng: tai nghe, chuột, bàn phím cơ.",
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
