import { store, initialCategories, generateId } from "@/lib/data/store";
import {
  fetchCategoriesFromFirestore,
  saveCategoryToFirestore,
  deleteCategoryFromFirestore,
  CategoryItem,
} from "@/lib/firebase/services";
import { getCache, setCache, deleteCachePattern } from "@/lib/redis/client";

const CACHE_KEY = "cache:categories:all";

export async function getAllCategories(): Promise<CategoryItem[]> {
  const cached = await getCache<CategoryItem[]>(CACHE_KEY);
  if (cached && cached.length > 0) return cached;

  const dbCategories = await fetchCategoriesFromFirestore();
  const result = dbCategories.length > 0 ? dbCategories : (store.categories.length > 0 ? store.categories : initialCategories);
  
  await setCache(CACHE_KEY, result, 300);
  return result;
}

export async function createCategory(data: {
  name: string;
  icon: string;
}): Promise<CategoryItem> {
  const slug = data.name.toLowerCase().trim().replace(/\s+/g, "-");
  const id = `cat-${generateId()}`;

  const newCategory: CategoryItem = {
    id,
    name: data.name,
    slug,
    icon: data.icon || "🌱",
  };

  store.categories.push(newCategory);
  await saveCategoryToFirestore(newCategory);
  await deleteCachePattern("cache:categories:*");

  return newCategory;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const index = store.categories.findIndex((c) => c.id === id || c.slug === id);
  if (index !== -1) {
    store.categories.splice(index, 1);
  }

  await deleteCategoryFromFirestore(id);
  await deleteCachePattern("cache:categories:*");

  return true;
}
