# ĐẶC TẢ GIAO DIỆN: THANH TOÁN (CHECKOUT)
- Xây dựng màn hình desktop

## 1. HỆ THỐNG LƯỚI & BỐ CỤC (LAYOUT SYSTEM)
- **Root Layout:** Bố cục chia làm 2 cột chính trên giao diện Desktop (Cột trái: Thông tin khách hàng, Cột phải: Thông tin đơn hàng).
  - Cấu trúc grid gợi ý: `grid grid-cols-1 lg:grid-cols-12 gap-8`.
  - Cột trái chiếm 7 hoặc 8 phần: `lg:col-span-7` hoặc `lg:col-span-8`.
  - Cột phải chiếm phần còn lại: `lg:col-span-5` hoặc `lg:col-span-4`.
  - Lớp bọc ngoài (Container): `max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen`.
- **Cột phải (Order Summary):** Cần thiết lập Sticky để khi cuộn trang, khối giỏ hàng luôn hiển thị: `sticky top-8`.
- **Spacing Chuẩn:** Khoảng cách giữa các phần trong một form là `space-y-6`. Các nhóm input nhỏ hơn có khoảng cách `space-y-4` hoặc grid `gap-4`.

## 2. ĐẶC TẢ COMPONENT (COMPONENT SPECS)

- **`CheckoutSectionCard` (Khung bao ngoài Cột trái & Phải) [DUMB]**:
  - Box Style: `bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8`.
  - Typography: Tiêu đề khối `text-xl font-bold text-gray-900 mb-6`.

- **`InputField` & `TextArea` (Trường nhập liệu) [DUMB]**:
  - Box Style: `w-full rounded-xl border border-gray-300 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`.
  - Typography: Label `block text-sm font-medium text-gray-700 mb-1`. Placeholder `text-gray-400`.
  - Checkbox Style: `rounded border-gray-300 text-orange-600 focus:ring-orange-500`.

- **`PaymentMethodOption` (Lựa chọn phương thức thanh toán) [DUMB]**:
  - Box Style: Khối chọn `flex items-center p-4 border rounded-xl cursor-pointer transition-all`.
  - Trạng thái chưa chọn: `border-gray-200 bg-white hover:bg-gray-50`.
  - Trạng thái đang chọn: `border-orange-500 bg-orange-50 ring-1 ring-orange-500`.

- **`CheckoutSubmitButton` (Nút Đặt Hàng) [DUMB]**:
  - Box Style: `w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors mt-6`.
  - Typography: `text-base font-bold text-white uppercase tracking-wider`.
  - Trạng thái loading: Thêm spinner, `opacity-75 cursor-not-allowed`.

- **`CheckoutModal` (Popup QR / COD) [SMART]**:
  - Backdrop: `fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4`.
  - Modal Box: `bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center`.
  - Typography (Countdown QR): `text-2xl font-mono font-bold text-rose-700`.

## 3. RÀNG BUỘC MÀU SẮC (COLOR CONSTRAINTS)
- **Màu Cam thương hiệu:** Dùng cho nút call-to-action chính (Nút Đặt hàng), Checkbox đang tick, Radio button đang chọn, viền (border) khi focus vào input. Theo chuẩn hệ màu Tailwind: `bg-orange-600`, `text-orange-600`, `ring-orange-500`, `border-orange-500`.
- **Màu Đỏ mận (Discount Badge / Báo lỗi / Đếm ngược):** Áp dụng khi hiển thị mã giảm giá đã áp dụng thành công hoặc thời gian đếm ngược của mã QR. Bắt buộc dùng `bg-rose-100 text-rose-800` (cho badge) hoặc `text-rose-700` (cho chữ).
- **Màu Nền & Border:** Bố cục nền tổng thể `bg-gray-50`, khối chứa nội dung `bg-white`, border nhạt phân chia sản phẩm `border-gray-100` hoặc `border-gray-200`.

## 4. MOCK DATA (DỮ LIỆU HIỂN THỊ)
- **Thông tin giao hàng:**
  - Họ tên: `Nguyễn Văn A`
  - Số điện thoại: `0987654321`
  - Email: `coder@techbite.vn`
  - Địa chỉ: `123 Đường Công Nghệ, Quận 1, TP. HCM`
  - Ghi chú: `Giao giờ hành chính giúp mình nhé.`
- **Thông tin đơn hàng (Mini Cart):**
  - Sản phẩm 1: `Bàn phím cơ Keychron K8 Pro` (x1) - Giá: `2.150.000 đ`
  - Sản phẩm 2: `Chuột Logitech MX Master 3S` (x1) - Giá: `2.490.000 đ`
- **Chi phí (Pricing Details):**
  - Tạm tính: `4.640.000 đ`
  - Phí vận chuyển: `40.000 đ`
  - Giảm giá (Mã: TECHBITE200): `- 200.000 đ`
  - Tổng cộng: `4.480.000 đ`