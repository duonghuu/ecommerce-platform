# KẾ HOẠCH KIẾN TRÚC BACK-END: TRANG CHỦ (HOME PAGE)

## 1. Thiết kế Dữ liệu (Database Schema)

Dựa trên yêu cầu của trang chủ (Hiển thị Banner, Danh mục, Sản phẩm nổi bật) tại `01-home-idea.md` và các quy tắc từ `ARCHITECTURE.md`, chúng ta cần các bảng sau (Giả định thiết kế Relational Database như PostgreSQL/MySQL):

### Bảng `banners`
Lưu trữ thông tin các banner quảng cáo (Hero Banner).
- `id` (PK, UUID)
- `title` (String): Tiêu đề banner (VD: "Nạp Năng Lượng - Code Phê Hơn").
- `subtitle` (String, nullable): Tiêu đề phụ (VD: "Combo Thức Khuya giảm giá 20%...").
- `imageUrl` (String): Đường dẫn hình ảnh banner.
- `targetUrl` (String, nullable): Link điều hướng khi người dùng click vào banner.
- `position` (String): Vị trí hiển thị (VD: `home_hero`). Indexing.
- `isActive` (Boolean): Trạng thái hiển thị (Mặc định: true).
- `startDate` (DateTime, nullable): Hẹn giờ ngày bắt đầu hiển thị.
- `endDate` (DateTime, nullable): Hẹn giờ ngày kết thúc hiển thị.

### Bảng `categories`
Lưu trữ danh mục món ăn (Hỗ trợ cấu trúc cây Parent - Child).
- `id` (PK, UUID)
- `parentId` (FK, nullable): Trỏ về `id` của Category cha.
- `name` (String): Tên danh mục (VD: Đồ Ăn Vặt, Nước Uống).
- `slug` (String): Đường dẫn thân thiện (VD: `do-an-vat`). Unique Index.
- `iconUrl` (String): Link ảnh icon mô tả danh mục.
- `isFeatured` (Boolean): Đánh dấu để ưu tiên hiển thị ở khu vực Categories của trang chủ. Indexing.
- `displayOrder` (Int): Thứ tự sắp xếp.

### Bảng `products`
Lưu trữ thông tin sản phẩm cốt lõi (Đã định nghĩa cơ bản trong `ARCHITECTURE.md`).
- `id` (PK, UUID)
- `categoryId` (FK): Trỏ về `categories.id`. Indexing để query nhanh.
- `name` (String): Tên món ăn (VD: "Khô Gà Lá Chanh Xé Cay").
- `slug` (String): Tên đường dẫn. Unique Index.
- `price` (Decimal): Giá gốc.
- `salePrice` (Decimal, nullable): Giá khuyến mãi.
- `thumbnailUrl` (String): Ảnh đại diện sản phẩm hiển thị trên Card.
- `stock` (Int): Số lượng tồn kho. (Không cho phép thêm vào giỏ nếu stock = 0).
- `salesCount` (Int): Tổng số lượng đã bán (Dùng để lấy danh sách Best Sellers / Trending). Indexing.
- `isFeatured` (Boolean): Cờ đánh dấu món nổi bật để hiển thị trực tiếp trên Home Page.

---

## 2. Giao kèo API (API Contract)

Để đạt mục tiêu "tốc độ tải siêu nhanh", thay vì gọi 3-4 API riêng lẻ từ Client, chúng ta sẽ áp dụng **BFF (Backend For Frontend)** pattern để gom dữ liệu trả về trong 1 request duy nhất cho màn hình Home.

### 2.1. API Fetch Home Data
- **Method & Route:** `GET /api/v1/home`
- **Mô tả:** Trả về toàn bộ dữ liệu cần thiết (Banners, Categories, Featured Products, Social Proof) để render Frontend ngay lập tức.
- **Auth Guard:** Public (Không yêu cầu xác thực).
- **Request Payload:** Không có. (Hoặc Query Params: `?limitFeatured=8`).
- **Response Payload (Thành công - 200 OK):**
```json
{
  "status": "success",
  "data": {
    "heroBanners": [
      {
        "id": "b1",
        "title": "Nạp Năng Lượng - Code Phê Hơn",
        "subtitle": "Combo Thức Khuya giảm giá 20% từ 22h - 2h sáng.",
        "imageUrl": "https://images.unsplash.com/...",
        "targetUrl": "/promotions/thuc-khuya"
      }
    ],
    "featuredCategories": [
      {
        "id": "c1",
        "name": "Đồ Ăn Vặt",
        "slug": "do-an-vat",
        "iconUrl": "https://..."
      }
    ],
    "featuredProducts": [
      {
        "id": "p1",
        "name": "Khô Gà Lá Chanh Xé Cay",
        "slug": "kho-ga-la-chanh",
        "price": 45000,
        "salePrice": 35000,
        "thumbnailUrl": "https://images.unsplash.com/...",
        "stock": 50,
        "isAvailable": true
      }
    ],
    "socialProof": {
      "totalUsers": 500,
      "message": "Hơn 500+ anh em dev đã nạp năng lượng tại đây"
    }
  }
}
```
- **Response Payload (Thất bại - 500 Internal Error):**
```json
{
  "status": "error",
  "message": "Không thể tải dữ liệu trang chủ lúc này. Vui lòng thử lại sau.",
  "code": "INTERNAL_SERVER_ERROR"
}
```

---

## 3. Xử lý Bất đồng bộ & Caching (Architecture & Background Jobs)

Trang chủ là điểm chạm đầu tiên (Landing page) đón toàn bộ Traffic của hệ thống. Vì thế bắt buộc phải tối ưu hóa tải trọng cho Database.

### 3.1. Caching với Redis
- Dữ liệu trả về từ `GET /api/v1/home` (Banner, Category, Sản phẩm nổi bật) rất ít khi thay đổi theo từng giây. 
- **Giải pháp:** 
  - Cache nguyên khối Response JSON của API này vào Redis với key `cache:home_data`.
  - **TTL (Time To Live):** 15 phút - 30 phút. Hoặc lưu vĩnh viễn (No expiry) cho tới khi có thay đổi.
  - **Cache Invalidation:** Khi Admin thực hiện các tác vụ (Thêm/Sửa/Xoá Banner, cập nhật cờ `isFeatured` của Product/Category), Backend sẽ xóa (DEL) key `cache:home_data`. Lượt request tiếp theo sẽ tự động lấy từ Database và nạp lại vào Redis.

### 3.2. Background Jobs với Message Queue (RabbitMQ / BullMQ)
Nếu dự án có yêu cầu thu thập dữ liệu (Tracking / Analytics) khi user truy cập Trang chủ để phục vụ chiến dịch Marketing:
- **Tác vụ nặng:** Log lịch sử truy cập (Page Views) của từng Session/User.
- **Giải pháp:**
  - Frontend gọi một API ngầm `POST /api/v1/tracking/page-view`.
  - API này KHÔNG ghi trực tiếp vào Database. Nó sẽ đẩy payload (Session ID, IP, Thiết bị, Thời gian) vào **RabbitMQ** (hoặc BullMQ).
  - Trả về ngay lập tức `202 Accepted` cho Frontend để giải phóng luồng (Main Thread không bị block).
  - Một **Background Worker** (Consumer) chạy ngầm sẽ kéo các messages từ Queue, gom thành batch (VD: 100 records/lần) và insert vào Database Analytics một cách tuần tự.
