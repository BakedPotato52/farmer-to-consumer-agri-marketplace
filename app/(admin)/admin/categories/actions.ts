"use server";

import { revalidatePath } from "next/cache";

export async function addCategoryAction(formData: FormData) {
  const name = formData.get("name") as string;
  const icon = formData.get("icon") as string;
  const slug = name.toLowerCase().replace(/\s+/g, '-');

  // In a real app we'd save to DB here
  console.log(`Adding category: ${name} ${icon} (${slug})`);
  
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function deleteCategoryAction(id: string) {
  // In a real app we'd delete from DB here
  console.log(`Deleting category: ${id}`);
  
  revalidatePath("/admin/categories");
  return { success: true };
}
