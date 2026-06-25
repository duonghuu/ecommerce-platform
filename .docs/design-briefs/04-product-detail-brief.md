1. HỆ THỐNG LƯỚI & BỐ CỤC (LAYOUT SYSTEM):
- **Cấu trúc Root:** `max-w-7xl mx-auto px-4 py-8 md:py-12` (Bao phủ toàn bộ nội dung với khoảng trống hai bên).
- **ProductTopSection (Phần trên):** `flex flex-col md:flex-row gap-8 lg:gap-12 mb-12` (Mobile xếp dọc, Desktop xếp ngang phân chia cột trái/phải).
- **ProductGallery (Cột trái - Hình ảnh):** `w-full md:w-1/2 flex-shrink-0 flex flex-col gap-4`.
- **ProductInfo (Cột phải - Thông tin):** `w-full md:w-1/2 flex flex-col gap-6` (Chiếm nửa không gian còn lại bên phải).
- **ProductBottomSection (Phần dưới):** `flex flex-col gap-12 mt-12` (Chứa mô tả chi tiết và sản phẩm liên quan, trải rộng full màn hình).
- **ProductGrid (Sản phẩm liên quan):** `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6` (Responsive chia 2, 3 và 4 cột tùy kích thước màn hình).

2. ĐẶC TẢ COMPONENT (COMPONENT SPECS):
- **`MainImage` [DUMB]:**
  + Box Style: `w-full aspect-square object-cover rounded-2xl shadow-sm border border-gray-100 overflow-hidden` (Góc bo mềm mại, làm nổi bật món ăn).
  
- **`ThumbnailList` [DUMB]:**
  + Box Style: `flex gap-4 overflow-x-auto pb-2 scrollbar-hide` (Danh sách nằm ngang).
  + Thumbnail Item: `w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden cursor-pointer border-2 transition-all` (Ảnh đang chọn có viền `border-[#ff8c42]`, ảnh thường `border-transparent opacity-70 hover:opacity-100`).

- **`ProductTitle` [DUMB]:**
  + Typography: `text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight`.

- **`ProductPrice` [DUMB]:**
  + Box Style: `flex items-end gap-3`.
  + Typography: Giá bán `text-3xl md:text-4xl font-bold text-[#A63D40]`, Giá gốc `text-lg text-gray-400 line-through`.

- **`ProductShortDesc` [DUMB]:**
  + Typography: `text-base text-gray-600 leading-relaxed`.

- **`ProductActions` [DUMB]:**
  + Box Style: `flex flex-col sm:flex-row gap-4 mt-4`.
  + Trạng thái tương tác:
    - Nút "Thêm vào giỏ": `flex-1 bg-[#ff8c42] text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-md`.
    - Nút "Mua ngay": `flex-1 bg-white text-[#ff8c42] border-2 border-[#ff8c42] px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center hover:bg-orange-50 active:scale-95 transition-all`.

- **`ProductDescription` [DUMB]:**
  + Box Style: `bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100`.
  + Typography: Tiêu đề `text-xl font-bold text-gray-900 mb-4`, Nội dung `text-gray-600 space-y-4 leading-relaxed`.

- **`ProductCard` (trong Related Products) [DUMB]:**
  + Kế thừa chuẩn từ danh sách sản phẩm: `bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative`.

3. RÀNG BUỘC MÀU SẮC (COLOR CONSTRAINTS):
- **Màu nền trang chủ đạo:** Không gian trắng sạch sẽ (Clean) `bg-white` hoặc xám cực nhạt `bg-gray-50`.
- **Màu Call-to-Action chính:** BẮT BUỘC sử dụng mã màu theo yêu cầu đặc biệt `bg-[#ff8c42]` (Cam thương hiệu).
- **Màu Giá tiền / Huy hiệu nổi bật:** BẮT BUỘC sử dụng mã màu `#A63D40` (Đỏ mận).
- **Màu sắc cơ bản khác:** Sử dụng class chuẩn Tailwind (`text-gray-900` cho tiêu đề chính, `text-gray-600` cho mô tả phụ). Tuyệt đối không dùng mã HEX tự chế cho các phần này.

4. MOCK DATA (DỮ LIỆU HIỂN THỊ):
- **Sản phẩm chính:** 
  + Tên: Cơm Tấm Sườn Bì Chả Đặc Biệt
  + Giá: 65.000đ (Giá gốc: 80.000đ)
  + Mô tả ngắn: Hương vị đậm đà truyền thống với miếng sườn nướng than hoa thơm lừng, ăn kèm bì chả làm thủ công và nước mắm chua ngọt chuẩn vị.
  + Ảnh chính: `https://images.unsplash.com/photo-1626844131082-256783844137?auto=format&fit=crop&w=800&q=80`
  + Ảnh thư viện:
    1. `https://images.unsplash.com/photo-1626844131082-256783844137?auto=format&fit=crop&w=200&q=80`
    2. `https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=200&q=80`
    3. `https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=200&q=80`
- **Mô tả chi tiết:**
  "Một đĩa cơm tấm hoàn hảo không thể thiếu sườn nướng mật ong mềm ngọt, bì heo giòn sần sật và chả trứng béo ngậy. Chúng tôi cam kết sử dụng nguyên liệu tươi ngon nhất trong ngày để mang đến trải nghiệm ẩm thực trọn vẹn. Đặc biệt, mỡ hành được phi thơm lừng cùng tóp mỡ giòn rụm sẽ đánh thức mọi giác quan của bạn."
- **Sản phẩm liên quan:**
  1. Bún Bò Huế Đặc Biệt (55.000đ) - Ảnh: `https://images.unsplash.com/photo-1582878826629-29b7ad1cb431?auto=format&fit=crop&w=500&q=80`
  2. Gà Rán Sốt Cay Hàn Quốc (85.000đ) - Ảnh: `https://images.unsplash.com/photo-1569058242253-1df34b062b19?auto=format&fit=crop&w=500&q=80`
  3. Trà Đào Cam Sả (45.000đ) - Ảnh: `https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=500&q=80`
  4. Phở Bò Chín Nạm (60.000đ) - Ảnh: `https://images.unsplash.com/photo-1582878826629-29b7ad1cb431?auto=format&fit=crop&w=500&q=80` (Dùng tạm ảnh Bún bò Huế hoặc phở nếu có)
