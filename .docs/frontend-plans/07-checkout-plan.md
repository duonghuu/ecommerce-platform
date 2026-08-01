# QUY HOẠCH KỸ THUẬT: THANH TOÁN (CHECKOUT)

## 1. PHÂN RÃ COMPONENT (COMPONENT TREE)

- `CheckoutPage` **[SMART]**: Component cấp cao nhất của trang Thanh toán. Quản lý toàn bộ state liên quan đến form thông tin, giỏ hàng hiện tại, và gọi API xử lý thanh toán (Tạo đơn hàng).
  - `CheckoutLayout` **[DUMB]**: Wrapper layout chia màn hình thành 2 cột (Cột trái: Thông tin, Cột phải: Đơn hàng). Có style sạch sẽ (Clean), không gian trắng, các khối nội dung sử dụng `rounded-2xl`.
  
  - `CustomerInfoForm` **[DUMB]**: Nằm ở cột trái. Form nhập liệu: Họ tên, Email, Số điện thoại, Địa chỉ nhận hàng, Chọn phương thức vận chuyển, Ghi chú đơn hàng, Checkbox điều khoản. Nhận giá trị form và validation errors từ cha. Nếu người dùng đã đăng nhập, thông tin sẽ được điền sẵn.
  
  - `OrderSummarySidebar` **[DUMB]**: Nằm ở cột phải. Khối thông tin đơn hàng.
    - `MiniCart` **[DUMB]**: Hiển thị lại danh sách sản phẩm trong giỏ hàng.
    - `PricingDetails` **[DUMB]**: Hiển thị Thành tiền, Thuế, Phí vận chuyển, Tổng cộng.
    - `DiscountInput` **[SMART/DUMB]**: Input nhập mã giảm giá. Sử dụng màu đỏ mận (`bg-[#A63D40]` hoặc `text-[#A63D40]`) cho các badge giảm giá nếu có áp dụng.
    - `PaymentMethodSelector` **[DUMB]**: Lựa chọn phương thức thanh toán (COD, QR Code). Nhận giá trị phương thức được chọn từ cha.
    - `CheckoutSubmitButton` **[DUMB]**: Nút thanh toán gọi hành động chính. BẮT BUỘC sử dụng màu cam thương hiệu (`bg-[#ff8c42]`).

  - `CheckoutModal` **[SMART]**: Popup Modal hiển thị thông báo/hành động sau khi nhấn Thanh toán.
    - `CODPopupContent` **[DUMB]**: Hiển thị nội dung ghi chú: "Thanh toán trực tiếp cho shipper khi nhận hàng" kèm nút Xác nhận.
    - `QRCodePopupContent` **[DUMB]**: Hiển thị hình ảnh QR Code, số tiền thanh toán, đồng hồ đếm ngược. Hỗ trợ logic tự động xác nhận đơn hàng khi thanh toán thành công thông qua WebSocket hoặc Polling API.

## 2. QUẢN LÝ TRẠNG THÁI (STATE MANAGEMENT)

- **Local State (`useState` / React Hook Form):**
  - Form States (Sử dụng `react-hook-form` kết hợp `zod` để validate): `fullName`, `email`, `phone`, `address`, `shippingMethod`, `orderNotes`, `termsAccepted`.
  - `paymentMethod` (string): `'COD' | 'QR_CODE'`.
  - `discountCode` (string): Mã giảm giá đang nhập.
  - `isSubmitting` (boolean): Trạng thái loading của nút Thanh toán khi đang gọi API tạo đơn hàng.
  - `popupState` (Object): Trạng thái quản lý popup sau khi tạo đơn hàng thành công, ví dụ `{ isOpen: true, type: 'COD' | 'QR_CODE', orderId: '...' }`.
  - `qrCountdown` (number): Thời gian đếm ngược (giây) hiển thị trên popup QR Code.

- **Global State (Zustand / Context API):**
  - `cartStore`:
    - `items`: Danh sách sản phẩm (để truyền vào `MiniCart`).
    - Lấy thông tin tổng tiền và tính toán.
    - Hàm `clearCart()`: Xóa sạch giỏ hàng nội bộ (và local storage) sau khi thanh toán hoặc tạo đơn hàng thành công.
  - `authStore`:
    - Lấy thông tin `user` hiện tại (nếu `isAuthenticated === true`) để pre-fill (điền sẵn) các trường như Họ tên, Email, Số điện thoại vào `CustomerInfoForm`.

## 3. CẤU TRÚC DỮ LIỆU (DATA INTERFACES)

```typescript
// 1. Giao diện dữ liệu mô hình cốt lõi (Models)
export interface CheckoutCartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

// 2. Giao diện Payload (Gửi lên API)
export interface CreateOrderPayload {
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
  };
  shippingMethod: string;
  paymentMethod: 'COD' | 'QR_CODE';
  orderNotes?: string;
  discountCode?: string;
  termsAccepted: boolean;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
}

export interface OrderResponse {
  orderId: string;
  orderCode: string;
  totalAmount: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED';
  paymentMethod: 'COD' | 'QR_CODE';
  paymentDetails?: {
    qrCodeUrl?: string; // Trả về nếu phương thức là QR_CODE
    bankAccount?: string;
    bankName?: string;
    expiresAt?: string; // Thời gian hết hạn của mã QR
  };
}

// 3. Giao diện Props cho các Dumb Components
export interface CustomerInfoFormProps {
  register: any; // React Hook Form register
  errors: any;   // React Hook Form errors
}

export interface OrderSummarySidebarProps {
  items: CheckoutCartItem[];
  subTotal: number;
  shippingFee: number;
  discountAmount: number;
  total: number;
}

export interface PaymentMethodSelectorProps {
  selectedMethod: 'COD' | 'QR_CODE';
  onSelect: (method: 'COD' | 'QR_CODE') => void;
}

export interface CheckoutModalProps {
  isOpen: boolean;
  type: 'COD' | 'QR_CODE' | null;
  orderData: OrderResponse | null;
  countdownTimer?: number;
  onClose: () => void;
  onConfirmSuccess?: () => void; // Callback khi đơn hàng được xác nhận hoặc hoàn tất
}
```
