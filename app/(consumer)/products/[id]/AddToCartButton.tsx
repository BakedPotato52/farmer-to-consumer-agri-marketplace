"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart/CartContext";

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
      isOrganic: product.isOrganic,
      maxQuantity: product.quantityAvailable,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Quantity:
        </label>
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-1 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            -
          </button>
          <input
            type="number"
            value={quantity}
            readOnly
            className="w-12 text-center bg-transparent border-none text-gray-900 dark:text-white focus:ring-0 text-sm font-medium"
          />
          <button
            onClick={() =>
              setQuantity(Math.min(product.quantityAvailable, quantity + 1))
            }
            className="px-3 py-1 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            +
          </button>
        </div>
        <span className="text-sm text-gray-500">{product.unit}s</span>
      </div>

      <button
        onClick={handleAdd}
        disabled={product.quantityAvailable === 0}
        className={`w-full py-3 px-6 rounded-xl font-bold transition-all duration-300 shadow-md flex items-center justify-center gap-2 ${
          added
            ? "bg-green-500 text-white hover:bg-green-600"
            : product.quantityAvailable > 0
              ? "bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg"
              : "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700"
        }`}
      >
        {added ? (
          <>
            <span>✓</span> Added to Cart
          </>
        ) : product.quantityAvailable > 0 ? (
          <>
            <span>🛒</span> Add to Cart
          </>
        ) : (
          "Out of Stock"
        )}
      </button>
    </div>
  );
}
