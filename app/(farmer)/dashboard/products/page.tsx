import { getSession } from "@/lib/auth/session";
import { getProductsByFarmer } from "@/lib/data/products";
import Link from "next/link";
import { CATEGORY_LABELS } from "@/lib/types";
import { deleteProductAction, toggleProductAction } from "./actions";
import { cookies } from "next/headers";
import {
  MdAddCircleOutline,
  MdDelete,
  MdEco,
  MdEdit,
  MdInventory2,
} from "react-icons/md";

export default async function ProductsPage() {
  await cookies();
  const session = await getSession();
  if (!session) return null;

  const products = await getProductsByFarmer(session.userId);

  return (
    <div className="space-y-8">
      {/* Header card */}
      <div className="glass-card p-6 md:p-8 rounded-3xl organic-shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-primary">
            Products Management
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Manage your harvest listings, stock levels, and active status (
            {products.length} listed).
          </p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="bg-primary text-on-primary px-6 py-3 rounded-xl font-heading text-sm font-semibold hover:bg-primary-container transition-all active:scale-[0.98] organic-shadow flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">
            <MdAddCircleOutline />
          </span>
          Add New Product
        </Link>
      </div>

      {/* Table */}
      <div className="glass-card organic-shadow rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-on-surface">
            <thead className="bg-surface-container-low text-xs font-bold text-outline uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-outline italic"
                  >
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <span className="material-symbols-outlined text-4xl text-outline">
                        <MdInventory2 />
                      </span>
                      <p className="font-heading font-bold text-on-surface">
                        No products listed yet
                      </p>
                      <p className="text-xs">
                        Start selling by adding your first harvest product.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-surface-container-low/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-heading font-bold text-primary text-base">
                          {product.name}
                        </span>
                        {product.isOrganic && (
                          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1 mt-0.5">
                            <span className="material-symbols-outlined text-[14px]">
                              <MdEco />
                            </span>{" "}
                            Certified Organic
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-surface-container-low text-on-surface-variant rounded-full text-xs font-semibold border border-outline-variant/20">
                        {CATEGORY_LABELS[product.category]}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-heading font-bold text-primary">
                      ₹{product.price}{" "}
                      <span className="text-xs font-normal text-outline">
                        / {product.unit}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {product.quantityAvailable > 0 ? (
                        <span className="font-semibold text-xs text-on-surface">
                          {product.quantityAvailable} {product.unit}s
                        </span>
                      ) : (
                        <span className="text-error font-bold text-[10px] uppercase bg-error-container/30 border border-error/20 px-2 py-1 rounded-full">
                          Out of Stock
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
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-colors ${
                            product.isActive
                              ? "bg-secondary-container text-on-secondary-container border-secondary/20"
                              : "bg-surface-container-high text-outline border-outline-variant/30"
                          }`}
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </button>
                      </form>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/products/${product.id}/edit`}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Edit product"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            <MdEdit />
                          </span>
                        </Link>
                        <form
                          action={async () => {
                            "use server";
                            await deleteProductAction(product.id);
                          }}
                        >
                          <button
                            type="submit"
                            className="p-2 text-error hover:bg-error-container/30 rounded-lg transition-colors"
                            title="Delete product"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              <MdDelete />
                            </span>
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
