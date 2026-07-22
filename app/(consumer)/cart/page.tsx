"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/CartContext";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCart();

  const subtotal = getTotal();
  const deliveryFee = items.length > 0 ? 40 : 0;
  const total = subtotal + deliveryFee;

  // Group items by farmer
  const groupedItems = items.reduce(
    (acc, item) => {
      if (!acc[item.farmerId]) {
        acc[item.farmerId] = {
          farmerName: item.farmerName,
          items: [],
        };
      }
      acc[item.farmerId].items.push(item);
      return acc;
    },
    {} as Record<string, { farmerName: string; items: typeof items }>,
  );

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-8xl mb-6">🛒</div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Your cart is empty
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md text-center">
          Looks like you haven't added any fresh produce to your cart yet. Let's
          fix that!
        </p>
        <Link
          href="/products"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-all hover:shadow-lg"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Shopping Cart
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Cart Items List */}
        <div className="flex-1 space-y-8">
          {Object.entries(groupedItems).map(([farmerId, group]) => (
            <div
              key={farmerId}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              <div className="bg-emerald-50 dark:bg-gray-700/50 px-6 py-4 border-b border-emerald-100 dark:border-gray-600">
                <h2 className="font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
                  <span className="text-lg">🧑‍🌾</span> {group.farmerName}
                </h2>
              </div>

              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {group.items.map((item) => (
                  <div
                    key={item.productId}
                    className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Link
                          href={`/products/${item.productId}`}
                          className="font-bold text-gray-900 dark:text-white hover:text-emerald-600 transition-colors"
                        >
                          {item.productName}
                        </Link>
                        {item.isOrganic && (
                          <span className="bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                            Organic
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        ₹{item.price} / {item.unit}
                      </div>
                    </div>

                    <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                      {/* Quantity Controls */}
                      <div className="flex items-center bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                        >
                          -
                        </button>
                        <span className="w-10 text-center text-sm font-medium text-gray-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                          disabled={item.quantity >= item.maxQuantity}
                        >
                          +
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="font-bold text-gray-900 dark:text-white w-20 text-right">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title="Remove item"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center">
            <Link
              href="/products"
              className="text-emerald-600 font-medium hover:underline flex items-center gap-1 text-sm"
            >
              ← Continue Shopping
            </Link>
            <button
              onClick={clearCart}
              className="text-gray-500 hover:text-red-600 text-sm font-medium transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 sticky top-24 overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Delivery Fee</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ₹{deliveryFee.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900 dark:text-white">
                    Total
                  </span>
                  <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1 text-right">
                  Including all taxes
                </p>
              </div>

              <Link
                href="/checkout"
                className="w-full block text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Proceed to Checkout
              </Link>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 flex gap-3 text-sm text-emerald-800 dark:text-emerald-300">
              <span className="text-xl">🌿</span>
              <p>
                By purchasing, you are directly supporting local farmers and
                sustainable agriculture.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
