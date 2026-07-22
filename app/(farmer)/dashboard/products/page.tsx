import { getSession } from "@/lib/auth/session";
import { getProductsByFarmer } from "@/lib/data/products";
import Link from "next/link";
import { CATEGORY_LABELS } from "@/lib/types";
import { deleteProductAction, toggleProductAction } from "./actions";
import { cookies } from "next/headers";

export default async function ProductsPage() {
  await cookies();
  const session = await getSession();
  if (!session) return null;

  const products = await getProductsByFarmer(session.userId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Products Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            You have {products.length} products listed.
          </p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2"
        >
          <span>+</span> Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">Product Name</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-4xl mb-3">📦</span>
                      <p className="text-lg font-medium text-gray-700 mb-1">
                        No products found
                      </p>
                      <p className="text-sm">
                        Get started by adding your first product.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-800">
                          {product.name}
                        </span>
                        {product.isOrganic && (
                          <span className="text-xs text-emerald-600 font-medium mt-0.5">
                            🌱 Organic
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        {CATEGORY_LABELS[product.category]}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      ₹{product.price}{" "}
                      <span className="text-gray-500 font-normal text-xs">
                        / {product.unit}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {product.quantityAvailable > 0 ? (
                        <span className="font-medium">
                          {product.quantityAvailable} {product.unit}
                        </span>
                      ) : (
                        <span className="text-red-500 font-medium text-xs bg-red-50 px-2 py-1 rounded">
                          Out of stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <form
                        action={async () => {
                          "use server";
                          await toggleProductAction(
                            product.id,
                            !product.isActive,
                          );
                        }}
                      >
                        <button
                          type="submit"
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            product.isActive
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </button>
                      </form>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/dashboard/products/${product.id}/edit`}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                        >
                          Edit
                        </Link>
                        <form
                          action={async () => {
                            "use server";
                            await deleteProductAction(product.id);
                          }}
                        >
                          <button
                            type="submit"
                            className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
