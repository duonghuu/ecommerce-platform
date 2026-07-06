# QUY HOẠCH HỆ THỐNG BACKEND: TRANG QUẢN LÝ CHUYÊN MỤC SẢN PHẨM (CATEGORY)

Dựa trên yêu cầu nghiệp vụ tại `01-category-idea.md` và kiến trúc hệ thống hiện tại, dưới đây là bản quy hoạch thiết kế kỹ thuật hạ tầng cho tính năng Quản lý chuyên mục sản phẩm.

## 1. Trụ cột 1: Thiết kế Dữ liệu (Database Schema)

Hiện tại bảng `categories` đã tồn tại trong `schema.prisma`. Dựa vào yêu cầu quản lý (cần hiển thị "Trạng thái"), ta sẽ cập nhật bảng này để hỗ trợ việc Bật/Tắt (Active/Inactive) chuyên mục bên cạnh xóa mềm.

**Cập nhật Model `Category` trong Prisma:**
- Thêm trường `isActive Boolean @default(true)` để hiển thị trạng thái "Hoạt động" hay "Đang ẩn" trên UI.

```prisma
model Category {
  id           String    @id @default(uuid())
  parentId     String?
  name         String
  slug         String    @unique
  iconUrl      String
  isFeatured   Boolean   @default(false)
  displayOrder Int       @default(0)
  isActive     Boolean   @default(true) // [MỚI] Trạng thái hiển thị (Active/Inactive)

  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  deletedAt    DateTime? // Hỗ trợ Soft Delete

  parent       Category?  @relation("CategoryToCategory", fields: [parentId], references: [id], onDelete: Cascade)
  children     Category[] @relation("CategoryToCategory")
  products     Product[]

  @@index([isFeatured])
  @@index([parentId])
  @@index([isActive]) // [MỚI] Index cho truy vấn theo trạng thái
  @@map("categories")
}
```

## 2. Trụ cột 2: Giao kèo API (API Contract)

Toàn bộ API quản lý chuyên mục tại Dashboard **bắt buộc phải qua xác thực** và phân quyền `ADMIN` hoặc `STAFF`.

### 2.1 Lấy danh sách chuyên mục (Dành cho Admin)
- **Method & Route:** `GET /api/v1/admin/categories`
- **Auth Guard:** `JwtAuthGuard`, `RolesGuard(Role.ADMIN, Role.STAFF)`
- **Request Query:**
  - `page`: number (default 1)
  - `limit`: number (default 10)
  - `search`: string (tìm theo `name`)
  - `isActive`: boolean (lọc theo trạng thái)
  - `parentId`: string (lọc theo chuyên mục cha, nếu có)
- **Response Success (200):**
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "name": "Bánh mặn",
        "slug": "banh-man",
        "iconUrl": "http...",
        "parentId": null,
        "parentName": null,
        "isActive": true,
        "isFeatured": false,
        "displayOrder": 1,
        "createdAt": "2026-07-05T00:00:00.000Z"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "totalItems": 25,
      "totalPages": 3
    }
  }
  ```

### 2.2 Lấy chi tiết một chuyên mục
- **Method & Route:** `GET /api/v1/admin/categories/:id`
- **Auth Guard:** `JwtAuthGuard`, `RolesGuard(Role.ADMIN, Role.STAFF)`
- **Response Success (200):** Trả về chi tiết object chuyên mục. Dùng để đổ dữ liệu vào modal chỉnh sửa.

### 2.3 Thêm mới chuyên mục
- **Method & Route:** `POST /api/v1/admin/categories`
- **Auth Guard:** `JwtAuthGuard`, `RolesGuard(Role.ADMIN)` (Tuỳ chọn chỉ định admin mới được tạo/sửa)
- **Request Body (DTO):**
  ```json
  {
    "name": "Bánh ngọt",
    "slug": "banh-ngot",
    "iconUrl": "url_to_image",
    "parentId": "uuid_or_null",
    "isActive": true,
    "displayOrder": 1
  }
  ```
  *(Lưu ý: Backend tự sinh `slug` từ `name` nếu frontend không gửi lên, hoặc validate `slug` độc nhất).*
- **Response Success (201):** Trả về chuyên mục vừa tạo.

### 2.4 Cập nhật chuyên mục
- **Method & Route:** `PUT /api/v1/admin/categories/:id`
- **Auth Guard:** `JwtAuthGuard`, `RolesGuard(Role.ADMIN)`
- **Request Body (DTO):** Giống thêm mới, nhưng các trường là tùy chọn (Partial).
  ```json
  {
    "name": "Bánh ngọt cập nhật",
    "isActive": false
  }
  ```
- **Response Success (200):** Trả về chuyên mục vừa cập nhật.

### 2.5 Xóa chuyên mục
- **Method & Route:** `DELETE /api/v1/admin/categories/:id`
- **Auth Guard:** `JwtAuthGuard`, `RolesGuard(Role.ADMIN)`
- **Business Logic:**
  - Nếu `Category` đang có `products` bên trong hoặc `children` chuyên mục con, backend phải ném lỗi `BadRequestException("Không thể xóa chuyên mục đang chứa sản phẩm hoặc chuyên mục con.")`.
  - Nếu thỏa mãn điều kiện xóa, thực hiện Soft Delete (Cập nhật `deletedAt`).
- **Response Success (200):** 
  ```json
  {
    "message": "Xóa chuyên mục thành công"
  }
  ```

## 3. Trụ cột 3: Xử lý Bất đồng bộ & Caching (Architecture & Background Jobs)

- **Caching (Redis):** Danh sách chuyên mục (Đặc biệt là cây chuyên mục hiển thị trên Header / Menu) ít khi thay đổi nhưng lại được gọi với tần suất cực lớn ở Frontend (`GET /api/v1/categories` public).
  - Cần áp dụng caching trên Redis cho các API lấy danh sách chuyên mục cho Public Users.
  - **Cache Invalidation:** Mỗi khi Admin thực hiện `POST`, `PUT`, hoặc `DELETE` chuyên mục (Cập nhật dữ liệu), Backend bắt buộc phải clear các key cache liên quan đến danh mục trong Redis (Ví dụ: `cache:categories:list:*`, `cache:categories:tree`).
- **Xử lý bất đồng bộ:** Việc thêm, sửa, xóa danh mục hiện tại là tác vụ nhỏ gọn, thao tác DB đơn giản, không yêu cầu thiết lập Background Job/Message Queue. Cập nhật Cache có thể chạy trực tiếp trên luồng chính do tốc độ vào Redis siêu nhanh.
- **Tối ưu hình ảnh (IconUrl):** Nếu có chức năng admin tự upload ảnh icon lên server thay vì chèn link có sẵn, quá trình nén và tối ưu hóa ảnh có thể cân nhắc chạy ngầm qua Message Queue (nếu dung lượng ảnh lớn), nhưng với icon dung lượng nhỏ thì có thể upload trực tiếp qua S3/Cloudinary đồng bộ.
