# QUY HOẠCH KỸ THUẬT: TRANG CHỦ

## 1. PHÂN RÃ COMPONENT (COMPONENT TREE)

- `HomePage` **[SMART]**: Component cấp cao nhất của trang. Quản lý việc gọi API để lấy dữ liệu (Banner, Categories, Products, Social Proof) và truyền xuống các component con.
  - `HeroBanner` **[DUMB]**: Hiển thị banner lớn (Combo Thức Khuya Coder). Nhận Props chứa thông tin hình ảnh, tiêu đề và hành động nút CTA.
  - `CategorySection` **[DUMB]**: Khu vực hiển thị hàng ngang các danh mục. Nhận Props là danh sách Categories.
    - `CategoryItem` **[DUMB]** *(Tiềm năng: Shared UI)*: Khối nhỏ hiển thị một danh mục đơn lẻ (gồm Icon và Tên).
  - `FeaturedMenu` **[SMART]**: Khu vực danh sách món nổi bật. Tự chứa logic kết nối với Global Store để xử lý hành động "Thêm vào giỏ hàng" mà không cần đẩy logic ngược lên `HomePage`.
    - `ProductCard` **[DUMB]** *(Tiềm năng: Shared UI)*: Thẻ hiển thị thông tin một món ăn (Ảnh, Tên, Giá, Nút cam [+]).
  - `SocialProofBanner` **[DUMB]**: Dải banner hiển thị số lượng người dùng. Nhận Props là con số thống kê hoặc chuỗi văn bản.

## 2. QUẢN LÝ TRẠNG THÁI (STATE MANAGEMENT)

- **Local State (`useState` / Component State):**
  - `isFetchingHomeData` (boolean): Trạng thái loading khi lần đầu gọi API tải dữ liệu trang chủ.
  - `homeError` (string | null): Trạng thái lưu trữ lỗi nếu gọi API thất bại.
  - `addingToCartId` (string | null): Trạng thái lưu ID của món ăn đang được thêm vào giỏ hàng (để hiển thị loading spinner ngay trên nút [+] của đúng thẻ sản phẩm đó).

- **Global State (Zustand / Pinia):**
  - `cartItems` (Array): Trạng thái giỏ hàng toàn cục. Khi bấm nút [+] ở Trang chủ, dữ liệu sẽ được dispatch/commit vào đây để tự động cập nhật số lượng món ở Header/Cart Drawer.
  - `userProfile` (Object): (Nếu có) Kiểm tra xem user là thành viên chưa để hiển thị banner ưu đãi cá nhân hóa thay vì banner mặc định.

- **URL Query Parameters:**
  - `ref` hoặc `utm_source` (string): Bắt các tham số affiliate/marketing từ URL khi truy cập vào trang chủ để lưu vào session/cookies.
  - Mặc định trang chủ dạng phễu không chứa bộ lọc phức tạp nên không cần đưa state nội bộ (như tab/filter) lên URL.

## 3. CẤU TRÚC DỮ LIỆU (DATA INTERFACES)

```typescript
// 1. Giao diện dữ liệu mô hình cốt lõi (Models)
export interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  badges?: string[];
}

// 2. Giao diện Props cho các Dumb Components
export interface HeroBannerProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  onCtaClick: () => void;
}

export interface CategoryItemProps {
  category: Category;
  onClick: (slug: string) => void;
}

export interface CategorySectionProps {
  categories: Category[];
}

export interface ProductCardProps {
  product: Product;
  isAddingToCart: boolean;
  onAddToCart: (productId: string) => void;
}

export interface SocialProofBannerProps {
  customerCount: number;
  messageTemplate: string; // VD: "Hơn {count}+ anh em dev đã nạp năng lượng tại đây"
}
```
