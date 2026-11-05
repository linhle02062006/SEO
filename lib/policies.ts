import type { FaqItem } from "@/types";

export type PolicySection = {
  heading: string;
  body: string[];
  list?: string[];
};

export type Policy = {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  updatedAt: string;
  sections: PolicySection[];
  faq: FaqItem[];
};

export const POLICIES: Policy[] = [
  {
    slug: "chinh-sach-bao-hanh",
    title: "Chính sách bảo hành",
    seoTitle: "Chính sách bảo hành sản phẩm",
    seoDescription:
      "Chính sách bảo hành 12 tháng cho phụ kiện điện thoại tại TechZone: điều kiện bảo hành, quy trình gửi bảo hành và thời gian xử lý.",
    intro:
      "Mọi sản phẩm tại TechZone đều là hàng chính hãng, có nguồn gốc rõ ràng và được bảo hành trực tiếp bởi nhà sản xuất hoặc nhà phân phối ủy quyền tại Việt Nam.",
    updatedAt: "2025-01-10",
    sections: [
      {
        heading: "Thời hạn bảo hành",
        body: [
          "Tất cả sản phẩm phụ kiện điện thoại, tai nghe, sạc dự phòng và phụ kiện laptop tại TechZone được bảo hành 12 tháng kể từ ngày nhận hàng, trừ các linh kiện tiêu hao có quy định riêng.",
        ],
        list: [
          "Cáp sạc, củ sạc: 12 tháng (không bao gồm hao mòn do cắm kéo dài)",
          "Tai nghe Bluetooth: 12 tháng (bao gồm lỗi pin và loa)",
          "Sạc dự phòng: 12 tháng (dung lượng thực tế tối thiểu 90% dung lượng danh định)",
          "Ốp lưng, kính cường lực, giá đỡ: 12 tháng với lỗi kỹ thuật sản xuất",
          "Phụ kiện gaming, phụ kiện laptop: 12 tháng",
        ],
      },
      {
        heading: "Điều kiện được bảo hành",
        body: [
          "Sản phẩm được bảo hành khi lỗi do nhà sản xuất, xuất hiện trong thời gian bảo hành và sản phẩm còn nguyên trạng, chưa qua sửa chữa hoặc can thiệp từ bên thứ ba.",
        ],
      },
      {
        heading: "Trường hợp không được bảo hành",
        body: ["Sản phẩm sẽ không được bảo hành trong các trường hợp sau:"],
        list: [
          "Lỗi do rơi, vật lý, va chạm, ngâm nước hoặc để trong môi trường ẩm mốc",
          "Lỗi do sử dụng sai mục đích, sạc quá công suất thiết kế, cắm ngược chiều",
          "Lỗi do phần mềm, jailbreak, cài đặt ứng dụng không chính chủ",
          "Thiếu tem bảo hành, hóa đơn hoặc serial không khớp",
          "Hư hỏng do sét, điện áp bất thường, thiên tai",
          "Sản phẩm đã quá thời hạn bảo hành",
        ],
      },
      {
        heading: "Quy trình gửi bảo hành",
        body: [
          "Bạn không cần trực tiếp đến trung tâm bảo hành. TechZone sẽ tiếp nhận và xử lý trực tiếp, giúp bạn tiết kiệm thời gian.",
        ],
        list: [
          "Bước 1: Gửi mã đơn hàng và ảnh/video lỗi qua form liên hệ hoặc email 1350080137@sv.hcmunre.edu.vn",
          "Bước 2: Nhân viên kỹ thuật phản hồi trong 24 giờ làm việc với kết quả kiểm tra",
          "Bước 3: Gửi sản phẩm lỗi về TechZone (chúng tôi hỗ trợ chi phí vận chuyển chiều về)",
          "Bước 4: Đổi mới sản phẩm hoặc hoàn tiền trong 5-7 ngày làm việc",
        ],
      },
    ],
    faq: [
      {
        question: "Sản phẩm bị lỗi trong thời gian bảo hành thì mất phí không?",
        answer:
          "Không. Quá trình bảo hành hoàn toàn miễn phí, bao gồm cả chi phí vận chuyển gửi sản phẩm lỗi về TechZone.",
      },
      {
        question: "Tôi có thể bảo hành tại địa điểm gần nhà hơn không?",
        answer:
          "Bạn có thể gửi yêu cầu bảo hành kèm mã đơn hàng và hình ảnh lỗi qua form liên hệ — đội ngũ TechZone sẽ hỗ trợ trực tiếp và đồng hành xử lý ngay.",
      },
      {
        question: "Cần những gì để gửi bảo hành?",
        answer:
          "Mã đơn hàng (bắt buộc), ảnh hoặc video mô tả lỗi, và sản phẩm cùng phụ kiện đi kèm. Bạn không cần hóa đơn giấy vì TechZone lưu trữ dữ liệu đơn hàng trong hệ thống.",
      },
    ],
  },
  {
    slug: "chinh-sach-doi-tra",
    title: "Chính sách đổi trả",
    seoTitle: "Chính sách đổi trả 7 ngày",
    seoDescription:
      "Chính sách đổi trả sản phẩm trong 7 ngày tại TechZone: điều kiện đổi trả, quy trình hoàn tiền và trường hợp không được đổi trả.",
    intro:
      "TechZone cam kết sản phẩm đúng mô tả, đúng chất lượng. Nếu sản phẩm không phù hợp với mong muốn của bạn, bạn có 7 ngày để đổi hoặc hoàn tiền.",
    updatedAt: "2025-01-10",
    sections: [
      {
        heading: "Điều kiện đổi trả",
        body: [
          "Sản phẩm được đổi trả khi: chưa qua sử dụng, còn nguyên bao bì, phụ kiện đi kèm và tem bảo hành; có hóa đơn hoặc mã đơn hàng khớp với sản phẩm.",
        ],
      },
      {
        heading: "Thời hạn đổi trả",
        body: [
          "Thời hạn đổi trả tính từ ngày bạn nhận hàng là 7 ngày cho sản phẩm chưa sử dụng. Yêu cầu đổi trả sau 7 ngày chỉ được xử lý khi sản phẩm có lỗi kỹ thuật từ nhà sản xuất, theo chính sách bảo hành.",
        ],
      },
      {
        heading: "Quy trình đổi trả",
        body: ["Quy trình gồm 4 bước đơn giản:"],
        list: [
          "Bước 1: Gửi yêu cầu qua form liên hệ hoặc email 1350080137@sv.hcmunre.edu.vn kèm mã đơn hàng",
          "Bước 2: Nhân viên xác nhận đơn hàng có đủ điều kiện đổi trả trong 24 giờ",
          "Bước 3: Gửi sản phẩm về TechZone (miễn phí vận chuyển chiều về)",
          "Bước 4: Nhận lại sản phẩm mới hoặc hoàn tiền trong 3-5 ngày làm việc",
        ],
      },
      {
        heading: "Phí đổi trả",
        body: [
          "TechZone chịu toàn bộ chi phí vận chuyển hai chiều khi đổi trả do lỗi sản xẩm hoặc lỗi từ TechZone. Nếu bạn đổi trả do lý do cá nhân (ví dụ: mua nhầm màu), bạn chịu chi phí vận chuyển chiều đi.",
        ],
      },
      {
        heading: "Hoàn tiền",
        body: [
          "Tiền được hoàn lại cùng phương thức thanh toán ban đầu. Với COD, TechZone chuyển khoản trực tiếp về tài khoản ngân hàng của bạn trong 3-5 ngày làm việc. Với chuyển khoản ngân hàng, thời gian hoàn tiền phụ thuộc vào ngân hàng nhận (1-3 ngày làm việc).",
        ],
      },
    ],
    faq: [
      {
        question: "Đã dùng rồi có được đổi không?",
        answer:
          "Sản phẩm đã qua sử dụng không được đổi trả theo chính sách 7 ngày. Tuy nhiên nếu có lỗi kỹ thuật từ nhà sản xuất, bạn vẫn được bảo hành trong 12 tháng.",
      },
      {
        question: "Mất tem bảo hành thì có được đổi không?",
        answer:
          "Tem bảo hành bị mất khi sản phẩm vẫn còn nguyên bao bì và có mã đơn hàng vẫn được hỗ trợ đổi trả trong 7 ngày. Sau thời hạn này, tem bảo hành là căn cứ bảo hành.",
      },
      {
        question: "Chi phí vận chuyển khi đổi trả là bao nhiêu?",
        answer:
          "Miễn phí hoàn toàn khi lỗi thuộc về sản phẩm hoặc TechZone. Khi bạn tự ý đổi trả do cá nhân, bạn chịu chi phí vận chuyển chiều đi theo biểu phí của đơn vị vận chuyển.",
      },
    ],
  },
  {
    slug: "chinh-sach-van-chuyen",
    title: "Chính sách vận chuyển",
    seoTitle: "Chính sách vận chuyển & giao hàng",
    seoDescription:
      "Chính sách giao hàng TechZone: thời gian giao toàn quốc 24-48 giờ, phí vận chuyển, miễn phí cho đơn từ 300.000 đồng.",
    intro:
      "TechZone giao hàng toàn quốc qua đơn vị vận chuyển uy tín, có hỗ trợ theo dõi hành trình đơn hàng.",
    updatedAt: "2025-01-10",
    sections: [
      {
        heading: "Thời gian giao hàng",
        body: [
          "Thời gian giao hàng được tính từ thời điểm đơn hàng được xác nhận và chuẩn bị xong.",
        ],
        list: [
          "Nội thành Hồ Chí Minh, Hà Nội: 24 giờ làm việc",
          "Các tỉnh thành còn lại: 48 giờ làm việc",
          "Vùng xa, đảo lớn, khu vực giao lại không thuộc đơn vị vận chuyển: có thể 3-5 ngày",
          "Thời điểm cao điểm (dịp lễ, Tết, Black Friday): có thể chậm thêm 1-2 ngày",
        ],
      },
      {
        heading: "Phí vận chuyển",
        body: [
          "Đơn hàng từ 300.000 ₫ được miễn phí vận chuyển toàn quốc. Dưới mức này, phí vận chuyển đồng nhất 30.000 ₫/đơn.",
        ],
      },
      {
        heading: "Đơn vị vận chuyển",
        body: [
          "TechZone hợp tác với các đơn vị vận chuyển như Giao Hàng Nhanh, GHN Express, Viettel Post và SPX Express tùy theo khu vực giao hàng.",
        ],
      },
      {
        heading: "Theo dõi đơn hàng",
        body: [
          "Bạn sẽ nhận được mã vận đơn qua tin nhắn và email ngay sau khi đơn được gửi. Trạng thái đơn hàng cũng có thể tra cứu trực tiếp trên website bằng mã đơn hàng.",
        ],
      },
      {
        heading: "Kiểm tra khi nhận hàng",
        body: [
          "Bạn nên kiểm tra ngay số lượng, tình trạng sản phẩm và phụ kiện trước khi thanh toán với đơn COD. Nếu phát hiện sai sót, vui lòng từ chối nhận và ghi rõ trong biên bản bàn giao.",
        ],
      },
    ],
    faq: [
      {
        question: "Đơn hàng của tôi đang ở đâu?",
        answer:
          "Bạn tra cứu bằng mã đơn hàng dạng TZ250105A1B2C3 tại trang xác nhận đơn hàng, hoặc gửi email kèm mã đơn để được hỗ trợ tra cứu.",
      },
      {
        question: "Có giao hàng ngoài giờ làm việc không?",
        answer:
          "Chúng tôi chỉ giao hàng trong khung giờ 8:00-22:00 tất cả các ngày trong tuần để đảm bảo người nhận có mặt.",
      },
      {
        question: "Tôi có thể thay đổi địa chỉ giao hàng không?",
        answer:
          "Có, nếu đơn chưa chuyển sang trạng thái đang giao. Vui lòng gửi yêu cầu qua form liên hệ trong vòng 2 giờ sau khi đặt hàng.",
      },
    ],
  },
  {
    slug: "chinh-sach-bao-mat",
    title: "Chính sách bảo mật thông tin",
    seoTitle: "Chính sách bảo mật thông tin",
    seoDescription:
      "Chính sách bảo mật thông tin tại TechZone: cách thu thập, sử dụng và bảo vệ dữ liệu khách hàng theo Nghị định 13/2023/NĐ-CP.",
    intro:
      "TechZone tôn trọng dữ liệu cá nhân của khách hàng và cam kết xử lý thông tin minh bạch, an toàn theo quy định pháp luật.",
    updatedAt: "2025-01-10",
    sections: [
      {
        heading: "Thông tin chúng tôi thu thập",
        body: [
          "Khi bạn đặt hàng hoặc đăng ký tư vấn, TechZone thu thập: họ tên, số điện thoại, email, địa chỉ giao hàng và nội dung tin nhắn (nếu có).",
        ],
      },
      {
        heading: "Mục đích sử dụng",
        body: ["Thông tin chỉ được sử dụng cho các mục đích sau:"],
        list: [
          "Xác nhận, xử lý và giao đơn hàng",
          "Liên hệ tư vấn, hỗ trợ kỹ thuật và chăm sóc sau bán hàng",
          "Gửi thông báo về đơn hàng và chương trình khuyến mại (nếu bạn đồng ý)",
          "Phân tích dữ liệu ẩn danh để cải thiện trải nghiệm website",
        ],
      },
      {
        heading: "Chia sẻ dữ liệu",
        body: [
          "TechZone không bán, không trao đổi và không chia sẻ dữ liệu cá nhân của bạn cho bên thứ ba vì mục đích thương mại. Dữ liệu chỉ được chia sẻ với đơn vị vận chuyển ở mức tối thiểu cần thiết để giao hàng và cơ quan nhà nước có thẩm quyền theo yêu cầu pháp luật.",
        ],
      },
      {
        heading: "Bảo mật dữ liệu",
        body: [
          "Mật khẩu tài khoản được lưu dưới dạng băm bcrypt. Phiên đăng nhập dùng JWT trong cookie httpOnly, chống truy cập từ JavaScript. Kết nối cơ sở dữ liệu sử dụng kết nối mã hóa SSL/TLS trong môi trường production.",
        ],
      },
      {
        heading: "Quyền của bạn",
        body: [
          "Bạn có quyền yêu cầu xem, chỉnh sửa hoặc xóa dữ liệu cá nhân, cũng như rút lại sự đồng ý xử lý dữ liệu bất cứ lúc nào. Liên hệ 1350080137@sv.hcmunre.edu.vn để thực hiện quyền này.",
        ],
      },
      {
        heading: "Cookie",
        body: [
          "Website sử dụng cookie để duy trì phiên đăng nhập, ghi nhớ giỏ hàng và đo lường lưu lượng truy cập ẩn danh phục vụ tối ưu SEO. Bạn có thể tắt cookie trong cài đặt trình duyệt, tuy nhiên một số chức năng sẽ không hoạt động.",
        ],
      },
    ],
    faq: [
      {
        question: "Dữ liệu của tôi có được bán cho bên thứ ba không?",
        answer:
          "Không. TechZone không bán hay chia sẻ dữ liệu cá nhân của bạn cho bên thứ ba vì mục đích thương mại.",
      },
      {
        question: "Tôi có thể yêu cầu xóa dữ liệu không?",
        answer:
          "Có. Gửi yêu cầu qua 1350080137@sv.hcmunre.edu.vn kèm email hoặc số điện thoại đã đăng ký, chúng tôi xử lý trong tối đa 5 ngày làm việc.",
      },
    ],
  },
  {
    slug: "dieu-khoan-su-dung",
    title: "Điều khoản sử dụng",
    seoTitle: "Điều khoản sử dụng website",
    seoDescription:
      "Điều khoản sử dụng website TechZone: phạm vi sử dụng, quyền và nghĩa vụ của khách hàng, giới hạn trách nhiệm và luật áp dụng.",
    intro:
      "Việc truy cập và sử dụng website TechZone đồng nghĩa với việc bạn đã đọc và đồng ý với các điều khoản dưới đây.",
    updatedAt: "2025-01-10",
    sections: [
      {
        heading: "Phạm vi áp dụng",
        body: [
          "Điều khoản này áp dụng cho mọi truy cập vào website techzone.vn thuộc sở hữu của TechZone Việt Nam.",
        ],
      },
      {
        heading: "Quyền của khách hàng",
        body: ["Khi sử dụng website, bạn cam kết:"],
        list: [
          "Cung cấp thông tin chính xác và trung thực khi đặt hàng",
          "Không sử dụng website cho mục đích vi phạm pháp luật",
          "Không tự động thu thập dữ liệu (scraping) gây ảnh hưởng hoạt động của website",
          "Không đăng nội dung gây hại, phân biệt đối xử hoặc vi phạm quyền thương hiệu của bên thứ ba",
        ],
      },
      {
        heading: "Giá cả và khuyến mãi",
        body: [
          "Giá sản phẩm hiển thị trên website là giá bán lẻ tại thời điểm truy cập, đã bao gồm VAT. TechZone có quyền thay đổi giá, thông tin sản phẩm hoặc chương trình khuyến mãi, và thay đổi có hiệu lực kể từ thời điểm công bố trên website.",
        ],
      },
      {
        heading: "Giới hạn trách nhiệm",
        body: [
          "TechZone nỗ lực đảm bảo thông tin trên website chính xác và cập nhật. Tuy nhiên, màu sắc hiển thị có thể khác nhau giữa các thiết bị. TechZone không chịu trách nhiệm đối với thiệt hại phát sinh từ việc sử dụng sản phẩm không đúng hướng dẫn.",
        ],
      },
      {
        heading: "Luật áp dụng",
        body: [
          "Điều khoản này được giải thích và thực hiện theo pháp luật Việt Nam. Tranh chấp sẽ được giải quyết tại Tòa án nhân dân có thẩm quyền tại TP. Hồ Chí Minh.",
        ],
      },
    ],
    faq: [
      {
        question: "Giá trên website có bao gồm VAT không?",
        answer:
          "Có, tất cả giá hiển thị đã bao gồm VAT 10%. Phí vận chuyển được hiển thị riêng ở bước thanh toán.",
      },
      {
        question: "Tôi có thể đặt hàng bằng tài khoản doanh nghiệp không?",
        answer:
          "Hiện tại website hỗ trợ đặt hàng cá nhân. Với nhu cầu số lượng lớn, vui lòng liên hệ 1350080137@sv.hcmunre.edu.vn để được hỗ trợ báo giá sỉ.",
      },
    ],
  },
];

export function getPolicy(slug: string): Policy | undefined {
  return POLICIES.find((p) => p.slug === slug);
}
