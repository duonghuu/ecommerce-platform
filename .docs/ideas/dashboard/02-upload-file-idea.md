# Ý TƯỞNG: Upload File

## 1. Thông tin chung (Meta Info)

- **Dự án:** TechBite
- **Tính năng:** Upload & Quản lý tệp (File Management)
- **Mục đích:**
  - Cho phép upload nhiều loại tệp (ảnh, video, tài liệu, file nén...)
  - Quản lý metadata tập trung
  - Hỗ trợ tái sử dụng file giữa nhiều module
  - Dễ dàng mở rộng sang Cloud Storage (S3, MinIO...)

---

## 2. Đối tượng & Trải nghiệm (Target & UX)

- **Người dùng chính:** Quản trị viên, nhân viên hệ thống
- **Hành động chính:**
  - Upload file
  - Xem tiến trình upload
  - Xem trước ảnh/video
  - Xóa hoặc thay thế file
- **Cảm xúc mang lại:**
  - Thao tác đơn giản
  - Upload nhanh
  - Phản hồi lỗi rõ ràng
  - Hỗ trợ kéo thả (Drag & Drop)

---

## 3. Đặc tả Thiết kế (Design Specs)

- Upload đơn hoặc nhiều file
- Drag & Drop
- Thanh tiến trình (Progress)
- Preview ảnh/video
- Hiển thị tên, kích thước, loại file
- Hỗ trợ Retry khi upload thất bại
- Hiển thị trạng thái (Uploading / Success / Failed)