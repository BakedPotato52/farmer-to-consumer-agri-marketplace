"use client";

import React, { useState, useEffect, useCallback } from "react";
import { CartContext } from "./CartContext";
import type { CartItem } from "@/lib/types";

const CART_STORAGE_KEY = "farmfresh_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        setItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage:", error);
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isHydrated]);

  const addItem = useCallback((newItem: CartItem) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.productId === newItem.productId,
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        const existingItem = updatedItems[existingItemIndex];

        // Check if adding more exceeds maxQuantity
        const newQuantity = Math.min(
          existingItem.quantity + newItem.quantity,
          existingItem.maxQuantity,
        );

        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
        };
        return updatedItems;
      } else {
        // Enforce max quantity limit even on initial add
        const itemToAdd = {
          ...newItem,
          quantity: Math.min(newItem.quantity, newItem.maxQuantity),
        };
        return [...prevItems, itemToAdd];
      }
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.productId !== productId),
    );
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.productId === productId) {
          // Ensure quantity is between 1 and maxQuantity
          const newQuantity = Math.max(1, Math.min(quantity, item.maxQuantity));
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getTotal = useCallback(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  const getItemCount = useCallback(() => {
    return items.reduce((count, item) => count + item.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items: isHydrated ? items : [],
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
