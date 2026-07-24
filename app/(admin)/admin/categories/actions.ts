"use server";

import { revalidatePath } from "next/cache";
import { createCategory, deleteCategory } from "@/lib/data/categories";

export async function addCategoryAction(formData: FormData) {
  const name = formData.get("name") as string;
  const icon = formData.get("icon") as string;

  if (!name || !icon) {
    return { error: "Name and icon are required" };
  }

  try {
    await createCategory({ name, icon });
    revalidatePath("/admin/categories");
    revalidatePath("/products");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to create category" };
  }
}

export async function deleteCategoryAction(id: string) {
  if (!id) {
    return { error: "Category ID is required" };
  }

  try {
    await deleteCategory(id);
    revalidatePath("/admin/categories");
    revalidatePath("/products");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to delete category" };
  }
}
