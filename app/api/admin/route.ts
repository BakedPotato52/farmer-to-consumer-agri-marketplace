import { NextRequest, NextResponse } from "next/server";
import { getPlatformStats } from "@/lib/data/analytics";
import { getSession } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  const session = await getSession();
  
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
  }

  try {
    const stats = await getPlatformStats();
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch platform stats" }, { status: 500 });
  }
}
