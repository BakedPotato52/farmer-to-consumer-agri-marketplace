"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { updateProductAction } from "../../actions";
import { Product } from "@/lib/types";
import ImageUpload from "@/components/ui/ImageUpload";
import { RiErrorWarningLine, RiProgress5Line } from "react-icons/ri";
import { FaRegSave } from "react-icons/fa";
import { MdEco } from "react-icons/md";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-primary text-on-primary px-8 py-3.5 rounded-xl font-heading text-sm font-semibold hover:bg-primary-container transition-all active:scale-[0.98] organic-shadow flex items-center gap-2 disabled:opacity-50"
    >
      {pending ? (
        <>
          <span className="material-symbols-outlined animate-spin text-[20px]">
            <RiProgress5Line />
          </span>
          Updating...
        </>
      ) : (
        <>
          <span className="material-symbols-outlined text-[20px]">
            <FaRegSave />
          </span>
          Save Changes
        </>
      )}
    </button>
  );
}

export default function EditProductForm({ product }: { product: Product }) {
  const [state, formAction] = useActionState(updateProductAction, null);

  const formattedDate = product.harvestDate
    ? new Date(product.harvestDate).toISOString().split("T")[0]
    : "";

  return (
    <div className="glass-card organic-shadow rounded-3xl p-8">
      {state?.error && (
        <div className="p-4 rounded-xl bg-error-container/30 border border-error/20 text-xs font-semibold text-on-error-container mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">
            <RiErrorWarningLine />
          </span>
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-6">
        <input type="hidden" name="id" value={product.id} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2 sm:col-span-2">
            <label
              htmlFor="name"
              className="block text-xs font-bold text-outline uppercase tracking-wider"
            >
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={product.name}
              required
              className="w-full px-4 py-3 bg-white border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 text-on-surface"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="category"
              className="block text-xs font-bold text-outline uppercase tracking-wider"
            >
              Category *
            </label>
            <select
              id="category"
              name="category"
              defaultValue={product.category}
              required
              className="w-full px-4 py-3 bg-white border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 text-on-surface font-medium"
            >
              <option value="vegetables">Vegetables</option>
              <option value="fruits">Fruits</option>
              <option value="dairy">Dairy</option>
              <option value="grains">Grains</option>
              <option value="herbs">Herbs & Spices</option>
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="harvestDate"
              className="block text-xs font-bold text-outline uppercase tracking-wider"
            >
              Harvest Date *
            </label>
            <input
              type="date"
              id="harvestDate"
              name="harvestDate"
              defaultValue={formattedDate}
              required
              className="w-full px-4 py-3 bg-white border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 text-on-surface"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="price"
              className="block text-xs font-bold text-outline uppercase tracking-wider"
            >
              Price (₹) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              min="0"
              step="0.01"
              defaultValue={product.price}
              required
              className="w-full px-4 py-3 bg-white border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 text-on-surface"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="unit"
              className="block text-xs font-bold text-outline uppercase tracking-wider"
            >
              Unit *
            </label>
            <select
              id="unit"
              name="unit"
              defaultValue={product.unit}
              required
              className="w-full px-4 py-3 bg-white border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 text-on-surface font-medium"
            >
              <option value="kg">Kilogram (kg)</option>
              <option value="litre">Litre</option>
              <option value="dozen">Dozen</option>
              <option value="bunch">Bunch</option>
              <option value="piece">Piece</option>
            </select>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label
              htmlFor="quantityAvailable"
              className="block text-xs font-bold text-outline uppercase tracking-wider"
            >
              Quantity Available *
            </label>
            <input
              type="number"
              id="quantityAvailable"
              name="quantityAvailable"
              min="0"
              defaultValue={product.quantityAvailable}
              required
              className="w-full px-4 py-3 bg-white border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 text-on-surface"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label
              htmlFor="description"
              className="block text-xs font-bold text-outline uppercase tracking-wider"
            >
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={product.description}
              required
              className="w-full px-4 py-3 bg-white border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 text-on-surface resize-none"
            />
          </div>

          <div className="sm:col-span-2">
            <ImageUpload
              label="Product Images"
              name="images"
              initialImages={
                product.images && product.images.length > 0
                  ? product.images
                  : product.image
                    ? [product.image]
                    : []
              }
              multiple={true}
              maxFiles={5}
            />
          </div>

          <div className="space-y-3 sm:col-span-2 pt-4 border-t border-outline-variant/10">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isOrganic"
                defaultChecked={product.isOrganic}
                className="w-5 h-5 rounded border-outline text-primary focus:ring-primary"
              />
              <span className="text-sm font-semibold text-on-surface flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px] text-secondary">
                  <MdEco />
                </span>
                Certified Organic
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                defaultChecked={product.isActive}
                className="w-5 h-5 rounded border-outline text-primary focus:ring-primary"
              />
              <span className="text-sm font-semibold text-on-surface">
                Product is Active
              </span>
            </label>
          </div>
        </div>

        <div className="pt-6 border-t border-outline-variant/10 flex justify-between items-center">
          <Link
            href="/dashboard/products"
            className="text-on-surface-variant text-sm font-semibold hover:text-primary transition-colors"
          >
            Cancel
          </Link>
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
