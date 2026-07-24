import { store } from "@/lib/data/store";
import type { FarmerProfile, User, FarmerFilters } from "@/lib/types";
import {
  saveFarmerToFirestore,
  updateFarmerInFirestore,
  fetchFarmersFromFirestore,
  fetchUsersFromFirestore,
} from "@/lib/firebase/services";
import { getCache, setCache, deleteCachePattern } from "@/lib/redis/client";

const CACHE_KEYS = {
  ALL: "cache:farmers:all",
  VERIFIED: "cache:farmers:verified",
  BY_ID: (id: string) => `cache:farmers:id:${id}`,
};

export async function getAllFarmers(): Promise<
  (FarmerProfile & { user: User })[]
> {
  const cached = await getCache<(FarmerProfile & { user: User })[]>(
    CACHE_KEYS.ALL,
  );
  if (cached) return cached;

  const farmers = await fetchFarmersFromFirestore();
  const users = await fetchUsersFromFirestore();

  const farmerList = farmers.length > 0 ? farmers : store.farmerProfiles;
  const userList = users.length > 0 ? users : store.users;

  const result = farmerList.map((profile) => {
    const user = userList.find((u) => u.id === profile.userId) || {
      id: profile.userId,
      name: profile.farmName || "Farmer",
      email: "",
      password: "",
      role: "farmer" as const,
      phone: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return { ...profile, user };
  });

  await setCache(CACHE_KEYS.ALL, result, 120);
  return result;
}

export async function getFarmerById(
  userId: string,
): Promise<(FarmerProfile & { user: User }) | undefined> {
  const cached = await getCache<FarmerProfile & { user: User }>(
    CACHE_KEYS.BY_ID(userId),
  );
  if (cached) return cached;

  const farmers = await getAllFarmers();
  const farmer = farmers.find((f) => f.userId === userId);
  if (farmer) {
    await setCache(CACHE_KEYS.BY_ID(userId), farmer, 120);
  }
  return farmer;
}

export async function createFarmerProfile(
  data: Omit<FarmerProfile, "rating" | "totalReviews" | "totalProducts">,
): Promise<FarmerProfile> {
  const newProfile: FarmerProfile = {
    ...data,
    rating: 0,
    totalReviews: 0,
    totalProducts: 0,
  };
  store.farmerProfiles.push(newProfile);
  await saveFarmerToFirestore(newProfile);
  await deleteCachePattern("cache:farmers:*");
  await deleteCachePattern("cache:analytics:*");
  return newProfile;
}

export async function updateFarmerProfile(
  userId: string,
  data: Partial<FarmerProfile>,
): Promise<FarmerProfile | undefined> {
  const farmers = await fetchFarmersFromFirestore();
  const existing =
    farmers.find((p) => p.userId === userId) ||
    store.farmerProfiles.find((p) => p.userId === userId);

  const updated = {
    ...(existing || {
      userId,
      farmName: "Farm",
      farmLocation: "",
      state: "",
      pincode: "",
      cropTypes: [],
      farmingMethod: "organic" as const,
      description: "",
      isVerified: false,
      rating: 0,
      totalReviews: 0,
      totalProducts: 0,
      deliverySlots: [],
    }),
    ...data,
  };

  const index = store.farmerProfiles.findIndex((p) => p.userId === userId);
  if (index !== -1) {
    store.farmerProfiles[index] = updated;
  } else {
    store.farmerProfiles.push(updated);
  }

  await updateFarmerInFirestore(userId, data);
  await deleteCachePattern("cache:farmers:*");
  await deleteCachePattern("cache:analytics:*");
  return updated;
}

export async function verifyFarmer(
  userId: string,
): Promise<FarmerProfile | undefined> {
  const updates = {
    isVerified: true,
    verificationDate: new Date().toISOString(),
  };
  return updateFarmerProfile(userId, updates);
}

export async function rejectFarmer(userId: string): Promise<boolean> {
  const updates = {
    isVerified: false,
  };
  await updateFarmerProfile(userId, updates);
  return true;
}

export async function getVerifiedFarmers(): Promise<
  (FarmerProfile & { user: User })[]
> {
  const cached = await getCache<(FarmerProfile & { user: User })[]>(
    CACHE_KEYS.VERIFIED,
  );
  if (cached) return cached;

  const farmers = await getAllFarmers();
  const result = farmers.filter((f) => f.isVerified);
  await setCache(CACHE_KEYS.VERIFIED, result, 120);
  return result;
}

export async function getPendingFarmers(): Promise<
  (FarmerProfile & { user: User })[]
> {
  const farmers = await getAllFarmers();
  return farmers.filter((f) => !f.isVerified);
}

export async function searchFarmers(
  filters: FarmerFilters,
): Promise<(FarmerProfile & { user: User })[]> {
  let farmers = await getAllFarmers();

  if (filters.isVerified !== undefined) {
    farmers = farmers.filter((f) => f.isVerified === filters.isVerified);
  }

  if (filters.farmingMethod) {
    farmers = farmers.filter((f) => f.farmingMethod === filters.farmingMethod);
  }

  if (filters.location) {
    const loc = filters.location.toLowerCase();
    farmers = farmers.filter(
      (f) =>
        f.farmLocation.toLowerCase().includes(loc) ||
        f.state.toLowerCase().includes(loc),
    );
  }

  if (filters.search) {
    const s = filters.search.toLowerCase();
    farmers = farmers.filter(
      (f) =>
        f.farmName.toLowerCase().includes(s) ||
        f.user.name.toLowerCase().includes(s) ||
        f.description.toLowerCase().includes(s),
    );
  }

  return farmers;
}
