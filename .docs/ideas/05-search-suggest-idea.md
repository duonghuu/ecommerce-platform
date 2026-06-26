# Ý TƯỞNG: Search Suggest (Tìm kiếm gợi ý)

**1. Thông tin chung (Meta Info)**
* **Dự án:** TechBite.
* **Tính năng:** Thanh tìm kiếm gợi ý (Search Suggest).
* **Mục đích:** Hiển thị danh sách gợi ý tìm kiếm, dễ dàng xem kết quả tìm kiếm ngay trên Header

**2. Đối tượng & Trải nghiệm (Target & UX)**
* **Người dùng chính:** Lập trình viên, dân văn phòng, học viên IT hay thức khuya chạy deadline.
* **Hành động chính:** Khi gõ 1 từ khóa, hệ thống sẽ gợi ý các sản phẩm liên quan, có thể thấy hình ảnh sản phẩm và giá tiền, và có thể click vào để xem chi tiết sản phẩm ngay lập tức.
* **Cảm xúc mang lại:** Kích thích bấm vào xem chi tiết sản phẩm ngay lập tức

**3. Đặc tả Thiết kế (Design Specs)**
* **Phong cách UI:** Sạch sẽ (Clean), ưu tiên không gian trắng (Whitespace) để làm nổi bật hình ảnh món ăn. Các khối nội dung bo góc mềm mại (`rounded-2xl`).
* **Màu sắc chủ đạo (Brand Colors):** - Màu Cam thương hiệu BẮT BUỘC dùng cho các nút Call-to-Action chính (Mua ngay, Thêm vào giỏ): `bg-[#ff8c42]`.
  - Màu Đỏ mận dùng cho các huy hiệu (Badge) giảm giá hoặc chữ nổi bật: `bg-[#A63D40]` hoặc `text-[#A63D40]`.
* **Cấu trúc Màn hình (Top to Bottom):**
- Hiển thị danh sách tối đa 5 sản phẩm gợi ý
- Có hình ảnh sản phẩm ở bên trái
- Tên sản phẩm và giá tiền ở bên phải
- Nếu tên sản phẩm dài thì cắt bớt và thêm dấu ..., chỉ hiện tên 1 dòng
- Có nút xem tất cả kết quả và chuyển sang trang kết quả tìm kiếm

**4. Dữ liệu cốt lõi (Mock Data)**
* **Ảnh sản phẩm:** Sử dụng 1 ảnh sản phẩm ứng với tên sản phẩm, lấy ở unsplash.com
* **Tên sản phẩm:** Lấy tên sản phẩm bất kỳ đến đồ ăn, đồ uống. Ảnh sản phẩm lấy tương ứng trên unsplash.com
* **Sản phẩm liên quan:** Lấy tên sản phẩm bất kỳ đến đồ ăn, đồ uống. Ảnh sản phẩm lấy tương ứng trên unsplash.com
* **Mô tả sản phẩm:** Lấy nội dung bất kỳ liên quan đến sản phẩm