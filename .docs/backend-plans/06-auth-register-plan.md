# QUY HOẠCH HỆ THỐNG BACK-END: CHỨC NĂNG ĐĂNG KÝ (REGISTER)

## BƯỚC 1: TRỤ CỘT 1 - THIẾT KẾ DỮ LIỆU (DATABASE SCHEMA)

Cần bổ sung/tạo mới bảng `User` để lưu trữ thông tin người dùng. 
Sử dụng Prisma Schema:

```prisma
enum Role {
  ADMIN
  STAFF
  CUSTOMER
}

model User {
  id        String   @id @default(uuid())
  fullName  String
  email     String   @unique
  phone     String?
  password  String   // Đã được băm (Hashed)
  role      Role     @default(CUSTOMER)
  isActive  Boolean  @default(true)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Quan hệ với các bảng khác nếu có sau này (Order, Cart)
  // orders Order[]
}
```

**Ràng buộc (Constraints):**
- `email`: Đánh index (`@unique`) để kiểm tra email tồn tại nhanh chóng và phục vụ đăng nhập.
- `password`: Bắt buộc phải được băm (hash) bằng bcrypt/argon2 trước khi lưu vào DB. Tuyệt đối không lưu plain text.
- `role`: Mặc định khi đăng ký qua form ngoài Frontend sẽ luôn là `CUSTOMER`.

---

## BƯỚC 2: TRỤ CỘT 2 - GIAO KÈO API (API CONTRACT)

### 1. API Đăng ký tài khoản mới

- **Method:** `POST`
- **Route:** `/api/v1/auth/register`
- **Mô tả:** Đăng ký tài khoản khách hàng mới. Không yêu cầu Auth.

**Request Payload (Body):**
Yêu cầu sử dụng Zod để validate chặt chẽ payload trước khi đưa vào Controller.

```typescript
// Zod Schema
const RegisterPayloadSchema = z.object({
  fullName: z.string().min(1, "Họ tên không được để trống"),
  email: z.string().email("Định dạng email không hợp lệ"),
  phone: z.string().regex(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ").optional(),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự")
  // Lưu ý: confirmPassword đã được validate ở Frontend, không cần gửi xuống Backend
});
```

**Response Payload (Thành công - 201 Created):**
Trạng thái đăng ký thành công, trả về thông tin user (LOẠI BỎ `password` ra khỏi response).
```json
{
  "statusCode": 201,
  "message": "Đăng ký tài khoản thành công",
  "data": {
    "id": "uuid-1234-5678",
    "fullName": "Nguyen Van A",
    "email": "coder@techbite.vn",
    "phone": "0987654321",
    "role": "CUSTOMER",
    "createdAt": "2023-10-20T10:00:00.000Z"
  }
}
```

**Response Payload (Thất bại - 400/409):**
- `400 Bad Request`: Lỗi validation từ Zod (Sai định dạng email, mật khẩu ngắn...).
- `409 Conflict`: Email đã tồn tại trong hệ thống.
```json
{
  "statusCode": 409,
  "message": "Email này đã được sử dụng. Vui lòng chọn email khác.",
  "error": "Conflict"
}
```

---

## BƯỚC 3: TRỤ CỘT 3 - XỬ LÝ BẤT ĐỒNG BỘ & CACHING (ARCHITECTURE & BACKGROUND JOBS)

Với chức năng đăng ký, luồng xử lý cần đặc biệt chú ý hiệu năng và trải nghiệm người dùng:

1. **Băm mật khẩu (Password Hashing):** 
   - Hàm hash mật khẩu (ví dụ `bcrypt.hash`) là tác vụ tốn CPU. Bắt buộc gọi phiên bản bất đồng bộ (async) để không block Event Loop của Node.js.
   
2. **Background Jobs (Message Queue):**
   - **Gửi Email Welcome:** Việc gửi email chào mừng/xác thực không được làm chậm quá trình trả về Response của API Đăng ký.
   - **Quy trình chuẩn:** 
     - API Insert User vào DB -> Trả về `201 Created` cho Client ngay lập tức.
     - Song song đó, đẩy một message `{ userId, email, fullName }` vào hàng đợi (RabbitMQ hoặc Redis BullMQ) với job name `SEND_WELCOME_EMAIL`.
     - Worker chạy ngầm sẽ tiêu thụ message này và gửi email thông qua SMTP service (SendGrid/AWS SES/Nodemailer).

3. **Bảo mật (Rate Limiting):**
   - API `/api/v1/auth/register` BẮT BUỘC phải được bảo vệ bằng cơ chế Rate Limiting (Giới hạn số lần request theo IP).
   - Ví dụ: 5 requests / 15 phút cho cùng 1 IP để tránh việc bị Spam tạo tài khoản giả hàng loạt.
