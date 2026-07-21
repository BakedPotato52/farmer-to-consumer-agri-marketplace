'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { createProductAction } from '../actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Saving...' : 'Add Product'}
    </button>
  );
}

export default function NewProductPage() {
  const [state, formAction] = useActionState(createProductAction, null);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        <Link href="/dashboard/products" className="text-gray-500 hover:text-gray-700 font-medium">
          Cancel
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
        {state?.error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 text-sm font-medium">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name *</label>
              <input type="text" id="name" name="name" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" placeholder="e.g., Organic Tomatoes" />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category *</label>
              <select id="category" name="category" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white">
                <option value="">Select a category</option>
                <option value="vegetables">Vegetables</option>
                <option value="fruits">Fruits</option>
                <option value="dairy">Dairy</option>
                <option value="grains">Grains</option>
                <option value="herbs">Herbs & Spices</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="harvestDate" className="block text-sm font-medium text-gray-700">Harvest Date *</label>
              <input type="date" id="harvestDate" name="harvestDate" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
            </div>

            <div className="space-y-2">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (₹) *</label>
              <input type="number" id="price" name="price" min="0" step="0.01" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" placeholder="0.00" />
            </div>

            <div className="space-y-2">
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700">Unit *</label>
              <select id="unit" name="unit" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white">
                <option value="kg">Kilogram (kg)</option>
                <option value="litre">Litre</option>
                <option value="dozen">Dozen</option>
                <option value="bunch">Bunch</option>
                <option value="piece">Piece</option>
              </select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="quantityAvailable" className="block text-sm font-medium text-gray-700">Quantity Available *</label>
              <input type="number" id="quantityAvailable" name="quantityAvailable" min="0" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" placeholder="Enter quantity" />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description *</label>
              <textarea id="description" name="description" rows={4} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" placeholder="Describe your product..."></textarea>
            </div>

            <div className="space-y-4 sm:col-span-2 pt-2 border-t border-gray-100">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="isOrganic" className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" />
                <span className="text-gray-700 font-medium">This product is Organic</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="isActive" defaultChecked className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" />
                <span className="text-gray-700 font-medium">Make product Active immediately</span>
              </label>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <SubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
}
