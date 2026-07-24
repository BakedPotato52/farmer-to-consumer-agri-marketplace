// ============================================================
// FarmFresh Marketplace — Core Type Definitions
// ============================================================

// --- User & Roles ---

export type UserRole = "farmer" | "consumer" | "admin";

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  phone: string;
  avatar?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

// --- Farmer Profile ---

export type FarmingMethod = "organic" | "conventional" | "mixed";

export interface FarmerProfile {
  userId: string;
  farmName: string;
  farmLocation: string;
  state: string;
  pincode: string;
  cropTypes: string[];
  farmingMethod: FarmingMethod;
  description: string;
  isVerified: boolean;
  verificationDate?: string;
  rating: number;
  totalReviews: number;
  totalProducts: number;
  deliverySlots: DeliverySlot[];
  farmImage?: string;
  bannerImage?: string;
}

// --- Products ---

export type ProductCategory =
  | "vegetables"
  | "fruits"
  | "dairy"
  | "grains"
  | "herbs";

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  vegetables: "Vegetables",
  fruits: "Fruits",
  dairy: "Dairy",
  grains: "Grains",
  herbs: "Herbs & Spices",
};

export const CATEGORY_ICONS: Record<ProductCategory, string> = {
  vegetables: "🥬",
  fruits: "🍎",
  dairy: "🥛",
  grains: "🌾",
  herbs: "🌿",
};

export interface Product {
  id: string;
  farmerId: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  unit: string;
  quantityAvailable: number;
  isOrganic: boolean;
  harvestDate: string;
  image?: string;
  images: string[];
  rating: number;
  totalReviews: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- Orders ---

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled";

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "pending",
  "confirmed",
  "packed",
  "shipped",
  "delivered",
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  packed: "Packed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "#F59E0B",
  confirmed: "#3B82F6",
  packed: "#8B5CF6",
  shipped: "#06B6D4",
  delivered: "#10B981",
  cancelled: "#EF4444",
};

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  pricePerUnit: number;
  unit: string;
  totalPrice: number;
  image?: string;
}

export interface Order {
  id: string;
  consumerId: string;
  consumerName: string;
  farmerId: string;
  farmerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  deliveryAddress: string;
  deliverySlot: string;
  deliveryDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// --- Reviews ---

export interface Review {
  id: string;
  consumerId: string;
  consumerName: string;
  farmerId: string;
  productId?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// --- Delivery ---

export interface DeliverySlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
}

// --- Cart ---

export interface CartItem {
  productId: string;
  productName: string;
  farmerId: string;
  farmerName: string;
  price: number;
  unit: string;
  quantity: number;
  image?: string;
  isOrganic: boolean;
  maxQuantity: number;
}

// --- Analytics ---

export interface PlatformStats {
  totalFarmers: number;
  verifiedFarmers: number;
  totalConsumers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingApprovals: number;
  orderFulfilmentRate: number;
  averageOrderValue: number;
  repeatCustomerRate: number;
}

export interface SalesSummary {
  totalRevenue: number;
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  averageOrderValue: number;
  topProducts: { name: string; revenue: number; orders: number }[];
}

// --- Filters ---

export interface ProductFilters {
  category?: ProductCategory;
  isOrganic?: boolean;
  minPrice?: number;
  maxPrice?: number;
  farmerId?: string;
  location?: string;
  search?: string;
  sortBy?: "price_asc" | "price_desc" | "rating" | "newest";
}

export interface FarmerFilters {
  farmingMethod?: FarmingMethod;
  location?: string;
  isVerified?: boolean;
  search?: string;
}

// --- Session ---

export interface SessionData {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
}
