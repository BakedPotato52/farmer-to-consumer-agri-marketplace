import { store, generateId } from "@/lib/data/store";
import type { Product, ProductCategory, ProductFilters } from "@/lib/types";
import { getFarmerById } from "./farmers";
import {
  saveProductToFirestore,
  updateProductInFirestore,
  deleteProductFromFirestore,
  fetchProductsFromFirestore,
} from "@/lib/firebase/services";
import { getCache, setCache, deleteCachePattern } from "@/lib/redis/client";

const CACHE_KEYS = {
  ALL: "cache:products:all",
  ACTIVE: "cache:products:active",
  BY_ID: (id: string) => `cache:products:id:${id}`,
  BY_FARMER: (farmerId: string) => `cache:products:farmer:${farmerId}`,
  FILTERED: (hash: string) => `cache:products:filter:${hash}`,
};

export async function getAllProducts(): Promise<Product[]> {
  const cached = await getCache<Product[]>(CACHE_KEYS.ALL);
  if (cached) return cached;

  const products = await fetchProductsFromFirestore();
  const result = products.length > 0 ? products : store.products;
  await setCache(CACHE_KEYS.ALL, result, 120);
  return result;
}

export async function getActiveProducts(): Promise<Product[]> {
  const cached = await getCache<Product[]>(CACHE_KEYS.ACTIVE);
  if (cached) return cached;

  const products = await getAllProducts();
  const result = products.filter((p) => p.isActive);
  await setCache(CACHE_KEYS.ACTIVE, result, 120);
  return result;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const cached = await getCache<Product>(CACHE_KEYS.BY_ID(id));
  if (cached) return cached;

  const products = await getAllProducts();
  const product = products.find((p) => p.id === id);
  if (product) {
    await setCache(CACHE_KEYS.BY_ID(id), product, 120);
  }
  return product;
}

export async function getProductsByFarmer(
  farmerId: string,
): Promise<Product[]> {
  const cached = await getCache<Product[]>(CACHE_KEYS.BY_FARMER(farmerId));
  if (cached) return cached;

  const products = await getAllProducts();
  const result = products.filter((p) => p.farmerId === farmerId);
  await setCache(CACHE_KEYS.BY_FARMER(farmerId), result, 120);
  return result;
}

export async function getProductsByCategory(
  category: ProductCategory,
): Promise<Product[]> {
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

  // Invalidate Redis product cache pattern
  await deleteCachePattern("cache:products:*");
  await deleteCachePattern("cache:analytics:*");
  return newProduct;
}

export async function updateProduct(
  id: string,
  data: Partial<Product>,
): Promise<Product | undefined> {
  const products = await getAllProducts();
  const existing =
    products.find((p) => p.id === id) ||
    store.products.find((p) => p.id === id);
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

  // Invalidate Redis product cache pattern
  await deleteCachePattern("cache:products:*");
  await deleteCachePattern("cache:analytics:*");
  return updated;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const index = store.products.findIndex((p) => p.id === id);
  if (index !== -1) {
    store.products.splice(index, 1);
  }
  await deleteProductFromFirestore(id);

  // Invalidate Redis product cache pattern
  await deleteCachePattern("cache:products:*");
  await deleteCachePattern("cache:analytics:*");
  return true;
}

export async function filterProducts(
  filters: ProductFilters,
): Promise<Product[]> {
  const filterHash = JSON.stringify(filters);
  const cached = await getCache<Product[]>(CACHE_KEYS.FILTERED(filterHash));
  if (cached) return cached;

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
    const farmers = await Promise.all(
      filtered.map((p) => getFarmerById(p.farmerId)),
    );
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

  await setCache(CACHE_KEYS.FILTERED(filterHash), filtered, 60);
  return filtered;
}
