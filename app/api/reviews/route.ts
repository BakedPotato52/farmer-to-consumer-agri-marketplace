import { NextRequest, NextResponse } from "next/server";
import {
  getReviewsByFarmer,
  getReviewsByProduct,
  createReview,
} from "@/lib/data/reviews";
import { getSession } from "@/lib/auth/session";
import type { Review } from "@/lib/types";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const farmerId = searchParams.get("farmerId");
  const productId = searchParams.get("productId");

  let reviews: Review[] = [];

  if (productId) {
    reviews = await getReviewsByProduct(productId);
  } else if (farmerId) {
    reviews = await getReviewsByFarmer(farmerId);
  } else {
    // If we wanted all reviews, we'd add that to data store. For now, return empty or bad request
    return NextResponse.json(
      { error: "Missing farmerId or productId parameter" },
      { status: 400 },
    );
  }

  return NextResponse.json(reviews);
}

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session || session.role !== "consumer") {
    return NextResponse.json(
      { error: "Unauthorized. Consumer access required." },
      { status: 403 },
    );
  }

  try {
    const body = await request.json();

    if (!body.farmerId || !body.rating || !body.comment) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const newReview = await createReview({
      consumerId: session.userId,
      consumerName: session.name,
      farmerId: body.farmerId,
      productId: body.productId,
      rating: body.rating,
      comment: body.comment,
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 },
    );
  }
}
