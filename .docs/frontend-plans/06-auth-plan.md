# QUY HOẠCH KỸ THUẬT: XÁC THỰC & NGƯỜI DÙNG (AUTH)

## 1. PHÂN RÃ COMPONENT (COMPONENT TREE)

- `LoginPage` **[SMART]**: Component cấp cao nhất của trang Đăng nhập. Quản lý việc gọi API xác thực và chuyển hướng người dùng sau khi đăng nhập thành công.
  - `LoginForm` **[DUMB]**: Form nhập liệu chứa các Input (Email, Mật khẩu) và Nút Đăng nhập. Hiển thị thông báo lỗi validation hoặc lỗi từ API. Nhận hàm xử lý qua Props (`onSubmit`).
  - `AuthLink` **[DUMB]**: Component chứa liên kết chuyển sang trang Đăng ký.

- `RegisterPage` **[SMART]**: Component cấp cao nhất của trang Đăng ký. Quản lý việc gọi API tạo tài khoản.
  - `RegisterForm` **[DUMB]**: Form nhập liệu chứa các Input (Họ tên, Email, Số điện thoại, Mật khẩu, Xác nhận mật khẩu). Có logic validation hiển thị lỗi (đặc biệt validate định dạng email, khớp mật khẩu). Nhận hàm xử lý qua Props (`onSubmit`).
  - `AuthLink` **[DUMB]**: Component chứa liên kết chuyển sang trang Đăng nhập.

- `ProfilePage` **[SMART]**: Trang thông tin cá nhân. Cần được bảo vệ bằng Auth Guard (chỉ cho phép user đã đăng nhập). Quản lý gọi API lấy thông tin chi tiết và lịch sử mua hàng.
  - `ProfileInfo` **[DUMB]**: Hiển thị thông tin cá nhân (Họ tên, Email, Số điện thoại).
  - `OrderHistory` **[DUMB]**: Hiển thị danh sách các đơn hàng đã mua.
  - `LogoutButton` **[DUMB]**: Nút đăng xuất, nhận hàm xử lý `onLogout` qua Props.

- `Header` *(Cập nhật)* **[SMART]**:
  - `AuthMenu` **[SMART]**: Kiểm tra trạng thái Global State của User. Nếu chưa đăng nhập: Hiển thị Nút/Link "Đăng nhập". Nếu đã đăng nhập: Hiển thị lời chào (VD: "Chào, {tên}") và dropdown/liên kết tới Trang Tài khoản & Nút Đăng xuất.

## 2. QUẢN LÝ TRẠNG THÁI (STATE MANAGEMENT)

- **Local State (`useState` / React Hook Form):**
  - Form States (Sử dụng `react-hook-form` kết hợp `zod` để quản lý): `email`, `password`, `fullName`, `phone`, `confirmPassword`.
  - `isSubmitting` (boolean): Trạng thái loading của nút Submit khi đang gọi API Login/Register.
  - `apiError` (string | null): Trạng thái lưu trữ lỗi trả về từ Backend (VD: "Sai mật khẩu", "Email đã tồn tại").
  - `isFetchingProfile` (boolean): Trạng thái loading khi lần đầu gọi API tải thông tin profile.

- **Global State (Zustand / Context API):**
  - `authStore`:
    - `user` (Object | null): Chứa thông tin cơ bản của user hiện tại (id, họ tên, email). Nếu `null` nghĩa là khách (Guest).
    - `isAuthenticated` (boolean): Trạng thái đăng nhập.
    - Hàm `setCredentials(user)`: Lưu thông tin user sau khi login.
    - Hàm `logout()`: Xóa thông tin user khỏi store.

- **URL Query Parameters:**
  - `redirect` (string): Lưu lại đường dẫn trang trước đó (ví dụ đang ở `/cart` -> bị bắt đăng nhập -> lưu `?redirect=/cart` -> đăng nhập xong quay lại giỏ hàng).

## 3. CẤU TRÚC DỮ LIỆU (DATA INTERFACES)

```typescript
// 1. Giao diện dữ liệu mô hình cốt lõi (Models)
export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
}

export interface OrderSummary {
  id: string;
  orderCode: string;
  totalAmount: number;
  status: 'PENDING' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

// 2. Giao diện Payload (Gửi lên API)
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  // confirmPassword sẽ được handle và lọc ra ở tầng Frontend (bằng Zod) trước khi gửi lên API
}

export interface AuthResponse {
  user: User;
  // Access Token và Refresh Token thường được cấu hình HttpOnly Cookie từ Backend, 
  // nhưng nếu BE trả qua JSON thì cần khai báo:
  accessToken?: string; 
}

// 3. Giao diện Props cho các Dumb Components
export interface LoginFormProps {
  isLoading: boolean;
  errorMessage?: string;
  onSubmit: (data: LoginPayload) => void;
}

export interface RegisterFormProps {
  isLoading: boolean;
  errorMessage?: string;
  onSubmit: (data: RegisterPayload) => void;
}

export interface ProfileInfoProps {
  user: User;
}

export interface OrderHistoryProps {
  orders: OrderSummary[];
  isLoading: boolean;
}

export interface LogoutButtonProps {
  onLogout: () => void;
  isLoading?: boolean;
}
```
