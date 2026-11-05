import type { SeedProduct } from "./catalog";

/**
 * Danh mục sản phẩm TechZone.
 *
 * Tên, thương hiệu, thông số và giá đều được đồng bộ 1-1 với ảnh sản phẩm
 * thật lấy từ cellphoneS.com.vn (xem `scripts/scrape-cps-images.ts` và
 * `scripts/scrape-cps-specs.ts`). Mỗi slug có đúng 2 ảnh:
 *   public/products/{slug}.jpg và public/products/{slug}-2.jpg
 */
export const SEED_PRODUCTS: SeedProduct[] = [
  /* ---------------------------- ỐP LƯNG ---------------------------- */
  {
    name: "Ốp lưng iPhone 15 Plus Mipow Soft trong suốt",
    slug: "op-lung-iphone-15-plus-mipow-soft-trong-suat",
    sku: "TZ-OPL-001",
    category: "op-lung",
    brand: "mipow",
    price: 250000,
    salePrice: 225000,
    stock: 120,
    isFeatured: true,
    shortDescription:
      "Ốp lưng Mipow Soft trong suốt cho iPhone 15 Plus/14 Plus, chống sốc, chống trầy xước.",
    description:
      "Ốp lưng Mipow Soft mang thiết kế trong suốt dạng ốp trong, ôm sát thân máy mà vẫn thời trang. Lớp silicon dẻo kết hợp khung chống sốc giúp hấp thụ va đậm và chống trầy xước cho mặt lưng iPhone 15 Plus/14 Plus. Dễ tháo lắp, không để lại vết bám.",
    specs: [
      { label: "Dòng sản phẩm", value: "iPhone 15 Plus" },
      { label: "Phân loại ốp", value: "Chống sốc, Ốp trong, Ốp dẻo" },
      { label: "Tính năng", value: "Chống sốc, va đập, Chống trầy xước" },
      { label: "Dùng được cho", value: "iPhone 15 Plus / 14 Plus" },
      { label: "Hãng sản xuất", value: "Mipow" },
    ],
    faq: [
      {
        question: "Ốp lưng có làm mất khả năng sạc không dây không?",
        answer:
          "Không. Thiết kế ốp trong mỏng của Mipow Soft không che vùng cuộn sạc nên iPhone vẫn sạc không dây bình thường.",
      },
      {
        question: "Ốp có bị ố vàng sau thời gian sử dụng không?",
        answer:
          "Vật liệu silicon trong suốt có độ bền màu cao. Chỉ cần lau nhẹ bằng khăn ẩm là ốp sạch trở lại như mới.",
      },
    ],
  },
  {
    name: "Ốp lưng silicon Samsung Galaxy S25 Plus chính hãng",
    slug: "op-lung-silicon-samsung-galaxy-s25-plus",
    sku: "TZ-OPL-002",
    category: "op-lung",
    brand: "samsung",
    price: 250000,
    salePrice: 129000,
    stock: 95,
    isFeatured: true,
    shortDescription:
      "Ốp lưng silicon chính hãng Samsung cho Galaxy S25 Plus, mỏng nhẹ, ôm sát và bền bỉ.",
    description:
      "Ốp lưng silicon chính hãng của Samsung dành riêng cho Galaxy S25 Plus với bề mặt mịn màng, chống trầy xước và chống bám vân tay. Các nút cắt chính xác giúp thao tác dễ dàng, phần viền ôm sát thân máy mà vẫn tháo lắp nhanh chóng.",
    specs: [
      { label: "Dùng được cho", value: "Samsung Galaxy S25 Plus" },
      { label: "Dòng sản phẩm", value: "Samsung Galaxy S25 Plus" },
      { label: "Chất liệu", value: "Silicone mềm" },
      { label: "Tính năng", value: "Chống trầy xước, chống bám vân tay" },
      { label: "Hãng sản xuất", value: "Samsung Chính hãng" },
    ],
  },
  {
    name: "Ốp lưng iPhone 13 Pro Araree Core Nukin Clear trong suốt",
    slug: "op-lung-araree-core-nukin-iphone-13-pro",
    sku: "TZ-OPL-003",
    category: "op-lung",
    brand: "araree",
    price: 190000,
    salePrice: 129000,
    stock: 140,
    shortDescription:
      "Ốp lưng Araree Core Nukin Clear trong suốt cho iPhone 13 Pro, chống sốc va đập và chống trầy xước.",
    description:
      "Araree Core Nukin Clear là ốp lưng trong suốt dành riêng cho iPhone 13 Pro với cấu trúc ốp trong kết hợp khung chống sốc. Lớp vỏ dẻo hấp thụ va đậm tốt, mặt lưng trong suốt giúp thấy rõ màu sắc nguyên bản của máy mà vẫn chống trầy xước hiệu quả.",
    specs: [
      { label: "Dòng sản phẩm", value: "iPhone 13 Pro" },
      { label: "Phân loại ốp", value: "Chống sốc, Ốp trong" },
      { label: "Tính năng", value: "Chống sốc, va đập, Chống trầy xước" },
      { label: "Dùng được cho", value: "iPhone 13 Pro" },
      { label: "Hãng sản xuất", value: "Araree" },
    ],
  },
  {
    name: "Ốp lưng silicon Samsung Galaxy A35 2024",
    slug: "op-lung-silicon-samsung-galaxy-a35",
    sku: "TZ-OPL-004",
    category: "op-lung",
    brand: "samsung",
    price: 183000,
    salePrice: 110000,
    stock: 70,
    shortDescription:
      "Ốp lưng silicon chính hãng Samsung Galaxy A35 2024, chống sốc, chống trầy xước, mỏng nhẹ.",
    description:
      "Ốp lưng silicon chính hãng dành cho Samsung Galaxy A35 2024 với bề mặt dẻo mềm, ôm sát thân máy và chống trầy xước tốt. Kích thước chuẩn 82.5 x 166.2 x 11.1mm đảm bảo các nút cắt khớp chính xác và bảo vệ tốt cả cụm camera.",
    specs: [
      { label: "Kích thước", value: "82.5 x 166.2 x 11.1 mm" },
      { label: "Dòng sản phẩm", value: "Galaxy A35" },
      { label: "Phân loại ốp", value: "Chống sốc, Ốp dẻo" },
      { label: "Tính năng", value: "Chống sốc, va đập, Chống trầy xước" },
      { label: "Hãng sản xuất", value: "Samsung Chính hãng" },
    ],
  },

  /* ---------------------------- CÁP SẠC ---------------------------- */
  {
    name: "Cáp Baseus Dura Series USB-C to Lightning 20W dài 1m",
    slug: "cap-baseus-dura-usb-c-to-lightning-20w-1m",
    sku: "TZ-CAP-001",
    category: "cap-sac",
    brand: "baseus",
    price: 140000,
    salePrice: 110000,
    stock: 250,
    isFeatured: true,
    shortDescription:
      "Cáp Baseus Dura Series USB-C to Lightning hỗ trợ sạc nhanh 20W, dài 1m, truyền dữ liệu 480Mbps.",
    description:
      "Cáp Baseus Dura Series kết hợp chip E-Marker đảm bảo sạc nhanh 20W an toàn và ổn định. Lõi 4 sợi giúp truyền dữ liệu tốc độ 480Mbps, lớp vỏ chịu được hơn 10.000 lần uốn cong nên bền bỉ theo thời gian. Chiều dài 1m vừa đủ dùng trong túi hoặc trên bàn làm việc.",
    specs: [
      { label: "Công suất sạc", value: "20W" },
      { label: "Sử dụng tối đa", value: "1 thiết bị" },
      { label: "Đầu vào", value: "USB-C" },
      { label: "Đầu ra", value: "Lightning" },
      { label: "Tiện ích", value: "Sạc nhanh, truyền dữ liệu 480Mbps, chip E-Marker, chịu hơn 10.000 lần uốn cong" },
      { label: "Chiều dài dây", value: "1 mét" },
      { label: "Hãng sản xuất", value: "Baseus" },
    ],
    faq: [
      {
        question: "Cáp sạc nhanh 20W có sạc được iPhone không?",
        answer:
          "Có. Khi dùng kèm củ sạc PD 20W trở lên, iPhone 12 trở lên sẽ nhận mức sạc nhanh tối đa 20W.",
      },
      {
        question: "Cáp có truyền dữ liệu được không?",
        answer:
          "Có. Cáp hỗ trợ truyền dữ liệu tốc độ 480Mbps, đồng bộ ảnh, video và sao lưu iCloud ổn định.",
      },
    ],
  },
  {
    name: "Cáp Mophie USB-C to USB-C 100W dài 3m",
    slug: "cap-mophie-usb-c-to-usb-c-100w-3m",
    sku: "TZ-CAP-002",
    category: "cap-sac",
    brand: "mophie",
    price: 690000,
    salePrice: 490000,
    stock: 160,
    isFeatured: true,
    shortDescription:
      "Cáp Mophie USB-C to USB-C 100W dài 3m, sạc nhanh laptop và điện thoại, thiết kế chống rối.",
    description:
      "Cáp Mophie USB-C to USB-C công suất 100W là lựa chọn cho laptop, máy tính bảng và điện thoại trong một sợi dây duy nhất. Chiều dài 3m cho phép sạc từ xa ổn định, thiết kế chống rối giúp cáp giữ nguyên hình dạng sau nhiều lần cuộn vào túi.",
    specs: [
      { label: "Công suất sạc", value: "100W" },
      { label: "Sử dụng tối đa", value: "1 thiết bị" },
      { label: "Đầu vào", value: "USB-C" },
      { label: "Đầu ra", value: "USB-C" },
      { label: "Tiện ích", value: "Hỗ trợ sạc nhanh, Chống rối" },
      { label: "Chiều dài dây", value: "3 mét" },
      { label: "Hãng sản xuất", value: "Mophie" },
    ],
  },
  {
    name: "Cáp Baseus Crystal Shine USB-C to Lightning 1.2M chuẩn MFI",
    slug: "cap-baseus-crystal-shine-usb-c-lightning-1-2m",
    sku: "TZ-CAP-003",
    category: "cap-sac",
    brand: "baseus",
    price: 160000,
    salePrice: 130000,
    stock: 85,
    shortDescription:
      "Cáp Baseus Crystal Shine USB-C to Lightning 1.2M đạt chuẩn MFI, sạc nhanh 20W và truyền dữ liệu 480Mbps.",
    description:
      "Cáp Baseus Crystal Shine đạt chứng nhận MFI nên tương thích an toàn với toàn bộ thiết bị iOS. Công suất sạc 20W giúp iPhone 12 trở lên sạc nhanh, tốc độ truyền tải dữ liệu 480Mbps cho phép đồng bộ nội dung ổn định. Bề mặt trong suốt lấp lánh, dễ lau chùi.",
    specs: [
      { label: "Công suất sạc", value: "20W" },
      { label: "Công nghệ/Đạt chứng nhận", value: "MFI" },
      { label: "Chiều dài dây", value: "1.2m" },
      { label: "Tiện ích", value: "Tốc độ truyền tải dữ liệu lên đến 480Mbps" },
      { label: "Hãng sản xuất", value: "Baseus" },
    ],
  },
  {
    name: "Cáp Baseus Bright Mirror 2 Series rút gọn 3-in-1 1.1m",
    slug: "cap-baseus-bright-mirror-2-retractable-3-in-1",
    sku: "TZ-CAP-004",
    category: "cap-sac",
    brand: "baseus",
    price: 269000,
    salePrice: 190000,
    stock: 110,
    shortDescription:
      "Cáp Baseus Bright Mirror 2 Series 3-in-1 USB-A sang Type-C, Lightning, Micro USB, dây rút gọn 1.1m.",
    description:
      "Cáp Baseus Bright Mirror 2 Series tích hợp ba đầu nối Type-C, Lightning và Micro USB trong một dây USB-A, giúp bạn chỉ cần mang theo một bộ sạc cho mọi thiết bị. Cơ chế rút gọn giúp dây cuộn gọn gàng chống rối, phần đầu nối bọc silicon chịu va đập tốt.",
    specs: [
      { label: "Sử dụng tối đa", value: "3 thiết bị" },
      { label: "Đầu vào", value: "USB-A" },
      { label: "Đầu ra", value: "Type-C, Micro USB và Lightning" },
      { label: "Tiện ích", value: "Hạn chế rối dây, siêu bền, truyền tải dữ liệu 480Mbps" },
      { label: "Chiều dài dây", value: "1.1 mét" },
      { label: "Hãng sản xuất", value: "Baseus" },
    ],
  },

  /* ---------------------------- CỦ SẠC ---------------------------- */
  {
    name: "Sạc Anker 1C1A 20W kèm cáp Type-C to C dài 1.5m B2348",
    slug: "cu-sac-anker-20w-1c1a-kem-cap-type-c",
    sku: "TZ-CUS-001",
    category: "cu-sac",
    brand: "anker",
    price: 350000,
    salePrice: 260000,
    stock: 200,
    isFeatured: true,
    shortDescription:
      "Sạc Anker 1C1A 20W kèm cáp Type-C to C 1.5m, sạc nhanh cho tối đa 2 thiết bị, bảo vệ MultiProtect.",
    description:
      "Sạc Anker B2348 trang bị 1 cổng USB-C và 1 cổng USB-A cho phép sạc đồng thời 2 thiết bị với tổng công suất 20W. Công nghệ MultiProtect và PowerIQ 3.0 tự nhận diện thiết bị, điều chỉnh dòng sạc phù hợp và bảo vệ an toàn trước quá nhiệt, quá dòng, quá tải. Trong hộp có sẵn cáp Type-C to C dài 1.5m.",
    specs: [
      { label: "Công suất sạc", value: "20W" },
      { label: "Sử dụng tối đa", value: "2 thiết bị" },
      { label: "Đầu vào", value: "Cáp sạc: Type-C" },
      { label: "Đầu ra", value: "Củ sạc: USB-A, USB-C; Cáp sạc: Type-C" },
      { label: "Công nghệ/Đạt chứng nhận", value: "MultiProtect, PowerIQ 3.0" },
      { label: "Chiều dài dây", value: "1.5 mét" },
      { label: "Hãng sản xuất", value: "Anker" },
    ],
    faq: [
      {
        question: "Củ sạc 20W có sạc nhanh cho iPhone không?",
        answer:
          "Có. iPhone 12 trở lên nhận tối đa 20W khi dùng củ sạc này cùng cáp Lightning hoặc cáp Type-C hỗ trợ PD.",
      },
      {
        question: "Củ sạc có an toàn cho pin không?",
        answer:
          "Có. Chip quản lý nguồn MultiProtect bảo vệ quá nhiệt, quá dòng và quá tải trong suốt quá trình sạc.",
      },
    ],
  },
  {
    name: "Sạc Ugreen Robot Uno GaN 65W 2C1A",
    slug: "cu-sac-ugreen-robot-uno-gan-65w-2c1a",
    sku: "TZ-CUS-002",
    category: "cu-sac",
    brand: "ugreen",
    price: 900000,
    salePrice: 465000,
    stock: 90,
    isFeatured: true,
    shortDescription:
      "Sạc Ugreen Robot Uno GaN 65W, 2 cổng USB-C và 1 USB-A, màn hình LED robot hiển thị trạng thái sạc.",
    description:
      "Sạc Ugreen Robot Uno sử dụng công nghệ GaNFast giúp giảm nhiệt, tiết kiệm năng lượng và thiết kế nhỏ gọn. Với 2 cổng USB-C và 1 cổng USB-A, bạn có thể sạc MacBook, iPad và điện thoại cùng lúc. Mặt robot là màn hình LED hiển thị biểu thức trạng thái sạc, kèm bảo vệ ngắn mạch, quá tải, nhiệt độ và quá điện áp.",
    specs: [
      { label: "Công suất sạc", value: "65W" },
      { label: "Sử dụng tối đa", value: "3 thiết bị" },
      { label: "Đầu ra", value: "2 x USB-C, 1 x USB-A" },
      { label: "Tiện ích", value: "Sạc nhanh, công nghệ GaNFast, màn hình LED robot, bảo vệ ngắn mạch/quá tải/quá nhiệt/quá điện áp" },
      { label: "Hãng sản xuất", value: "Ugreen" },
    ],
  },
  {
    name: "Đế sạc không dây Aukey Magfusion 1X Qi2.2 25W",
    slug: "cu-sac-khong-day-aukey-magfusion-qi2-25w",
    sku: "TZ-CUS-003",
    category: "cu-sac",
    brand: "aukey",
    price: 990000,
    salePrice: 690000,
    stock: 60,
    shortDescription:
      "Đế sạc không dây Aukey Magfusion 1X chuẩn Qi2.2 25W, tích hợp nam châm, điều chỉnh góc 35°.",
    description:
      "Đế sạc không dây Aukey Magfusion 1X đạt chuẩn Qi2.2 với công suất 25W, sử dụng nam châm từ tính mạnh để giữ điện thoại đúng vị trí sạc. Bản lề cho phép điều chỉnh góc nhìn đến 35° nên vừa sạc vừa xem video, đầu vào USB-C cho phép dùng chung với củ sạc của bạn.",
    specs: [
      { label: "Công suất sạc", value: "25W" },
      { label: "Sử dụng tối đa", value: "1 thiết bị" },
      { label: "Đầu vào", value: "USB-C" },
      { label: "Tiện ích", value: "Đế sạc tích hợp nam châm mạnh mẽ, điều chỉnh góc nhìn đến 35°" },
      { label: "Công nghệ/Đạt chứng nhận", value: "Công nghệ Qi2" },
      { label: "Hãng sản xuất", value: "Aukey" },
    ],
  },
  {
    name: "Củ sạc nhanh Samsung 25W EP-T2510NBEGWW",
    slug: "cu-sac-samsung-25w-ep-t2510nbegww",
    sku: "TZ-CUS-004",
    category: "cu-sac",
    brand: "samsung",
    price: 380000,
    salePrice: 310000,
    stock: 75,
    shortDescription:
      "Củ sạc nhanh Samsung 25W công nghệ GaN, hỗ trợ PD 3.0 và PPS, bảo vệ đa lớp.",
    description:
      "Củ sạc nhanh Samsung 25W (EP-T2510NBEGWW) ứng dụng công nghệ GaN giúp thân củ gọn nhẹ và tản nhiệt tốt. Hỗ trợ chuẩn PD 3.0 kèm PPS nên tương thích với nhiều thiết bị, kèm bảo vệ quá tải, đoản mạch, nhiệt độ cao và rò rỉ điện. Sản phẩm không kèm cáp.",
    specs: [
      { label: "Công suất sạc", value: "25W" },
      { label: "Sử dụng tối đa", value: "1 thiết bị" },
      { label: "Đầu ra", value: "Type-C" },
      { label: "Tiện ích", value: "Công nghệ sạc GaN, bảo vệ quá tải/đoản mạch/nhiệt độ/rò rỉ, giảm năng lượng ở chế độ chờ" },
      { label: "Công nghệ/Đạt chứng nhận", value: "PD 3.0, PPS" },
      { label: "Hãng sản xuất", value: "Samsung Chính hãng" },
    ],
  },

  /* ---------------------------- TAI NGHE ---------------------------- */
  {
    name: "Tai nghe Bluetooth True Wireless Havit TW972",
    slug: "tai-nghe-bluetooth-havit-tw972",
    sku: "TZ-TNG-001",
    category: "tai-nghe",
    brand: "havit",
    price: 459000,
    salePrice: 299000,
    stock: 180,
    isFeatured: true,
    shortDescription:
      "Tai nghe Bluetooth True Wireless Havit TW972, chống nước IPX4, pin nghe 7.5 giờ kèm micro.",
    description:
      "Havit TW972 là tai nghe True Wireless hai bên với micro tích hợp cho các cuộc gọi hằng ngày. Chuẩn kháng nước IPX4 giúp tai nghe an toàn khi gặp mưa nhẹ hay mồ hôi. Mỗi bên tai nghe cho thời lượng sử dụng 7.5 giờ, kết hợp hộp sạc giúp sử dụng thoải mái cả ngày.",
    specs: [
      { label: "Loại tai nghe", value: "True Wireless Stereo" },
      { label: "Micro", value: "Có" },
      { label: "Thời lượng sử dụng Pin", value: "Tai nghe: 7.5 giờ" },
      { label: "Tính năng khác", value: "Kháng nước IPX4" },
      { label: "Hãng sản xuất", value: "Havit" },
    ],
    faq: [
      {
        question: "Tai nghe có hỗ trợ gọi điện thoại không?",
        answer:
          "Có. Tai nghe có micro tích hợp giúp thu âm rõ ràng trong các cuộc gọi hằng ngày.",
      },
      {
        question: "Có dùng được với iPhone và Android không?",
        answer:
          "Có, tai nghe kết nối Bluetooth phổ quát, tương thích với cả iOS và Android.",
      },
    ],
  },
  {
    name: "Tai nghe chụp tai gaming Sony Inzone H3",
    slug: "tai-nghe-chup-tai-gaming-sony-inzone-h3",
    sku: "TZ-TNG-002",
    category: "tai-nghe",
    brand: "sony",
    price: 1550000,
    salePrice: 1050000,
    stock: 35,
    shortDescription:
      "Tai nghe chụp tai Sony Inzone H3, công nghệ 360 Spatial Sound, micro boom rời, cổng 3.5mm.",
    description:
      "Sony Inzone H3 sử dụng công nghệ 360 Spatial Sound cho âm thanh định vị chính xác, giúp bạn nhận biết vị trí đối thủ trong game. Tai nghe trọng lượng 299g với đệm tai êm, micro boom rời cho lời nói rõ ràng, kết nối qua cổng 3.5mm và điều khiển bằng nút bấm vật lý.",
    specs: [
      { label: "Trọng lượng", value: "299 g" },
      { label: "Công nghệ âm thanh", value: "360 Spatial Sound" },
      { label: "Micro", value: "Có" },
      { label: "Cổng kết nối", value: "3.5mm" },
      { label: "Phương thức điều khiển", value: "Nút bấm vật lý" },
      { label: "Tính năng khác", value: "Micro boom" },
      { label: "Hãng sản xuất", value: "Sony" },
    ],
  },
  {
    name: "Tai nghe Bluetooth thể thao Anker Soundcore C50i",
    slug: "tai-nghe-bluetooth-the-thao-anker-soundcore-c50i",
    sku: "TZ-TNG-003",
    category: "tai-nghe",
    brand: "anker",
    price: 1290000,
    salePrice: 1090000,
    stock: 65,
    shortDescription:
      "Tai nghe Bluetooth thể thao Anker Soundcore C50i, chống nước bụi IP55, 2 micro AI, pin 28 giờ.",
    description:
      "Anker Soundcore C50i là tai nghe Bluetooth thể thao với 2 micro AI giúp lọc tiếng ồn khi gọi. Chuẩn chống nước chống bụi IP55 đồng hành cùng bạn trong tập luyện và chạy bộ ngoài trời. Thời lượng pin 7 giờ mỗi lần sạc, kèm hộp sạc cho tổng 28 giờ sử dụng.",
    specs: [
      { label: "Trọng lượng", value: "Tai nghe: 5.5 g" },
      { label: "Micro", value: "Có (2 micro AI)" },
      { label: "Thời lượng sử dụng Pin", value: "Tai nghe: 7 giờ; Hộp sạc: 28 giờ" },
      { label: "Tính năng khác", value: "Kháng nước, bụi IP55" },
      { label: "Phương thức điều khiển", value: "Nút bấm" },
      { label: "Hãng sản xuất", value: "Anker" },
    ],
  },
  {
    name: "Tai nghe Bluetooth True Wireless gaming ROG Cetra",
    slug: "tai-nghe-tws-gaming-rog-cetra",
    sku: "TZ-TNG-004",
    category: "tai-nghe",
    brand: "asus",
    price: 2190000,
    salePrice: 1570000,
    stock: 22,
    shortDescription:
      "Tai nghe gaming không dây ROG Cetra, chống ồn chủ động, EQ âm thanh 7.1, sạc nhanh, phạm vi 10m.",
    description:
      "ROG Cetra là tai nghe True Wireless dành riêng cho game thủ với tính năng chống ồn chủ động và bộ tùy chỉnh EQ âm thanh 7.1. Điều khiển bằng cảm ứng chạm tiện lợi trong lúc chiến đấu, hỗ trợ sạc nhanh và phạm vi kết nối 10m giúp bạn linh hoạt di chuyển.",
    specs: [
      { label: "Công nghệ âm thanh", value: "Chống ồn chủ động, Tùy chỉnh EQ/âm thanh 7.1" },
      { label: "Micro", value: "Có" },
      { label: "Phương thức điều khiển", value: "Cảm ứng chạm" },
      { label: "Tính năng khác", value: "Sạc nhanh" },
      { label: "Phạm vi kết nối", value: "10 m" },
      { label: "Hãng sản xuất", value: "ASUS" },
    ],
  },

  /* -------------------------- SẠC DỰ PHÒNG -------------------------- */
  {
    name: "Pin sạc dự phòng Xiaomi 10000mAh 22.5W tích hợp cáp Type-C",
    slug: "pin-sac-du-phong-xiaomi-10000mah-22-5w",
    sku: "TZ-SDP-001",
    category: "sac-du-phong",
    brand: "xiaomi",
    price: 590000,
    salePrice: 390000,
    stock: 145,
    isFeatured: true,
    shortDescription:
      "Pin sạc dự phòng Xiaomi 10000mAh 22.5W, 3 cổng ra, có cáp Type-C tích hợp và đèn LED báo pin.",
    description:
      "Pin sạc dự phòng Xiaomi 10000mAh hỗ trợ sạc nhanh 22.5W với 3 cổng ra gồm 1 USB-C, 1 USB-A và 1 cáp USB-C tích hợp, giúp sạc đồng thời nhiều thiết bị mà không cần mang thêm dây. Đèn LED hiển thị dung lượng pin còn lại, lõi pin lithium-ion cho tuổi thọ ổn định.",
    specs: [
      { label: "Dung lượng pin", value: "10000mAh" },
      { label: "Công suất sạc", value: "22.5W" },
      { label: "Cổng sạc ra", value: "1 x USB-C, 1 x USB-A, 1 x cáp USB-C" },
      { label: "Cổng sạc vào", value: "1 x USB-C" },
      { label: "Tiện ích", value: "Đèn LED hiển thị dung lượng pin, sạc nhiều thiết bị cùng lúc" },
      { label: "Lõi pin", value: "Lithium-ion" },
      { label: "Kích thước", value: "105.2 x 26.9 x 65.2mm" },
      { label: "Hãng sản xuất", value: "Xiaomi" },
    ],
    faq: [
      {
        question: "Sạc dự phòng 10000mAh sạc được iPhone mấy lần?",
        answer:
          "Với iPhone 15 (dung lượng pin 3349mAh), sạc dự phòng 10000mAh sạc khoảng 2 lần ở chế độ sạc nhanh, thực tế khoảng 1.5 lần do hao hụt chuyển đổi.",
      },
      {
        question: "Sạc dự phòng có an toàn khi để qua đêm không?",
        answer:
          "Có. Sạc dự phòng sử dụng chip quản lý nguồn thông minh, tự ngắt khi sạc đầy và bảo vệ đa lớp trước nhiệt độ cao.",
      },
    ],
  },
  {
    name: "Pin sạc dự phòng không dây Ugreen Qi2 10000mAh 30W PB761",
    slug: "pin-sac-du-phong-ugreen-qi2-10000mah-30w",
    sku: "TZ-SDP-002",
    category: "sac-du-phong",
    brand: "ugreen",
    price: 1200000,
    salePrice: 990000,
    stock: 70,
    isFeatured: true,
    shortDescription:
      "Pin sạc dự phòng không dây Ugreen Qi2 10000mAh, sạc không dây 15W và có dây 30W, đèn LED báo lượng pin.",
    description:
      "Ugreen PB761 tích hợp sạc không dây chuẩn Qi2 15W lẫn sạc có dây 30W trong cùng một thiết bị. Cổng sạc ra gồm USB-C và MagSafe nên đáp ứng điện thoại, tai nghe, smartwatch trong một chuyến đi. Đèn LED trắng hiển thị lượng pin còn lại, lõi lithium polymer cho độ bền ổn định.",
    specs: [
      { label: "Dung lượng pin", value: "10000mAh" },
      { label: "Công suất sạc", value: "Có dây: 30W; Không dây: 15W" },
      { label: "Cổng sạc ra", value: "1 x USB-C, 1 x MagSafe" },
      { label: "Cổng sạc vào", value: "1 x USB-C" },
      { label: "Tiện ích", value: "Đèn LED trắng hiển thị lượng pin, sạc nhiều thiết bị cùng lúc" },
      { label: "Lõi pin", value: "Lithium Polymer" },
      { label: "Kích thước", value: "105 x 69 x 20 mm" },
      { label: "Trọng lượng", value: "222 g" },
      { label: "Hãng sản xuất", value: "Ugreen" },
    ],
  },
  {
    name: "Pin sạc dự phòng Cuktech CP24 20000mAh 40W LPB200N",
    slug: "pin-sac-du-phong-cuktech-cp24-20000mah-40w",
    sku: "TZ-SDP-003",
    category: "sac-du-phong",
    brand: "cuktech",
    price: 645000,
    salePrice: 589000,
    stock: 48,
    shortDescription:
      "Pin sạc dự phòng Cuktech CP24 20000mAh 40W, cổng 1A1C, tích hợp cáp USB-C rút gọn.",
    description:
      "Cuktech CP24 (LPB200N) là pin sạc dự phòng 20000mAh công suất 40W với bố cục 1A1C, hỗ trợ sạc nhanh cho điện thoại, máy tính bảng. Cáp USB-C tích hợp rút gọn giúp bạn không phải mang theo dây riêng, dung lượng lớn phù hợp cho chuyến đi dài hoặc dự phòng cho dân văn phòng.",
    specs: [
      { label: "Dung lượng pin", value: "20000mAh" },
      { label: "Công suất sạc", value: "40W" },
      { label: "Cổng sạc ra", value: "1 x USB-A, 1 x USB-C, cáp USB-C tích hợp" },
      { label: "Cổng sạc vào", value: "1 x USB-C" },
      { label: "Mã sản phẩm", value: "CP24 / LPB200N" },
      { label: "Hãng sản xuất", value: "Cuktech" },
    ],
  },
  {
    name: "Pin sạc dự phòng Baseus Enercore CR11 20000mAh 67W",
    slug: "pin-sac-du-phong-baseus-enercore-cr11-20000mah-67w",
    sku: "TZ-SDP-004",
    category: "sac-du-phong",
    brand: "baseus",
    price: 990000,
    salePrice: 770000,
    stock: 55,
    shortDescription:
      "Pin sạc dự phòng Baseus Enercore CR11 20000mAh 67W, màn hình LED, sạc được laptop, cáp co rút 70cm.",
    description:
      "Baseus Enercore CR11 với công suất 67W có thể sạc laptop, máy tính bảng lẫn điện thoại. Màn hình LED hiển thị trạng thái sạc, cáp co rút dài 70cm chống rối giúp mang theo gọn gàng. Hệ thống tản nhiệt ba lớp cùng bảo vệ quá dòng, quá áp, quá nhiệt và ngắn mạch bảo đảm an toàn.",
    specs: [
      { label: "Dung lượng pin", value: "20000mAh" },
      { label: "Công suất sạc", value: "67W" },
      { label: "Cổng sạc ra", value: "1 x cáp Type-C, 1 x USB-C" },
      { label: "Cổng sạc vào", value: "1 x USB-C" },
      { label: "Tiện ích", value: "Sạc được cho laptop, màn hình LED, bảo vệ quá dòng/quá áp/quá nhiệt/ngắn mạch, tản nhiệt 3 lớp, cáp co rút chống rối" },
      { label: "Hiệu suất sạc", value: "75%" },
      { label: "Lõi pin", value: "Lithium polymer" },
      { label: "Kích thước", value: "14.5 x 6.9 x 2.5 cm" },
      { label: "Trọng lượng", value: "390g" },
      { label: "Chiều dài dây", value: "70 cm" },
      { label: "Hãng sản xuất", value: "Baseus" },
    ],
  },

  /* ------------------------- KÍNH CƯỜNG LỰC ------------------------- */
  {
    name: "Dán kính cường lực Mipow full viền cho iPhone 17/18 Pro Max",
    slug: "dan-kinh-cuong-luc-mipow-full-vien-iphone-17-18-pro-max",
    sku: "TZ-KCL-001",
    category: "kinh-cuong-luc",
    brand: "mipow",
    price: 450000,
    stock: 300,
    isFeatured: true,
    shortDescription:
      "Dán kính cường lực Mipow full viền cao cấp cho iPhone 17/18 Pro Max, chống xước và bảo vệ trọn màn hình.",
    description:
      "Miếng dán kính cường lực Mipow full viền cho iPhone 17/18 Pro Max phủ kín toàn bộ mặt trước, bo sát viền màn hình nên vừa khít và thẩm mỹ. Lớp kính chịu lực va đập, chống trầy xước hiệu quả, giữ nguyên độ nhạy cảm ứng và độ sắc nét của màn hình.",
    specs: [
      { label: "Loại miếng dán", value: "Dán cường lực" },
      { label: "Dùng được cho", value: "Apple iPhone 17 Pro Max / 18 Pro Max" },
      { label: "Đặc điểm", value: "Full viền cao cấp" },
      { label: "Hãng sản xuất", value: "Mipow" },
    ],
    faq: [
      {
        question: "Dán kính có ảnh hưởng cảm ứng không?",
        answer:
          "Không. Miếng dán mỏng giữ độ nhạy cảm ứng gần như không thay đổi, đầu cảm ứng khớp hoàn toàn.",
      },
      {
        question: "Kính có che camera trước không?",
        answer:
          "Không. Thiết kế full viền có khoét vừa khít vùng camera trước, không làm ảnh hưởng chất lượng ảnh.",
      },
    ],
  },
  {
    name: "Dán kính cường lực Zagg Plus Edge Full cho Samsung Galaxy S25 Ultra",
    slug: "dan-kinh-cuong-luc-zagg-plus-edge-galaxy-s25-ultra",
    sku: "TZ-KCL-002",
    category: "kinh-cuong-luc",
    brand: "zagg",
    price: 390000,
    salePrice: 351000,
    stock: 220,
    shortDescription:
      "Dán kính cường lực Zagg Plus Edge Full cho Samsung Galaxy S25 Ultra, chống sốc va đập và chống trầy xước.",
    description:
      "Zagg Plus Edge Full bảo vệ trọn mặt trước Samsung Galaxy S25 Ultra với lớp kính cường lực chịu lực va đập tốt. Thiết kế viền cong ôm sát thân máy nên dán kính nhanh gọn và tạo cảm giác liền mạch, chống trầy xước, chống bám vân tay trong quá trình sử dụng.",
    specs: [
      { label: "Dòng sản phẩm", value: "Samsung Galaxy S25 Ultra" },
      { label: "Loại miếng dán", value: "Dán cường lực màn hình" },
      { label: "Tính năng", value: "Chống sốc, va đập, Chống trầy xước" },
      { label: "Dùng được cho", value: "Samsung Galaxy S25 Ultra" },
      { label: "Hãng sản xuất", value: "ZAGG" },
    ],
  },
  {
    name: "Dán bảo vệ camera Zeelot viền kim loại cho iPhone 18 Pro",
    slug: "dan-bao-ve-camera-zeelot-vien-iphone-18-pro",
    sku: "TZ-KCL-003",
    category: "kinh-cuong-luc",
    brand: "zeelot",
    price: 450000,
    stock: 130,
    shortDescription:
      "Dán bảo vệ camera Zeelot viền kim loại cho iPhone 18 Pro/18 Pro Max, chống sốc và chống trầy xước.",
    description:
      "Dán bảo vệ camera Zeelot có khung viền kim loại bao quanh cụm camera iPhone 18 Pro/18 Pro Max, vừa bảo vệ mặt kính lens vừa tạo điểm nhấn sang trọng. Bề mặt chống trầy xước, chịu va đập tốt giúp cụm camera luôn trong trạng thái như mới.",
    specs: [
      { label: "Loại miếng dán", value: "Dán bảo vệ camera" },
      { label: "Dùng được cho", value: "iPhone 18 Pro / 18 Pro Max" },
      { label: "Tính năng", value: "Chống sốc, va đập, Chống trầy xước" },
      { label: "Đặc điểm", value: "Viền kim loại" },
      { label: "Hãng sản xuất", value: "Zeelot" },
    ],
  },
  {
    name: "Dán kính chống nhìn trộm Zagg Invisibleshield Xtr không viền",
    slug: "dan-kinh-chong-nhin-trom-zagg-invisibleshield-xtr",
    sku: "TZ-KCL-004",
    category: "kinh-cuong-luc",
    brand: "zagg",
    price: 1650000,
    stock: 65,
    shortDescription:
      "Dán kính chống nhìn trộm Zagg Invisibleshield Xtr không viền, công nghệ ClearPrint tự xóa vân tay.",
    description:
      "Zagg Invisibleshield Xtr là miếng dán chống nhìn trộm dạng không viền, chỉ hiển thị rõ nội dung khi bạn nhìn thẳng vào màn hình. Công nghệ ClearPrint khuếch tán dầu giúp vân tay tự biến mất khi bật màn hình, kết hợp lớp kính cường lực bảo vệ màn hình khỏi xước và va đập.",
    specs: [
      { label: "Loại miếng dán", value: "Dán cường lực chống nhìn trộm" },
      { label: "Dùng được cho", value: "iPhone Duo" },
      { label: "Công nghệ", value: "ClearPrint khuếch tán dầu, dấu vân tay tự biến mất khi bật màn hình" },
      { label: "Đặc điểm", value: "Không viền, mặt trước" },
      { label: "Hãng sản xuất", value: "ZAGG" },
    ],
  },

  /* ------------------------ GIÁ ĐỠ ĐIỆN THOẠI ------------------------ */
  {
    name: "Giá đỡ điện thoại Goojodoq BD3059 bằng nhôm",
    slug: "gia-do-dien-thoai-goojodoq-bd3059",
    sku: "TZ-GDD-001",
    category: "gia-do-dien-thoai",
    brand: "goojodoq",
    price: 120000,
    salePrice: 98000,
    stock: 160,
    isFeatured: true,
    shortDescription:
      "Giá đỡ điện thoại Goojodoq BD3059 bằng nhôm, xoay 360°, chống trượt, gấp gọn mang theo.",
    description:
      "Giá đỡ Goojodoq BD3059 làm bằng nhôm với trục xoay 360° cho phép điều chỉnh linh hoạt mọi góc nghiêng. Đế chống trượt và thiết kế tản nhiệt rỗng giúp điện thoại không bị nóng khi sạc, có thể gấp gọn mang đi dễ dàng.",
    specs: [
      { label: "Chất liệu", value: "Nhôm" },
      { label: "Tiện ích", value: "Xoay 360°, chống trượt, trục dày, điều chỉnh linh hoạt, tản nhiệt rỗng, gấp gọn" },
      { label: "Hãng sản xuất", value: "Goojodoq" },
    ],
    faq: [
      {
        question: "Giá đỡ có dùng được cho iPad không?",
        answer:
          "Được với iPad mini và các máy nhỏ. Với iPad lớn, bạn nên dùng giá đỡ chuyên dụng có chân lớn hơn.",
      },
    ],
  },
  {
    name: "Giá đỡ điện thoại trên ô tô Wiwu Magnetic CH056",
    slug: "gia-do-dien-thoai-o-to-wiwu-magnetic-ch056",
    sku: "TZ-GDD-002",
    category: "gia-do-dien-thoai",
    brand: "wiwu",
    price: 700000,
    salePrice: 630000,
    stock: 95,
    shortDescription:
      "Giá đỡ điện thoại ô tô Wiwu Magnetic CH056, hút từ trường mạnh, xoay 360° và gập gọn.",
    description:
      "Giá đỡ Wiwu Magnetic CH056 sử dụng hút từ trường mạnh để gắn điện thoại chắc chắn trên dashboard, không rơi khi xe chạy qua ổ số. Đế xoay 360° cho phép chuyển đổi giữa chế độ ngang và dọc, thiết kế gập lại gọn nhẹ để mang theo.",
    specs: [
      { label: "Tiện ích", value: "Hút từ trường mạnh, xoay 360°, có thể gập lại & di động, tương thích phổ quát" },
      { label: "Hãng sản xuất", value: "Wiwu" },
    ],
  },
  {
    name: "Gậy chụp ảnh tripod Goojodoq BD3025 có điều khiển từ xa",
    slug: "tripod-dien-thoai-goojodoq-bd3025",
    sku: "TZ-GDD-003",
    category: "gia-do-dien-thoai",
    brand: "goojodoq",
    price: 300000,
    salePrice: 249000,
    stock: 120,
    shortDescription:
      "Tripod Goojodoq BD3025 chụp ảnh và quay video, điều khiển từ xa, chân quadrapod tự bung, ABS + nhôm.",
    description:
      "Gậy chụp ảnh Goojodoq BD3025 có chân quadrapod tự động bung ra khi nhấn nút mở khóa, kết hợp điều khiển từ xa để chụp ảnh hoặc quay video mà không cần chạm vào máy. Tay cầm kiểu DSLR, đế giày lạnh kép và vật liệu ABS kết hợp hợp kim nhôm cho độ bền tốt.",
    specs: [
      { label: "Pin", value: "CR1632" },
      { label: "Chất liệu", value: "ABS + Hợp kim nhôm" },
      { label: "Tính năng khác", value: "Nhấn giữ nút nguồn bật/tắt, nhấn một lần chụp ảnh hoặc quay video, nhấn đúp chuyển camera trước/sau, tay cầm kiểu DSLR, đế giày lạnh kép" },
      { label: "Tiện ích", value: "Chân quadrapod tự bung, điều khiển từ xa tự tắt sau 10 phút, tự kết nối lại khi bật nguồn, xoay nhiều góc độ" },
      { label: "Hãng sản xuất", value: "Goojodoq" },
    ],
  },
  {
    name: "Giá đỡ iPad và điện thoại Goojodoq BD3099 thép cacbon",
    slug: "gia-do-ipad-dien-thoai-goojodoq-bd3099",
    sku: "TZ-GDD-004",
    category: "gia-do-dien-thoai",
    brand: "goojodoq",
    price: 200000,
    salePrice: 179000,
    stock: 60,
    shortDescription:
      "Giá đỡ iPad và điện thoại Goojodoq BD3099 bằng thép cacbon, đế xoay 360°, nâng cao 210mm, gập gọn.",
    description:
      "Goojodoq BD3099 làm bằng thép cacbon nên vừa nhẹ vừa cứng, chịu được máy tính bảng nặng. Đế xoay 360° kết hợp trục nâng cao mở rộng 210mm cho phép bạn chỉnh chiều cao và góc nghiêng linh hoạt. Miếng đệm silicon chống trượt và có thể gập lại gọn gàng.",
    specs: [
      { label: "Chất liệu", value: "Thép cacbon" },
      { label: "Tiện ích", value: "Đế xoay 360°, chiều cao mở rộng 210mm, miếng đệm silicon chống trượt, có thể gập lại" },
      { label: "Hãng sản xuất", value: "Goojodoq" },
    ],
  },

  /* -------------------------- PHỤ KIỆN LAPTOP -------------------------- */
  {
    name: "Hub USB-C Anker 7 trong 1 A83D2",
    slug: "hub-anker-7-trong-1-usb-c-a83d2",
    sku: "TZ-PKL-001",
    category: "phu-kien-laptop",
    brand: "anker",
    price: 820000,
    salePrice: 620000,
    stock: 42,
    isFeatured: true,
    shortDescription:
      "Hub USB-C Anker 7 trong 1 A83D2, xuất HDMI 4K@60Hz, sạc laptop PD 100W, đọc thẻ SD/MicroSD.",
    description:
      "Hub Anker A83D2 biến một cổng USB-C thành 7 cổng tiện dụng gồm 2 USB-A 3.0, 1 USB-C, 1 USB-C PD, HDMI 4K@60Hz, khe SD và khe MicroSD. Cổng PD hỗ trợ sạc passthrough 100W nên bạn chỉ cần cắm một cáp sạc gốc của laptop. Tốc độ truyền dữ liệu 5Gbps và đọc thẻ tới 104 Mb/s.",
    specs: [
      { label: "Số cổng", value: "7 cổng" },
      { label: "Công suất sạc", value: "100W" },
      { label: "Đầu vào", value: "USB-C" },
      { label: "Đầu ra", value: "1 x USB-C, 1 x HDMI, 2 x USB-A 3.0, 1 x USB-C PD, 1 x khe SD, 1 x khe MicroSD" },
      { label: "Tiện ích", value: "Truyền dữ liệu 5Gbps, đọc thẻ 104 Mb/s, thiết kế nhỏ gọn" },
      { label: "Công nghệ/Đạt chứng nhận", value: "Power Delivery" },
      { label: "Chất lượng nội dung", value: "4K@60Hz" },
      { label: "Hãng sản xuất", value: "Anker" },
    ],
    faq: [
      {
        question: "Hub có sạc được laptop không?",
        answer:
          "Có. Cổng USB-C hỗ trợ sạc passthrough tới 100W, bạn chỉ cần cắm một cáp sạc gốc của laptop vào hub.",
      },
    ],
  },
  {
    name: "Túi chống sốc laptop S-case Classic 15.6 inch",
    slug: "tui-chong-soc-laptop-s-case-classic-15-6-inch",
    sku: "TZ-PKL-002",
    category: "phu-kien-laptop",
    brand: "s-case",
    price: 200000,
    salePrice: 180000,
    stock: 88,
    shortDescription:
      "Túi chống sốc laptop S-case Classic 15.6 inch, thiết kế gọn nhẹ bảo vệ an toàn khi di chuyển.",
    description:
      "Túi chống sốc S-case Classic 15.6 inch bảo vệ laptop trong các chuyến đi công tác, học tập. Thiết kế dạng ốp vỏ ôm sát máy, khoen trong khi vẫn giữ phong cách gọn gàng. Chất liệu bền bỉ chống xước, khoen quai xách thuận tiện.",
    specs: [
      { label: "Kích thước ngăn laptop", value: "15.6 inch" },
      { label: "Kiểu dáng", value: "Ốp vỏ ôm sát" },
      { label: "Hãng sản xuất", value: "S-Case" },
    ],
  },
  {
    name: "Chuột không dây Logitech M331",
    slug: "chuot-khong-day-logitech-m331",
    sku: "TZ-PKL-003",
    category: "phu-kien-laptop",
    brand: "logitech",
    price: 390000,
    salePrice: 340000,
    stock: 110,
    shortDescription:
      "Chuột không dây Logitech M331, cảm biến 1000 DPI, kết nối USB Receiver, pin dùng 18 tháng.",
    description:
      "Logitech M331 là chuột không dây im lặng dành cho văn phòng với cơ bấm silent giúp không làm phiền người xung quanh. Kết nối qua USB Receiver với khoảng cách 10m, cảm biến quang học 1000 DPI đáp ứng mọi nhu cầu làm việc. Pin cho thời gian sử dụng tới 18 tháng.",
    specs: [
      { label: "Tương thích", value: "Windows 10/11 trở lên, macOS 11 trở lên, ChromeOS, Linux" },
      { label: "Độ phân giải", value: "1000 DPI" },
      { label: "Kết nối", value: "USB Receiver" },
      { label: "Khoảng cách kết nối", value: "10 m" },
      { label: "Đèn LED", value: "Không" },
      { label: "Cơ bấm", value: "Silent" },
      { label: "Thời gian dùng", value: "18 tháng" },
      { label: "Hãng sản xuất", value: "Logitech" },
    ],
  },
  {
    name: "Bàn phím cơ không dây Mchose G75 Pro Tri-Mode 82 phím",
    slug: "ban-phim-co-khong-day-mchose-g75-pro-tri-mode",
    sku: "TZ-PKL-004",
    category: "phu-kien-laptop",
    brand: "mchose",
    price: 1690000,
    salePrice: 1390000,
    stock: 28,
    shortDescription:
      "Bàn phím cơ không dây Mchose G75 Pro, 82 phím Tenkeyless, RGB 16.8 triệu màu, kết nối 3 chế độ.",
    description:
      "Mchose G75 Pro là bàn phím cơ không dây 82 phím dạng Tenkeyless gọn nhẹ, hỗ trợ đồng thời Bluetooth, Wireless 2.4GHz và USB-C có dây nên chuyển đổi thiết bị rất nhanh. Đèn nền RGB 16.8 triệu màu kiểu South-Facing cho hiệu ứng đẹp và không nhòe chữ. Khoảng cách không dây tới 10m.",
    specs: [
      { label: "Loại bàn phím", value: "Tenkeyless" },
      { label: "Số phím", value: "82 phím" },
      { label: "Tương thích", value: "Windows, macOS, Linux" },
      { label: "Kết nối", value: "Bluetooth, Wireless 2.4GHz, USB-C có dây" },
      { label: "Khoảng cách kết nối", value: "Không dây đến 10m" },
      { label: "Đèn LED", value: "RGB 16.8 triệu màu, South-Facing RGB" },
      { label: "Hãng sản xuất", value: "MCHOSE" },
    ],
  },

  /* -------------------------- PHỤ KIỆN GAMING -------------------------- */
  {
    name: "Chuột gaming không dây Mchose G3 V2 Tri-Mode 12000 DPI",
    slug: "chuot-gaming-khong-day-mchose-g3-v2-tri-mode",
    sku: "TZ-PKG-001",
    category: "phu-kien-gaming",
    brand: "mchose",
    price: 590000,
    salePrice: 449000,
    stock: 40,
    isFeatured: true,
    shortDescription:
      "Chuột gaming Mchose G3 V2, cảm biến 12000 DPI, 3 chế độ kết nối, không dây 2.4GHz tầm 10m.",
    description:
      "Mchose G3 V2 trang bị cảm biến quang học 12000 DPI cho độ chính xác tuyệt đối trong các game FPS. Chuột hỗ trợ 3 chế độ kết nối gồm có dây, không dây 2.4GHz và Bluetooth, tầm hoạt động không dây tới 10m nên bạn chơi thoải mái ở mọi khoảng cách.",
    specs: [
      { label: "Tương thích", value: "Windows" },
      { label: "Độ phân giải", value: "12000 DPI" },
      { label: "Kết nối", value: "Có dây + Không dây 2.4GHz + Bluetooth" },
      { label: "Khoảng cách kết nối", value: "Không dây: 10 mét" },
      { label: "Hãng sản xuất", value: "MCHOSE" },
    ],
  },
  {
    name: "Chuột gaming có dây Asus TUF M3 Gen 2 8000 DPI RGB",
    slug: "chuot-gaming-co-day-asus-tuf-m3-gen-2",
    sku: "TZ-PKG-002",
    category: "phu-kien-gaming",
    brand: "asus",
    price: 590000,
    salePrice: 410000,
    stock: 55,
    shortDescription:
      "Chuột gaming có dây Asus TUF M3 Gen 2, cảm biến 8000 DPI, đèn RGB, kết nối USB 2.0 Type-C sang Type-A.",
    description:
      "Asus TUF M3 Gen 2 là chuột gaming có dây với cảm biến quang học 8000 DPI cho phép chỉnh đích tuyệt đối trong game. Đèn RGB tạo điểm nhấn cho góc gaming, kết nối USB 2.0 với đầu chuyển Type-C sang Type-A tương thích rộng rãi với máy tính và laptop.",
    specs: [
      { label: "Tương thích", value: "Windows 10 / Windows 11" },
      { label: "Độ phân giải", value: "8000 DPI" },
      { label: "Kết nối", value: "USB 2.0 (Type-C sang Type-A)" },
      { label: "Đèn LED", value: "Đèn RGB" },
      { label: "Hãng sản xuất", value: "ASUS" },
    ],
  },
  {
    name: "Tay cầm chơi game điện thoại Dareu H101X",
    slug: "tay-cam-choi-game-dareu-h101x",
    sku: "TZ-PKG-003",
    category: "phu-kien-gaming",
    brand: "dareu",
    price: 699000,
    salePrice: 490000,
    stock: 72,
    shortDescription:
      "Tay cầm chơi game Dareu H101X, kết nối cáp USB-C và Bluetooth 5.0, rung 2 motor, pin 650mAh.",
    description:
      "Dareu H101X hỗ trợ cả kết nối cáp USB Type-C lẫn Bluetooth 5.0, tương thích với PC, Android và Nintendo Switch. Hai motor rung cho phản hồi chân thực, chế độ Turbo/Motion control giúp thao tác nhanh nhạy hơn. Pin 650mAh cho thời gian sử dụng tới 25 giờ.",
    specs: [
      { label: "Pin", value: "Lên tới 25 giờ" },
      { label: "Chất liệu", value: "Nhựa" },
      { label: "Kết nối", value: "Cáp USB Type-C, Bluetooth 5.0" },
      { label: "Lõi pin", value: "Pin lithium" },
      { label: "Dung lượng Pin", value: "650 mAh" },
      { label: "Phạm vi kết nối", value: "Cáp: 1.8 m" },
      { label: "Tính năng khác", value: "Hỗ trợ Rung với 2 motor, hỗ trợ Turbo / Motion control" },
      { label: "Tiện ích", value: "Tương thích với PC, Android, Nintendo Switch" },
      { label: "Hãng sản xuất", value: "DAREU" },
    ],
  },
  {
    name: "Đèn bàn LED Hyperwork Nova DL02 24W",
    slug: "den-ban-led-hyperwork-nova-dl02",
    sku: "TZ-PKG-004",
    category: "phu-kien-gaming",
    brand: "hyperwork",
    price: 590000,
    salePrice: 490000,
    stock: 90,
    shortDescription:
      "Đèn bàn LED Hyperwork Nova DL02 công suất 24W, 3 nhiệt độ màu 3000K - 3800K - 5000K, PC + ABS + kim loại.",
    description:
      "Đèn bàn Hyperwork Nova DL02 công suất 24W cho vùng làm việc sáng rõ, điều chỉnh 3 nhiệt độ màu 3000K - 3800K - 5000K để chuyển đổi giữa ánh sáng ấm và trắng theo thời điểm. Thân đèn làm từ PC, ABS và kim loại, kích thước 15.5 x 15.5 x 43cm, phù hợp làm đèn học tập và đèn gaming.",
    specs: [
      { label: "Công suất", value: "24W" },
      { label: "Nhiệt độ màu", value: "3000K - 3800K - 5000K" },
      { label: "Chất liệu", value: "PC + ABS + kim loại" },
      { label: "Kích thước", value: "15.5 × 15.5 × 43 cm" },
      { label: "Hãng sản xuất", value: "HyperWork" },
    ],
  },
  {
    name: "Tay cầm chơi game Dareu H102",
    slug: "tay-cam-choi-game-dareu-h102",
    sku: "TZ-PKG-005",
    category: "phu-kien-gaming",
    brand: "dareu",
    price: 490000,
    salePrice: 469000,
    stock: 18,
    shortDescription:
      "Tay cầm chơi game Dareu H102, kết nối USB có dây + 2.4G + Bluetooth, rung dual motor, pin 500mAh.",
    description:
      "Dareu H102 hỗ trợ 3 chế độ kết nối USB có dây, 2.4G không dây và Bluetooth nên tương thích với PC, điện thoại và các thiết bị khác. Cần analog với dead zone điều chỉnh 0 - 10% cho phản hồi tinh tế, dual vibration motor tạo rung chân thực, pin 500mAh cho khoảng 10 giờ sử dụng.",
    specs: [
      { label: "Pin", value: "~10 giờ" },
      { label: "Kết nối", value: "USB Wired + 2.4G + Bluetooth" },
      { label: "Chiều dài dây", value: "1.5m" },
      { label: "Dung lượng Pin", value: "500mAh" },
      { label: "Tính năng khác", value: "Dead zone 0 ~ 10%, độ rung dual vibration motors" },
      { label: "Hãng sản xuất", value: "DAREU" },
    ],
  },
  {
    name: "Loa Bluetooth Sony SRS-XB100 Extra Bass chống nước IP67",
    slug: "loa-bluetooth-sony-srs-xb100-extra-bass",
    sku: "TZ-PKG-006",
    category: "tai-nghe",
    brand: "sony",
    price: 1490000,
    salePrice: 1090000,
    stock: 45,
    shortDescription:
      "Loa Bluetooth Sony SRS-XB100 Extra Bass, IP67, pin 16 giờ, loa X-Balanced 5W, nhẹ 274g.",
    description:
      "Sony SRS-XB100 là loa Bluetooth di động trọng lượng chỉ 274g với công nghệ X-Balanced Speaker Unit cho âm thanh cân bằng, dải tần rộng và chống méo tiếng. Chuẩn IP67 giúp loa chịu được nước và bụi nên an toàn dù bên bờ hồ hay cắm trại. Pin cho 16 giờ nghe nhạc, kết nối tầm 10m.",
    specs: [
      { label: "Trọng lượng", value: "274g" },
      { label: "Công nghệ âm thanh", value: "DSP X-Balanced Speaker Unit, Khử tiếng vọng" },
      { label: "Công suất", value: "5W" },
      { label: "Thời lượng pin", value: "16 giờ" },
      { label: "Chống nước", value: "IP67" },
      { label: "Phạm vi kết nối", value: "10 m" },
      { label: "Hãng sản xuất", value: "Sony" },
    ],
  },
];
