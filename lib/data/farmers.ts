import { store } from "@/lib/data/store";
import type { FarmerProfile, User, FarmerFilters } from "@/lib/types";

export function getAllFarmers(): (FarmerProfile & { user: User })[] {
  return store.farmerProfiles.map((profile) => {
    const user = store.users.find((u) => u.id === profile.userId)!;
    return { ...profile, user };
  });
}

export function getFarmerById(userId: string): (FarmerProfile & { user: User }) | undefined {
  const profile = store.farmerProfiles.find((p) => p.userId === userId);
  if (!profile) return undefined;
  const user = store.users.find((u) => u.id === userId)!;
  return { ...profile, user };
}

export function createFarmerProfile(
  data: Omit<FarmerProfile, "rating" | "totalReviews" | "totalProducts">
): FarmerProfile {
  const newProfile: FarmerProfile = {
    ...data,
    rating: 0,
    totalReviews: 0,
    totalProducts: 0,
  };
  store.farmerProfiles.push(newProfile);
  return newProfile;
}

export function updateFarmerProfile(
  userId: string,
  data: Partial<FarmerProfile>
): FarmerProfile | undefined {
  const index = store.farmerProfiles.findIndex((p) => p.userId === userId);
  if (index === -1) return undefined;

  store.farmerProfiles[index] = { ...store.farmerProfiles[index], ...data };
  return store.farmerProfiles[index];
}

export function verifyFarmer(userId: string): FarmerProfile | undefined {
  const index = store.farmerProfiles.findIndex((p) => p.userId === userId);
  if (index === -1) return undefined;

  store.farmerProfiles[index] = {
    ...store.farmerProfiles[index],
    isVerified: true,
    verificationDate: new Date().toISOString(),
  };
  return store.farmerProfiles[index];
}

export function rejectFarmer(userId: string): boolean {
  const index = store.farmerProfiles.findIndex((p) => p.userId === userId);
  if (index === -1) return false;
  store.farmerProfiles.splice(index, 1);
  return true;
}

export function getVerifiedFarmers(): (FarmerProfile & { user: User })[] {
  return getAllFarmers().filter((f) => f.isVerified);
}

export function getPendingFarmers(): (FarmerProfile & { user: User })[] {
  return getAllFarmers().filter((f) => !f.isVerified);
}

export function searchFarmers(filters: FarmerFilters): (FarmerProfile & { user: User })[] {
  let farmers = getAllFarmers();

  if (filters.isVerified !== undefined) {
    farmers = farmers.filter((f) => f.isVerified === filters.isVerified);
  }

  if (filters.farmingMethod) {
    farmers = farmers.filter((f) => f.farmingMethod === filters.farmingMethod);
  }

  if (filters.location) {
    const loc = filters.location.toLowerCase();
    farmers = farmers.filter(
      (f) => f.farmLocation.toLowerCase().includes(loc) || f.state.toLowerCase().includes(loc)
    );
  }

  if (filters.search) {
    const s = filters.search.toLowerCase();
    farmers = farmers.filter(
      (f) =>
        f.farmName.toLowerCase().includes(s) ||
        f.user.name.toLowerCase().includes(s) ||
        f.description.toLowerCase().includes(s)
    );
  }

  return farmers;
}
