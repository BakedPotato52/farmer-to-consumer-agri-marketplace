import { store, generateId } from "@/lib/data/store";
import type { Review } from "@/lib/types";
import { saveReviewToFirestore, fetchReviewsFromFirestore } from "@/lib/firebase/services";

export async function getAllReviews(): Promise<Review[]> {
  const reviews = await fetchReviewsFromFirestore();
  return reviews.length > 0 ? reviews : store.reviews;
}

export async function getReviewsByFarmer(farmerId: string): Promise<Review[]> {
  const reviews = await getAllReviews();
  return reviews.filter((r) => r.farmerId === farmerId);
}

export async function getReviewsByProduct(productId: string): Promise<Review[]> {
  const reviews = await getAllReviews();
  return reviews.filter((r) => r.productId === productId);
}

export async function getReviewsByConsumer(consumerId: string): Promise<Review[]> {
  const reviews = await getAllReviews();
  return reviews.filter((r) => r.consumerId === consumerId);
}

export async function createReview(data: Omit<Review, "id" | "createdAt">): Promise<Review> {
  const newReview: Review = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  store.reviews.push(newReview);
  await saveReviewToFirestore(newReview);
  return newReview;
}

export async function getAverageRating(farmerId: string): Promise<number> {
  const reviews = await getReviewsByFarmer(farmerId);
  if (reviews.length === 0) return 0;
  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  return total / reviews.length;
}
