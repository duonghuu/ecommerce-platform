1. HỆ THỐNG LƯỚI & BỐ CỤC (LAYOUT SYSTEM):
- **Cấu trúc Root (GlobalSearch):** `relative w-full max-w-lg mx-auto` (Làm điểm tựa (anchor) để Dropdown hiển thị ngay bên dưới Input).
- **SearchInput:** `w-full` hiển thị thanh nhập liệu.
- **SearchSuggestDropdown (Khung Dropdown):** `absolute top-full left-0 right-0 mt-2 z-50` (Hiển thị đè lên các nội dung phía dưới, cách thanh search 1 khoảng nhỏ `mt-2`).
- **SuggestProductList:** `flex flex-col` (Danh sách xếp dọc).

2. ĐẶC TẢ COMPONENT (COMPONENT SPECS):
- **`SearchInput` [DUMB]:**
  + Box Style: `w-full h-12 px-5 pl-12 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#ff8c42]/50 focus:bg-white transition-all` (Bo tròn dạng viên thuốc `rounded-full`, có hiệu ứng viền khi focus).
  + Icon: Icon kính lúp ở vị trí `absolute left-4 top-1/2 -translate-y-1/2 text-gray-400`.
  
- **`SearchSuggestDropdown` [DUMB]:**
  + Box Style: `bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden` (Góc bo mềm mại `rounded-2xl`, bóng đổ rõ ràng để nổi bật trên nền layout `shadow-xl`).

- **`SuggestProductItem` [DUMB]:**
  + Box Style: `flex items-center gap-4 p-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0`.
  + Image Thumbnail: `w-14 h-14 flex-shrink-0 rounded-xl object-cover` (Ảnh bo góc vuông `rounded-xl`).
  + Info Container: `flex flex-col flex-1 min-w-0` (Ngăn chặn text bị tràn ra ngoài khối).
  + Typography Tên món: `text-sm font-semibold text-gray-900 truncate` (Cắt text 1 dòng với dấu `...`).
  + Typography Giá tiền: `text-sm font-bold text-[#A63D40] mt-1`.

- **`ViewAllResultsButton` [DUMB]:**
  + Box Style: `block w-full text-center p-3 bg-orange-50/50 hover:bg-orange-50 transition-colors`.
  + Typography: `text-sm font-bold text-[#ff8c42]`.

3. RÀNG BUỘC MÀU SẮC (COLOR CONSTRAINTS):
- **Màu nền Dropdown:** Không gian trắng sạch sẽ `bg-white`.
- **Màu Tương tác (Focus/Hover):** `hover:bg-gray-50` cho các item. Vùng viền input khi active sử dụng Cam thương hiệu `#ff8c42`.
- **Màu Giá tiền:** BẮT BUỘC sử dụng mã màu `#A63D40` (Đỏ mận).
- **Màu Call-to-Action (Nút Xem tất cả):** Sử dụng mã màu `#ff8c42` kết hợp với nền cam nhạt.

4. MOCK DATA (DỮ LIỆU HIỂN THỊ):
- **Gợi ý sản phẩm (tối đa 5 item):**
  1. Tên: "Cơm Tấm Sườn Bì Chả" | Giá: 65.000đ | Ảnh: `https://images.unsplash.com/photo-1626844131082-256783844137?auto=format&fit=crop&w=100&q=80`
  2. Tên: "Bún Bò Huế Đặc Biệt" | Giá: 55.000đ | Ảnh: `https://images.unsplash.com/photo-1582878826629-29b7ad1cb431?auto=format&fit=crop&w=100&q=80`
  3. Tên: "Trà Đào Cam Sả Thơm Mát" | Giá: 45.000đ | Ảnh: `https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=100&q=80`
  4. Tên: "Gà Rán Sốt Cay Hàn Quốc Giòn Rụm" (Tên cố tình dài để test cắt chữ `truncate`) | Giá: 85.000đ | Ảnh: `https://images.unsplash.com/photo-1569058242253-1df34b062b19?auto=format&fit=crop&w=100&q=80`
  5. Tên: "Phở Bò Tái Nạm" | Giá: 60.000đ | Ảnh: `https://images.unsplash.com/photo-1582878826629-29b7ad1cb431?auto=format&fit=crop&w=100&q=80`
