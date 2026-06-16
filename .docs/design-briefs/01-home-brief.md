# ĐẶC TẢ GIAO DIỆN: TRANG CHỦ

## 1. HỆ THỐNG LƯỚI & BỐ CỤC (LAYOUT SYSTEM)
- **Root Layout:** `max-w-7xl mx-auto min-h-screen pb-16`. Khung trang giới hạn chiều rộng trên màn hình lớn, có padding ở dưới cho mobile.
- **HeroBanner Section:** Mobile dùng `flex flex-col`, Desktop dùng `grid grid-cols-2 items-center gap-8`.
- **Category Section:** Mobile dùng `flex overflow-x-auto snap-x gap-4` (scroll ngang), Desktop dùng `grid grid-cols-4 md:grid-cols-6 gap-6`.
- **FeaturedMenu Section:** Dạng lưới Grid. Mobile `grid-cols-2 gap-4`, Tablet `grid-cols-3 gap-6`, Desktop `grid-cols-4 gap-8`.
- **Spacing Chuẩn:** Padding lề container `px-4 md:px-8`, Khoảng cách giữa các Section lớn `py-12 md:py-16`.

## 2. ĐẶC TẢ COMPONENT (COMPONENT SPECS)

- **`HeroBanner` [DUMB]**:
  - Box Style: `rounded-2xl overflow-hidden relative bg-orange-50`.
  - Typography: Title `text-4xl md:text-5xl font-bold tracking-tight text-gray-900`, Subtitle `text-lg text-gray-600 mt-4`.
  - Trạng thái: Nút CTA `hover:scale-105 active:scale-95 transition-transform`.

- **`CategorySection` [DUMB]**:
  - Vùng chứa container không định dạng màu sắc/viền đặc biệt, đóng vai trò chứa (wrapper) danh sách.

- **`CategoryItem` [DUMB]**:
  - Box Style: `rounded-2xl bg-white shadow-sm border border-gray-100 p-4 text-center flex flex-col items-center justify-center`.
  - Typography: `text-sm font-medium text-gray-700 mt-2`.
  - Trạng thái: `hover:shadow-md hover:border-orange-200 hover:-translate-y-1 transition-all cursor-pointer`.

- **`ProductCard` [DUMB]**:
  - Box Style: `rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full relative`.
  - Typography: Tên món `text-base font-semibold text-gray-800 line-clamp-2`, Giá `text-orange-500 font-bold text-lg`.
  - Trạng thái: Thẻ `hover:shadow-lg hover:-translate-y-1 transition-all`. Nút [+] `active:scale-90 hover:bg-orange-600 transition-colors`.

- **`SocialProofBanner` [DUMB]**:
  - Box Style: `rounded-xl bg-orange-100 py-3 px-6 flex items-center justify-center gap-2`.
  - Typography: `text-sm md:text-base font-medium text-orange-800`.
  - Trạng thái: Không hiệu ứng tương tác (chỉ đọc).

## 3. RÀNG BUỘC MÀU SẮC (COLOR CONSTRAINTS)
- **Màu Cam thương hiệu:** Dùng cho nút Call-to-Action chính, nút [+] thêm vào giỏ, và chữ hiển thị Giá tiền. Bắt buộc dùng `bg-orange-500`, `text-orange-500`, `hover:bg-orange-600`.
- **Màu Đỏ mận:** Dùng cho Badge giảm giá, nhãn dán nổi bật. Bắt buộc dùng `bg-rose-700`, `text-rose-700`.
- **Màu Nền chung:** Nền trang trắng `bg-white`, nền các section làm điểm nhấn nhẹ dùng `bg-orange-50` hoặc `bg-gray-50`.
- **Màu Chữ:** Tiêu đề dùng `text-gray-900`, Văn bản phụ dùng `text-gray-600` hoặc `text-gray-500`.

## 4. MOCK DATA (DỮ LIỆU HIỂN THỊ)
- **Hero Banner:**
  - Tiêu đề: "Nạp Năng Lượng - Code Phê Hơn"
  - Phụ đề: "Combo Thức Khuya giảm giá 20% từ 22h - 2h sáng."
  - Nút CTA: "Mua ngay"
- **Categories:**
  - "Đồ Ăn Vặt" (Icon: 🍟)
  - "Nước Uống" (Icon: 🧋)
  - "Trái Cây Tô" (Icon: 🍉)
  - "Combo Deadline" (Icon: 📦)
- **Sản phẩm (Featured Products):**
  - Món 1: "Khô Gà Lá Chanh Xé Cay" - Giá: "45.000 đ" - Ảnh: `https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&q=80&w=400&h=400`
  - Món 2: "Trà Sữa Oolong Nướng Full Topping" - Giá: "35.000 đ" - Ảnh: `https://images.unsplash.com/photo-1558857563-b37102e99e00?auto=format&fit=crop&q=80&w=400&h=400`
- **Social Proof:**
  - Nội dung: "🔥 Hơn 500+ anh em dev đã nạp năng lượng tại đây"
