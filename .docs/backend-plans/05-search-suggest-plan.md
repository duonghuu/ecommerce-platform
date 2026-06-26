# KẾ HOẠCH KỸ THUẬT BACK-END: TÌM KIẾM GỢI Ý (SEARCH SUGGEST)

## 1. THIẾT KẾ DỮ LIỆU (DATABASE SCHEMA)
Tính năng tìm kiếm gợi ý sẽ tái sử dụng trực tiếp bảng `Product` đã có trong hệ thống. Tuy nhiên, để tối ưu hoá hiệu năng cho tính năng search (thường xuyên được gọi), cần bổ sung Index.

**Cập nhật Bảng `Product`:**
- **Index:** Cần đánh chỉ mục (Indexing) cho trường `name` trong bảng `Product`. Nếu sử dụng MySQL/PostgreSQL, có thể cân nhắc dùng `FULLTEXT INDEX` trên trường `name` (và `shortDescription` nếu cần mở rộng) để tối ưu hóa truy vấn tìm kiếm dạng `LIKE %keyword%` hoặc Match Against.
- Các trường cần select trả về (để tối ưu băng thông): `id`, `name`, `price`, `salePrice`, `images` (chỉ lấy ảnh đầu tiên `images[0]`).

## 2. GIAO KÈO API (API CONTRACT)

### Lấy danh sách sản phẩm gợi ý (Search Suggest)
- **Method & Route:** `GET /api/v1/products/suggest`
- **Mô tả:** Trả về danh sách tối đa 5 sản phẩm khớp với từ khóa tìm kiếm.
- **Xác thực (Auth):** Không yêu cầu (Public API).

**Request Payload (Query Params):**
```typescript
interface SearchSuggestQueryDTO {
  keyword: string; // Bắt buộc. Từ khóa tìm kiếm.
  limit?: number;  // Tùy chọn. Số lượng kết quả trả về, mặc định là 5.
}
```

**Response Payload (Thành công - 200 OK):**
```typescript
interface SuggestProduct {
  id: string;
  name: string;
  price: number; 
  image: string; // Mapping từ ảnh đầu tiên của mảng Product.images
}

interface SearchSuggestResponse {
  success: boolean;
  data: SuggestProduct[]; // Mảng tối đa 5 phần tử
}
```

**Response Payload (Thất bại - 4xx/5xx):**
```typescript
interface ErrorResponse {
  statusCode: number;
  message: string; // VD: "Keyword is required", "Rate limit exceeded"
}
```

## 3. XỬ LÝ BẤT ĐỒNG BỘ & CACHING (ARCHITECTURE)

**1. Tối ưu hóa truy vấn (Performance & Caching):**
- **Vấn đề:** Mặc dù Frontend đã có cơ chế `debounce` (300ms), API search vẫn có khả năng bị gọi rất nhiều lần với cùng một từ khóa (ví dụ các từ khóa phổ biến như "cơm", "gà", "trà sữa").
- **Giải pháp (Redis Caching):** 
  - Lưu kết quả tìm kiếm vào Redis với Cache Key dạng: `search_suggest:{keyword}`.
  - Thời gian sống (TTL) của Cache: 5-10 phút.
  - Khi có Request, hệ thống sẽ kiểm tra Redis trước. Nếu có (Cache Hit), trả về ngay. Nếu không (Cache Miss), truy vấn Database, định dạng dữ liệu, lưu vào Redis và trả về cho Client.

**2. Bảo mật & Chống Spam (Security):**
- **Rate Limiting:** Do đây là Public API và có thao tác quét chuỗi (LIKE/Search), bắt buộc phải áp dụng Rate Limit khắt khe hơn các API GET thông thường để tránh bị tấn công DDoS cạn kiệt tài nguyên DB (VD: Giới hạn 20 requests / 10 giây / 1 IP).

**3. Kiến trúc luồng xử lý (Controller -> Service):**
- **Controller:** Validate query param `keyword` bằng DTO (chặn ký tự đặc biệt nguy hiểm chống SQL Injection), chuyển tiếp cho Service.
- **Service:** Xử lý logic đọc Redis -> (Nếu miss) gọi Repository Prisma tìm kiếm với `.take(5)` -> Map dữ liệu thành định dạng `SuggestProduct` (chỉ lấy ảnh index 0) -> Ghi Redis -> Trả kết quả.
