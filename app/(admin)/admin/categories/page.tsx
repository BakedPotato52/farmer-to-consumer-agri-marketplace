import { getAllCategories } from "@/lib/data/categories";
import CategoryManager from "./category-manager";

export default async function CategoryManagementPage() {
  const categories = await getAllCategories();

  return <CategoryManager initialCategories={categories} />;
}
