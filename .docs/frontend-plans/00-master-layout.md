# KẾ HOẠCH KỸ THUẬT: BỐ CỤC TOÀN CỤC (MASTER LAYOUT)

## 1. PHÂN RÃ COMPONENT (COMPONENT TREE)

- **MasterLayout** `[SMART]`
  - *Vai trò:* Wrapper chính bọc toàn bộ ứng dụng, nhận `children` để render nội dung các trang con.
  - **Header** `[SMART]`
    - *Vai trò:* Sticky navigation, quản lý việc lấy dữ liệu giỏ hàng và trạng thái đăng nhập.
    - **Logo** `[DUMB]` *(Tiềm năng: Shared UI)*
      - *Vai trò:* Hiển thị logo tĩnh, click để về trang chủ.
    - **SearchBar** `[SMART]` *(Tiềm năng: Shared UI)*
      - *Vai trò:* Ô nhập từ khóa, quản lý sự kiện submit tìm kiếm.
    - **UserActions** `[SMART]`
      - *Vai trò:* Chứa các nút tương tác người dùng phụ thuộc vào Auth và Cart data.
      - **LoginButton** `[DUMB]` *(Tiềm năng: Shared UI)*
        - *Vai trò:* Nút bấm mở modal đăng nhập hoặc chuyển hướng.
      - **CartIcon** `[DUMB]` *(Tiềm năng: Shared UI)*
        - *Vai trò:* Icon giỏ hàng, nhận số lượng item qua Props để hiển thị Badge.
  - **MainContent** `[DUMB]`
    - *Vai trò:* Container tạo khoảng trống (padding), bọc xung quanh nội dung trang con.
  - **Footer** `[DUMB]`
    - *Vai trò:* Vùng chân trang tĩnh.
    - **FooterColumn** `[DUMB]` *(Tiềm năng: Shared UI)*
      - *Vai trò:* Render một cột gồm tiêu đề và danh sách các liên kết.

## 2. QUẢN LÝ TRẠNG THÁI (STATE MANAGEMENT)

- **Trạng thái đăng nhập (`isAuthenticated`, `userProfile`)**:
  - *Chiến lược:* **Global State (Zustand/Pinia)**. Dùng toàn cục để thay đổi nút Login thành Avatar/Menu người dùng và bảo vệ các tính năng khác.
- **Số lượng sản phẩm trong giỏ hàng (`totalCartItems`)**:
  - *Chiến lược:* **Global State (Zustand/Pinia)**. Giỏ hàng có thể thay đổi ở bất kỳ trang nào, icon giỏ hàng trên Header cần luôn đồng bộ.
- **Nội dung ô tìm kiếm (`searchQuery`)**:
  - *Chiến lược:* **URL Query Parameters (`?q=...`)**. Cho phép người dùng chia sẻ link kết quả tìm kiếm dễ dàng và reload lại không bị mất trạng thái tìm kiếm.
- **Trạng thái cuộn trang của Header (`isScrolled`)**:
  - *Chiến lược:* **Local State (`useState` tại `Header`)**. Nếu chỉ cần đổi màu/đổ bóng cho Header khi cuộn qua một vị trí nhất định, dùng Local state. Nếu chỉ dính thì dùng CSS `position: sticky`.

## 3. CẤU TRÚC DỮ LIỆU (DATA INTERFACES)

```typescript
// --- Shared UI Component Props ---

export interface LogoProps {
  altText?: string;
  width?: number;
  height?: number;
  onClick?: () => void;
}

export interface SearchBarProps {
  defaultValue?: string;
  placeholder?: string;
  onSearch: (query: string) => void;
}

export interface CartIconProps {
  itemCount: number;
  onClick?: () => void;
}

export interface LoginButtonProps {
  label?: string;
  onClick: () => void;
}

// --- Layout Component Props ---

export interface MasterLayoutProps {
  children: React.ReactNode;
}

export interface FooterLinkItem {
  label: string;
  url: string;
  isExternal?: boolean;
}

export interface FooterColumnProps {
  title: string;
  links: FooterLinkItem[];
}
```
