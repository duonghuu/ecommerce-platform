# KẾ HOẠCH KỸ THUẬT: THANH TÌM KIẾM GỢI Ý (SEARCH SUGGEST)

## 1. PHÂN RÃ COMPONENT (COMPONENT TREE)

Tính năng Search Suggest thường được đặt trong thanh Header (thuộc Master Layout), do đó các component này sẽ được tích hợp trực tiếp vào thanh điều hướng hoặc Header của ứng dụng.

- **`GlobalSearch`** `[SMART]` (Component bọc ngoài cùng: Quản lý trạng thái từ khóa nhập vào, debounce quá trình nhập, gọi API fetch danh sách gợi ý và điều khiển trạng thái mở/đóng của dropdown)
  - **`SearchInput`** `[DUMB]` (Thanh input nhập từ khóa tìm kiếm: Bắt sự kiện `onChange`, `onFocus`, `onBlur`)
  - **`SearchSuggestDropdown`** `[DUMB]` (Khung Dropdown hiển thị kết quả gợi ý, chỉ xuất hiện khi có từ khóa và đang focus, có đổ bóng nhẹ và bo góc `rounded-2xl`, ưu tiên không gian trắng clean)
    - **`SuggestProductList`** `[DUMB]` (Vùng chứa danh sách các sản phẩm gợi ý, hiển thị tối đa 5 kết quả)
      - **`SuggestProductItem`** `[DUMB]` (Hiển thị 1 kết quả gợi ý. Layout chia 2 phần: Ảnh nhỏ bên trái bo góc, Tên và Giá tiền bên phải. Tên sản phẩm cắt bớt bằng `truncate` chỉ hiện 1 dòng. Tương tác click để chuyển hướng đến trang chi tiết sản phẩm)
    - **`ViewAllResultsButton`** `[DUMB]` (Nút "Xem tất cả kết quả" ở cuối dropdown, click chuyển hướng sang trang kết quả tìm kiếm đầy đủ)

## 2. QUẢN LÝ TRẠNG THÁI (STATE MANAGEMENT)

| Tên State | Loại (Loại lưu trữ) | Chức năng |
| :--- | :--- | :--- |
| `searchKeyword` | Local (`useState`) | Lưu trữ từ khóa người dùng đang nhập vào `SearchInput`. |
| `debouncedKeyword` | Local (Custom Hook) | Từ khóa sau khi đã được debounce (ví dụ: delay 300ms) để tối ưu số lần gọi API. |
| `isDropdownOpen` | Local (`useState`) | Trạng thái hiển thị của khung dropdown gợi ý (mở khi input được focus và có từ khóa). |
| `suggestedProducts`| Local (`useState` / Fetcher) | Danh sách mảng các sản phẩm trả về từ API dựa trên `debouncedKeyword` (tối đa 5 sản phẩm). |
| `isLoading` | Local (`useState`) | Trạng thái đang tải dữ liệu (hiển thị skeleton hoặc spinner trong dropdown). |

## 3. CẤU TRÚC DỮ LIỆU (DATA INTERFACES)

```typescript
// Định nghĩa cấu trúc cho 1 sản phẩm gợi ý hiển thị trong dropdown
export interface SuggestProduct {
  id: string;
  name: string; // Tên sản phẩm (sẽ bị truncate 1 dòng trên UI)
  price: number; // Giá tiền (có thể tô màu đỏ mận #A63D40)
  image: string; // URL ảnh sản phẩm thu nhỏ
}

// Props cho thanh input
export interface SearchInputProps {
  keyword: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  // onBlur có thể cần xử lý delay để không đóng dropdown ngay khi click vào item
}

// Props cho khung dropdown hiển thị kết quả
export interface SearchSuggestDropdownProps {
  isOpen: boolean;
  isLoading: boolean;
  products: SuggestProduct[];
  keyword: string; // Dùng để truyền vào router khi click "Xem tất cả kết quả"
  onClose: () => void;
}

// Props cho 1 dòng sản phẩm gợi ý
export interface SuggestProductItemProps {
  product: SuggestProduct;
  onClick: (productId: string) => void;
}
```
