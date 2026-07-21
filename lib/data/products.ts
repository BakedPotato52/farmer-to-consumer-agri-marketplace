import { store, generateId } from "@/lib/data/store";
import type { Product, ProductCategory, ProductFilters } from "@/lib/types";
import { getFarmerById } from "./farmers";

export function getAllProducts(): Product[] {
  return [...store.products];
}

export function getActiveProducts(): Product[] {
  return store.products.filter((p) => p.isActive);
}

export function getProductById(id: string): Product | undefined {
  return store.products.find((p) => p.id === id);
}

export function getProductsByFarmer(farmerId: string): Product[] {
  return store.products.filter((p) => p.farmerId === farmerId);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return store.products.filter((p) => p.category === category);
}

export function createProduct(
  data: Omit<Product, "id" | "rating" | "totalReviews" | "createdAt" | "updatedAt">
): Product {
  const now = new Date().toISOString();
  const newProduct: Product = {
    ...data,
    id: generateId(),
    rating: 0,
    totalReviews: 0,
    createdAt: now,
    updatedAt: now,
  };
  store.products.push(newProduct);
  return newProduct;
}

export function updateProduct(id: string, data: Partial<Product>): Product | undefined {
  const index = store.products.findIndex((p) => p.id === id);
  if (index === -1) return undefined;

  store.products[index] = {
    ...store.products[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  return store.products[index];
}

export function deleteProduct(id: string): boolean {
  const index = store.products.findIndex((p) => p.id === id);
  if (index === -1) return false;
  store.products.splice(index, 1);
  return true;
}

export function filterProducts(filters: ProductFilters): Product[] {
  let filtered = store.products.filter((p) => p.isActive);

  if (filters.search) {
    const s = filters.search.toLowerCase();
    filtered = filtered.filter(
      (p) => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s)
    );
  }

  if (filters.category) {
    filtered = filtered.filter((p) => p.category === filters.category);
  }

  if (filters.isOrganic !== undefined) {
    filtered = filtered.filter((p) => p.isOrganic === filters.isOrganic);
  }

  if (filters.minPrice !== undefined) {
    filtered = filtered.filter((p) => p.price >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
  }

  if (filters.farmerId) {
    filtered = filtered.filter((p) => p.farmerId === filters.farmerId);
  }

  if (filters.location) {
    const loc = filters.location.toLowerCase();
    filtered = filtered.filter((p) => {
      const farmer = getFarmerById(p.farmerId);
      if (!farmer) return false;
      return farmer.farmLocation.toLowerCase().includes(loc) || farmer.state.toLowerCase().includes(loc);
    });
  }

  if (filters.sortBy) {
    switch (filters.sortBy) {
      case "price_asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }
  }

  return filtered;
}
