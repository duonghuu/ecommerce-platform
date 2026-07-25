# KẾ HOẠCH BACK-END: GIỎ HÀNG (CART MODULE)

## 1. Cơ chế quản lý trạng thái Giỏ hàng (Guest vs Logged In)
Dựa theo yêu cầu và kiến trúc chuẩn (`ARCHITECTURE.md`), luồng giỏ hàng được thiết kế để xử lý linh hoạt cho cả người dùng chưa đăng nhập và đã đăng nhập:
- **User chưa đăng nhập (Guest):** Toàn bộ dữ liệu giỏ hàng được quản lý bởi Frontend bằng **Local Storage**. Giúp trải nghiệm mượt mà, nhanh chóng (Slide-out Cart) mà không gọi API tốn tài nguyên Backend. Cấu trúc dữ liệu lưu trong Local Storage cần mô phỏng giống với cấu trúc API trả về.
- **User đã đăng nhập (Logged In):** Dữ liệu giỏ hàng được lưu trữ và quản lý thống nhất tại **Database**.
- **Cơ chế chuyển tiếp (Sync):** Ngay sau khi Guest thực hiện thao tác Đăng nhập (Login) thành công, Frontend sẽ gọi API `POST /api/v1/cart/sync` để đẩy toàn bộ Local Storage lên Backend. Backend sẽ gộp (merge) số lượng với giỏ hàng có sẵn trong Database. Sau khi Sync xong, Frontend sẽ xóa Local Storage và chuyển sang dùng API hoàn toàn.

## 2. Trụ cột 1: Thiết kế Dữ liệu (Database Schema)
Tập trung quản lý giỏ hàng cho người dùng đã đăng nhập (Persisted Cart).

### Bảng `carts`
Lưu trữ giỏ hàng của người dùng. Một user chỉ có tối đa 1 giỏ hàng active.
- `id` (UUID, Primary Key)
- `userId` (UUID, Foreign Key -> `users(id)`, Unique Constraint)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### Bảng `cart_items`
Lưu chi tiết số lượng sản phẩm trong giỏ hàng. 
**QUAN TRỌNG:** KHÔNG lưu giá sản phẩm (`price`/`salePrice`) tại đây. Giá luôn phải Join với bảng `products` để đảm bảo luôn lấy giá hiện hành (theo yêu cầu ở `ARCHITECTURE.md`).
- `id` (UUID, Primary Key)
- `cartId` (UUID, Foreign Key -> `carts(id)`)
- `productId` (UUID, Foreign Key -> `products(id)`)
- `quantity` (Int, Default: 1, CHECK quantity > 0)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)
- **Index/Constraint:** Ràng buộc `UNIQUE(cartId, productId)` để tránh duplicate record cho cùng 1 sản phẩm.

## 3. Trụ cột 2: Giao kèo API (API Contract)
*Các API dưới đây bắt buộc yêu cầu Authentication (Role: CUSTOMER).*

### 3.1. Lấy thông tin giỏ hàng
- **Method:** `GET /api/v1/cart`
- **Mục đích:** Render giỏ hàng trên UI (Drawer).
- **Logic Backend:** Lấy giỏ hàng của `userId` từ token. Join với bảng `products` để tính toán Tổng tiền (SubTotal, GrandTotal) theo thời gian thực.
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "cartId": "uuid...",
    "items": [
      {
        "cartItemId": "uuid...",
        "quantity": 2,
        "product": {
          "id": "uuid...",
          "name": "Tai nghe Sony WH-1000XM5",
          "thumbnail": "https://...",
          "price": 8000000,
          "salePrice": 7500000,
          "stock": 10
        },
        "itemTotal": 15000000 // Tính bằng: quantity * (salePrice || price)
      }
    ],
    "summary": {
      "subTotal": 15000000,
      "shippingFee": 0, // Miễn phí giao hàng (Hardcode cho MVP hoặc tính sau)
      "grandTotal": 15000000
    }
  }
}
```

### 3.2. Thêm sản phẩm vào giỏ (Hoặc cộng thêm số lượng)
- **Method:** `POST /api/v1/cart/items`
- **Logic:** 
  - Nếu `productId` chưa có trong giỏ hàng -> Thêm mới vào `cart_items`.
  - Nếu đã có -> Cập nhật cộng dồn `quantity` hiện có.
  - **Kiểm tra Stock:** Validate số lượng sau khi cộng không được vượt quá `product.stock`. Nếu vượt, báo lỗi HTTP 400.
- **Request Body:**
```json
{
  "productId": "uuid...",
  "quantity": 1
}
```
- **Response (200 OK):** Trả về toàn bộ giỏ hàng mới nhất (giống API GET) để UI cập nhật ngay lập tức.

### 3.3. Thay đổi trực tiếp số lượng 1 sản phẩm
- **Method:** `PUT /api/v1/cart/items/:productId`
- **Logic:** Ghi đè (Overwrite) số lượng hiện tại. Ví dụ người dùng gõ số 5 vào ô input.
  - Vẫn phải kiểm tra không được vượt quá tồn kho.
- **Request Body:**
```json
{
  "quantity": 5 
}
```
- **Response (200 OK):** Trả về toàn bộ giỏ hàng đã tính toán lại.

### 3.4. Xóa sản phẩm khỏi giỏ
- **Method:** `DELETE /api/v1/cart/items/:productId`
- **Logic:** Xóa record trong `cart_items`.
- **Response (200 OK):** Trả về giỏ hàng rỗng hơn đã cập nhật lại tổng tiền.

### 3.5. Đồng bộ giỏ hàng (Cart Sync)
- **Method:** `POST /api/v1/cart/sync`
- **Mục đích:** Phục vụ luồng chuyển tiếp khi Guest thực hiện Đăng nhập.
- **Logic:**
  - Nhận một mảng các sản phẩm và số lượng tương ứng từ Local Storage.
  - Lặp qua từng item: Nếu đã có trong DB thì cộng dồn số lượng, chưa có thì insert mới.
  - Đảm bảo `quantity` tổng không vượt qua `stock` hiện tại.
- **Request Body:**
```json
{
  "items": [
    { "productId": "uuid-1", "quantity": 2 },
    { "productId": "uuid-2", "quantity": 1 }
  ]
}
```
- **Response (200 OK):** Trả về giỏ hàng đầy đủ. (Tín hiệu để Frontend có thể clear Local Storage).

## 4. Trụ cột 3: Xử lý Bất đồng bộ, Caching & Performance
- **Không Cache Total Amount:** Do tính chất E-commerce biến động giá trị nhanh chóng (khuyến mãi, đổi giá), hệ thống **TUYỆT ĐỐI KHÔNG** cache tổng tiền đơn hàng. Việc query giá hiện tại của sản phẩm và nhân số lượng sẽ thực hiện on-the-fly (tính toán trực tiếp trên RAM của Server khi gọi API).
- **Bắt lỗi Out-Of-Stock thụ động:** Khi lấy thông tin giỏ hàng (`GET`), nếu backend phát hiện `quantity` > `stock` thực tế (do lúc thêm thì còn hàng nhưng lúc sau bị khách khác mua mất), backend nên trả về một flag `isStockError: true` vào chính item đó. Điều này giúp Frontend bôi đỏ sản phẩm và ngăn không cho bấm Checkout.
- **Xóa Giỏ hàng cũ (Dọn rác):** Có thể thiết lập một Background Job (Cron Job bằng `@nestjs/schedule` hoặc Redis TTL) dọn dẹp các bản ghi `carts` không có tương tác nào trong vòng 30 ngày để tối ưu dung lượng DB.
