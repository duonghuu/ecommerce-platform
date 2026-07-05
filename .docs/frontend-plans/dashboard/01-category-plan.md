# KẾ HOẠCH KỸ THUẬT: TRANG QUẢN LÝ CHUYÊN MỤC SẢN PHẨM (CATEGORY)

## 1. PHÂN RÃ COMPONENT (COMPONENT TREE)

- **CategoryPage** `[SMART]`
  - *Vai trò:* Wrapper chính của trang. Chịu trách nhiệm fetch dữ liệu danh sách chuyên mục (Categories) từ API, quản lý các state như phân trang, tìm kiếm, và điều phối việc mở các Modal (Thêm/Sửa/Xóa).
  - **CategoryPageHeader** `[DUMB]`
    - *Vai trò:* Hiển thị tiêu đề trang ("Quản lý chuyên mục") và nút "Thêm chuyên mục mới".
  - **CategoryFilterBar** `[SMART]`
    - *Vai trò:* Thanh chứa ô nhập từ khóa tìm kiếm chuyên mục. Có thể debounce input trước khi đẩy lên URL query.
  - **CategoryTableCard** `[DUMB]`
    - *Vai trò:* Khung giao diện nền trắng, bo góc, chứa bảng dữ liệu và phần phân trang ở dưới cùng.
    - **CategoryTable** `[DUMB]`
      - *Vai trò:* Hiển thị danh sách chuyên mục dưới dạng bảng. Nhận dữ liệu `categories` và các callback `onEdit`, `onDelete`.
      - **CategoryTableRow** `[DUMB]`
        - *Vai trò:* Render một dòng của bảng, bao gồm: Ảnh Icon, Tên, Đường dẫn (Slug) / Chuyên mục cha, Trạng thái, và cụm nút thao tác (Xem trên Frontend, Sửa, Xóa).
    - **Pagination** `[DUMB]`
      - *Vai trò:* Hiển thị các nút phân trang, nhận thông tin `currentPage`, `totalPages` và callback `onPageChange`.
  - **CategoryFormModal** `[SMART]`
    - *Vai trò:* Modal popup để Thêm mới hoặc Cập nhật chuyên mục. Sử dụng form validation (ví dụ: `react-hook-form`). Nếu là chế độ sửa, sẽ được fill sẵn dữ liệu `initialData`.
  - **ConfirmDeleteModal** `[SMART]`
    - *Vai trò:* Modal popup xác nhận hành động xóa chuyên mục (tránh người dùng bấm nhầm).

## 2. QUẢN LÝ TRẠNG THÁI (STATE MANAGEMENT)

- **Trạng thái Dữ liệu (Server State - SWR / React Query hoặc Next.js fetch)**:
  - *Lấy danh sách:* Fetch danh sách chuyên mục dựa theo query parameters `?page=...&search=...`. 
  - *Mutations:* Các hàm gọi API `createCategory`, `updateCategory`, `deleteCategory`. Sau khi mutation thành công cần invalidate/revalidate lại danh sách.
- **Trạng thái Tìm kiếm & Phân trang (`searchQuery`, `currentPage`)**:
  - *Chiến lược:* **Đồng bộ với URL Query Parameters**. Giúp người dùng có thể copy link chia sẻ được đúng trang và kết quả tìm kiếm hiện tại. Ô search dùng local state tạm thời và thực hiện debounce 300-500ms trước khi push lên URL.
- **Trạng thái Modal Thêm/Sửa (`isFormModalOpen`, `editingCategory`)**:
  - *Chiến lược:* **Local State** tại `CategoryPage`. `isFormModalOpen` (boolean) để ẩn/hiện Modal. `editingCategory` lưu trữ object chuyên mục đang được chọn để sửa (nếu giá trị là `null` thì hiểu là hành động Thêm mới).
- **Trạng thái Modal Xóa (`isConfirmDeleteOpen`, `deletingCategory`)**:
  - *Chiến lược:* **Local State** tại `CategoryPage`. Tương tự như trên, lưu thông tin chuyên mục đang được nhắm tới để xóa.

## 3. CẤU TRÚC DỮ LIỆU (DATA INTERFACES)

```typescript
// --- Models ---

export interface Category {
  id: string;
  name: string;
  slug: string; // Dùng để tạo link frontend: http://localhost:3001/category/[slug]
  iconUrl?: string | null;
  parentCategory?: string | null; // Hoặc parentId nếu có phân cấp
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

// --- Component Props ---

export interface CategoryTableProps {
  categories: Category[];
  isLoading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export interface CategoryFormModalProps {
  isOpen: boolean;
  initialData?: Category | null; // null => Thêm mới, object => Cập nhật
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => Promise<void>;
}

export interface ConfirmDeleteModalProps {
  isOpen: boolean;
  categoryName?: string;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

// --- Form Data ---

export interface CategoryFormData {
  name: string;
  slug: string;
  iconUrl?: string;
  parentCategory?: string;
  status: 'ACTIVE' | 'INACTIVE';
}
```
