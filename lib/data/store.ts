// ============================================================
// FarmFresh Marketplace — Clean Store Singleton
// ============================================================

import type {
  User,
  FarmerProfile,
  Product,
  Order,
  Review,
  DeliverySlot,
} from "@/lib/types";

export interface DataStore {
  users: User[];
  farmerProfiles: FarmerProfile[];
  products: Product[];
  orders: Order[];
  reviews: Review[];
  categories: { id: string; name: string; slug: string; icon: string }[];
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export const defaultDeliverySlots: DeliverySlot[] = [
  { id: "ds1", day: "Monday", startTime: "08:00", endTime: "12:00" },
  { id: "ds2", day: "Wednesday", startTime: "08:00", endTime: "12:00" },
  { id: "ds3", day: "Friday", startTime: "08:00", endTime: "12:00" },
  { id: "ds4", day: "Saturday", startTime: "09:00", endTime: "13:00" },
];

export const initialCategories = [
  { id: "cat-1", name: "Vegetables", slug: "vegetables", icon: "🥬" },
  { id: "cat-2", name: "Fruits", slug: "fruits", icon: "🍎" },
  { id: "cat-3", name: "Dairy", slug: "dairy", icon: "🥛" },
  { id: "cat-4", name: "Grains", slug: "grains", icon: "🌾" },
  { id: "cat-5", name: "Herbs & Spices", slug: "herbs", icon: "🌿" },
];

export const store: DataStore = {
  users: [],
  farmerProfiles: [],
  products: [],
  orders: [],
  reviews: [],
  categories: initialCategories,
};
