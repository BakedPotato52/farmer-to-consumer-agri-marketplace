"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { verifyFarmer, rejectFarmer } from "@/lib/data/farmers";

export async function approveFarmerAction(formData: FormData): Promise<void> {
  const userId = formData.get("userId") as string;
  if (!userId) return;

  const session = await getSession();
  if (!session || session.role !== "admin") {
    throw new Error("Unauthorized access");
  }

  verifyFarmer(userId);

  revalidatePath("/admin/farmers");
  revalidatePath("/admin");
  revalidatePath("/farmers");
}

export async function rejectFarmerAction(formData: FormData): Promise<void> {
  const userId = formData.get("userId") as string;
  if (!userId) return;

  const session = await getSession();
  if (!session || session.role !== "admin") {
    throw new Error("Unauthorized access");
  }

  rejectFarmer(userId);

  revalidatePath("/admin/farmers");
  revalidatePath("/admin");
  revalidatePath("/farmers");
}
