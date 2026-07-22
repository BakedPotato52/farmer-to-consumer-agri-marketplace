import { NextRequest, NextResponse } from "next/server";
import { filterProducts, createProduct } from "@/lib/data/products";
import { getSession } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const filters: any = {};

  if (searchParams.has("category"))
    filters.category = searchParams.get("category");
  if (searchParams.has("organic"))
    filters.isOrganic = searchParams.get("organic") === "true";
  if (searchParams.has("minPrice"))
    filters.minPrice = Number(searchParams.get("minPrice"));
  if (searchParams.has("maxPrice"))
    filters.maxPrice = Number(searchParams.get("maxPrice"));
  if (searchParams.has("farmerId"))
    filters.farmerId = searchParams.get("farmerId");
  if (searchParams.has("search")) filters.search = searchParams.get("search");
  if (searchParams.has("sortBy")) filters.sortBy = searchParams.get("sortBy");

  const products = await filterProducts(filters);

  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session || session.role !== "farmer") {
    return NextResponse.json(
      { error: "Unauthorized. Farmer access required." },
      { status: 403 },
    );
  }

  try {
    const body = await request.json();

    // Validate required fields (simplified)
    const required = [
      "name",
      "description",
      "category",
      "price",
      "unit",
      "quantityAvailable",
    ];
    for (const field of required) {
      if (body[field] === undefined) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }

    const newProduct = await createProduct({
      ...body,
      farmerId: session.userId,
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }
}
