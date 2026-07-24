import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./config";
import type { User, FarmerProfile, Product, Order, Review } from "@/lib/types";
import { store } from "@/lib/data/store";

// Collection Names
export const COLLECTIONS = {
  USERS: "users",
  FARMERS: "farmers",
  PRODUCTS: "products",
  ORDERS: "orders",
  REVIEWS: "reviews",
} as const;

/**
 * Sync initial seed data to Firestore if a collection is empty
 */
export async function seedFirestoreIfEmpty(): Promise<void> {
  try {
    const productsSnap = await getDocs(collection(db, COLLECTIONS.PRODUCTS));
    if (productsSnap.empty) {
      console.log("Seeding initial products to Firestore...");
      for (const prod of store.products) {
        await setDoc(doc(db, COLLECTIONS.PRODUCTS, prod.id), prod);
      }
    }

    const usersSnap = await getDocs(collection(db, COLLECTIONS.USERS));
    if (usersSnap.empty) {
      console.log("Seeding initial users to Firestore...");
      for (const user of store.users) {
        await setDoc(doc(db, COLLECTIONS.USERS, user.id), user);
      }
    }

    const farmersSnap = await getDocs(collection(db, COLLECTIONS.FARMERS));
    if (farmersSnap.empty) {
      console.log("Seeding initial farmers to Firestore...");
      for (const farmer of store.farmerProfiles) {
        await setDoc(doc(db, COLLECTIONS.FARMERS, farmer.userId), farmer);
      }
    }

    const ordersSnap = await getDocs(collection(db, COLLECTIONS.ORDERS));
    if (ordersSnap.empty) {
      console.log("Seeding initial orders to Firestore...");
      for (const order of store.orders) {
        await setDoc(doc(db, COLLECTIONS.ORDERS, order.id), order);
      }
    }

    const reviewsSnap = await getDocs(collection(db, COLLECTIONS.REVIEWS));
    if (reviewsSnap.empty) {
      console.log("Seeding initial reviews to Firestore...");
      for (const review of store.reviews) {
        await setDoc(doc(db, COLLECTIONS.REVIEWS, review.id), review);
      }
    }
  } catch (err) {
    console.warn("Firestore auto-seeding warning (can be ignored if offline):", err);
  }
}

// --- USER OPERATIONS ---

export async function fetchUsersFromFirestore(): Promise<User[]> {
  try {
    const snap = await getDocs(collection(db, COLLECTIONS.USERS));
    if (snap.empty) return store.users;
    return snap.docs.map((d) => d.data() as User);
  } catch {
    return store.users;
  }
}

export async function saveUserToFirestore(user: User): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTIONS.USERS, user.id), user);
  } catch (err) {
    console.error("Error saving user to Firestore:", err);
  }
}

// --- PRODUCT OPERATIONS ---

export async function fetchProductsFromFirestore(): Promise<Product[]> {
  try {
    const snap = await getDocs(collection(db, COLLECTIONS.PRODUCTS));
    if (snap.empty) return store.products;
    return snap.docs.map((d) => d.data() as Product);
  } catch {
    return store.products;
  }
}

export async function saveProductToFirestore(product: Product): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTIONS.PRODUCTS, product.id), product);
  } catch (err) {
    console.error("Error saving product to Firestore:", err);
  }
}

export async function updateProductInFirestore(id: string, updates: Partial<Product>): Promise<void> {
  try {
    await updateDoc(doc(db, COLLECTIONS.PRODUCTS, id), updates as DocumentData);
  } catch (err) {
    console.error("Error updating product in Firestore:", err);
  }
}

export async function deleteProductFromFirestore(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTIONS.PRODUCTS, id));
  } catch (err) {
    console.error("Error deleting product from Firestore:", err);
  }
}

// --- FARMER OPERATIONS ---

export async function fetchFarmersFromFirestore(): Promise<FarmerProfile[]> {
  try {
    const snap = await getDocs(collection(db, COLLECTIONS.FARMERS));
    if (snap.empty) return store.farmerProfiles;
    return snap.docs.map((d) => d.data() as FarmerProfile);
  } catch {
    return store.farmerProfiles;
  }
}

export async function saveFarmerToFirestore(farmer: FarmerProfile): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTIONS.FARMERS, farmer.userId), farmer);
  } catch (err) {
    console.error("Error saving farmer to Firestore:", err);
  }
}

export async function updateFarmerInFirestore(userId: string, updates: Partial<FarmerProfile>): Promise<void> {
  try {
    await updateDoc(doc(db, COLLECTIONS.FARMERS, userId), updates as DocumentData);
  } catch (err) {
    console.error("Error updating farmer in Firestore:", err);
  }
}

// --- ORDER OPERATIONS ---

export async function fetchOrdersFromFirestore(): Promise<Order[]> {
  try {
    const snap = await getDocs(collection(db, COLLECTIONS.ORDERS));
    if (snap.empty) return store.orders;
    return snap.docs.map((d) => d.data() as Order);
  } catch {
    return store.orders;
  }
}

export async function saveOrderToFirestore(order: Order): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTIONS.ORDERS, order.id), order);
  } catch (err) {
    console.error("Error saving order to Firestore:", err);
  }
}

export async function updateOrderInFirestore(id: string, updates: Partial<Order>): Promise<void> {
  try {
    await updateDoc(doc(db, COLLECTIONS.ORDERS, id), updates as DocumentData);
  } catch (err) {
    console.error("Error updating order in Firestore:", err);
  }
}

// --- REVIEW OPERATIONS ---

export async function fetchReviewsFromFirestore(): Promise<Review[]> {
  try {
    const snap = await getDocs(collection(db, COLLECTIONS.REVIEWS));
    if (snap.empty) return store.reviews;
    return snap.docs.map((d) => d.data() as Review);
  } catch {
    return store.reviews;
  }
}

export async function saveReviewToFirestore(review: Review): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTIONS.REVIEWS, review.id), review);
  } catch (err) {
    console.error("Error saving review to Firestore:", err);
  }
}
