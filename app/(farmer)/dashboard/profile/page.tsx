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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Card */}
      <div className="glass-card p-6 md:p-8 rounded-3xl organic-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-primary">Farm Profile Settings</h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Manage public farm story, location details, crop categories, and verification status.
          </p>
        </div>

        {profile.isVerified ? (
          <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold shadow-sm">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>Verified Master Farmer</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-100 text-amber-900 rounded-full text-xs font-bold shadow-sm">
            <span className="material-symbols-outlined text-[18px]">schedule</span>
            <span>Verification Pending</span>
          </div>
        )}
      </div>

      <ProfileForm profile={profile} />
    </div>
  );
}
