# QUY HOẠCH HỆ THỐNG BACKEND: CHỨC NĂNG UPLOAD VÀ QUẢN LÝ FILE

Dựa trên yêu cầu nghiệp vụ tại `02-upload-file-idea.md`, dưới đây là bản quy hoạch thiết kế kỹ thuật hạ tầng cho tính năng Upload File, với mục tiêu quản lý tập trung và dễ dàng mở rộng sang Cloud Storage (S3, MinIO...).

## 1. Trụ cột 1: Thiết kế Dữ liệu (Database Schema)

Để đáp ứng yêu cầu "quản lý metadata tập trung" và "tái sử dụng file", ta sẽ tạo một bảng `medias` (hoặc `files`) mới hoàn toàn để lưu trữ toàn bộ lịch sử upload của hệ thống.

**Tạo Model `Media` mới trong Prisma:**

```prisma
model Media {
  id           String    @id @default(uuid())
  filename     String    // Tên file gốc (ví dụ: banner-tet.jpg)
  url         String    // Đường dẫn tuyệt đối hoặc tương đối (URL public)
  mimeType     String    // Loại file (image/jpeg, image/png, video/mp4,...)
  size         Int       // Kích thước file tính bằng Bytes
  provider     String    @default("LOCAL") // Nơi lưu trữ (LOCAL, AWS_S3, MINIO, CLOUDINARY)
  
  // Metadata bổ sung (Nếu là ảnh/video)
  width        Int?
  height       Int?
  
  // Theo dõi người upload (Tuỳ chọn)
  uploadedById String?
  uploadedBy   User?     @relation(fields: [uploadedById], references: [id], onDelete: SetNull)

  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  deletedAt    DateTime? // Soft delete để giữ lịch sử nếu cần

  @@index([uploadedById])
  @@index([mimeType])
  @@map("medias")
}
```

*Lưu ý: Bảng `User` cần bổ sung quan hệ ngược lại `medias Media[]`.*

## 2. Trụ cột 2: Giao kèo API (API Contract)

Toàn bộ API quản lý file tại Dashboard **bắt buộc phải qua xác thực** (`ADMIN` hoặc `STAFF`). Tuy nhiên, theo ghi chú hiện tại, hệ thống tạm thời sẽ comment Guard lại.

### 2.1 Upload một file (Single File)
- **Method & Route:** `POST /api/v1/admin/upload`
- **Content-Type:** `multipart/form-data`
- **Request Body:**
  - `file`: (Binary File) Bắt buộc
- **Response Success (201):**
  ```json
  {
    "status": "success",
    "data": {
      "id": "uuid",
      "filename": "banner-tet.jpg",
      "url": "uploads/banner-tet-1701234567.jpg",
      "mimeType": "image/jpeg",
      "size": 1024000
    }
  }
  ```

### 2.2 Upload nhiều file cùng lúc (Multiple Files) - Phục vụ Drag & Drop
- **Method & Route:** `POST /api/v1/admin/upload/multiple`
- **Content-Type:** `multipart/form-data`
- **Request Body:**
  - `files`: (Array of Binary Files) Bắt buộc (Tối đa 10 file/lần)
- **Response Success (201):** Trả về mảng các object Media giống API Single File.

### 2.3 Lấy danh sách tệp (File Library/Gallery)
- **Method & Route:** `GET /api/v1/admin/medias`
- **Request Query:**
  - `page`: number
  - `limit`: number
  - `search`: string (Tìm theo `filename`)
  - `mimeType`: string (Lọc theo loại file, VD: `image/*`, `video/*`)
- **Response Success (200):** Trả về danh sách Media phân trang để Frontend có thể hiển thị dạng Grid/List cho phép người dùng chọn lại file cũ.

### 2.4 Xóa tệp (Delete File)
- **Method & Route:** `DELETE /api/v1/admin/medias/:id`
- **Business Logic:**
  - Cập nhật `deletedAt` trong database (Soft delete).
  - *(Tùy chọn)* Xóa file vật lý trên ổ cứng hoặc S3 để giải phóng dung lượng.
- **Response Success (200):** Xóa thành công.

## 3. Trụ cột 3: Xử lý Bất đồng bộ & Caching (Architecture & Background Jobs)

- **Architecture (Thiết kế Adapter Pattern):** Backend bắt buộc phải xây dựng `StorageService` theo mô hình Adapter (Interface) để dễ dàng "Switch" (Chuyển đổi) giữa `LocalStorage` (lưu vào thư mục `public/uploads` của máy chủ hiện tại) và `CloudStorage` (AWS S3, MinIO) chỉ bằng cách đổi biến môi trường `.env`. Không fix cứng luồng lưu file vật lý vào Controller.
- **Xử lý bất đồng bộ (Background Jobs / Message Queue):**
  - **Upload thông thường:** Các file ảnh nhỏ (< 5MB) có thể xử lý đồng bộ trực tiếp.
  - **Upload video/file lớn:** Nếu upload video hoặc cần nén/resize ảnh ra nhiều kích thước (thumbnail), bắt buộc phải đẩy vào Message Queue (VD: BullMQ/RabbitMQ). Controller trả về ngay HTTP 202 Accepted cùng với một `jobId` để Frontend tạo thanh Progress bar qua Polling/Websocket, worker chạy ngầm xử lý nén file mà không làm treo Main Thread của Node.js.
- **Bảo mật (Security):** 
  - Phải chặn nghiêm ngặt các định dạng file thực thi (Exe, sh, bat, php...) qua thư viện như `file-type` (kiểm tra Magic bytes thay vì chỉ tin tưởng đuôi mở rộng `.extension` do Client gửi lên).
  - Giới hạn Max File Size (VD: Ảnh tối đa 5MB, Video tối đa 100MB).
