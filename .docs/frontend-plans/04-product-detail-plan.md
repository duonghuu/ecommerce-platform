# KẾ HOẠCH KỸ THUẬT: MÀN HÌNH CHI TIẾT SẢN PHẨM

## 1. PHÂN RÃ COMPONENT (COMPONENT TREE)

- **`ProductDetailPage`** `[SMART]` (Page/Route component: Quản lý layout chính, đọc `productId` từ URL params và fetch chi tiết sản phẩm)
  - **`ProductDetailLayout`** `[DUMB]` (Container chính chia bố cục màn hình: Phần trên 2 cột, Phần dưới fullwidth)
    - **`ProductTopSection`** `[DUMB]` (Phần đầu chia 2 cột trái/phải)
      - **`ProductGallery`** `[SMART]` (Cột trái: Quản lý và hiển thị hình ảnh sản phẩm, cho phép đổi ảnh lớn khi click vào ảnh thư viện nhỏ)
        - **`MainImage`** `[DUMB]` (Hiển thị ảnh đại diện đang được chọn với viền bo góc `rounded-2xl`)
        - **`ThumbnailList`** `[DUMB]` (Danh sách các ảnh nhỏ/thư viện nằm dưới ảnh đại diện)
      - **`ProductInfo`** `[SMART]` (Cột phải: Hiển thị thông tin và xử lý các hành động thêm vào giỏ/mua ngay)
        - **`ProductTitle`** `[DUMB]` (Tên sản phẩm)
        - **`ProductPrice`** `[DUMB]` (Giá tiền và các huy hiệu giảm giá nếu có - màu Đỏ mận `#A63D40`)
        - **`ProductShortDesc`** `[DUMB]` (Mô tả ngắn của sản phẩm)
        - **`ProductActions`** `[DUMB]` (Nhóm nút tương tác chính: "Thêm vào giỏ" và "Mua ngay" - dùng màu Cam thương hiệu `#ff8c42`)
    - **`ProductBottomSection`** `[DUMB]` (Phần bên dưới hiển thị thông tin bổ sung)
      - **`ProductDescription`** `[DUMB]` (Nội dung mô tả chi tiết sản phẩm)
      - **`RelatedProducts`** `[SMART]` (Hiển thị danh sách sản phẩm liên quan - layout fullwidth)
        - **`ProductGrid`** `[DUMB]` *(Shared UI)* (Grid 4 cột hiển thị danh sách sản phẩm)
          - **`ProductCard`** `[DUMB]` *(Shared UI)* (Component dùng chung hiển thị 1 món ăn)

*(Lưu ý: Không bao gồm Header và Footer vì đã được quản lý ở cấp độ Master Layout)*

## 2. QUẢN LÝ TRẠNG THÁI (STATE MANAGEMENT)

| Tên State | Loại (Loại lưu trữ) | Chức năng |
| :--- | :--- | :--- |
| `productId` | URL Param (`/:id`) | ID của sản phẩm, dùng để gọi API lấy thông tin chi tiết. |
| `product` | Local (`useState` / Fetcher) | Dữ liệu chi tiết của sản phẩm hiện tại. |
| `activeImageIndex`| Local (`useState`) | Trạng thái lưu trữ vị trí ảnh đang được xem ở kích thước lớn (trong component `ProductGallery`). |
| `isLoading` | Local (`useState`) | Trạng thái đang tải dữ liệu chi tiết sản phẩm từ server. |
| `quantity` | Local (`useState`) | (Tuỳ chọn) Số lượng sản phẩm muốn mua trước khi Thêm vào giỏ. |
| `cartItems` | Global (Zustand/Pinia) | Danh sách sản phẩm trong giỏ hàng (để thực hiện hành động Thêm vào giỏ hàng). |

## 3. CẤU TRÚC DỮ LIỆU (DATA INTERFACES)

```typescript
// Định nghĩa cấu trúc chi tiết cho Sản phẩm
export interface ProductDetail {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[]; // Mảng chứa URL ảnh đại diện (phần tử 0) và ảnh thư viện
  shortDescription: string;
  description: string;
  badgeText?: string;
  categoryId: string;
}

// Props cho component hiển thị Bộ sưu tập ảnh (Cột trái)
export interface ProductGalleryProps {
  images: string[];
}

// Props cho component hiển thị Thông tin chính (Cột phải)
export interface ProductInfoProps {
  product: ProductDetail;
  onAddToCart: (productId: string, quantity: number) => void;
  onBuyNow: (productId: string, quantity: number) => void;
}

// Props cho các Nút hành động
export interface ProductActionsProps {
  onAddToCart: () => void;
  onBuyNow: () => void;
}

// Props cho component Sản phẩm liên quan
export interface RelatedProductsProps {
  categoryId: string; // Fetch sản phẩm liên quan dựa theo category của sản phẩm hiện tại
  currentProductId: string; // Loại trừ sản phẩm đang xem
  // hoặc truyền trực tiếp danh sách mảng products liên quan từ phía trên xuống
  products?: Product[]; // Tái sử dụng Interface Product từ danh sách
}
```
