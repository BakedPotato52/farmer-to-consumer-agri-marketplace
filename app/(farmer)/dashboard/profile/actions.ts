"use server";

import { updateFarmerProfile } from "@/lib/data/farmers";
import { getSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { FarmingMethod } from "@/lib/types";
import { cookies } from "next/headers";

export async function updateProfileAction(prevState: any, formData: FormData) {
  await cookies();
  const session = await getSession();
  if (!session || session.role !== "farmer") {
    return { error: "Unauthorized" };
  }

  const farmName = formData.get("farmName") as string;
  const farmLocation = formData.get("farmLocation") as string;
  const state = formData.get("state") as string;
  const pincode = formData.get("pincode") as string;
  const farmingMethod = formData.get("farmingMethod") as FarmingMethod;
  const description = formData.get("description") as string;

  const cropTypesString = formData.get("cropTypes") as string;
  const cropTypes = cropTypesString
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);

  if (!farmName || !farmLocation || !state || !pincode || !farmingMethod) {
    return { error: "Missing required fields" };
  }

  const updates = {
    farmName,
    farmLocation,
    state,
    pincode,
    farmingMethod,
    description,
    cropTypes,
  };

  try {
    await updateFarmerProfile(session.userId, updates);
    revalidatePath("/dashboard/profile");
    return { success: true, message: "Profile updated successfully" };
  } catch (error) {
    return { error: "Failed to update profile" };
  }
}
