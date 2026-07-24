import { NextResponse } from "next/server";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { destroySession } from "@/lib/auth/session";

export async function POST() {
  try {
    await signOut(auth);
  } catch (err) {
    console.error("Error signing out from Firebase Auth:", err);
  }
  
  await destroySession();
  
  return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), {
    status: 303,
  });
}
