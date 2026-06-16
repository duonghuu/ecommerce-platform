# ĐẶC TẢ THIẾT KẾ: BỐ CỤC TOÀN CỤC (MASTER LAYOUT)

## 1. HỆ THỐNG LƯỚI & BỐ CỤC (LAYOUT SYSTEM)

- **RÀNG BUỘC VIEWPORT (BẮT BUỘC):**
 - Khung tranh render phải là Desktop (Chiều rộng tối thiểu 1440px). 
- **Cấu trúc Root (MasterLayout):**
  - Wrapper ngoài cùng: `min-h-screen flex flex-col bg-gray-50`.
- **Header:**
  - Layout: `sticky top-0 z-50 bg-white border-b border-gray-200`.
  - Inner Container: `max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4`.
- **MainContent:**
  - Layout: `flex-grow max-w-7xl mx-auto px-4 py-8 w-full`.
- **Footer:**
  - Layout: `bg-slate-900 text-white py-12 mt-auto`.
  - Inner Container: `max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8`.

## 2. ĐẶC TẢ COMPONENT (COMPONENT SPECS)

- **Logo** `[DUMB]`
  - Box Style: Không viền, không nền.
  - Typography: `text-2xl font-bold tracking-tight text-slate-900`.
  - Tương tác: `hover:opacity-80 transition-opacity cursor-pointer`.

- **LoginButton** `[DUMB]`
  - Box Style: `rounded-lg px-4 py-2 border border-slate-200`.
  - Typography: `text-sm font-medium text-slate-700`.
  - Tương tác: `hover:bg-slate-50 hover:border-slate-300 transition-colors`.

- **CartIcon** `[DUMB]`
  - Box Style: Button chứa icon `p-2 rounded-full relative`. Badge số lượng `absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-600`.
  - Typography (Badge): `text-[10px] font-bold text-white`.
  - Tương tác: `hover:bg-slate-100 transition-colors`.

- **MainContent** `[DUMB]`
  - Box Style: Khung chứa rỗng, không định dạng style phức tạp, chỉ bọc `children`.

- **Footer** `[DUMB]`
  - Box Style: Nền tối trải dài toàn màn hình `w-full bg-slate-900`.

- **FooterColumn** `[DUMB]`
  - Box Style: Cột Flexbox `flex flex-col gap-4`.
  - Typography (Title): `text-lg font-semibold text-white`.
  - Typography (Link): `text-sm text-slate-300`.
  - Tương tác (Link): `hover:text-white hover:underline transition-colors`.

## 3. RÀNG BUỘC MÀU SẮC (COLOR CONSTRAINTS)

- **Background Tổng thể:** `bg-gray-50` (Tạo không gian nổi bật nội dung).
- **Background Header & Card:** `bg-white` (Sạch sẽ, dễ nhìn).
- **Primary Accent (Badge Giỏ hàng):** `bg-orange-600` (Gây sự chú ý vào hành động mua sắm).
- **Văn bản chính (Dark):** `text-slate-900` (Dành cho Logo, Heading).
- **Văn bản phụ (Muted):** `text-slate-700` hoặc `text-slate-500` (Cho các nút phụ, placeholder).
- **Footer Background:** `bg-slate-900`.
- **Footer Text:** `text-white` (Heading) và `text-slate-300` (Links).

## 4. MOCK DATA (DỮ LIỆU HIỂN THỊ)

- **Logo:** `TechBite.`
- **SearchBar (Placeholder):** `"Tìm kiếm laptop, điện thoại..."`
- **LoginButton (Label):** `"Đăng nhập"`
- **CartIcon (Badge số lượng):** `3`
- **Footer Column 1 (Về TechBite):**
  - Giới thiệu
  - Tuyển dụng
  - Liên hệ
- **Footer Column 2 (Chính sách):**
  - Điều khoản sử dụng
  - Chính sách bảo mật
  - Chính sách đổi trả
- **Footer Column 3 (Mạng xã hội):**
  - Facebook
  - YouTube
  - Instagram
