"use client";

import { CATEGORY_LABELS, CATEGORY_ICONS, ProductCategory } from "@/lib/types";
import { addCategoryAction, deleteCategoryAction } from "./actions";
import { useState } from "react";

export default function CategoryManagement() {
  const [isAdding, setIsAdding] = useState(false);

  // Derive categories from types
  const categories = (Object.keys(CATEGORY_LABELS) as ProductCategory[]).map(
    (slug) => ({
      id: slug,
      slug,
      name: CATEGORY_LABELS[slug],
      icon: CATEGORY_ICONS[slug],
    }),
  );

  const handleAdd = async (formData: FormData) => {
    await addCategoryAction(formData);
    setIsAdding(false);
    // In a real app, toast success
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      await deleteCategoryAction(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Category Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage product categories available on the platform.
          </p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-emerald-700 transition-colors shadow-sm self-start sm:self-auto"
        >
          {isAdding ? "Cancel" : "+ Add Category"}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100 animate-in slide-in-from-top-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">
            New Category
          </h2>
          <form
            action={handleAdd}
            className="flex flex-col sm:flex-row gap-4 items-end"
          >
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500 py-2 px-3 border"
                placeholder="e.g. Exotic Fruits"
              />
            </div>
            <div className="w-full sm:w-32">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icon (Emoji)
              </label>
              <input
                type="text"
                name="icon"
                required
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500 py-2 px-3 border"
                placeholder="🥑"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-black transition-colors"
            >
              Save
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 group hover:border-emerald-200 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform duration-300">
              {category.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 truncate">
                {category.name}
              </div>
              <div className="text-xs text-gray-500 font-mono truncate">
                {category.slug}
              </div>
            </div>
            <button
              onClick={() => handleDelete(category.id)}
              className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-all shrink-0"
              title="Delete"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
