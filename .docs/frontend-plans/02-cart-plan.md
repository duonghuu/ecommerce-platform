# QUY HOẠCH KỸ THUẬT: GIỎ HÀNG TRƯỢT (CART DRAWER)

## 1. PHÂN RÃ COMPONENT (COMPONENT TREE)

- `CartDrawer` **[SMART]**: Component gốc (Container). Lắng nghe trạng thái mở/đóng từ URL hoặc Global State, lấy dữ liệu giỏ hàng, và truyền xuống các component con.
  - `CartDrawerOverlay` **[DUMB]**: Hiển thị lớp phủ làm tối và mờ nền (backdrop-blur). Bắt sự kiện click để đóng giỏ hàng. *(Tiềm năng: Shared UI - Modal/Drawer Overlay)*
  - `CartDrawerContainer` **[DUMB]**: Khối giao diện chính trượt từ phải sang.
    - `CartDrawerHeader` **[DUMB]**: Tiêu đề giỏ hàng và nút đóng (X).
    - `CartItemList` **[DUMB]**: Vùng cuộn (scrollable) chứa danh sách các sản phẩm.
      - `CartItem` **[DUMB]**: Card hiển thị Thumbnail (vuông), Tên sản phẩm, Giá bán.
        - `QuantitySelector` **[DUMB]**: Component chứa nút `[+]`, `[-]` và hiển thị số lượng. *(Tiềm năng: Shared UI)*
        - `RemoveButton` **[DUMB]**: Nút xóa sản phẩm khỏi giỏ màu xám nhạt.
    - `CartDrawerFooter` **[DUMB]**: Vùng ghim cố định (sticky bottom). Hiển thị phí giao hàng, Tổng tiền.
      - `CheckoutCTA` **[DUMB]**: Nút "Thanh Toán Ngay" (Primary CTA - `bg-orange-600`). *(Tiềm năng: Shared UI - PrimaryButton)*

## 2. QUẢN LÝ TRẠNG THÁI (STATE MANAGEMENT)

**Danh sách State cần thiết:**
- `isCartOpen`: Trạng thái hiển thị (Mở/Đóng) của Drawer.
- `cartItems`: Danh sách các sản phẩm đang có trong giỏ hàng.
- `isCheckingOut`: Trạng thái đang xử lý thanh toán (Loading spinner trên nút CTA).

**Chiến lược lưu trữ:**
- **URL Query Parameters:** 
  - `isCartOpen` NÊN được lưu dưới dạng Query Param (VD: `?cart=open`). Điều này giúp người dùng có thể dùng nút Back của trình duyệt để đóng giỏ hàng một cách tự nhiên, hoặc chia sẻ link mở sẵn giỏ hàng.
- **Global State (Zustand/Pinia):** 
  - `cartItems` BẮT BUỘC lưu ở Global State vì dữ liệu này cần được đồng bộ ở nhiều nơi (VD: Con số Badge trên Header `CartIcon` cũng cần đọc data này).
- **Local State (`useState`):** 
  - `isCheckingOut` chỉ lưu ở Local State bên trong `CartDrawer` để quản lý trạng thái loading của nút Thanh toán tại thời điểm đó.

## 3. CẤU TRÚC DỮ LIỆU (DATA INTERFACES)

```typescript
// Core Data Entity
export interface ICartItem {
  id: string;
  name: string;
  thumbnailUrl: string;
  price: number;
  quantity: number;
}

// Props cho các Dumb Components
export interface CartItemProps {
  item: ICartItem;
  onIncreaseQuantity: (id: string) => void;
  onDecreaseQuantity: (id: string) => void;
  onRemoveItem: (id: string) => void;
}

export interface QuantitySelectorProps {
  value: number;
  onIncrease: () => void;
  onDecrease: () => void;
  disabled?: boolean;
}

export interface CartDrawerFooterProps {
  subtotal: number;
  shippingFee: number;
  total: number;
  isCheckingOut: boolean;
  onCheckout: () => void;
}

export interface CartDrawerContainerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
```
