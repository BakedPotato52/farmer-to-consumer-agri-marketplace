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
  const farmImage = formData.get("farmImage") as string;
  const bannerImage = formData.get("bannerImage") as string;

  const cropTypesString = formData.get("cropTypes") as string;
  const cropTypes = cropTypesString
    ? cropTypesString
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean)
    : [];

  if (!farmName || !farmLocation || !state || !pincode || !farmingMethod) {
    return { error: "Missing required fields" };
  }

  const updates: any = {
    farmName,
    farmLocation,
    state,
    pincode,
    farmingMethod,
    description,
    cropTypes,
  };

  if (farmImage !== undefined) {
    updates.farmImage = farmImage;
  }
  if (bannerImage !== undefined) {
    updates.bannerImage = bannerImage;
  }

  try {
    await updateFarmerProfile(session.userId, updates);
    revalidatePath("/dashboard/profile");
    revalidatePath(`/farmers/${session.userId}`);
    revalidatePath("/farmers");
    revalidatePath("/");
    return { success: true, message: "Profile updated successfully" };
  } catch (error) {
    return { error: "Failed to update profile" };
  }
}
