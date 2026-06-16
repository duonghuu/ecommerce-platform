# KẾ HOẠCH KỸ THUẬT: MÀN HÌNH DANH SÁCH SẢN PHẨM

## 1. PHÂN RÃ COMPONENT (COMPONENT TREE)

- **`ProductListPage`** `[SMART]` (Page/Route component: Quản lý layout chính, đọc URL Query và fetch data)
  - **`Banner`** `[DUMB]` (Hiển thị ảnh quảng cáo nổi bật)
  - **`ProductListLayout`** `[DUMB]` (Container chia layout cột trái/phải)
    - **`SidebarFilter`** `[SMART]` (Quản lý và cập nhật filter, đồng bộ lên URL)
      - **`FilterGroup`** `[DUMB]` (Hiển thị các nhóm bộ lọc như Danh mục, Mức giá)
    - **`ProductMainArea`** `[SMART]` (Chứa danh sách sản phẩm và các action liên quan)
      - **`ProductToolbar`** `[DUMB]` (Thanh công cụ chứa nút ẩn/hiện bộ lọc, số lượng kết quả và dropdown sắp xếp)
      - **`ProductGrid`** `[DUMB]` (Grid 4 cột hiển thị danh sách sản phẩm)
        - **`ProductCard`** `[DUMB]` *(Shared UI)* (Hiển thị thông tin 1 món ăn: Ảnh, Tên, Giá, Badge giảm giá, Nút "Thêm vào giỏ")
      - **`Pagination`** `[DUMB]` *(Shared UI)* (Điều hướng phân trang)

## 2. QUẢN LÝ TRẠNG THÁI (STATE MANAGEMENT)

| Tên State | Loại (Loại lưu trữ) | Chức năng |
| :--- | :--- | :--- |
| `isFilterVisible` | Local (`useState`) | Trạng thái Ẩn/Hiện Sidebar bộ lọc ở bên trái nhằm tối ưu không gian hiển thị sản phẩm. |
| `page` | URL Query (`?page=1`) | Trang hiện tại (Hỗ trợ share link, reload không mất trang). |
| `sortBy` | URL Query (`?sort=price_asc`) | Tiêu chí sắp xếp (Thời gian cập nhật, Giá, Nổi bật). |
| `category` | URL Query (`?category=drinks`) | Tiêu chí lọc danh mục sản phẩm đang được chọn. |
| `products` | Local (`useState` / Fetcher) | Danh sách sản phẩm hiện tại (lấy theo query params). |
| `isLoading` | Local (`useState`) | Trạng thái đang tải dữ liệu sản phẩm. |
| `cartItems` | Global (Zustand/Pinia) | Danh sách sản phẩm trong giỏ hàng (hiển thị số lượng trên Header và xử lý nút "Thêm vào giỏ" ở từng `ProductCard`). |

## 3. CẤU TRÚC DỮ LIỆU (DATA INTERFACES)

```typescript
// Định nghĩa cấu trúc cho 1 Sản phẩm
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  badgeText?: string;
  isPopular?: boolean;
  updatedAt: string;
}

// Props cho component hiển thị 1 sản phẩm (Shared UI)
export interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
}

// Props cho thanh công cụ (Toolbar) phía trên danh sách sản phẩm
export interface ProductToolbarProps {
  totalItems: number;
  isFilterVisible: boolean;
  currentSort: string;
  onToggleFilter: () => void;
  onSortChange: (sortValue: string) => void;
}

// Props cho nhóm bộ lọc
export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface FilterGroupProps {
  title: string;
  options: FilterOption[];
  selectedValue: string | null;
  onChange: (value: string) => void;
}

// Props cho component phân trang (Shared UI)
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
```
