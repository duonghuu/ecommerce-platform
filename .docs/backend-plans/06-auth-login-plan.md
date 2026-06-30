# KẾ HOẠCH BACKEND: Chức năng Đăng nhập (Auth Login)

## 1. Thông tin chung
- **Tính năng:** Đăng nhập tài khoản khách hàng.
- **Mục tiêu:** Cung cấp API để xác thực thông tin người dùng dựa trên `email` và `password`, sau đó trả về Token phân quyền (Access Token & Refresh Token) theo quy chuẩn của dự án.
- **Tham chiếu:** Ý tưởng `.docs/ideas/06-auth-idea.md` và Kiến trúc `.docs/ARCHITECTURE.md`.

## 2. Cấu trúc Cơ sở dữ liệu (Database Schema)
*Không có sự thay đổi về Schema.* Tính năng đăng nhập sẽ sử dụng lại model `User` đã được thiết kế (bao gồm logic `@unique` cho trường `email`). 

## 3. Giao kèo API (API Contract)

### Đăng nhập (Login)
- **Endpoint:** `POST /api/v1/auth/login`
- **Mô tả:** Xác thực thông tin tài khoản và trả về JWT Token. Không yêu cầu Access Token khi gọi.

**Request Payload (Body):**
Yêu cầu sử dụng Zod để validate payload (dùng ZodValidationPipe ở cấp độ Controller).

```typescript
// Zod Schema
const LoginPayloadSchema = z.object({
  email: z.string().email("Định dạng email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu")
});
```

**Response (Thành công - 200 OK):**
```json
{
  "statusCode": 200,
  "message": "Đăng nhập thành công",
  "data": {
    "user": {
      "id": "uuid",
      "fullName": "Nguyen Van A",
      "email": "coder@techbite.vn",
      "phone": "0987654321",
      "role": "CUSTOMER",
      "isActive": true,
      "createdAt": "2026-06-28T00:00:00Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Response (Lỗi - 401 Unauthorized):**
*Quy tắc phòng thủ:* Không bao giờ chỉ ra cụ thể là sai Email hay sai Password để tránh việc kẻ gian dò quét tài khoản. Trả về thông báo lỗi chung.
```json
{
  "statusCode": 401,
  "message": "Tài khoản hoặc mật khẩu không chính xác."
}
```

## 4. Kiến trúc & Bảo mật (Architecture & Security)

1. **Xử lý Mật khẩu:** 
   - Truy vấn thông tin người dùng từ CSDL thông qua `email`.
   - BẮT BUỘC sử dụng thư viện `bcrypt.compare` để đối chiếu mật khẩu truyền vào với mật khẩu đã hash trong cơ sở dữ liệu.
2. **Cấp phát JWT Token:**
   - Sử dụng lại logic cấp token tương tự tính năng Register.
   - Access Token: `15m` (Dùng `JWT_ACCESS_SECRET`)
   - Refresh Token: `7d` (Dùng `JWT_REFRESH_SECRET`)
3. **Quản lý phiên đăng nhập với Redis (TODO):**
   - Theo tài liệu `ARCHITECTURE.md`, sau này toàn bộ Refresh Token sinh ra từ quá trình Đăng nhập sẽ được lưu trữ và giám sát vòng đời trên Redis. Bổ sung comment nhắc nhở TODO cho phần này.
