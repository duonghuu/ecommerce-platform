# Product List API Endpoints

Danh sách các API phục vụ cho trang Product List đã được xây dựng:

1. **Lấy danh sách sản phẩm (có lọc, phân trang, sắp xếp)**
   - **Method:** `GET`
   - **Path:** `/api/v1/products`
   - **File:** `apps/backend/src/modules/products/products.controller.ts`

2. **Lấy danh sách danh mục (bộ lọc trái)**
   - **Method:** `GET`
   - **Path:** `/api/v1/categories`
   - **File:** `apps/backend/src/modules/categories/categories.controller.ts`

3. **Lấy danh sách Banner (Top Banner)**
   - **Method:** `GET`
   - **Path:** `/api/v1/banners`
   - **Query Params:** `?position=product_list_top`
   - **File:** `apps/backend/src/modules/banners/banners.controller.ts`

Toàn bộ các API đều đã được implement Validation (bảo vệ đầu vào) với thư viện **Zod** thông qua `ZodValidationPipe`.
Dữ liệu được trả về kết nối trực tiếp với Prisma ORM, áp dụng cơ chế pagination và filtering tiêu chuẩn.
