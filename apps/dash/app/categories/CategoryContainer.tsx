"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Category } from "./types";
import { createCategory, updateCategory, deleteCategory } from "./actions";

export const CategoryContainer = ({
  initialCategories,
  meta,
  currentSearch,
  parentCategories = []
}: {
  initialCategories: Category[];
  meta: { page: number; limit: number; totalItems: number; totalPages: number };
  currentSearch: string;
  parentCategories?: { id: string; name: string }[];
}) => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [isPending, setIsPending] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (category: Category) => {
    setDeletingCategory(category);
    setIsConfirmDeleteOpen(true);
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setIsFormModalOpen(true);
  };

  const confirmDelete = async () => {
    if (deletingCategory) {
      setIsPending(true);
      try {
        const res = await deleteCategory(deletingCategory.id);
        if (res.error) alert(res.error);
      } catch (err) {
        alert("Lỗi khi xoá");
      } finally {
        setIsPending(false);
        setIsConfirmDeleteOpen(false);
        setDeletingCategory(null);
      }
    }
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsPending(true);
    const formData = new FormData(formRef.current);

    try {
      if (editingCategory) {
        const res = await updateCategory(editingCategory.id, formData);
        if (res.error) alert(res.error);
        else setIsFormModalOpen(false);
      } else {
        const res = await createCategory(formData);
        if (res.error) alert(res.error);
        else setIsFormModalOpen(false);
      }
    } catch (err) {
      alert("Đã xảy ra lỗi");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-[32px] font-bold tracking-tight text-[#202224]">Categories</h1>
        <button
          onClick={handleAddNew}
          className="bg-[#4880FF] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
        >
          Add Category
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-[14px] border border-[#D5D5D5] overflow-hidden">
        {/* Table Header Tools */}
        <div className="px-6 py-4 flex justify-between items-center border-b border-[#D5D5D5]">
          <form method="GET" action="/categories" className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <i className="fa-solid fa-magnifying-glass text-sm"></i>
            </div>
            <input
              type="text"
              name="search"
              defaultValue={currentSearch}
              placeholder="Search category name"
              className="bg-[#F5F6FA] rounded-full pl-9 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-[#4880FF]/20 text-sm border border-[#D5D5D5]"
            />
            {/* Ẩn submit button */}
            <button type="submit" className="hidden"></button>
          </form>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F5F6FA] border-b border-[#D5D5D5]">
                <th className="py-4 px-6 text-sm font-bold text-[#202224] w-24">Icon</th>
                <th className="py-4 px-6 text-sm font-bold text-[#202224]">Category Name</th>
                <th className="py-4 px-6 text-sm font-bold text-[#202224]">Slug / Parent</th>
                <th className="py-4 px-6 text-sm font-bold text-[#202224]">Status</th>
                <th className="py-4 px-6 text-sm font-bold text-[#202224] w-32">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {initialCategories.length > 0 ? (
                initialCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="w-[60px] h-[60px] bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                        {category.iconUrl ? (
                          <Image
                            src={category.iconUrl.startsWith('http') 
                              ? category.iconUrl.replace(/\/api\/v1\/upload(s)?/g, '/uploads') 
                              : `http://localhost:3001${category.iconUrl.replace(/\/api\/v1\/upload(s)?/g, '/uploads')}`}
                            alt={category.name}
                            width={60}
                            height={60}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <i className="fa-regular fa-image text-gray-400 text-xl"></i>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm font-semibold text-[#202224]/90">
                      {category.name}
                    </td>
                    <td className="py-4 px-6 text-sm font-semibold text-[#202224]/90">
                      <div className="flex flex-col">
                        <span className="text-gray-500 font-normal text-xs mb-1">
                          Parent: {category.parentCategory || "None"}
                        </span>
                        <span>/{category.slug}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm">
                      {category.status === "ACTIVE" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`http://localhost:3001/category/${category.slug}`}
                          target="_blank"
                          title="View on Frontend"
                          className="w-8 h-8 rounded bg-gray-100 text-blue-500 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center transition-colors"
                        >
                          <i className="fa-regular fa-eye"></i>
                        </Link>
                        <button
                          onClick={() => handleEdit(category)}
                          title="Edit"
                          className="w-8 h-8 rounded bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 flex items-center justify-center transition-colors"
                        >
                          <i className="fa-regular fa-pen-to-square"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(category)}
                          title="Delete"
                          className="w-8 h-8 rounded bg-gray-100 text-red-500 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition-colors"
                        >
                          <i className="fa-regular fa-trash-can"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    Chưa có dữ liệu danh mục.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {meta.totalPages > 1 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-[#D5D5D5]">
            <span className="text-sm font-semibold text-gray-400">
              Showing {(meta.page - 1) * meta.limit + 1}-
              {Math.min(meta.page * meta.limit, meta.totalItems)} of{" "}
              {meta.totalItems}
            </span>

            <div className="flex items-center gap-2">
              {meta.page > 1 ? (
                <Link
                  href={`/categories?page=${meta.page - 1}&search=${currentSearch}`}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <i className="fa-solid fa-chevron-left text-xs"></i>
                </Link>
              ) : (
                <div className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-300 opacity-50 cursor-not-allowed">
                  <i className="fa-solid fa-chevron-left text-xs"></i>
                </div>
              )}

              {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((page) => (
                <Link
                  key={page}
                  href={`/categories?page=${page}&search=${currentSearch}`}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg font-semibold text-sm transition-colors ${meta.page === page
                      ? "bg-[#4880FF] text-white shadow-sm"
                      : "border border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                >
                  {page}
                </Link>
              ))}

              {meta.page < meta.totalPages ? (
                <Link
                  href={`/categories?page=${meta.page + 1}&search=${currentSearch}`}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <i className="fa-solid fa-chevron-right text-xs"></i>
                </Link>
              ) : (
                <div className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-300 opacity-50 cursor-not-allowed">
                  <i className="fa-solid fa-chevron-right text-xs"></i>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#202224]">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h2>
              <button
                onClick={() => setIsFormModalOpen(false)}
                disabled={isPending}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>

            <form ref={formRef} onSubmit={handleSaveForm} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Category Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingCategory?.name || ""}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4880FF]/50"
                  placeholder="e.g. Smart Watches"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Slug</label>
                <input
                  type="text"
                  name="slug"
                  defaultValue={editingCategory?.slug || ""}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4880FF]/50"
                  placeholder="e.g. smart-watches"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Icon/Image</label>
                <input
                  type="file"
                  name="file"
                  accept="image/*"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4880FF]/50"
                />
                {editingCategory?.iconUrl && (
                  <p className="text-xs text-gray-500 mt-1">Leave empty to keep current image</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Parent Category</label>
                <select
                  name="parentId"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4880FF]/50"
                  defaultValue={editingCategory?.parentId || ""}
                >
                  <option value="">None (Top Level)</option>
                  {parentCategories.map(cat => (
                    cat.id !== editingCategory?.id ? (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ) : null
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4880FF]/50"
                  defaultValue={editingCategory?.status || "ACTIVE"}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 rounded-lg bg-[#4880FF] font-semibold text-white hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
                >
                  {isPending && <i className="fa-solid fa-circle-notch fa-spin"></i>}
                  {editingCategory ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {isConfirmDeleteOpen && deletingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-500 flex items-center justify-center mx-auto mb-4 text-2xl">
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>
            <h2 className="text-xl font-bold text-[#202224] mb-2">Delete Category?</h2>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete the category <span className="font-semibold text-gray-800">"{deletingCategory.name}"</span>? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setIsConfirmDeleteOpen(false)}
                disabled={isPending}
                className="px-6 py-2 rounded-lg border border-gray-300 font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isPending}
                className="px-6 py-2 rounded-lg bg-red-500 font-semibold text-white hover:bg-red-600 disabled:opacity-50 flex items-center gap-2"
              >
                {isPending && <i className="fa-solid fa-circle-notch fa-spin"></i>}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
