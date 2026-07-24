"use client";

import { useState } from "react";
import { addCategoryAction, deleteCategoryAction } from "./actions";
import { CategoryItem } from "@/lib/firebase/services";
import { MdAddCircle, MdClose } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";

export default function CategoryManager({
  initialCategories,
}: {
  initialCategories: CategoryItem[];
}) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async (formData: FormData) => {
    const res = await addCategoryAction(formData);
    if (res?.success) {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      await deleteCategoryAction(id);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-card p-6 md:p-8 rounded-3xl organic-shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-primary">
            Marketplace Categories
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Organize produce taxonomies, icons, and marketplace navigation tags
            ({initialCategories.length} active categories).
          </p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-primary text-on-primary px-6 py-3 rounded-xl font-heading text-sm font-semibold hover:bg-primary-container transition-all active:scale-[0.98] organic-shadow flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">
            {isAdding ? <MdClose /> : <MdAddCircle />}
          </span>
          {isAdding ? "Cancel" : "Add New Category"}
        </button>
      </div>

      {isAdding && (
        <div className="glass-card p-8 rounded-3xl organic-shadow border-2 border-primary/20">
          <h2 className="font-heading text-xl font-bold text-primary mb-4">
            Create New Category
          </h2>
          <form
            action={handleAdd}
            className="flex flex-col sm:flex-row gap-4 items-end"
          >
            <div className="flex-1 w-full space-y-2">
              <label className="block text-xs font-bold text-outline uppercase tracking-wider">
                Category Name *
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-4 py-3 bg-white border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 text-on-surface"
                placeholder="e.g. Exotic Microgreens"
              />
            </div>
            <div className="w-full sm:w-36 space-y-2">
              <label className="block text-xs font-bold text-outline uppercase tracking-wider">
                Emoji Icon *
              </label>
              <input
                type="text"
                name="icon"
                required
                className="w-full px-4 py-3 bg-white border border-outline-variant/30 rounded-xl text-sm text-center outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="🌱"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto bg-primary text-on-primary px-8 py-3.5 rounded-xl font-heading text-sm font-semibold hover:bg-primary-container transition-all active:scale-[0.98] organic-shadow"
            >
              Save Category
            </button>
          </form>
        </div>
      )}

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialCategories.map((category) => (
          <div
            key={category.id}
            className="glass-card organic-shadow rounded-3xl p-6 flex items-center justify-between transition-all hover:-translate-y-0.5 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform">
                {category.icon}
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-primary">
                  {category.name}
                </h3>
                <span className="text-xs font-mono text-outline">
                  slug: {category.slug}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleDelete(category.id)}
              className="p-2 text-error hover:bg-error-container/30 rounded-xl transition-colors opacity-70 group-hover:opacity-100 cursor-pointer"
              title="Delete Category"
            >
              <span className="material-symbols-outlined text-[20px]">
                <RiDeleteBinLine />
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
