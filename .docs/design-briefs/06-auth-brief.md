# ĐẶC TẢ GIAO DIỆN: XÁC THỰC & NGƯỜI DÙNG (AUTH)
- Xây dựng màn hình desktop
## 1. HỆ THỐNG LƯỚI & BỐ CỤC (LAYOUT SYSTEM)
- **Root Layout (Trang Auth):** Cấu trúc tập trung ở giữa màn hình (Centered Layout) dành cho Đăng nhập/Đăng ký. Cụ thể: `min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8`.
- **Auth Card:** Khung chứa form đăng nhập/đăng ký giới hạn chiều rộng `max-w-md w-full`.
- **Root Layout (Trang Profile):** Layout 2 cột trên Desktop (`grid-cols-1 md:grid-cols-4 gap-6`), 1 cột trên Mobile. Cột nhỏ bên trái (`col-span-1`) dành cho Sidebar Navigation, cột lớn bên phải (`col-span-3`) hiển thị chi tiết (Thông tin cá nhân / Lịch sử đơn hàng). Lớp bọc ngoài: `max-w-7xl mx-auto py-10 px-4`.
- **Spacing Chuẩn:** Khoảng cách giữa các input field `space-y-4` hoặc `space-y-6`.

## 2. ĐẶC TẢ COMPONENT (COMPONENT SPECS)

- **`AuthCard` (Khung Form) [DUMB]**:
  - Box Style: `bg-white rounded-2xl shadow-sm border border-gray-100 p-8`.
  - Typography: Tiêu đề form `text-2xl font-bold text-gray-900 text-center`, mô tả phụ `text-sm text-gray-600 text-center mt-2`.

- **`InputField` (Trường nhập liệu) [DUMB]**:
  - Box Style: Input `w-full rounded-xl border border-gray-300 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`.
  - Typography: Label `block text-sm font-medium text-gray-700 mb-1`, Placeholder `text-gray-400`.
  - Error State: Viền chuyển đỏ `border-red-500 focus:ring-red-500`, Text báo lỗi `text-xs text-red-600 mt-1`.

- **`SubmitButton` (Nút xác nhận) [DUMB]**:
  - Box Style: `w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500`.
  - Typography: `text-sm font-semibold text-white`.
  - Trạng thái: `hover:bg-orange-700 transition-colors`. Khi loading: Giảm opacity `opacity-70 cursor-not-allowed` kết hợp icon spinner.

- **`AuthLink` (Liên kết chuyển hướng) [DUMB]**:
  - Typography: Chữ thường `text-sm text-gray-600`, Phần link có thể nhấn `font-medium text-orange-600 hover:text-orange-500`.

- **`ProfileInfoCard` [DUMB]**:
  - Box Style: `bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6`.
  - Typography: Nhãn thông tin `text-sm text-gray-500`, Giá trị `text-base font-medium text-gray-900`.

- **`OrderHistoryCard` [DUMB]**:
  - Box Style: `bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden`.
  - Trạng thái Đơn hàng (Badge): Thành công `bg-green-100 text-green-800`, Đang giao `bg-blue-100 text-blue-800`, Đang xử lý `bg-yellow-100 text-yellow-800`.

## 3. RÀNG BUỘC MÀU SẮC (COLOR CONSTRAINTS)
- **Màu Cam thương hiệu:** Áp dụng cho nút Submit (Đăng nhập, Đăng ký), các link chuyển hướng, focus ring của ô input. Bắt buộc dùng biến màu Tailwind: `bg-orange-600`, `text-orange-600`, `ring-orange-500`.
- **Màu Lỗi (Error):** Dành cho báo lỗi validation của Form. Bắt buộc dùng `text-red-600`, `border-red-500`.
- **Màu Nền & Border:** Nền trang tổng quát `bg-gray-50`, nền Form trắng `bg-white`, viền ô input và border mỏng `border-gray-200` hoặc `border-gray-300`.
- **Lưu ý theo AGENTS.md:** Không sử dụng các mã HEX (như `#ff8c42` hay `#A63D40`), thay vào đó đã ánh xạ sang hệ màu Tailwind (`orange-600`, `rose-700`) để tuân thủ luật thiết kế.

## 4. MOCK DATA (DỮ LIỆU HIỂN THỊ)
- **Trang Đăng Nhập:**
  - Tiêu đề: "Chào mừng trở lại"
  - Link: "Chưa có tài khoản? Đăng ký ngay"
  - Form Fields: Email (placeholder: `coder@techbite.vn`), Mật khẩu (placeholder: `••••••••`)
- **Trang Đăng Ký:**
  - Tiêu đề: "Tạo tài khoản mới"
  - Link: "Đã có tài khoản? Đăng nhập"
  - Form Fields: Họ tên (placeholder: `Nguyen Van A`), Số điện thoại (placeholder: `0987654321`), Email, Mật khẩu, Xác nhận mật khẩu.
- **Trang Profile:**
  - Thông tin mẫu: Tên `Hải Đăng`, Email `haidang.dev@gmail.com`, SĐT `0912345678`.
  - Đơn hàng mẫu: Mã `TB-12345`, Tổng tiền `85.000 đ`, Trạng thái `Đang giao`.
