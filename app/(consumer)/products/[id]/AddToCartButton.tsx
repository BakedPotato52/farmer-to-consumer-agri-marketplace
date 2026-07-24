"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart/CartContext";
import { FaRegCheckCircle } from "react-icons/fa";
import { MdAddShoppingCart } from "react-icons/md";

export default function AddToCartButton({
  product,
  farmerName,
}: {
  product: {
    id: string;
    name: string;
    price: number;
    unit: string;
    isOrganic: boolean;
    farmerId: string;
    quantityAvailable: number;
    image?: string;
  };
  farmerName: string;
}) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      farmerId: product.farmerId,
      farmerName,
      price: product.price,
      unit: product.unit,
      quantity,
      image: product.image,
      isOrganic: product.isOrganic,
      maxQuantity: product.quantityAvailable,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Quantity Picker */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold text-on-surface-variant">Quantity:</span>
        <div className="flex items-center bg-surface-container-low border border-outline-variant/30 rounded-xl p-1">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white hover:bg-surface-container text-on-surface font-bold text-sm transition-colors shadow-sm cursor-pointer"
          >
            -
          </button>
          <span className="w-12 text-center text-sm font-bold text-on-surface">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(Math.min(product.quantityAvailable, quantity + 1))}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white hover:bg-surface-container text-on-surface font-bold text-sm transition-colors shadow-sm cursor-pointer"
          >
            +
          </button>
        </div>
        <span className="text-xs text-outline">{product.unit}s</span>
      </div>

      {/* Button */}
      <button
        type="button"
        onClick={handleAdd}
        disabled={product.quantityAvailable === 0}
        className={`w-full py-4 px-6 rounded-xl font-heading text-sm font-semibold transition-all duration-300 shadow-md flex items-center justify-center gap-2 organic-shadow cursor-pointer ${
          added
            ? "bg-secondary text-on-secondary hover:opacity-90"
            : product.quantityAvailable > 0
            ? "bg-primary text-on-primary hover:bg-primary-container active:scale-[0.98]"
            : "bg-surface-container-high text-outline cursor-not-allowed"
        }`}
      >
        {added ? (
          <>
            <span className="material-symbols-outlined text-[20px]"><FaRegCheckCircle /></span>
            Added to Basket!
          </>
        ) : product.quantityAvailable > 0 ? (
          <>
            <span className="material-symbols-outlined text-[20px]"><MdAddShoppingCart /></span>
            Add to Basket (₹{product.price * quantity})
          </>
        ) : (
          "Out of Stock"
        )}
      </button>
    </div>
  );
}
