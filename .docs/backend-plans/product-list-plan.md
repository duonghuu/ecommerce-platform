# KẾ HOẠCH KIẾN TRÚC BACK-END: DANH SÁCH SẢN PHẨM (PRODUCT LIST PAGE)

## 1. Thiết kế Dữ liệu (Database Schema)

Dựa trên yêu cầu từ `03-product-list-idea.md` và `ARCHITECTURE.md`, dữ liệu cho trang Danh sách sản phẩm chủ yếu tái sử dụng lại các bảng đã thiết kế, tuy nhiên cần bổ sung và tối ưu hóa (Indexing) để phục vụ việc lọc và sắp xếp.

### Bảng `products` (Bổ sung & Tối ưu)
Lưu trữ thông tin sản phẩm cốt lõi. Để đáp ứng yêu cầu bộ lọc và sắp xếp nhanh chóng, cần đánh Index cho các trường sau:
- Bổ sung trường `createdAt` (DateTime) và `updatedAt` (DateTime).
- **Indexing BẮT BUỘC:** 
  - `categoryId`: Để lọc sản phẩm theo danh mục cực nhanh.
  - `price` / `salePrice`: Phục vụ sắp xếp theo giá (Tăng/Giảm) và lọc theo khoảng giá (Min/Max).
  - `createdAt` / `updatedAt`: Phục vụ tính năng sắp xếp theo "Thời gian cập nhật" (Mới nhất).
  - `isFeatured`: Phục vụ bộ lọc hoặc sắp xếp "Nổi bật".

### Bảng `banners`
- Tái sử dụng bảng từ Home Page. Sử dụng field `position` mang giá trị `product_list_top` để truy vấn Banner lớn nổi bật cho trang này.

---

## 2. Giao kèo API (API Contract)

Trang Danh sách sản phẩm đòi hỏi bộ lọc (Filter), phân trang (Pagination) và sắp xếp (Sorting) linh hoạt.

### 2.1. API Lấy danh sách sản phẩm (Có phân trang & Lọc)
- **Method & Route:** `GET /api/v1/products`
- **Mô tả:** Lấy danh sách sản phẩm, hỗ trợ Query Params để lọc và sắp xếp.
- **Auth Guard:** Public (Không yêu cầu xác thực).
- **Request Payload (Query Params):**
  - `page` (Int, default: 1): Trang hiện tại.
  - `limit` (Int, default: 20): Số sản phẩm trên một trang.
  - `categoryId` (String, nullable): ID danh mục để lọc.
  - `minPrice` (Decimal, nullable): Lọc giá tối thiểu.
  - `maxPrice` (Decimal, nullable): Lọc giá tối đa.
  - `sortBy` (String, default: `latest`): Tiêu chí sắp xếp (`latest`, `price_asc`, `price_desc`, `featured`).
- **Response Payload (Thành công - 200 OK):**
```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "id": "p1",
        "name": "Khô Gà Lá Chanh Xé Cay",
        "slug": "kho-ga-la-chanh",
        "price": 45000,
        "salePrice": 35000,
        "thumbnailUrl": "https://images.unsplash.com/...",
        "stock": 50,
        "categoryId": "c1",
        "isFeatured": true,
        "updatedAt": "2026-06-10T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 20,
      "totalPages": 8
    }
  }
}
```

### 2.2. API Lấy thông tin bổ trợ (Banner & Category Filter)
- **Banner:** Gọi `GET /api/v1/banners?position=product_list_top`
- **Categories:** Gọi API `GET /api/v1/categories` lấy danh sách Category (dạng list) để render bộ lọc bên trái (Left Sidebar).

---

## 3. Xử lý Bất đồng bộ & Caching (Architecture & Background Jobs)

### 3.1. Caching & Tối ưu truy vấn
- **Vấn đề:** API `GET /api/v1/products` có quá nhiều tổ hợp lọc (Filter + Sort + Pagination) nên việc Cache toàn bộ Response bằng Redis là **không khả thi** (Cache Miss rate sẽ rất cao và tốn bộ nhớ).
- **Giải pháp Cache:**
  - Chỉ Cache Redis cho trang đầu tiên mặc định: `GET /api/v1/products?page=1&limit=20&sortBy=latest` (Key: `cache:products:default_page`).
  - Cache vĩnh viễn danh sách `Categories` để render bộ lọc nhanh chóng (Key: `cache:categories`).
- **Tối ưu Database (Query Optimization):**
  - Đảm bảo DB (PostgreSQL/MySQL) đã được tạo Composite Index cho các trường lọc phổ biến: `(categoryId, price)` hoặc `(categoryId, createdAt)`.

### 3.2. Background Jobs (Search & Analytics)
- Nếu tương lai có thêm tính năng **Tìm kiếm toàn văn (Full-text Search)** bằng tên sản phẩm, truy vấn `LIKE '%keyword%'` trong RDBMS sẽ rất chậm. Cần đưa dữ liệu sản phẩm sang **Elasticsearch** thông qua Message Queue (RabbitMQ) mỗi khi có sản phẩm được tạo mới hoặc cập nhật.
- Ghi nhận hành vi User: Khi user chọn một bộ lọc (VD: hay lọc giá 50k-100k), có thể gửi một event qua RabbitMQ để phân tích hành vi mua sắm, từ đó hiển thị Banner hoặc Gợi ý phù hợp ở các lần truy cập sau mà không block Main Thread của API Fetch.
