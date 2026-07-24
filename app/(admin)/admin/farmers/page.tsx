import { getAllFarmers, getPendingFarmers } from "@/lib/data/farmers";
import { approveFarmerAction, rejectFarmerAction } from "./actions";
import Link from "next/link";
import { FaStar } from "react-icons/fa6";
import { MdVerified } from "react-icons/md";

export default async function FarmersManagement({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const resolvedParams = await searchParams;
  const currentTab = resolvedParams.tab || "all";

  const allFarmers = await getAllFarmers();
  const pendingFarmers = await getPendingFarmers();

  const verifiedFarmers = allFarmers.filter((f) => f.isVerified);
  const rejectedFarmers = allFarmers.filter(
    (f) => !f.isVerified && !pendingFarmers.find((p) => p.userId === f.userId),
  );

  let displayedFarmers = allFarmers;
  if (currentTab === "pending") displayedFarmers = pendingFarmers;
  else if (currentTab === "verified") displayedFarmers = verifiedFarmers;
  else if (currentTab === "rejected") displayedFarmers = rejectedFarmers;

  const tabs = [
    { id: "all", label: "All Farmers", count: allFarmers.length },
    { id: "pending", label: "Pending Approval", count: pendingFarmers.length },
    { id: "verified", label: "Verified", count: verifiedFarmers.length },
    { id: "rejected", label: "Rejected", count: rejectedFarmers.length },
  ];

  return (
    <div className="space-y-8">
      {/* Header Card */}
      <div className="glass-card p-6 md:p-8 rounded-3xl organic-shadow">
        <h1 className="font-heading text-3xl font-extrabold text-primary">
          Farmer Merchant Management
        </h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Review application credentials, verify sustainable farming methods,
          and manage merchant accounts.
        </p>
      </div>

      <div className="glass-card organic-shadow rounded-3xl overflow-hidden flex flex-col">
        {/* Tabs Bar */}
        <div className="p-3 bg-surface-container-low border-b border-outline-variant/10 flex overflow-x-auto gap-2">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={`/admin/farmers?tab=${tab.id}`}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                currentTab === tab.id
                  ? "bg-secondary-container text-on-secondary-container shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-container-high/50"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`py-0.5 px-2 rounded-full text-[10px] font-extrabold ${
                  currentTab === tab.id
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-high text-outline"
                }`}
              >
                {tab.count}
              </span>
            </Link>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-on-surface">
            <thead className="bg-surface-container-low text-xs font-bold text-outline uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Farm Identity</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Farming Method</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {displayedFarmers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-outline italic"
                  >
                    No farmer merchants found in this category.
                  </td>
                </tr>
              ) : (
                displayedFarmers.map((farmer) => {
                  const isPending = !farmer.isVerified && farmer.rating === 0;
                  return (
                    <tr
                      key={farmer.userId}
                      className="hover:bg-surface-container-low/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-heading font-bold text-primary text-base flex items-center gap-1.5">
                          {farmer.farmName}
                          {farmer.isVerified && (
                            <span className="material-symbols-outlined text-secondary-fixed-dim text-[18px]">
                              <MdVerified />
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-outline">
                          {farmer.userId}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-on-surface-variant">
                        {farmer.farmLocation}, {farmer.state}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-surface-container-low text-on-surface-variant rounded-full text-xs font-semibold border border-outline-variant/20 capitalize">
                          {farmer.farmingMethod}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            farmer.isVerified
                              ? "bg-secondary-container text-on-secondary-container border-secondary/20"
                              : isPending
                                ? "bg-amber-100 text-amber-900 border-amber-200"
                                : "bg-error-container text-on-error-container border-error/20"
                          }`}
                        >
                          {farmer.isVerified
                            ? "Verified"
                            : isPending
                              ? "Pending"
                              : "Rejected"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                          <span
                            className="material-symbols-outlined text-[16px]"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            <FaStar />
                          </span>
                          <span className="text-on-surface">
                            {farmer.rating.toFixed(1)}
                          </span>
                          <span className="text-outline font-normal">
                            ({farmer.totalReviews})
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {!farmer.isVerified ? (
                          <div className="flex items-center justify-end gap-2">
                            <form action={approveFarmerAction}>
                              <input
                                type="hidden"
                                name="userId"
                                value={farmer.userId}
                              />
                              <button
                                type="submit"
                                className="px-3 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:bg-primary-container transition-all cursor-pointer"
                              >
                                Approve
                              </button>
                            </form>
                            <form action={rejectFarmerAction}>
                              <input
                                type="hidden"
                                name="userId"
                                value={farmer.userId}
                              />
                              <button
                                type="submit"
                                className="px-3 py-1.5 bg-error-container text-on-error-container rounded-lg text-xs font-semibold hover:opacity-80 transition-opacity cursor-pointer"
                              >
                                Reject
                              </button>
                            </form>
                          </div>
                        ) : (
                          <Link
                            href={`/farmers/${farmer.userId}`}
                            className="text-xs font-semibold text-primary hover:underline"
                          >
                            Public Profile →
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
