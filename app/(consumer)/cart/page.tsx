"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/CartContext";
import { MdAgriculture } from "react-icons/md";
import { RiDeleteBin6Line, RiShoppingBag3Fill, RiTruckLine } from "react-icons/ri";
import { CiBookmarkRemove } from "react-icons/ci";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { AiOutlineArrowLeft } from "react-icons/ai";

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
      <div className="pt-24 pb-16 max-w-[1280px] mx-auto px-4 md:px-10 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-20 h-20 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mb-6 organic-shadow">
          <span className="material-symbols-outlined text-4xl"><RiShoppingBag3Fill /></span>
        </div>
        <h1 className="font-heading text-3xl font-bold text-primary mb-2">Your basket is empty</h1>
        <p className="text-on-surface-variant mb-8 max-w-md text-center text-sm">
          Explore our seasonal harvests and support local boutique farmers directly.
        </p>
        <Link
          href="/products"
          className="bg-primary text-on-primary font-heading font-semibold text-sm py-3.5 px-8 rounded-xl organic-shadow hover:bg-primary-container transition-all active:scale-95"
        >
          Browse Fresh Produce
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-8 pb-16 max-w-[1280px] mx-auto px-4 md:px-10 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Shopping Cart Items */}
        <div className="flex-1 space-y-6">
          <div className="flex items-end justify-between mb-2">
            <h1 className="font-heading text-4xl font-extrabold text-primary">Your Basket</h1>
            <span className="text-sm font-semibold text-outline">{items.length} Items</span>
          </div>

          {Object.entries(groupedItems).map(([farmerId, group]) => (
            <div key={farmerId} className="glass-card organic-shadow rounded-2xl overflow-hidden">
              <div className="bg-surface-container-low px-6 py-3 border-b border-outline-variant/10 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]"><MdAgriculture /></span>
                <span className="text-xs font-bold text-outline uppercase tracking-wider">Farmer:</span>
                <span className="font-heading font-bold text-primary text-sm">{group.farmerName}</span>
              </div>

              <div className="divide-y divide-outline-variant/10">
                {group.items.map((item) => (
                  <div key={item.productId} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Link
                          href={`/products/${item.productId}`}
                          className="font-heading text-lg font-bold text-primary hover:underline"
                        >
                          {item.productName}
                        </Link>
                        {item.isOrganic && (
                          <span className="bg-secondary-container text-on-secondary-container text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                            Organic
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-outline">₹{item.price} per {item.unit}</p>
                    </div>

                    <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                      {/* Quantity Selector */}
                      <div className="flex items-center bg-surface-container-low rounded-full p-1 border border-outline-variant/10">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors text-primary"
                        >
                          <span className="material-symbols-outlined text-[16px]"><FaMinus /></span>
                        </button>
                        <span className="px-3 font-semibold text-sm text-on-surface">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.maxQuantity}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors text-primary disabled:opacity-40"
                        >
                          <span className="material-symbols-outlined text-[16px]"><FaPlus /></span>
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="font-heading text-lg font-bold text-primary min-w-17.5 text-right">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </div>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="text-error hover:opacity-80 transition-opacity p-1"
                        title="Remove item"
                      >
                        <span className="material-symbols-outlined text-[20px]"><RiDeleteBin6Line /></span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center pt-4">
            <Link
              href="/products"
              className="text-primary font-semibold hover:underline flex items-center gap-1 text-sm"
            >
              <span className="material-symbols-outlined text-[18px]"><AiOutlineArrowLeft /></span>
              Continue Shopping
            </Link>
            <button
              type="button"
              onClick={clearCart}
              className="text-outline hover:text-error text-xs font-semibold transition-colors"
            >
              Clear Basket
            </button>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="w-full lg:w-90 shrink-0">
          <div className="glass-card organic-shadow rounded-2xl p-6 sticky top-24 space-y-6">
            <h2 className="font-heading text-xl font-bold text-on-surface border-b border-outline-variant/10 pb-3">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal ({items.length} items)</span>
                <span className="font-semibold text-on-surface">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Flat Delivery Fee</span>
                <span className="font-semibold text-on-surface">₹{deliveryFee.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center py-3 border-t border-outline-variant/20">
              <span className="font-heading text-lg font-bold text-on-surface">Total</span>
              <span className="font-heading text-2xl font-bold text-primary">₹{total.toFixed(2)}</span>
            </div>

            <Link
              href="/checkout"
              className="w-full block text-center bg-primary text-on-primary py-4 rounded-xl font-heading text-sm font-semibold hover:bg-primary-container transition-all active:scale-[0.98] organic-shadow"
            >
              Proceed to Checkout
            </Link>

            <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/10 flex items-center gap-3 text-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-secondary text-[20px]"><RiTruckLine /></span>
              <div>
                <p className="font-bold text-on-surface">Farm-Fresh Delivery</p>
                <p className="text-[11px]">Direct cold-chain shipping from growers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
