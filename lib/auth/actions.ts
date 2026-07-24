"use server";

import { redirect } from "next/navigation";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { authenticateUser, createUser, getUserByEmail } from "@/lib/data/users";
import { createFarmerProfile } from "@/lib/data/farmers";
import { createSession, destroySession } from "@/lib/auth/session";
import type { UserRole, FarmingMethod } from "@/lib/types";

export async function loginAction(
  prevState: any,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  let user = await getUserByEmail(email);

  try {
    // Authenticate with Firebase Auth
    await signInWithEmailAndPassword(auth, email, password);
  } catch (firebaseErr: any) {
    // If Firebase Auth fails, check local/store fallback
    const fallbackUser = await authenticateUser(email, password);
    if (!fallbackUser) {
      const code = firebaseErr?.code;
      if (code === "auth/user-not-found" || code === "auth/invalid-credential" || code === "auth/wrong-password") {
        return { error: "Invalid email or password" };
      }
      if (code === "auth/invalid-email") {
        return { error: "Invalid email address format" };
      }
      return { error: firebaseErr.message || "Authentication failed" };
    }
    user = fallbackUser;
  }

  if (!user) {
    user = await getUserByEmail(email);
  }

  if (!user) {
    return { error: "User account profile not found" };
  }

  await createSession({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  console.log("User logged in:", user);

  if (user.role === "admin") {
    redirect("/admin");
  } else if (user.role === "farmer") {
    redirect("/dashboard");
  } else {
    redirect("/products");
  }
}

export async function registerAction(
  prevState: any,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const role = formData.get("role") as UserRole;
  const address = formData.get("address") as string;

  if (!email || !password || !name || !role) {
    return { error: "Missing required fields" };
  }

  if (password.length < 6) {
    return { error: "Password should be at least 6 characters" };
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return { error: "Email already exists" };
  }

  try {
    // Register user with Firebase Auth Email/Password
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (firebaseErr: any) {
    if (firebaseErr?.code === "auth/email-already-in-use") {
      return { error: "Email is already registered with Firebase" };
    }
    console.warn("Firebase Auth registration warning (proceeding with profile creation):", firebaseErr.message);
  }

  const user = await createUser({
    email,
    password,
    name,
    phone,
    role,
    address,
  });

  if (role === "farmer") {
    const farmName = formData.get("farmName") as string;
    const farmLocation = formData.get("farmLocation") as string;
    const state = formData.get("state") as string;
    const pincode = formData.get("pincode") as string;
    const cropTypesStr = formData.get("cropTypes") as string;
    const farmingMethod = formData.get("farmingMethod") as FarmingMethod;
    const description = formData.get("description") as string;

    const cropTypes = cropTypesStr
      ? cropTypesStr.split(",").map((c) => c.trim())
      : [];

    await createFarmerProfile({
      userId: user.id,
      farmName: farmName || `${name}'s Farm`,
      farmLocation: farmLocation || "Local Location",
      state: state || "State",
      pincode: pincode || "000000",
      cropTypes: cropTypes.length ? cropTypes : ["Vegetables"],
      farmingMethod: farmingMethod || "Organic",
      description: description || "Fresh farm produce",
      isVerified: false,
      deliverySlots: [
        { id: "ds1", day: "Monday", startTime: "08:00", endTime: "12:00" },
        { id: "ds2", day: "Wednesday", startTime: "08:00", endTime: "12:00" },
        { id: "ds3", day: "Friday", startTime: "08:00", endTime: "12:00" },
        { id: "ds4", day: "Saturday", startTime: "09:00", endTime: "13:00" },
      ],
    });
  }

  await createSession({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  if (user.role === "admin") {
    redirect("/admin");
  } else if (user.role === "farmer") {
    redirect("/dashboard");
  } else {
    redirect("/products");
  }
}

export async function logoutAction(): Promise<void> {
  try {
    await signOut(auth);
  } catch (err) {
    console.error("Firebase signOut error:", err);
  }
  await destroySession();
  redirect("/login");
}
