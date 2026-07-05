# KẾ HOẠCH KỸ THUẬT: BỐ CỤC TOÀN CỤC ADMIN DASHBOARD (MASTER LAYOUT)

## 1. PHÂN RÃ COMPONENT (COMPONENT TREE)

- **AdminMasterLayout** `[SMART]`
  - *Vai trò:* Wrapper chính bọc toàn bộ ứng dụng Admin, thiết lập layout dạng flex chia cột (Sidebar bên trái, nội dung bên phải), nhận `children` để render nội dung các trang con.
  - **Sidebar** `[SMART]`
    - *Vai trò:* Thanh menu dọc bên trái cố định (shrink-0), hiển thị logo và danh sách các liên kết chức năng.
    - **Logo** `[DUMB]`
      - *Vai trò:* Hiển thị logo "DashStack", click để về trang tổng quan Dashboard.
    - **NavigationMenu** `[SMART]`
      - *Vai trò:* Vùng chứa danh sách các menu, nhận biết URL hiện tại để active đúng mục.
      - **NavItem** `[DUMB]`
        - *Vai trò:* Render một mục menu đơn (icon, chữ).
      - **NavGroupTitle** `[DUMB]`
        - *Vai trò:* Render tiêu đề của một nhóm menu (vd: "PAGES").
  - **MainContentWrapper** `[DUMB]`
    - *Vai trò:* Vùng không gian chính, chiếm phần còn lại của màn hình (flex-1), chứa TopBar và nội dung cuộn.
    - **TopBar (Header)** `[SMART]`
      - *Vai trò:* Header cố định ở trên cùng của MainContentWrapper, chứa ô tìm kiếm và các action của Admin.
      - **SidebarToggle** `[DUMB]`
        - *Vai trò:* Nút hamburger ẩn/hiện sidebar trên màn hình nhỏ.
      - **GlobalSearch** `[SMART]`
        - *Vai trò:* Ô nhập từ khóa tìm kiếm (có icon search).
      - **TopBarActions** `[SMART]`
        - *Vai trò:* Vùng chứa chuông thông báo, chọn ngôn ngữ và profile admin.
        - **NotificationBell** `[DUMB]`
          - *Vai trò:* Icon chuông thông báo có hiển thị số lượng thông báo chưa đọc (Badge đỏ).
        - **LanguageSelector** `[DUMB]`
          - *Vai trò:* Hiển thị cờ ngôn ngữ hiện tại, click mở menu chọn ngôn ngữ.
        - **AdminProfile** `[SMART]`
          - *Vai trò:* Hiển thị Avatar, tên (Moni Roy), chức vụ (Admin) và icon chevron down để xổ menu (Settings, Logout).
    - **PageContent** `[DUMB]`
      - *Vai trò:* Vùng cho phép cuộn dọc (overflow-y-auto), thêm các padding (p-8) xung quanh nội dung trang con (`children`).

## 2. QUẢN LÝ TRẠNG THÁI (STATE MANAGEMENT)

- **Trạng thái Admin (`isAdminAuthenticated`, `adminProfile`)**:
  - *Chiến lược:* **Global State (Zustand/Pinia) hoặc Context API**. Quản lý trạng thái xác thực của quản trị viên để bảo vệ các tuyến đường (Admin Guard) và lấy thông tin Avatar/Tên hiển thị lên TopBar.
- **Trạng thái Active của Menu (`activePath`)**:
  - *Chiến lược:* **Dựa vào URL hiện tại** (`usePathname` trong Next.js). So sánh URL hiện tại với URL của `NavItem` để cấp style active (Nền màu primary, text trắng).
- **Trạng thái đóng/mở Sidebar (`isSidebarOpen`)**:
  - *Chiến lược:* **Local State** (nếu xử lý Responsive trên mobile) tại `AdminMasterLayout`. Mặc định ở Desktop luôn mở.
- **Trạng thái Tìm kiếm (`searchQuery`)**:
  - *Chiến lược:* **Local State** tại `GlobalSearch` lúc đang nhập, và đẩy lên **URL Query Parameters (`?q=...`)** khi ấn Enter để xử lý tìm kiếm.

## 3. CẤU TRÚC DỮ LIỆU (DATA INTERFACES)

```typescript
// --- Shared UI Component Props ---

export interface NavItemProps {
  label: string;
  iconClass: string; // Vd: "fa-solid fa-chart-pie"
  url: string;
  isActive?: boolean;
}

export interface NavGroupTitleProps {
  title: string; // Vd: "PAGES"
}

export interface NotificationBellProps {
  unreadCount: number; // Hiển thị trên badge
  onClick?: () => void;
}

export interface AdminProfileProps {
  adminName: string;
  adminRole: string;
  avatarUrl: string;
  onOpenMenu?: () => void; // Trigger dropdown
}

// --- Layout Component Props ---

export interface AdminMasterLayoutProps {
  children: React.ReactNode;
}
```
