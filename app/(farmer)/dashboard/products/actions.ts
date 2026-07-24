"use server";

import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/data/products";
import { getSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ProductCategory } from "@/lib/types";
import { cookies } from "next/headers";

export async function createProductAction(prevState: any, formData: FormData) {
  await cookies();
  const session = await getSession();
  if (!session || session.role !== "farmer") {
    return { error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const category = formData.get("category") as ProductCategory;
  const price = parseFloat(formData.get("price") as string);
  const unit = formData.get("unit") as string;
  const quantityAvailable = parseInt(
    formData.get("quantityAvailable") as string,
    10,
  );
  const description = formData.get("description") as string;
  const harvestDate = formData.get("harvestDate") as string;
  const isOrganic = formData.get("isOrganic") === "on";
  const isActive = formData.get("isActive") === "on";
  const imagesStr = formData.get("images") as string;

  const images = imagesStr
    ? imagesStr.split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  const image = images[0] || undefined;

  if (
    !name ||
    !category ||
    isNaN(price) ||
    !unit ||
    isNaN(quantityAvailable) ||
    !description ||
    !harvestDate
  ) {
    return { error: "Missing required fields" };
  }

  const newProduct = {
    farmerId: session.userId,
    name,
    category,
    price,
    unit,
    quantityAvailable,
    description,
    harvestDate: new Date(harvestDate).toISOString(),
    isOrganic,
    isActive,
    image,
    images,
  };

  try {
    await createProduct(newProduct);
  } catch (error) {
    return { error: "Failed to create product" };
  }

  revalidatePath("/dashboard/products");
  revalidatePath("/products");
  redirect("/dashboard/products");
}

export async function updateProductAction(prevState: any, formData: FormData) {
  await cookies();
  const session = await getSession();
  if (!session || session.role !== "farmer") {
    return { error: "Unauthorized" };
  }

  const id = formData.get("id") as string;
  if (!id) return { error: "Product ID is missing" };

  const name = formData.get("name") as string;
  const category = formData.get("category") as ProductCategory;
  const price = parseFloat(formData.get("price") as string);
  const unit = formData.get("unit") as string;
  const quantityAvailable = parseInt(
    formData.get("quantityAvailable") as string,
    10,
  );
  const description = formData.get("description") as string;
  const harvestDate = formData.get("harvestDate") as string;
  const isOrganic = formData.get("isOrganic") === "on";
  const isActive = formData.get("isActive") === "on";
  const imagesStr = formData.get("images") as string;

  const images = imagesStr
    ? imagesStr.split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  const image = images[0] || undefined;

  const updates: any = {
    name,
    category,
    price,
    unit,
    quantityAvailable,
    description,
    harvestDate: harvestDate ? new Date(harvestDate).toISOString() : undefined,
    isOrganic,
    isActive,
  };

  if (images.length > 0) {
    updates.images = images;
    updates.image = image;
  }

  try {
    await updateProduct(id, updates);
  } catch (error) {
    return { error: "Failed to update product" };
  }

  revalidatePath("/dashboard/products");
  revalidatePath("/products");
  redirect("/dashboard/products");
}

export async function deleteProductAction(productId: string) {
  await cookies();
  const session = await getSession();
  if (!session || session.role !== "farmer") {
    throw new Error("Unauthorized");
  }

  await deleteProduct(productId);
  revalidatePath("/dashboard/products");
  revalidatePath("/products");
}

export async function toggleProductAction(
  productId: string,
  isActive: boolean,
) {
  await cookies();
  const session = await getSession();
  if (!session || session.role !== "farmer") {
    throw new Error("Unauthorized");
  }

  await updateProduct(productId, { isActive });
  revalidatePath("/dashboard/products");
  revalidatePath("/products");
}
