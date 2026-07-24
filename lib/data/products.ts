import { store, generateId } from "@/lib/data/store";
import type { Product, ProductCategory, ProductFilters } from "@/lib/types";
import { getFarmerById } from "./farmers";
import {
  saveProductToFirestore,
  updateProductInFirestore,
  deleteProductFromFirestore,
  fetchProductsFromFirestore,
} from "@/lib/firebase/services";

export async function getAllProducts(): Promise<Product[]> {
  const products = await fetchProductsFromFirestore();
  return products.length > 0 ? products : store.products;
}

export async function getActiveProducts(): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter((p) => p.isActive);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await getAllProducts();
  return products.find((p) => p.id === id);
}

export async function getProductsByFarmer(farmerId: string): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter((p) => p.farmerId === farmerId);
}

export async function getProductsByCategory(category: ProductCategory): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter((p) => p.category === category);
}

export async function createProduct(
  data: Omit<
    Product,
    "id" | "rating" | "totalReviews" | "createdAt" | "updatedAt"
  >,
): Promise<Product> {
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
  await saveProductToFirestore(newProduct);
  return newProduct;
}

export async function updateProduct(
  id: string,
  data: Partial<Product>,
): Promise<Product | undefined> {
  const products = await getAllProducts();
  const existing = products.find((p) => p.id === id) || store.products.find((p) => p.id === id);
  if (!existing) return undefined;

  const updated = {
    ...existing,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  const index = store.products.findIndex((p) => p.id === id);
  if (index !== -1) {
    store.products[index] = updated;
  } else {
    store.products.push(updated);
  }

  await updateProductInFirestore(id, data);
  return updated;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const index = store.products.findIndex((p) => p.id === id);
  if (index !== -1) {
    store.products.splice(index, 1);
  }
  await deleteProductFromFirestore(id);
  return true;
}

export async function filterProducts(filters: ProductFilters): Promise<Product[]> {
  const allProducts = await getAllProducts();
  let filtered = allProducts.filter((p) => p.isActive);

  if (filters.search) {
    const s = filters.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s),
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
    const farmers = await Promise.all(filtered.map((p) => getFarmerById(p.farmerId)));
    filtered = filtered.filter((_, idx) => {
      const farmer = farmers[idx];
      if (!farmer) return false;
      return (
        farmer.farmLocation.toLowerCase().includes(loc) ||
        farmer.state.toLowerCase().includes(loc)
      );
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
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
    }
  }

  return filtered;
}
