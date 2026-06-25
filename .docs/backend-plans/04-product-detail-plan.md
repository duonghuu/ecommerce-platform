# KIẾN TRÚC BACK-END: MÀN HÌNH CHI TIẾT SẢN PHẨM

## 1. MÔ HÌNH DỮ LIỆU (DATABASE SCHEMA)
Mở rộng model `Product` hiện tại trong `schema.prisma` hoặc tạo bảng liên quan. Ở đây ta chọn cách mở rộng `Product` để dễ truy vấn.

**Bổ sung vào bảng `products`:**
- `shortDescription` (VARCHAR/TEXT): Mô tả ngắn gọn (hiển thị dưới tên/giá).
- `description` (TEXT): Nội dung chi tiết bài viết mô tả món ăn.
- `images` (JSON): Mảng danh sách URL các ảnh thư viện (gallery). Có thể lưu dưới dạng JSON array.
- `badgeText` (VARCHAR): Chữ hiển thị nổi bật trên thẻ/trang chi tiết (VD: "-18%", "Mới").

```prisma
model Product {
  // Các field hiện có
  id             String    @id @default(uuid())
  categoryId     String
  name           String
  slug           String    @unique
  price          Decimal   @db.Decimal(10, 2)
  salePrice      Decimal?  @db.Decimal(10, 2)
  thumbnailUrl   String
  stock          Int       @default(0)
  salesCount     Int       @default(0)
  isFeatured     Boolean   @default(false)
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  deletedAt      DateTime?

  // CÁC FIELD BỔ SUNG CHO CHI TIẾT SẢN PHẨM
  shortDescription String?   @db.Text
  description      String?   @db.LongText
  images           Json?     // Lưu mảng String URL
  badgeText        String?   @db.VarChar(50)

  category       Category  @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@index([categoryId])
  @@index([salesCount])
  @@index([isFeatured])
  @@map("products")
}
```

## 2. API CONTRACT (GIAO TIẾP DỮ LIỆU)

### 2.1. API Lấy thông tin chi tiết sản phẩm
- **Endpoint:** `GET /api/v1/products/:id` (hoặc `/:slug`)
- **Mô tả:** Lấy toàn bộ thông tin chi tiết của 1 sản phẩm.
- **Request Params:** `id` (String) - UUID hoặc Slug của sản phẩm.
- **Response (200 OK - Success):**
```json
{
  "data": {
    "id": "uuid",
    "name": "Cơm Tấm Sườn Bì Chả Đặc Biệt",
    "slug": "com-tam-suon-bi-cha-dac-biet",
    "price": 80000,
    "salePrice": 65000,
    "thumbnailUrl": "https://...",
    "images": [
      "https://...",
      "https://...",
      "https://..."
    ],
    "shortDescription": "Hương vị đậm đà truyền thống...",
    "description": "Một đĩa cơm tấm hoàn hảo...",
    "badgeText": "-18%",
    "categoryId": "category-uuid",
    "category": {
      "id": "category-uuid",
      "name": "Cơm Tấm",
      "slug": "com-tam"
    }
  }
}
```

### 2.2. API Lấy sản phẩm liên quan
- **Endpoint:** `GET /api/v1/products/:id/related`
- **Mô tả:** Lấy danh sách 4 sản phẩm cùng danh mục, ngoại trừ sản phẩm hiện tại.
- **Query Params:** `limit=4` (Mặc định lấy 4).
- **Response (200 OK - Success):** Trả về mảng tương tự API danh sách sản phẩm.
```json
{
  "data": [
    {
      "id": "uuid-2",
      "name": "Bún Bò Huế",
      "price": 55000,
      "salePrice": null,
      "thumbnailUrl": "https://...",
      "badgeText": "Nổi bật"
    }
    // ... 3 items nữa
  ]
}
```

## 3. CƠ CHẾ XỬ LÝ (BUSINESS LOGIC)
1. **Lấy chi tiết:** 
   - Kiểm tra ID có hợp lệ hay không.
   - Tìm kiếm trong DB (`findOne`). Nếu không thấy trả về `404 Not Found`.
   - Parse trường `images` từ JSON ra Array.
2. **Lấy sản phẩm liên quan:**
   - Truy vấn DB: Lấy `Category` của sản phẩm gốc. Lấy ngẫu nhiên hoặc sắp xếp theo `salesCount` các sản phẩm cùng `categoryId` nhưng `id != original_id`. Limit 4.
3. **Caching:** (Optional) Cân nhắc cache response của chi tiết sản phẩm nếu lưu lượng truy cập cao (Redis).
