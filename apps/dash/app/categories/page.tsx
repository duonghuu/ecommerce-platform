import { Metadata } from "next";
import { CategoryContainer } from "./CategoryContainer";
import { Category } from "./types";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Categories | DashStack Admin",
  description: "Manage product categories",
};

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const params = await searchParams;
  const page = params.page || "1";
  const search = params.search || "";

  const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";
  let categories: Category[] = [];
  let meta = { page: 1, limit: 10, totalItems: 0, totalPages: 1 };
  let errorMsg = null;

  try {
    const res = await fetch(
      `${BACKEND_URL}/admin/categories?page=${page}&limit=10&search=${search}`,
      { cache: "no-store" }
    );
    
    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }
    
    const data = await res.json();
    
    // Map backend data to Category interface
    categories = data.data.map((item: any) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      iconUrl: item.iconUrl,
      parentCategory: item.parent ? item.parent.name : null,
      parentId: item.parentId,
      status: item.isActive ? "ACTIVE" : "INACTIVE",
      createdAt: item.createdAt,
    }));
    
    meta = data.meta;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    errorMsg = "Không tải được dữ liệu danh mục.";
  }

  // Error State
  if (errorMsg) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-2xl">
          <i className="fa-solid fa-triangle-exclamation"></i>
        </div>
        <h2 className="text-xl font-bold text-gray-800">Lỗi tải dữ liệu</h2>
        <p className="text-gray-500">{errorMsg}</p>
      </div>
    );
  }

  // Success / Empty State will be handled in CategoryContainer
  return <CategoryContainer initialCategories={categories} meta={meta} currentSearch={search} />;
}
