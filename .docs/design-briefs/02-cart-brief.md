# ĐẶC TẢ THIẾT KẾ: GIỎ HÀNG TRƯỢT (CART DRAWER)

## 1. HỆ THỐNG LƯỚI & BỐ CỤC (LAYOUT SYSTEM)
- **Root Wrapper (Giỏ hàng mở):** `fixed inset-0 z-50 flex justify-end`. (Phủ toàn bộ màn hình, đẩy Drawer sang sát viền phải).
- **Drawer Container:** `w-full max-w-md h-full flex flex-col`. (Chiều rộng tối đa cho màn hình lớn, full màn hình cho mobile, dàn cột Flexbox dọc).
- **Header:** `flex items-center justify-between px-6 py-4 border-b border-gray-100`.
- **Item List (Body):** `flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-6`.
- **Footer (Summary & CTA):** `mt-auto px-6 py-6 border-t border-gray-100 sticky bottom-0`.

## 2. ĐẶC TẢ COMPONENT (COMPONENT SPECS)

- **`CartDrawerOverlay` [DUMB]**
  - Box Style: Lớp phủ đen trong suốt có làm mờ nền `bg-black/40 backdrop-blur-sm`.
  - Trạng thái: Không hiệu ứng tương tác hover, click ra ngoài để đóng.

- **`CartDrawerContainer` [DUMB]**
  - Box Style: Nền kính (Glassmorphism) `bg-white/95 backdrop-blur-md shadow-2xl`.

- **`CartDrawerHeader` [DUMB]**
  - Typography (Tiêu đề): `text-xl font-bold tracking-tight text-gray-900`.
  - Box Style (Nút Đóng): `p-2 rounded-full`.
  - Typography (Nút Đóng Icon): `text-gray-500`.
  - Trạng thái (Nút Đóng): `hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer`.

- **`CartItemList` [DUMB]**
  - Box Style: Container cuộn dọc, chỉ là wrapper, không quy định màu sắc đặc thù.

- **`CartItem` [DUMB]**
  - Box Style: Bố cục Flex ngang (Ảnh bên trái, thông tin bên phải) `flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm`. 
  - Image Style: `w-20 h-20 rounded-xl object-cover bg-gray-50`.
  - Typography (Tên): `text-base font-semibold text-gray-800 line-clamp-2`.
  - Typography (Giá): `text-orange-600 font-bold text-lg mt-1`.

- **`QuantitySelector` [DUMB]**
  - Box Style: `flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-200 w-fit`.
  - Buttons (+/-): `w-8 h-8 flex items-center justify-center rounded bg-white shadow-sm text-gray-700`.
  - Typography (Số lượng): `text-sm font-semibold w-4 text-center`.
  - Trạng thái (Buttons): `hover:bg-gray-100 active:scale-95 transition-all cursor-pointer`.

- **`RemoveButton` [DUMB]**
  - Typography: `text-sm font-medium text-gray-400 underline underline-offset-2`.
  - Trạng thái: `hover:text-red-500 transition-colors cursor-pointer`.

- **`CartDrawerFooter` [DUMB]**
  - Box Style: Nền `bg-white/90 backdrop-blur-md`. Bố cục Flex dọc chứa các dòng tính toán và nút.
  - Typography (Phí giao hàng label): `text-sm text-gray-500`.
  - Typography (Phí giao hàng value): `text-sm font-bold text-green-600`.
  - Typography (Tổng tiền label): `text-base font-semibold text-gray-700`.
  - Typography (Tổng tiền value): `text-2xl font-black text-gray-900`.

- **`CheckoutCTA` [DUMB]**
  - Box Style: Khối nút lớn `w-full py-4 rounded-xl shadow-lg shadow-orange-200/50 flex items-center justify-center`.
  - Typography: `text-white font-bold text-lg`.
  - Trạng thái: `hover:bg-orange-700 hover:-translate-y-1 hover:shadow-xl active:scale-95 transition-all cursor-pointer`.

## 3. RÀNG BUỘC MÀU SẮC (COLOR CONSTRAINTS)
- **Primary CTA & Giá tiền:** BẮT BUỘC dùng `bg-orange-600` và `text-orange-600` cho nút Thanh toán và Giá sản phẩm để kích thích mua hàng.
- **Background:** Overlay dùng `bg-black/40`, Giỏ hàng dùng `bg-white/95` (Hơi trong suốt để tạo hiệu ứng Glassmorphism).
- **Văn bản:** Tiêu đề chính dùng `text-gray-900`, phụ dùng `text-gray-500` hoặc `text-gray-400`.
- **Nhấn mạnh tích cực:** Phí giao hàng "Miễn phí" dùng `text-green-600`.
- **Hành động phá hủy:** Nút Xóa khi hover dùng `text-red-500`.

## 4. MOCK DATA (DỮ LIỆU HIỂN THỊ)
- **Header:** "Giỏ hàng của bạn (2)"
- **Sản phẩm 1:**
  - Tên: "Chuột không dây Logitech MX Master 3S"
  - Giá: "2.490.000 đ"
  - Số lượng: "1"
  - Ảnh: `https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=200&h=200`
- **Sản phẩm 2:**
  - Tên: "Bàn phím cơ Keychron K8 Pro Nhôm"
  - Giá: "2.150.000 đ"
  - Số lượng: "1"
  - Ảnh: `https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=200&h=200`
- **Tạm tính:**
  - Phí giao hàng: "Miễn phí"
  - Tổng tiền: "4.640.000 đ"
- **Nút CTA:** "Thanh Toán Ngay"
