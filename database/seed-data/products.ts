import type { SeedProduct } from "./catalog";

export const SEED_PRODUCTS: SeedProduct[] = [
  /* ---------------------------- ỐP LƯNG ---------------------------- */
  {
    name: "Ốp lưng iPhone 15 Silicone chống sốc chính hãng",
    slug: "op-lung-iphone-15-silicone-chong-soc",
    sku: "TZ-OPL-001",
    category: "op-lung",
    brand: "apple",
    price: 590000,
    salePrice: 349000,
    stock: 120,
    soldCount: 268,
    ratingAverage: 4.6,
    ratingCount: 94,
    badge: "Bán chạy",
    isFeatured: true,
    shortDescription:
      "Ốp lưng iPhone 15 bằng silicon chính hãng, chống sốc, chống trầy và hỗ trợ sạc không dây.",
    description:
      "Ốp lưng iPhone 15 Silicone chính hãng được hoàn thiện từ silicon mềm cao cấp, ôm sát thân máy nhưng vẫn dễ tháo lắp. Lớp microfiber bên trong giúp bảo vệ mặt lưng iPhone khỏi xước xát trong quá trình sử dụng. Sản phẩm hỗ trợ sạc không dây MagSafe, không làm ảnh hưởng tín hiệu và không che mất logo Apple.",
    specs: [
      { label: "Chất liệu", value: "Silicone mềm + lớp microfiber bên trong" },
      { label: "Tương thích", value: "iPhone 15, iPhone 15 Plus" },
      { label: "Chống sốc", value: "Có, gia cố 4 góc" },
      { label: "Sạc không dây", value: "Hỗ trợ MagSafe / Qi" },
      { label: "Bảo hành", value: "12 tháng" },
    ],
    faq: [
      {
        question: "Ốp lưng có làm mất khả năng sạc không dây không?",
        answer:
          "Không. Ốp lưng iPhone 15 Silicone chính hãng có thiết kế mỏng vùng cuộn sạc, vẫn sạc không dây MagSafe bình thường.",
      },
      {
        question: "Ốp có bị ố vàng sau thời gian sử dụng không?",
        answer:
          "Vật liệu silicon chính hãng có độ bền màu cao, thời gian sử dụng ố vàng không xảy ra nếu bạn vệ sinh định kỳ.",
      },
    ],
  },
  {
    name: "Ốp lưng Samsung Galaxy S24 chống trầy silicon",
    slug: "op-lung-samsung-galaxy-s24-chong-tray",
    sku: "TZ-OPL-002",
    category: "op-lung",
    brand: "samsung",
    price: 490000,
    salePrice: 299000,
    stock: 95,
    soldCount: 174,
    ratingAverage: 4.4,
    ratingCount: 61,
    isFeatured: true,
    shortDescription:
      "Ốp lưng Samsung Galaxy S24 silicon mềm, chống trầy xước, mỏng nhẹ và ôm sát máy.",
    description:
      "Ốp lưng Samsung Galaxy S24 có bề mặt mịn, chống trầy xước và chống bám vân tay nhờ lớp phủ chống trơn. Thiết kế ôm sát viền máy, các nút cắt chính xác giúp thao tác dễ dàng. Đây là lựa chọn lý tưởng cho người dùng thích ốp mỏng nhẹ.",
    specs: [
      { label: "Chất liệu", value: "Silicone mềm" },
      { label: "Tương thích", value: "Samsung Galaxy S24 / S24+" },
      { label: "Chống trầy", value: "Có" },
      { label: "Màu sắc", value: "Đen, Trắng, Xanh" },
    ],
  },
  {
    name: "Ốp lưng chống sốc iPhone 13 kèm đẩy lên camera",
    slug: "op-lung-chong-soc-iphone-13-day-len-camera",
    sku: "TZ-OPL-003",
    category: "op-lung",
    brand: "baseus",
    price: 390000,
    salePrice: 249000,
    stock: 140,
    soldCount: 156,
    ratingAverage: 4.3,
    ratingCount: 48,
    shortDescription:
      "Ốp lưng chống sốc iPhone 13 kèm khung bảo vệ camera nâng cao, chống va đập mạnh.",
    description:
      "Ốp lưng chống sốc iPhone 13 kết hợp khung cứng bảo vệ cụm camera, nâng cụm lens lên để tránh tiếp xúc mặt đất khi đặt máy. Mặt lưng kết hợp TPU và polycarbonate cho khả năng hấp thụ va đậm tốt, bề mặt mịn chống trầy.",
    specs: [
      { label: "Chất liệu", value: "TPU + Polycarbonate khung cứng" },
      { label: "Tương thích", value: "iPhone 13 / 13 Pro" },
      { label: "Bảo vệ camera", value: "Khung nhô 1.2mm" },
      { label: "Bảo hành", value: "12 tháng" },
    ],
  },
  {
    name: "Ốp lưng da PU cao cấp Samsung Galaxy A55",
    slug: "op-lung-da-pu-cao-cap-samsung-galaxy-a55",
    sku: "TZ-OPL-004",
    category: "op-lung",
    brand: "samsung",
    price: 550000,
    stock: 70,
    soldCount: 88,
    ratingAverage: 4.2,
    ratingCount: 27,
    shortDescription:
      "Ốp lưng da PU cao cấp cho Samsung Galaxy A55, mềm mại, thời trang và bền bỉ.",
    description:
      "Ốp lưng da PU cao cấp mang lại cảm giác da thật, mềm mại và bền bỉ theo thời gian. Có đường chỉ thêu tinh tế ở viền, phù hợp với phong cách tối giản, chuyên nghiệp.",
    specs: [
      { label: "Chất liệu", value: "PU cao cấp" },
      { label: "Tương thích", value: "Samsung Galaxy A55" },
      { label: "Kiểu dáng", value: "Tối giản, có đường chỉ" },
    ],
  },

  /* ---------------------------- CÁP SẠC ---------------------------- */
  {
    name: "Cáp sạc nhanh 20W Type-C hỗ trợ PD 3.0 chính hãng",
    slug: "cap-sac-nhanh-20w-type-c-ho-tro-pd-30",
    sku: "TZ-CAP-001",
    category: "cap-sac",
    brand: "baseus",
    price: 199000,
    salePrice: 129000,
    stock: 250,
    soldCount: 512,
    ratingAverage: 4.7,
    ratingCount: 186,
    badge: "Bán chạy",
    isFeatured: true,
    shortDescription:
      "Cáp sạc nhanh 20W Type-C hỗ trợ PD 3.0, sạc nhanh cho iPhone, Android và các thiết bị USB-C.",
    description:
      "Cáp sạc nhanh 20W Type-C hỗ trợ chuẩn PD 3.0 giúp sạc iPhone và điện thoại Android nhanh chóng, rút ngắn đáng kể thời gian chờ. Lõi cáp được gia cố chịu được hơn 10.000 lần uốn gấp, đầu connector gia cố chống rạn. Chiều dài 1.2m vừa đủ sử dụng trong túi hoặc trên bàn làm việc.",
    specs: [
      { label: "Công suất", value: "20W" },
      { label: "Chuẩn sạc", value: "PD 3.0, QC 3.0" },
      { label: "Đầu cắm", value: "USB-C to USB-C" },
      { label: "Chiều dài", value: "1.2m" },
      { label: "Độ bền", value: "Chịu uốn gấp trên 10.000 lần" },
      { label: "Bảo hành", value: "18 tháng" },
    ],
    faq: [
      {
        question: "Cáp sạc nhanh 20W có sạc được iPhone không?",
        answer:
          "Có. Khi dùng kèm củ sạc PD 20W trở lên, iPhone 12 trở lên sẽ nhận mức sạc nhanh tối đa 20W.",
      },
      {
        question: "Cáp có tương thích sạc laptop không?",
        answer:
          "Cáp hỗ trợ công suất 20W, phù hợp sạc iPad và một số máy tính bảng. Với laptop cần củ sạc công suất cao hơn.",
      },
    ],
  },
  {
    name: "Cáp sạc nhanh 65W Type-C PD sạc laptop và điện thoại",
    slug: "cap-sac-nhanh-65w-type-c-pd",
    sku: "TZ-CAP-002",
    category: "cap-sac",
    brand: "ugreen",
    price: 349000,
    salePrice: 239000,
    stock: 160,
    soldCount: 287,
    ratingAverage: 4.8,
    ratingCount: 112,
    badge: "Hot",
    isFeatured: true,
    shortDescription:
      "Cáp sạc nhanh 65W Type-C hỗ trợ PD 3.0, sạc được laptop, iPad, MacBook lẫn điện thoại.",
    description:
      "Cáp sạc nhanh 65W Type-C là giải pháp sạc đa năng cho laptop, máy tính bảng và điện thoại. Với công suất 65W hỗ trợ chuẩn Power Delivery 3.0, cáp sạc đầy pin MacBook Pro 13 inch trong khoảng 1.5 giờ. Đầu cắm được gia cố bằng hợp kim nhôm chịu lực tốt.",
    specs: [
      { label: "Công suất", value: "65W" },
      { label: "Chuẩn sạc", value: "PD 3.0, PPS" },
      { label: "Đầu cắm", value: "USB-C to USB-C" },
      { label: "Chiều dài", value: "1.5m" },
      { label: "Vật liệu", value: "Nylon braided, đầu nhôm alloy" },
    ],
  },
  {
    name: "Cáp Lightning sạc nhanh iPhone 15 chính hãng 1m",
    slug: "cap-lightning-sac-nhanh-iphone-15-chinh-hang",
    sku: "TZ-CAP-003",
    category: "cap-sac",
    brand: "apple",
    price: 390000,
    salePrice: 290000,
    stock: 85,
    soldCount: 132,
    ratingAverage: 4.5,
    ratingCount: 44,
    shortDescription:
      "Cáp Lightning chính hãng Apple sạc nhanh iPhone 15, đầu cắm chuẩn, bền bỉ và an toàn.",
    description:
      "Cáp Lightning chính hãng dành cho iPhone 15, iPhone 14 và các dòng iPhone dùng cổng Lightning. Đầu cắm được gia cố chắc chắn, hỗ trợ sạc nhanh và truyền dữ liệu, đồng thời đạt tiêu chuẩn an toàn với chip bảo vệ thông minh.",
    specs: [
      { label: "Đầu cắm", value: "USB-A to Lightning" },
      { label: "Chiều dài", value: "1m" },
      { label: "Tốc độ sạc", value: "Lên đến 20W với củ sạc phù hợp" },
      { label: "Truyền dữ liệu", value: "Có, tốc độ 480Mbps" },
    ],
  },
  {
    name: "Cáp sạc nhiều đầu 3-in-1 bộ sạc đa năng",
    slug: "cap-sac-nhieu-dau-3-in-1",
    sku: "TZ-CAP-004",
    category: "cap-sac",
    brand: "baseus",
    price: 290000,
    salePrice: 189000,
    stock: 110,
    soldCount: 145,
    ratingAverage: 4.1,
    ratingCount: 39,
    shortDescription:
      "Cáp sạc 3-in-1 kết hợp Type-C, Lightning và Micro USB, tiện lợi mang theo nhiều thiết bị.",
    description:
      "Cáp sạn 3-in-1 là bộ sạc nhỏ gọn kết hợp ba đầu nối Type-C, Lightning và Micro USB trong một dây. Giải quyết triệt để vấn đề mang theo nhiều bộ sạc khác nhau khi đi công tác, du lịch. Phần đầu nối được bọc silicone chống va đập.",
    specs: [
      { label: "Đầu cắm", value: "USB-A + Type-C + Lightning + Micro USB" },
      { label: "Chiều dài", value: "1.2m" },
      { label: "Tính năng", value: "Sạc và truyền dữ liệu" },
    ],
  },

  /* ---------------------------- CỦ SẠC ---------------------------- */
  {
    name: "Củ sạc nhanh 20W hỗ trợ PD và QC chính hãng",
    slug: "cu-sac-nhanh-20w-ho-tro-pd-va-qc",
    sku: "TZ-CUS-001",
    category: "cu-sac",
    brand: "baseus",
    price: 249000,
    salePrice: 159000,
    stock: 200,
    soldCount: 623,
    ratingAverage: 4.8,
    ratingCount: 241,
    badge: "Bán chạy",
    isFeatured: true,
    shortDescription:
      "Củ sạc nhanh 20W hỗ trợ sạc nhanh PD 3.0 và QC 3.0 cho iPhone, Samsung, Xiaomi.",
    description:
      "Củ sạc nhanh 20W là lựa chọn tối ưu cho điện thoại: nhỏ gọn, sạc nhanh và tương thích rộng rãi. Nhờ chip sạc thông minh tự nhận diện thiết bị, củ sạc điều chỉnh dòng điện an toàn, tránh quá nhiệt và bảo vệ tuổi thọ pin. Có 2 cổng: USB-C và USB-A.",
    specs: [
      { label: "Công suất", value: "20W tổng hợp" },
      { label: "Cổng", value: "1x USB-C, 1x USB-A" },
      { label: "Chuẩn sạc", value: "PD 3.0, QC 3.0, FCP, AFC" },
      { label: "Kích thước", value: "Nhỏ gọn, có thể gập đầu cắm" },
      { label: "Bảo hành", value: "18 tháng" },
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
          "Có. Chip quản lý nguồn thông minh bảo vệ quá nhiệt, quá dòng, quá áp và ngắn mạch.",
      },
    ],
  },
  {
    name: "Củ sạc GaN 65W sạc nhanh laptop và điện thoại",
    slug: "cu-sac-gan-65w-sac-nhanh-laptop-va-dien-thoai",
    sku: "TZ-CUS-002",
    category: "cu-sac",
    brand: "ugreen",
    price: 690000,
    salePrice: 549000,
    stock: 90,
    soldCount: 198,
    ratingAverage: 4.8,
    ratingCount: 86,
    badge: "Hot",
    isFeatured: true,
    shortDescription:
      "Củ sạc GaN 65W nhỏ gọn, sạc nhanh PD cho MacBook, iPad, iPhone và nhiều thiết bị cùng lúc.",
    description:
      "Củ sạc GaN 65W sử dụng công nghệ bán dẫn Nitride Gallium giúp thu nhỏ kích thước đáng kể so với củ sạc thông thường, chỉ bằng một nửa thể tích. Với 3 cổng (2x USB-C, 1x USB-A), bạn có thể sạc MacBook, iPad và điện thoại cùng lúc mà không lo thiếu cổng.",
    specs: [
      { label: "Công suất", value: "65W tổng hợp" },
      { label: "Cổng", value: "2x USB-C, 1x USB-A" },
      { label: "Công nghệ", value: "GaN" },
      { label: "Chuẩn sạc", value: "PD 3.0, QC 3.0, PPS" },
      { label: "Kích thước", value: "Cực kỳ nhỏ gọn" },
    ],
  },
  {
    name: "Củ sạc không dây sạc nhanh 15W MagSafe",
    slug: "cu-sac-khong-day-sac-nhanh-15w-magsafe",
    sku: "TZ-CUS-003",
    category: "cu-sac",
    brand: "apple",
    price: 790000,
    salePrice: 649000,
    stock: 60,
    soldCount: 112,
    ratingAverage: 4.6,
    ratingCount: 52,
    shortDescription:
      "Củ sạc không dây MagSafe 15W chính hãng, từ tính tự dính, sạc nhanh cho iPhone 12 trở lên.",
    description:
      "Củ sạc không dây MagSafe 15W mang đến trải nghiệm sạc tiện lợi và chính xác cho iPhone 12 trở lên. Hệ từ tính tự dính giúp củ sạc tự căn đúng vị trí sạc, tối đa hóa hiệu suất sạc nhanh. Có cáp USB-C 1m đi kèm trong hộp.",
    specs: [
      { label: "Công suất", value: "15W" },
      { label: "Kết nối", value: "Từ tính MagSafe" },
      { label: "Tương thích", value: "iPhone 12 trở lên" },
      { label: "Trong hộp", value: "Củ sạc + cáp USB-C 1m" },
    ],
  },
  {
    name: "Củ sạc nhanh 33W Samsung Super Fast Charging",
    slug: "cu-sac-nhanh-33w-samsung-super-fast-charging",
    sku: "TZ-CUS-004",
    category: "cu-sac",
    brand: "samsung",
    price: 450000,
    salePrice: 349000,
    stock: 75,
    soldCount: 96,
    ratingAverage: 4.4,
    ratingCount: 33,
    shortDescription:
      "Củ sạc nhanh 33W Samsung Super Fast Charging, đầu ra Type-C hỗ trợ PD và QC.",
    description:
      "Củ sạc nhanh 33W chính hãng Samsung hỗ trợ công nghệ Super Fast Charging, sạc Galaxy S23/S24 nhanh gấp đôi so với sạc thường. Đầu ra Type-C tương thích ngược với củ sạc PD thông thường nên dùng được cho nhiều thiết bị.",
    specs: [
      { label: "Công suất", value: "33W" },
      { label: "Đầu ra", value: "USB-C" },
      { label: "Chuẩn sạc", value: "PD, QC, Samsung Super Fast Charging" },
    ],
  },

  /* ---------------------------- TAI NGHE ---------------------------- */
  {
    name: "Tai nghe Bluetooth 5.3 chống nước tai nghe không dây",
    slug: "tai-nghe-bluetooth-5-3-chong-nuoc",
    sku: "TZ-TNG-001",
    category: "tai-nghe",
    brand: "baseus",
    price: 449000,
    salePrice: 279000,
    stock: 180,
    soldCount: 434,
    ratingAverage: 4.5,
    ratingCount: 176,
    badge: "Bán chạy",
    isFeatured: true,
    shortDescription:
      "Tai nghe Bluetooth 5.3 không dây, chống nước IPX5, pin 30 giờ, chất lượng âm thanh sống động.",
    description:
      "Tai nghe Bluetooth 5.3 sử dụng driver 10mm cho âm thanh sống động, âm trầm chắc và treo rõ ràng. Công nghệ chống ồn ENC giúp lọc tạp âm khi gọi điện thoại. Thời gian nghe nhạc lên đến 30 giờ và sạc nhanh 10 phút cho 2 giờ sử dụng.",
    specs: [
      { label: "Bluetooth", value: "5.3" },
      { label: "Driver", value: "10mm" },
      { label: "Chống nước", value: "IPX5" },
      { label: "Pin", value: "Nghe nhạc đến 30 giờ" },
      { label: "Sạc nhanh", value: "10 phút sạc = 2 giờ dùng" },
      { label: "Micro", value: "2 micro chống ồn ENC" },
    ],
    faq: [
      {
        question: "Tai nghe có hỗ trợ gọi điện thoại không?",
        answer:
          "Có. Tai nghe có 2 micro với công nghệ ENC giúp giảm tiếng ồn xung quanh, giúp giọng nói rõ ràng hơn.",
      },
      {
        question: "Có dùng được với iPhone và Android không?",
        answer:
          "Có, tai nghe tương thích phổ quát với cả iOS và Android qua Bluetooth 5.3.",
      },
    ],
  },
  {
    name: "Tai nghe gaming Logitech G522 có dây RGB",
    slug: "tai-nghe-gaming-logitech-g522-co-day-rgb",
    sku: "TZ-TNG-002",
    category: "tai-nghe",
    brand: "logitech",
    price: 1490000,
    salePrice: 1190000,
    stock: 35,
    soldCount: 64,
    ratingAverage: 4.7,
    ratingCount: 28,
    shortDescription:
      "Tai nghe gaming Logitech G522 có dây, driver 50mm, đèn RGB và micro rời có khử ồn.",
    description:
      "Tai nghe gaming Logitech G522 sử dụng driver 50mm cho âm thanh chi tiết, dải tần rộng, xử lý tốt tiếng bước chân và âm thanh xung quanh trong game. Đèn LED RGB 16.8 triệu màu tạo không gian chiến game huyền ảo. Micro rời có khả năng khử ồn, đi kèm cổng cắm 3.5mm và USB.",
    specs: [
      { label: "Driver", value: "50mm" },
      { label: "Kết nối", value: "Có dây, cổng 3.5mm + USB (đèn)" },
      { label: "Đèn", value: "RGB 16.8 triệu màu" },
      { label: "Micro", value: "Rời, khử ồn" },
      { label: "Trọng lượng", value: "~300g" },
    ],
  },
  {
    name: "Tai nghe Bluetooth chống nước cho chạy thể thao",
    slug: "tai-nghe-bluetooth-chong-nuoc-cho-chay-the-thao",
    sku: "TZ-TNG-003",
    category: "tai-nghe",
    brand: "baseus",
    price: 590000,
    salePrice: 399000,
    stock: 65,
    soldCount: 78,
    ratingAverage: 4.3,
    ratingCount: 35,
    shortDescription:
      "Tai nghe Bluetooth thể thao IPX7 không dây, móc tai chắc chắn, pin 8 giờ, sạc nhanh.",
    description:
      "Tai nghe Bluetooth thể thao thiết kế móc tai silicone mềm giúp cố định tai khi chạy, tập gym hay di chuyển. Chống nước IPX7 nên không sợ mưa và mồ hôi. Pin 8 giờ sử dụng, sạc nhanh qua cổng Type-C.",
    specs: [
      { label: "Bluetooth", value: "5.3" },
      { label: "Chống nước", value: "IPX7" },
      { label: "Pin", value: "8 giờ nghe nhạc" },
      { label: "Thiết kế", value: "Móc tai silicone" },
    ],
  },
  {
    name: "Tai nghe chơi game không dây Razer BlackShade V2",
    slug: "tai-nghe-choi-game-khong-day-razer-blackshade-v2",
    sku: "TZ-TNG-004",
    category: "tai-nghe",
    brand: "razer",
    price: 2390000,
    salePrice: 1990000,
    stock: 22,
    soldCount: 41,
    ratingAverage: 4.8,
    ratingCount: 19,
    shortDescription:
      "Tai nghe gaming Razer BlackShade V2 không dây 2.4GHz, micro rời, pin 30 giờ, âm thanh vòm 7.1.",
    description:
      "Razer BlackShade V2 là tai nghe gaming không dây 2.4GHz với micro rời có khử ồn và đèn RGB. Kết nối không dây 2.4GHz cho độ trễ cực thấp, phù hợp thi đấu game. Pin 30 giờ và hỗ trợ nghe qua Bluetooth.",
    specs: [
      { label: "Kết nối", value: "2.4GHz không dây + Bluetooth" },
      { label: "Driver", value: "50mm" },
      { label: "Pin", value: "30 giờ" },
      { label: "Micro", value: "Rời, khử ồn" },
      { label: "Đèn", value: "RGB" },
    ],
  },

  /* -------------------------- SẠC DỰ PHÒNG -------------------------- */
  {
    name: "Sạc dự phòng 10000mAh sạc nhanh 22.5W",
    slug: "sac-du-phong-10000mah-sac-nhanh-225w",
    sku: "TZ-SDP-001",
    category: "sac-du-phong",
    brand: "baseus",
    price: 590000,
    salePrice: 399000,
    stock: 145,
    soldCount: 587,
    ratingAverage: 4.7,
    ratingCount: 203,
    badge: "Bán chạy",
    isFeatured: true,
    shortDescription:
      "Sạc dự phòng 10000mAh sạc nhanh 22.5W, có màn hình hiển thị pin, sạc được 3 thiết bị.",
    description:
      "Sạc dự phòng 10000mAh hỗ trợ sạc nhanh 22.5W, có màn hình LED hiển thị chính xác phần trăm pin còn lại. Có 3 cổng ra, có thể sạc đồng thời điện thoại, tai nghe và smartwatch. Được bảo vệ bằng chip quản lý nguồn đa lớp chống nhiệt, chống nổ.",
    specs: [
      { label: "Dung lượng", value: "10.000mAh" },
      { label: "Cổng sạc ra", value: "1x USB-C, 2x USB-A" },
      { label: "Công suất", value: "22.5W" },
      { label: "Hiển thị", value: "Màn hình LED số" },
      { label: "Bảo vệ", value: "Chống quá nhiệt, quá dòng, ngắn mạch" },
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
    name: "Sạc dự phòng không dây 10000mAh có từ tính",
    slug: "sac-du-phong-khong-day-10000mah-co-tu-tinh",
    sku: "TZ-SDP-002",
    category: "sac-du-phong",
    brand: "anker",
    price: 890000,
    salePrice: 699000,
    stock: 70,
    soldCount: 156,
    ratingAverage: 4.8,
    ratingCount: 71,
    badge: "Hot",
    isFeatured: true,
    shortDescription:
      "Sạc dự phòng không dây 10000mAh hỗ trợ MagSafe, sạc nhanh 20W cho iPhone và tai nghe.",
    description:
      "Sạc dự phòng không dây 10000mAh tích hợp từ tính MagSafe, đặt iPhone lên là sạc ngay không cần cắm dây. Công suất sạc không dây 15W và có dây 20W. Thiết kế nhỏ gọn, mặt lưng có đèn LED báo trạng thái.",
    specs: [
      { label: "Dung lượng", value: "10.000mAh" },
      { label: "Sạc không dây", value: "15W MagSafe" },
      { label: "Sạc có dây", value: "20W USB-C" },
      { label: "Cổng", value: "USB-C, USB-A" },
      { label: "Số lần sạc", value: "Khoảng 2 lần cho iPhone 15" },
    ],
  },
  {
    name: "Pin sạc dự phòng 20000mAh PowerCore của Anker",
    slug: "pin-sac-du-phong-20000mah-powercore-anker",
    sku: "TZ-SDP-003",
    category: "sac-du-phong",
    brand: "anker",
    price: 1290000,
    salePrice: 999000,
    stock: 48,
    soldCount: 143,
    ratingAverage: 4.7,
    ratingCount: 68,
    shortDescription:
      "Pin sạc dự phòng 20000mAh Anker PowerCore, sạc nhanh 18W, ba cổng ra cho nhiều thiết bị.",
    description:
      "Anker PowerCore 20000mAh là pin sạc dự phòng công suất lớn dành cho người dùng di chuyển nhiều hoặc đi du lịch. Ba cổng ra cho phép sạc đồng thời điện thoại, máy tính bảng và tai nghe. Công nghệ PowerIQ và MultiProtect bảo vệ thiết bị an toàn tuyệt đối.",
    specs: [
      { label: "Dung lượng", value: "20.000mAh" },
      { label: "Sạc ra", value: "1x USB-C, 2x USB-A" },
      { label: "Công suất", value: "18W" },
      { label: "Bảo vệ", value: "MultiProtect, PowerIQ" },
    ],
  },
  {
    name: "Sạc dự phòng 20000mAh Type-C sạc nhanh 30W",
    slug: "sac-du-phong-20000mah-type-c-sac-nhanh-30w",
    sku: "TZ-SDP-004",
    category: "sac-du-phong",
    brand: "ugreen",
    price: 990000,
    salePrice: 749000,
    stock: 55,
    soldCount: 87,
    ratingAverage: 4.5,
    ratingCount: 41,
    shortDescription:
      "Sạc dự phòng 20000mAh cổng Type-C hai chiều, sạc nhanh 30W, màn hình LED.",
    description:
      "Sạc dự phòng 20000mAh với cổng Type-C hai chiều, vừa sạc cho điện thoại vừa sạc lại bằng chính cổng Type-C. Công suất sạc nhanh 30W đủ sạc cho iPad và nhiều thiết bị cùng lúc.",
    specs: [
      { label: "Dung lượng", value: "20.000mAh" },
      { label: "Sạc ra", value: "30W Type-C" },
      { label: "Sạc vào", value: "Type-C hai chiều" },
      { label: "Hiển thị", value: "Màn hình LED %" },
    ],
  },

  /* ------------------------- KÍNH CƯỜNG LỰC ------------------------- */
  {
    name: "Kính cường lực iPhone 15 chống xước full màn hình",
    slug: "kinh-cuong-luc-iphone-15-chong-xuoc-full-man-hinh",
    sku: "TZ-KCL-001",
    category: "kinh-cuong-luc",
    brand: "baseus",
    price: 390000,
    salePrice: 199000,
    stock: 300,
    soldCount: 745,
    ratingAverage: 4.6,
    ratingCount: 289,
    badge: "Bán chạy",
    isFeatured: true,
    shortDescription:
      "Kính cường lực iPhone 15 chống xước, chống vân tay, chống lóa, độ cứng 9H full màn hình.",
    description:
      "Kính cường lực iPhone 15 với độ cứng 9H chống xước, lớp phủ chống vân tay và chống lóa giúp màn hình hiển thị sắc nét dưới ánh sáng mạnh. Keo dán hợp kim OCA cho độ bám dính cao, không để lọt bụi và dễ tháo gỡ. Kèm khăn lau và dụng cụ lắp đặt.",
    specs: [
      { label: "Độ cứng", value: "9H" },
      { label: "Tính năng", value: "Chống xước, chống vân tay, chống lóa" },
      { label: "Dán", value: "Keo OCA full màn hình" },
      { label: "Tương thích", value: "iPhone 15 / 15 Plus" },
      { label: "Trong hộp", value: "1 kính + khăn lau + dụng cụ" },
    ],
    faq: [
      {
        question: "Dán kính có ảnh hưởng cảm ứng không?",
        answer:
          "Không. Kính mỏng 0.25mm, độ nhạy cảm ứng gần như không thay đổi, đầu cảm ứng khớp hoàn toàn.",
      },
      {
        question: "Kính có che camera trước không?",
        answer:
          "Không. Phiên bản full màn hình có thiết kế khoét vừa khít camera, không làm ảnh hưởng chất lượng ảnh.",
      },
    ],
  },
  {
    name: "Kính cường lực Samsung Galaxy S24 chống xước 9H",
    slug: "kinh-cuong-luc-samsung-galaxy-s24-chong-xuoc-9h",
    sku: "TZ-KCL-002",
    category: "kinh-cuong-luc",
    brand: "samsung",
    price: 350000,
    salePrice: 189000,
    stock: 220,
    soldCount: 386,
    ratingAverage: 4.5,
    ratingCount: 142,
    shortDescription:
      "Kính cường lực Samsung Galaxy S24 độ cứng 9H chống xước, chống vân tay, dán dễ.",
    description:
      "Kính cường lực dành riêng cho Samsung Galaxy S24 với lớp kính cường lực 9H chịu lực va đập mạnh. Bề mặt chống vân tay giúp màn hình luôn sạch và hiển thị rõ nét.",
    specs: [
      { label: "Độ cứng", value: "9H" },
      { label: "Tương thích", value: "Samsung Galaxy S24" },
      { label: "Tính năng", value: "Chống xước, chống vân tay" },
    ],
  },
  {
    name: "Kính cường lực iPhone 15 Pro có camera viền kim loại",
    slug: "kinh-cuong-luc-iphone-15-pro-co-camera-vien-kim-loai",
    sku: "TZ-KCL-003",
    category: "kinh-cuong-luc",
    brand: "ugreen",
    price: 490000,
    salePrice: 349000,
    stock: 130,
    soldCount: 165,
    ratingAverage: 4.4,
    ratingCount: 57,
    shortDescription:
      "Kính cường lực iPhone 15 Pro kèm khung viền kim loại bảo vệ cụm camera, sang trọng và bền.",
    description:
      "Kính cường lực iPhone 15 Pro được bọc viền kim loại ở phần camera, vừa bảo vệ lens vừa tạo cảm giác cao cấp. Lớp phủ chống lóa ánh sáng mạnh, màn hình hiển thị sắc nét dù ngoài trời.",
    specs: [
      { label: "Độ cứng", value: "9H" },
      { label: "Đặc điểm", value: "Viền kim loại bảo vệ camera" },
      { label: "Tương thích", value: "iPhone 15 Pro / Pro Max" },
    ],
  },
  {
    name: "Kính cường lực chống nhìn trộm Privacy cho iPhone",
    slug: "kinh-cuong-luc-chong-nhin-trom-privacy",
    sku: "TZ-KCL-004",
    category: "kinh-cuong-luc",
    brand: "baseus",
    price: 690000,
    salePrice: 449000,
    stock: 65,
    soldCount: 97,
    ratingAverage: 4.2,
    ratingCount: 41,
    shortDescription:
      "Kính cường lực chống nhìn trộm Privacy 4 góc, bảo vệ thông tin cá nhân trong điện thoại công cộng.",
    description:
      "Kính cường lực Privacy sử dụng công nghệ lọc góc nhìn, chỉ hiển thị rõ nội dung khi bạn nhìn thẳng vào màn hình. Bảo vệ thông tin cá nhân khi sử dụng điện thoại ở nơi công cộng như sân bay, quán cà phê.",
    specs: [
      { label: "Tính năng", value: "Chống nhìn trộm 4 góc" },
      { label: "Độ cứng", value: "9H" },
      { label: "Tương thích", value: "iPhone 15 series" },
    ],
  },

  /* ------------------------ GIÁ ĐỠ ĐIỆN THOẠI ------------------------ */
  {
    name: "Giá đỡ điện thoại để bàn nhôm có thể điều chỉnh",
    slug: "gia-do-dien-thoai-de-ban-nhom-co-the-dieu-chinh",
    sku: "TZ-GDD-001",
    category: "gia-do-dien-thoai",
    brand: "baseus",
    price: 320000,
    salePrice: 199000,
    stock: 160,
    soldCount: 312,
    ratingAverage: 4.5,
    ratingCount: 128,
    badge: "Bán chạy",
    isFeatured: true,
    shortDescription:
      "Giá đỡ điện thoại để bàn bằng nhôm, điều chỉnh độ cao và góc nghiêng, chân chống trơn.",
    description:
      "Giá đỡ điện thoại để bàn làm từ hợp kim nhôm chắc chắn, hỗ trợ điện thoại từ 4 inch đến 7 inch. Trục xoay 360 độ cho phép điều chỉnh góc nghiêng thoải mái, đế silicone chống trơn và bảo vệ mặt bàn. Phù hợp xem phim, học online, livestream.",
    specs: [
      { label: "Chất liệu", value: "Hợp kim nhôm + silicone" },
      { label: "Kích thước máy", value: "4 - 7 inch" },
      { label: "Xoay", value: "360 độ" },
      { label: "Độ cao", value: "Điều chỉnh được" },
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
    name: "Giá đỡ điện thoại kẹp xe máy có sạc không dây",
    slug: "gia-do-dien-thoai-kep-xe-may-co-sac-khong-day",
    sku: "TZ-GDD-002",
    category: "gia-do-dien-thoai",
    brand: "baseus",
    price: 490000,
    salePrice: 329000,
    stock: 95,
    soldCount: 138,
    ratingAverage: 4.3,
    ratingCount: 55,
    shortDescription:
      "Giá đỡ điện thoại kẹp xe máy kết hợp sạc không dây 15W, chống rung và chống nước.",
    description:
      "Giá đỡ điện thoại kẹp xe máy tích hợp sạc không dây 15W, giúp bạn vừa đi vừa sạc mà không lo hết pin giữa đường. Cánh tay chống rung silicone giữ điện thoại ổn định trên đường gồ ghề, chuẩn IPX6 chống nước.",
    specs: [
      { label: "Sạc không dây", value: "15W" },
      { label: "Chống rung", value: "Cánh tay silicone 4 chấm" },
      { label: "Chống nước", value: "IPX6" },
      { label: "Tương thích", value: "Điện thoại 4 - 7 inch" },
    ],
  },
  {
    name: "Tripod chân linh điện thoại có điều khiển từ xa",
    slug: "tripod-chan-linh-dien-thoai-co-dieu-khien-tu-xa",
    sku: "TZ-GDD-003",
    category: "gia-do-dien-thoai",
    brand: "ugreen",
    price: 450000,
    salePrice: 299000,
    stock: 120,
    soldCount: 176,
    ratingAverage: 4.4,
    ratingCount: 72,
    shortDescription:
      "Tripod chân linh điện thoại có điều khiển từ xa, chân xếp gọn, quay video và livestream dễ dàng.",
    description:
      "Tripod chân linh dùng cho điện thoại với chân xếp gọn chỉ 26cm, dễ mang theo. Kèm cáp sạc không dây và điều khiển từ xa Bluetooth để chụp ảnh, quay video không cần chạm vào máy. Bộ kẹp xoay 360 độ hỗ trợ màn hình ngang và dọc.",
    specs: [
      { label: "Chiều cao", value: "26cm gấp gọn" },
      { label: "Điều khiển", value: "Bluetooth từ xa" },
      { label: "Kẹp", value: "Xoay 360 độ" },
      { label: "Phụ kiện", value: "Cáp sạc không dây + túi đựng" },
    ],
  },
  {
    name: "Giá đỡ iPad và điện thoại đa năng có thể điều chỉnh",
    slug: "gia-do-ipad-va-dien-thoai-da-nang-co-the-dieu-chinh",
    sku: "TZ-GDD-004",
    category: "gia-do-dien-thoai",
    brand: "ugreen",
    price: 590000,
    salePrice: 429000,
    stock: 60,
    soldCount: 84,
    ratingAverage: 4.2,
    ratingCount: 36,
    shortDescription:
      "Giá đỡ iPad và điện thoại đa năng bằng thép, điều chỉnh chiều cao và góc độ linh hoạt.",
    description:
      "Giá đỡ đa năng bằng thép không gỉ dành cho iPad và điện thoại, trục chỉnh 2 chiều giúp bạn đặt máy ở bất kỳ góc độ nào. Chân đế rộng chống đổ, giữ được cả máy tính bảng nặng.",
    specs: [
      { label: "Chất liệu", value: "Thép không gỉ" },
      { label: "Tương thích", value: "iPad 10 - 12.9 inch, điện thoại" },
      { label: "Điều chỉnh", value: "Chiều cao + góc nghiêng" },
    ],
  },

  /* -------------------------- PHỤ KIỆN LAPTOP -------------------------- */
  {
    name: "Hub USB-C 7 cổng mở rộng HDMI 4K cho laptop",
    slug: "hub-usb-c-7-cong-mo-rong-hdmi-4k-cho-laptop",
    sku: "TZ-PKL-001",
    category: "phu-kien-laptop",
    brand: "ugreen",
    price: 1290000,
    salePrice: 890000,
    stock: 42,
    soldCount: 178,
    ratingAverage: 4.7,
    ratingCount: 82,
    badge: "Hot",
    isFeatured: true,
    shortDescription:
      "Hub USB-C 7 cổng mở rộng HDMI 4K, hỗ trợ xuất hình 4K60Hz, sạc laptop PD 100W.",
    description:
      "Hub USB-C 7 cổng mở rộng giúp biến một cổng USB-C thành 7 cổng tiện dụng: HDMI 4K, USB 3.0, cổng sạc PD 100W, đầu đọc thẻ SD/TF và cổng LAN. Thiết kế vỏ nhôm giúp tản nhiệt tốt, hoạt động ổn định trong thời gian dài.",
    specs: [
      { label: "Số cổng", value: "7 cổng" },
      { label: "Xuất hình", value: "HDMI 4K60Hz" },
      { label: "Sạc", value: "PD 100W passthrough" },
      { label: "USB", value: "2x USB 3.0, 2x USB 2.0" },
      { label: "Đọc thẻ", value: "SD + TF" },
      { label: "Mạng", value: "RJ45 Gigabit" },
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
    name: "Túi chống sốc laptop 15.6 inch chống nước",
    slug: "tui-chong-soc-laptop-156-inch-chong-nuoc",
    sku: "TZ-PKL-002",
    category: "phu-kien-laptop",
    brand: "baseus",
    price: 690000,
    salePrice: 449000,
    stock: 88,
    soldCount: 214,
    ratingAverage: 4.5,
    ratingCount: 97,
    shortDescription:
      "Túi chống sốc laptop 15.6 inch, chống nước, nhiều ngăn, đệm êm bảo vệ máy.",
    description:
      "Túi chống sốc laptop 15.6 inch có lớp đệm êm ở hai mặt, chống sốc và chống nước bên ngoài. Nhiều ngăn nhỏ để cất sạc, chuột, ổ cứng di động, khăn gạc. Dây đeo vai tháo rời tiện mang đi.",
    specs: [
      { label: "Kích thước", value: "15.6 inch" },
      { label: "Chất liệu", value: "Polyester chống nước" },
      { label: "Ngăn", value: "1 ngăn chính + 3 ngăn phụ" },
      { label: "Tính năng", value: "Chống sốc, chống nước, dây đeo vai" },
    ],
  },
  {
    name: "Chuột không dây silent cho laptop và văn phòng",
    slug: "chuot-khong-day-silent-cho-laptop-va-van-phong",
    sku: "TZ-PKL-003",
    category: "phu-kien-laptop",
    brand: "logitech",
    price: 590000,
    salePrice: 419000,
    stock: 110,
    soldCount: 163,
    ratingAverage: 4.6,
    ratingCount: 74,
    shortDescription:
      "Chuột không dây silent cho laptop, kết nối 2.4GHz và Bluetooth, pin dùng 12 tháng.",
    description:
      "Chuột không dây với cơ bấm silent cho phép làm việc trong văn phòng hay thư viện mà không gây tiếng ồn. Kết nối linh hoạt qua receiver 2.4GHz hoặc Bluetooth, chuyển đổi giữa 3 thiết bị. Pin AA cho thời gian sử dụng đến 12 tháng.",
    specs: [
      { label: "Kết nối", value: "2.4GHz + Bluetooth (3 thiết bị)" },
      { label: "Cảm biến", value: "Quang học 1600 DPI" },
      { label: "Cơ bấm", value: "Silent" },
      { label: "Pin", value: "1 x AA, tới 12 tháng" },
    ],
  },
  {
    name: "Bàn phím cơ không dây cho laptop và desktop",
    slug: "ban-phim-co-khong-day-cho-laptop-va-desktop",
    sku: "TZ-PKL-004",
    category: "phu-kien-laptop",
    brand: "logitech",
    price: 1890000,
    salePrice: 1490000,
    stock: 28,
    soldCount: 57,
    ratingAverage: 4.8,
    ratingCount: 26,
    shortDescription:
      "Bàn phím cơ không dây kết nối Bluetooth và 2.4GHz, switch cơ, đèn nền RGB.",
    description:
      "Bàn phím cơ không dây gọn nhẹ dùng switch cơ có phản hồi rõ ràng, hỗ trợ kết nối đồng thời 3 thiết bị qua Bluetooth và receiver 2.4GHz. Đèn nền RGB tùy chỉnh theo sở thích, pin sạc cho thời gian sử dụng lâu dài.",
    specs: [
      { label: "Switch", value: "Cơ" },
      { label: "Kết nối", value: "Bluetooth + 2.4GHz" },
      { label: "Đèn", value: "RGB tùy chỉnh" },
      { label: "Pin", value: "Sạc USB-C" },
    ],
  },

  /* -------------------------- PHỤ KIỆN GAMING -------------------------- */
  {
    name: "Chuột gaming không dây 12000 DPI RGB",
    slug: "chuot-gaming-khong-day-12000-dpi-rgb",
    sku: "TZ-PKG-001",
    category: "phu-kien-gaming",
    brand: "razer",
    price: 1490000,
    salePrice: 1090000,
    stock: 40,
    soldCount: 132,
    ratingAverage: 4.7,
    ratingCount: 61,
    badge: "Bán chạy",
    isFeatured: true,
    shortDescription:
      "Chuột gaming không dây 12000 DPI, sensor quang học chính xác, đèn RGB 8 chế độ, pin 70 giờ.",
    description:
      "Chuột gaming không dây trang bị sensor quang học độ phân giải lên tới 12000 DPI cho độ chính xác tuyệt đối trong FPS. Đèn RGB 8 chế độ tùy chỉnh, 6 nút lập trình sẵn, kết nối 2.4GHz độ trễ 1ms. Pin cho thời gian sử dụng lên đến 70 giờ.",
    specs: [
      { label: "DPI", value: "12.000" },
      { label: "Sensor", value: "Quang học" },
      { label: "Kết nối", value: "2.4GHz không dây" },
      { label: "Độ trễ", value: "1ms" },
      { label: "Đèn", value: "RGB 8 chế độ" },
      { label: "Pin", value: "Tới 70 giờ" },
    ],
  },
  {
    name: "Chuột gaming có dây Razer DeathAdder V2",
    slug: "chuot-gaming-co-day-razer-deathadder-v2",
    sku: "TZ-PKG-002",
    category: "phu-kien-gaming",
    brand: "razer",
    price: 1090000,
    salePrice: 849000,
    stock: 55,
    soldCount: 118,
    ratingAverage: 4.8,
    ratingCount: 58,
    shortDescription:
      "Chuột gaming có dây Razer DeathAdder V2, sensor 20.000 DPI, switch quang 70 triệu lần bấm.",
    description:
      "Razer DeathAdder V2 là chuột gaming có dây với sensor quang học 20.000 DPI cho phép chỉnh đích tuyệt đối. Switch quang học bền tới 70 triệu lần bấm, kết nối USB có dây không bị độ trễ.",
    specs: [
      { label: "DPI", value: "20.000" },
      { label: "Switch", value: "Quang học, 70 triệu lần bấm" },
      { label: "Kết nối", value: "USB có dây" },
      { label: "Trọng lượng", value: "~62g" },
    ],
  },
  {
    name: "Tay cầm chơi game điện thoại kết nối Bluetooth",
    slug: "tay-cam-choi-game-dien-thoai-ket-noi-bluetooth",
    sku: "TZ-PKG-003",
    category: "phu-kien-gaming",
    brand: "baseus",
    price: 590000,
    salePrice: 379000,
    stock: 72,
    soldCount: 147,
    ratingAverage: 4.2,
    ratingCount: 63,
    shortDescription:
      "Tay cầm chơi game điện thoại Bluetooth, cần bấm 3D, hỗ trợ Android và iOS, pin 20 giờ.",
    description:
      "Tay cầm chơi game điện thoại kết nối Bluetooth với cần bấm 3D chính xác, rung phản hồi và nút bấm phụ. Tương thích với game mobile trên Android và iOS, giúp bạn có lợi thế trong các game FPS.",
    specs: [
      { label: "Kết nối", value: "Bluetooth 5.0" },
      { label: "Cần", value: "3D chống trượt" },
      { label: "Phản hồi", value: "Rung" },
      { label: "Pin", value: "Tới 20 giờ" },
      { label: "Tương thích", value: "Android, iOS" },
    ],
  },
  {
    name: "Đèn LED dây gaming 5m có điều khiển từ xa",
    slug: "den-led-day-gaming-5m-co-dieu-khien-tu-xa",
    sku: "TZ-PKG-004",
    category: "phu-kien-gaming",
    brand: "razer",
    price: 390000,
    salePrice: 249000,
    stock: 90,
    soldCount: 96,
    ratingAverage: 4.0,
    ratingCount: 40,
    shortDescription:
      "Đèn LED dây gaming 5m, 16 triệu màu, điều khiển qua app và remote, cắm USB.",
    description:
      "Dây đèn LED gaming dài 5m với 16 triệu màu tùy chỉnh, điều khiển dễ dàng qua app điện thoại hoặc remote. Cắm trực tiếp vào cổng USB của PC hoặc laptop, phù hợp trang trí góc gaming.",
    specs: [
      { label: "Chiều dài", value: "5m" },
      { label: "Màu sắc", value: "16 triệu màu RGB" },
      { label: "Điều khiển", value: "App + remote" },
      { label: "Nguồn", value: "USB" },
    ],
  },
  {
    name: "Tay cầm chơi game không dây Razer Wolverine V2",
    slug: "tay-cam-choi-game-khong-day-razer-wolverine-v2",
    sku: "TZ-PKG-005",
    category: "phu-kien-gaming",
    brand: "razer",
    price: 2890000,
    salePrice: 2390000,
    stock: 18,
    soldCount: 33,
    ratingAverage: 4.7,
    ratingCount: 14,
    shortDescription:
      "Tay cầm chơi game không dây Razer Wolverine V2 cho Xbox, PC và mobile, cần analog.",
    description:
      "Tay cầm Razer Wolverine V2 mang đến trải nghiệm chơi game console đỉnh cao trên PC và mobile. Kết nối không dây 2.4GHz với độ trễ thấp, cần analog chính xác, nút Xbox hợp lệ.",
    specs: [
      { label: "Kết nối", value: "2.4GHz không dây" },
      { label: "Tương thích", value: "PC, Xbox, mobile" },
      { label: "Cần", value: "Analog + Hall effect" },
      { label: "Pin", value: "Tới 30 giờ" },
    ],
  },
  {
    name: "Loa bluetooth di động chống nước 20W",
    slug: "loa-bluetooth-di-dong-chong-nuoc-20w",
    sku: "TZ-PKG-006",
    category: "phu-kien-gaming",
    brand: "ugreen",
    price: 1290000,
    salePrice: 890000,
    stock: 45,
    soldCount: 88,
    ratingAverage: 4.5,
    ratingCount: 37,
    shortDescription:
      "Loa Bluetooth di động 20W IPX7, bass mạnh, pin 24 giờ, kết nối ghép nối stereo.",
    description:
      "Loa Bluetooth di động 20W với driver kép cho âm thanh cân bằng, bass dày và sâu. Chuẩn IPX7 chống nước hoàn toàn, pin 24 giờ sử dụng, hỗ trợ ghép nối 2 loa tạo hiệu ứng stereo.",
    specs: [
      { label: "Công suất", value: "20W" },
      { label: "Chống nước", value: "IPX7" },
      { label: "Pin", value: "Tới 24 giờ" },
      { label: "Kết nối", value: "Bluetooth 5.3, ghép stereo" },
    ],
  },
];
