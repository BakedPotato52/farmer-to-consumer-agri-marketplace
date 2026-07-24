import { store, generateId } from "@/lib/data/store";
import type { Review } from "@/lib/types";
import { saveReviewToFirestore } from "@/lib/firebase/services";

export function getAllReviews(): Review[] {
  return [...store.reviews];
}

export function getReviewsByFarmer(farmerId: string): Review[] {
  return store.reviews.filter((r) => r.farmerId === farmerId);
}

export function getReviewsByProduct(productId: string): Review[] {
  return store.reviews.filter((r) => r.productId === productId);
}

export function getReviewsByConsumer(consumerId: string): Review[] {
  return store.reviews.filter((r) => r.consumerId === consumerId);
}

export function createReview(data: Omit<Review, "id" | "createdAt">): Review {
  const newReview: Review = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  store.reviews.push(newReview);
  saveReviewToFirestore(newReview).catch(console.error);
  return newReview;
}

export function getAverageRating(farmerId: string): number {
  const reviews = getReviewsByFarmer(farmerId);
  if (reviews.length === 0) return 0;
  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  return total / reviews.length;
}
