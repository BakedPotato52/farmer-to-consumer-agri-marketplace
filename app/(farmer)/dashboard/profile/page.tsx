import { getFarmerById } from "@/lib/data/farmers";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import ProfileForm from "./profile-form";
import { cookies } from "next/headers";

export default async function ProfilePage() {
  await cookies();
  const session = await getSession();
  if (!session || session.role !== "farmer") {
    redirect("/login");
  }

  const profile = await getFarmerById(session.userId);
  if (!profile) {
    redirect("/login");
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Farm Profile</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your farm's public information and settings.</p>
        </div>
        {profile.isVerified ? (
          <span className="flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full font-medium text-sm">
            <span>✓</span> Verified Farmer
          </span>
        ) : (
          <span className="flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full font-medium text-sm">
            <span>⌛</span> Verification Pending
          </span>
        )}
      </div>

      <ProfileForm profile={profile} />
    </div>
  );
}
