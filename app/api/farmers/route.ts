import { NextRequest, NextResponse } from "next/server";
import {
  getAllFarmers,
  getVerifiedFarmers,
  searchFarmers,
} from "@/lib/data/farmers";
import { FarmingMethod } from "@/lib/types";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const verifiedOnly = searchParams.get("verified") !== "false";

  const filters: any = {};
  if (searchParams.has("method"))
    filters.farmingMethod = searchParams.get("method") as FarmingMethod;
  if (searchParams.has("location"))
    filters.location = searchParams.get("location");
  if (searchParams.has("search")) filters.search = searchParams.get("search");

  let farmers;

  if (Object.keys(filters).length > 0) {
    farmers = await searchFarmers(filters);
    if (verifiedOnly) {
      farmers = farmers.filter((f) => f.isVerified);
    }
  } else {
    farmers = verifiedOnly ? await getVerifiedFarmers() : await getAllFarmers();
  }

  return NextResponse.json(farmers);
}
