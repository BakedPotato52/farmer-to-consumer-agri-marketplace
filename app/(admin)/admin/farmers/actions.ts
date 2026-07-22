"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";

// In a real app we would import updateFarmerStatus from data/farmers
// Here we mock the implementation to simulate approval/rejection

export async function approveFarmerAction(userId: string) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    throw new Error("Unauthorized");
  }

  // TODO: Call actual db mutation, e.g., await approveFarmer(userId)
  console.log(`Farmer ${userId} approved by admin`);

  revalidatePath("/admin/farmers");
  revalidatePath("/admin");
  return { success: true };
}

export async function rejectFarmerAction(userId: string) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    throw new Error("Unauthorized");
  }

  // TODO: Call actual db mutation, e.g., await rejectFarmer(userId)
  console.log(`Farmer ${userId} rejected by admin`);

  revalidatePath("/admin/farmers");
  revalidatePath("/admin");
  return { success: true };
}
