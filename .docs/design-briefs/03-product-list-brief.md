1. HỆ THỐNG LƯỚI & BỐ CỤC (LAYOUT SYSTEM):
- **Cấu trúc Root:** `max-w-7xl mx-auto min-h-screen px-4 py-8` (Bao phủ toàn bộ nội dung với khoảng trống hai bên).
- **Banner Section:** `w-full h-48 md:h-64 mb-8 md:mb-12` (Chiếm trọn chiều ngang, chiều cao cố định).
- **ProductListLayout (Container chính):** `flex flex-col md:flex-row gap-6 md:gap-8` (Mobile xếp dọc, Desktop xếp ngang phân chia cột trái/phải).
- **Sidebar (Bộ lọc):** `w-full md:w-1/4 md:w-64 flex-shrink-0` (Mobile chiếm 100%, Desktop chiếm khoảng 25%).
- **Main Area (Danh sách sản phẩm):** `flex-1 flex flex-col gap-6` (Chiếm phần diện tích còn lại bên phải).
- **ProductGrid:** `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6` (Responsive chia 2, 3 và 4 cột tùy kích thước màn hình).

2. ĐẶC TẢ COMPONENT (COMPONENT SPECS):
- **`Banner` [DUMB]:**
  + Box Style: `rounded-2xl overflow-hidden shadow-md`.
  + Typography: Không yêu cầu (Nút/chữ nếu có phải rõ ràng trên nền ảnh).
  + Trạng thái tương tác: Không yêu cầu.

- **`ProductListLayout` [DUMB]:**
  + Box Style: Đóng vai trò là thẻ bọc ngoài, không chứa style về màu nền hay viền.

- **`FilterGroup` [DUMB]:**
  + Box Style: `border-b border-gray-100 py-5 last:border-0`.
  + Typography: Tiêu đề `text-lg font-bold text-gray-800 mb-4`, Tùy chọn `text-sm text-gray-600`.
  + Trạng thái tương tác: Tùy chọn hover `hover:text-[#ff8c42] cursor-pointer transition-colors`.

- **`ProductToolbar` [DUMB]:**
  + Box Style: `flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100`.
  + Typography: Text hiển thị số lượng `text-sm text-gray-500 font-medium`.
  + Trạng thái tương tác: Nút bấm `hover:bg-gray-50 active:scale-95 transition-all`.

- **`ProductGrid` [DUMB]:**
  + Box Style: Đóng vai trò cấu trúc lưới (grid), không chứa style đồ họa.

- **`ProductCard` [DUMB]:**
  + Box Style: `bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative`. (Sử dụng `rounded-2xl` để bo góc mềm mại, nhiều không gian trắng).
  + Typography: Tên sản phẩm `text-base font-semibold text-gray-800 line-clamp-2 mt-2`, Giá tiền `text-lg font-bold text-gray-900`.
  + Trạng thái tương tác: Thẻ sản phẩm `hover:-translate-y-1 hover:shadow-lg transition-all duration-300`, Nút thêm vào giỏ `active:scale-95 hover:opacity-90 transition-opacity`.

- **`Pagination` [DUMB]:**
  + Box Style: `flex justify-center items-center gap-2 mt-10`.
  + Typography: `text-sm font-semibold`.
  + Trạng thái tương tác: Nút trang `hover:bg-orange-50 hover:text-[#ff8c42] rounded-lg px-4 py-2 transition-colors`, Trang đang chọn `bg-[#ff8c42] text-white shadow-sm`.

3. RÀNG BUỘC MÀU SẮC (COLOR CONSTRAINTS):
- **Màu nền trang chủ đạo:** `bg-gray-50` (Tạo không gian sạch, làm nổi bật card sản phẩm màu trắng).
- **Màu Call-to-Action chính (Nút Thêm vào giỏ):** BẮT BUỘC sử dụng mã màu theo yêu cầu đặc biệt `bg-[#ff8c42] text-white`.
- **Màu Huy hiệu (Badge giảm giá) / Chữ nổi bật:** BẮT BUỘC sử dụng mã màu `bg-[#A63D40] text-white` hoặc `text-[#A63D40]`.
- **Màu sắc cơ bản khác:** Sử dụng class chuẩn Tailwind (Ví dụ: Chữ tiêu đề `text-gray-800`, chữ phụ `text-gray-500`, viền `border-gray-100`). Tuyệt đối không dùng mã HEX tự chế cho các phần này.

4. MOCK DATA (DỮ LIỆU HIỂN THỊ):
- **Banner Placeholder:** `https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80` (Món ăn tươi sáng).
- **Danh sách sản phẩm:**
  1. Cơm Tấm Sườn Bì Chả
     + Giá: 65.000đ (Giá gốc: 80.000đ)
     + Badge: "-20%"
     + Ảnh: `https://images.unsplash.com/photo-1626844131082-256783844137?auto=format&fit=crop&w=500&q=80`
  2. Bún Bò Huế Đặc Biệt
     + Giá: 55.000đ
     + Badge: "Nổi bật"
     + Ảnh: `https://images.unsplash.com/photo-1582878826629-29b7ad1cb431?auto=format&fit=crop&w=500&q=80`
  3. Trà Đào Cam Sả
     + Giá: 45.000đ
     + Ảnh: `https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=500&q=80`
  4. Gà Rán Sốt Cay Hàn Quốc
     + Giá: 85.000đ (Giá gốc: 100.000đ)
     + Badge: "Freeship"
     + Ảnh: `https://images.unsplash.com/photo-1569058242253-1df34b062b19?auto=format&fit=crop&w=500&q=80`
- **Bộ lọc (SidebarFilter / FilterGroup):**
  + Danh mục món: Đồ ăn chính (120), Đồ ăn vặt (45), Thức uống (80), Tráng miệng (25).
  + Mức giá: Dưới 50.000đ, 50.000đ - 100.000đ, Trên 100.000đ.
