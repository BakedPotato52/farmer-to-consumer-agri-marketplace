import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./config";
import type { User, FarmerProfile, Product, Order, Review } from "@/lib/types";

// Collection Names
export const COLLECTIONS = {
  USERS: "users",
  FARMERS: "farmers",
  PRODUCTS: "products",
  ORDERS: "orders",
  REVIEWS: "reviews",
} as const;

function handleFirestoreError(action: string, err: any) {
  if (err?.code === "not-found" || err?.message?.includes("NOT_FOUND") || err?.code === 5) {
    console.warn(
      `[Firestore Setup Required] ${action}: Cloud Firestore Database does not exist yet for project 'farm-fresh-52'.\n` +
      `👉 Please visit https://console.firebase.google.com/u/0/project/farm-fresh-52/firestore and click 'Create database'.`
    );
  } else {
    console.error(`[Firestore Error] ${action}:`, err);
  }
}

// --- USER OPERATIONS ---

export async function fetchUsersFromFirestore(): Promise<User[]> {
  try {
    const snap = await getDocs(collection(db, COLLECTIONS.USERS));
    if (snap.empty) return [];
    return snap.docs.map((d) => d.data() as User);
  } catch (err) {
    handleFirestoreError("fetchUsersFromFirestore", err);
    return [];
  }
}

export async function saveUserToFirestore(user: User): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTIONS.USERS, user.id), user);
  } catch (err) {
    handleFirestoreError("saveUserToFirestore", err);
  }
}

// --- PRODUCT OPERATIONS ---

export async function fetchProductsFromFirestore(): Promise<Product[]> {
  try {
    const snap = await getDocs(collection(db, COLLECTIONS.PRODUCTS));
    if (snap.empty) return [];
    return snap.docs.map((d) => d.data() as Product);
  } catch (err) {
    handleFirestoreError("fetchProductsFromFirestore", err);
    return [];
  }
}

export async function saveProductToFirestore(product: Product): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTIONS.PRODUCTS, product.id), product);
  } catch (err) {
    handleFirestoreError("saveProductToFirestore", err);
  }
}

export async function updateProductInFirestore(id: string, updates: Partial<Product>): Promise<void> {
  try {
    await updateDoc(doc(db, COLLECTIONS.PRODUCTS, id), updates as DocumentData);
  } catch (err) {
    handleFirestoreError("updateProductInFirestore", err);
  }
}

export async function deleteProductFromFirestore(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTIONS.PRODUCTS, id));
  } catch (err) {
    handleFirestoreError("deleteProductFromFirestore", err);
  }
}

// --- FARMER OPERATIONS ---

export async function fetchFarmersFromFirestore(): Promise<FarmerProfile[]> {
  try {
    const snap = await getDocs(collection(db, COLLECTIONS.FARMERS));
    if (snap.empty) return [];
    return snap.docs.map((d) => d.data() as FarmerProfile);
  } catch (err) {
    handleFirestoreError("fetchFarmersFromFirestore", err);
    return [];
  }
}

export async function saveFarmerToFirestore(farmer: FarmerProfile): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTIONS.FARMERS, farmer.userId), farmer);
  } catch (err) {
    handleFirestoreError("saveFarmerToFirestore", err);
  }
}

export async function updateFarmerInFirestore(userId: string, updates: Partial<FarmerProfile>): Promise<void> {
  try {
    await updateDoc(doc(db, COLLECTIONS.FARMERS, userId), updates as DocumentData);
  } catch (err) {
    handleFirestoreError("updateFarmerInFirestore", err);
  }
}

// --- ORDER OPERATIONS ---

export async function fetchOrdersFromFirestore(): Promise<Order[]> {
  try {
    const snap = await getDocs(collection(db, COLLECTIONS.ORDERS));
    if (snap.empty) return [];
    return snap.docs.map((d) => d.data() as Order);
  } catch (err) {
    handleFirestoreError("fetchOrdersFromFirestore", err);
    return [];
  }
}

export async function saveOrderToFirestore(order: Order): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTIONS.ORDERS, order.id), order);
  } catch (err) {
    handleFirestoreError("saveOrderToFirestore", err);
  }
}

export async function updateOrderInFirestore(id: string, updates: Partial<Order>): Promise<void> {
  try {
    await updateDoc(doc(db, COLLECTIONS.ORDERS, id), updates as DocumentData);
  } catch (err) {
    handleFirestoreError("updateOrderInFirestore", err);
  }
}

// --- REVIEW OPERATIONS ---

export async function fetchReviewsFromFirestore(): Promise<Review[]> {
  try {
    const snap = await getDocs(collection(db, COLLECTIONS.REVIEWS));
    if (snap.empty) return [];
    return snap.docs.map((d) => d.data() as Review);
  } catch (err) {
    handleFirestoreError("fetchReviewsFromFirestore", err);
    return [];
  }
}

export async function saveReviewToFirestore(review: Review): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTIONS.REVIEWS, review.id), review);
  } catch (err) {
    handleFirestoreError("saveReviewToFirestore", err);
  }
}
