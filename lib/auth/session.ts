import { cookies } from "next/headers";
import type { SessionData } from "@/lib/types";

const SESSION_COOKIE = "farmfresh_session";

export async function createSession(data: SessionData): Promise<void> {
  const cookieStore = await cookies();
  const sessionValue = Buffer.from(JSON.stringify(data)).toString("base64");

  cookieStore.set(SESSION_COOKIE, sessionValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    sameSite: "lax",
  });
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE);

  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  try {
    const sessionValue = Buffer.from(sessionCookie.value, "base64").toString(
      "utf-8",
    );
    return JSON.parse(sessionValue) as SessionData;
  } catch (error) {
    console.error("Failed to parse session cookie:", error);
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
