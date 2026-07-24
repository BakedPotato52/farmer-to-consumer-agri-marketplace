"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart/CartContext";
import { FaLocationDot } from "react-icons/fa6";
import { MdLocalAtm } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { RiProgress5Line } from "react-icons/ri";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = getTotal();
  const deliveryFee = items.length > 0 ? 40 : 0;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items.length, router]);

  if (items.length === 0) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const itemsByFarmer = items.reduce(
      (acc, item) => {
        if (!acc[item.farmerId]) {
          acc[item.farmerId] = [];
        }
        acc[item.farmerId].push(item);
        return acc;
      },
      {} as Record<string, typeof items>,
    );

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemsByFarmer,
          deliveryAddress: formData.get("address"),
          deliveryDate: formData.get("deliveryDate"),
          deliverySlot: formData.get("deliverySlot"),
          notes: formData.get("notes"),
          totalAmount: total,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.error || "Failed to place order. Please check your information and try again.");
        setIsSubmitting(false);
        return;
      }

      clearCart();
      router.push("/orders");
    } catch (err) {
      console.error(err);
      setError("An error occurred while placing your order. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-8 pb-16 max-w-[1280px] mx-auto px-4 md:px-10 min-h-screen">
      <h1 className="font-heading text-4xl font-extrabold text-primary mb-8">Secure Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Delivery Form */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 1: Address */}
          <section className="glass-card p-6 md:p-8 rounded-3xl organic-shadow space-y-6">
            <h2 className="font-heading text-xl font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px]"><FaLocationDot /></span>
              1. Delivery Address
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">
                  Full Street Address *
                </label>
                <textarea
                  name="address"
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-white border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline"
                  placeholder="Enter house no., street name, area, city, pincode..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">
                    Preferred Delivery Date *
                  </label>
                  <input
                    type="date"
                    name="deliveryDate"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 bg-white border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 text-on-surface"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">
                    Time Window Slot *
                  </label>
                  <select
                    name="deliverySlot"
                    required
                    className="w-full px-4 py-3 bg-white border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 text-on-surface font-medium"
                  >
                    <option value="">Select a time slot</option>
                    <option value="Morning (8AM - 12PM)">Morning (8:00 AM - 12:00 PM)</option>
                    <option value="Afternoon (12PM - 4PM)">Afternoon (12:00 PM - 4:00 PM)</option>
                    <option value="Evening (4PM - 8PM)">Evening (4:00 PM - 8:00 PM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">
                  Special Delivery Instructions (Optional)
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  className="w-full px-4 py-3 bg-white border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline"
                  placeholder="Gate code, landmark, or driver instructions..."
                />
              </div>
            </div>
          </section>

          {/* Step 2: Payment Method Info */}
          <section className="glass-card p-6 md:p-8 rounded-3xl organic-shadow space-y-4">
            <h2 className="font-heading text-xl font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px]">payments</span>
              2. Payment Method
            </h2>
            <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary text-2xl"><MdLocalAtm /></span>
                <div>
                  <p className="font-heading font-bold text-on-surface text-sm">Pay on Delivery (COD) / UPI</p>
                  <p className="text-xs text-outline">Pay securely upon doorstep delivery</p>
                </div>
              </div>
              <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                SELECTED
              </span>
            </div>
          </section>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4 shrink-0">
          <div className="glass-card rounded-3xl p-6 organic-shadow sticky top-24 space-y-6">
            <h2 className="font-heading text-xl font-bold text-on-surface border-b border-outline-variant/10 pb-3">
              Order Summary
            </h2>

            {/* Items snippet */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1 text-xs">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between items-center text-on-surface-variant">
                  <span className="truncate pr-2 font-medium">
                    {item.quantity}x {item.productName}
                  </span>
                  <span className="font-bold text-on-surface shrink-0">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-outline-variant/10 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal</span>
                <span className="font-semibold text-on-surface">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Delivery Fee</span>
                <span className="font-semibold text-on-surface">₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-outline-variant/20">
                <span className="font-heading text-lg font-bold text-on-surface">Total</span>
                <span className="font-heading text-2xl font-bold text-primary">₹{total.toFixed(2)}</span>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-error-container/30 border border-error/20 rounded-xl text-xs text-on-error-container">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-on-primary py-4 rounded-xl font-heading text-sm font-semibold hover:bg-primary-container transition-all active:scale-[0.98] organic-shadow flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[20px]"><RiProgress5Line /></span>
                  Placing Order...
                </>
              ) : (
                <>
                    <span className="material-symbols-outlined text-[20px]"><FaCheckCircle /></span>
                  Place Order (₹{total.toFixed(2)})
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-outline">
              🔒 Encrypted 256-bit Direct Farm Checkout
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
