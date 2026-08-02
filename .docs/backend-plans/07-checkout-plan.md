# QUY HOẠCH KIẾN TRÚC: THANH TOÁN (CHECKOUT MODULE)

## 1. THIẾT KẾ DỮ LIỆU (DATABASE SCHEMA)

Dựa trên schema hiện tại, chúng ta cần tạo thêm bảng `Order` và `OrderItem` để lưu trữ thông tin đơn hàng sau khi thanh toán.

### 1.1 Bảng `orders`
Lưu trữ thông tin tổng quan của đơn hàng, địa chỉ giao hàng và trạng thái thanh toán.
- **Các trường (Fields):**
  - `id` (String, UUID, PK)
  - `code` (String, Unique, Index) - Mã đơn hàng thân thiện dễ đọc (VD: `TB-123456`)
  - `userId` (String, FK -> `users.id`, Nullable) - Liên kết với User nếu đã đăng nhập, null nếu là Guest.
  - `customerName` (String) - Họ tên người nhận.
  - `customerPhone` (String) - Số điện thoại.
  - `customerEmail` (String, Nullable) - Email để gửi thông báo.
  - `shippingAddress` (String) - Địa chỉ giao hàng.
  - `shippingMethod` (String) - Phương thức giao hàng (VD: `STANDARD`, `EXPRESS`).
  - `shippingFee` (Decimal) - Phí vận chuyển.
  - `paymentMethod` (Enum: `COD`, `QR_CODE`) - Phương thức thanh toán.
  - `paymentStatus` (Enum: `PENDING`, `PAID`, `FAILED`) - Trạng thái thanh toán (QR_CODE ban đầu là PENDING).
  - `status` (Enum: `PENDING`, `CONFIRMED`, `SHIPPING`, `COMPLETED`, `CANCELLED`) - Trạng thái xử lý đơn hàng.
  - `subTotal` (Decimal) - Tạm tính.
  - `discountAmount` (Decimal) - Số tiền giảm giá.
  - `discountCode` (String, Nullable) - Mã giảm giá đã áp dụng.
  - `totalAmount` (Decimal) - Tổng tiền cuối cùng.
  - `notes` (String, Nullable) - Ghi chú đơn hàng.
  - `createdAt`, `updatedAt`, `deletedAt`
- **Indexing & Relations:**
  - Index: `[code]`, `[userId]`, `[status]`, `[paymentStatus]`, `[createdAt]`.
  - Khóa ngoại: `userId` tham chiếu `User`.

### 1.2 Bảng `order_items`
Lưu trữ các sản phẩm nằm trong đơn hàng. BẮT BUỘC lưu trữ *snapshot* (ảnh chụp) giá và tên sản phẩm tại thời điểm mua, đề phòng sản phẩm bị đổi giá sau này.
- **Các trường (Fields):**
  - `id` (String, UUID, PK)
  - `orderId` (String, FK -> `orders.id`)
  - `productId` (String, FK -> `products.id`, Nullable nếu sản phẩm bị xóa hẳn)
  - `productName` (String) - Tên sản phẩm lúc mua.
  - `productImage` (String) - Ảnh sản phẩm.
  - `price` (Decimal) - Giá bán tại thời điểm mua.
  - `quantity` (Int) - Số lượng mua.
  - `createdAt`, `updatedAt`
- **Indexing & Relations:**
  - Khóa ngoại: `orderId` tham chiếu `Order`, `productId` tham chiếu `Product`.
  - Index: `[orderId]`, `[productId]`.

---

## 2. GIAO KÈO API (API CONTRACT)

### 2.1 Tạo Đơn Hàng (Checkout)
- **Endpoint:** `POST /api/v1/orders`
- **Auth Guard:** Không bắt buộc (Guest vẫn có thể mua, nhưng dùng `cartId`). Nếu có Token thì lấy `userId` từ Token.
- **Request Payload:**
  ```json
  {
    "cartId": "uuid-cua-gio-hang-guest", // Chỉ cần thiết nếu không có Auth Token
    "customerInfo": {
      "fullName": "Nguyễn Văn A",
      "email": "dev@techbite.pro",
      "phone": "0901234567",
      "address": "123 Đường Công Nghệ, Quận 1, TP.HCM"
    },
    "shippingMethod": "STANDARD",
    "paymentMethod": "COD", // Hoặc "QR_CODE"
    "orderNotes": "Giao giờ hành chính",
    "discountCode": "TECHBITE200"
  }
  ```
- **Response (Thành công - 201 Created):**
  ```json
  {
    "statusCode": 201,
    "message": "Đặt hàng thành công",
    "data": {
      "orderId": "uuid",
      "orderCode": "TB-123456",
      "totalAmount": 4480000,
      "status": "PENDING",
      "paymentMethod": "QR_CODE",
      "paymentDetails": {
        "qrCodeUrl": "https://api.vietqr.io/.../image",
        "expiresAt": "2026-08-01T15:30:00Z"
      }
    }
  }
  ```

### 2.2 Lấy chi tiết Đơn hàng (Dành cho trang Theo dõi)
- **Endpoint:** `GET /api/v1/orders/:id`
- **Response:** Chi tiết `Order` bao gồm danh sách `OrderItems`.

### 2.3 Webhook Nhận Kết quả Thanh toán QR Code
- **Endpoint:** `POST /api/v1/orders/webhook/payment`
- **Chức năng:** API nội bộ hoặc public cho Cổng thanh toán gọi về khi user chuyển khoản thành công.
- **Logic:** Xác thực Signature -> Cập nhật `paymentStatus = PAID` -> Đổi trạng thái đơn hàng -> Thông báo Frontend.

### 2.4 Kiểm tra Trạng thái Thanh toán (Long-polling / SSE)
- **Endpoint:** `GET /api/v1/orders/:id/payment-status`
- **Chức năng:** Dành cho Popup QR Code của Frontend, Frontend sẽ gọi định kỳ (polling mỗi 3s) hoặc dùng SSE để biết khi nào user chuyển khoản thành công.

---

## 3. XỬ LÝ BẤT ĐỒNG BỘ & KIẾN TRÚC (ARCHITECTURE & BACKGROUND JOBS)

### 3.1 Giao dịch Cơ sở dữ liệu (Database Transaction)
Toàn bộ logic tạo đơn hàng BẮT BUỘC phải nằm trong một **Prisma Transaction** để đảm bảo tính nhất quán (ACID):
1. Đọc dữ liệu từ Cart và CartItem.
2. Kiểm tra tồn kho (Inventory Check): Nếu `stock < quantity`, rollback giao dịch và báo lỗi.
3. Trừ tồn kho (`stock = stock - quantity`, có thể tăng `salesCount`).
4. Tạo record bảng `Order` và các `OrderItem`.
5. Xóa toàn bộ `CartItem` trong giỏ hàng hiện tại (Clear cart).

### 3.2 Hàng đợi Message Queue (RabbitMQ / BullMQ)
Nghiệp vụ thanh toán yêu cầu xử lý ngầm các tác vụ nặng/có độ trễ, KHÔNG ĐƯỢC block main thread:
1. **Gửi Email Xác nhận Đơn hàng (`SendOrderEmailJob`)**: 
   - Sau khi transaction thành công, đẩy sự kiện `OrderCreated` vào queue. Worker sẽ nhận lệnh và gửi email hóa đơn cho user.
2. **Hủy đơn hàng hết hạn QR Code (`CancelUnpaidOrderJob`)**:
   - Nếu `paymentMethod == QR_CODE`, lên lịch một job delay 15 phút.
   - Khi chạy, Job kiểm tra `paymentStatus` của Order. Nếu vẫn là `PENDING` -> Chuyển thành `CANCELLED` và **hoàn lại số lượng tồn kho (restock)**.

### 3.3 Caching
- Danh sách các phương thức vận chuyển và cấu hình phí vận chuyển (nếu có lưu ở Database) có thể lưu Cache (Redis) vì dữ liệu này ít khi thay đổi.
