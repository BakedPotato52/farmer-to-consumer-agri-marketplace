import { getAllFarmers, getPendingFarmers } from "@/lib/data/farmers";
import { approveFarmerAction, rejectFarmerAction } from "./actions";

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Farmer Management
        </h1>
        <p className="text-gray-500 mt-1">
          Review and manage farmer accounts on the platform.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        {/* Tabs */}
        <div className="border-b border-gray-100 flex overflow-x-auto">
          {tabs.map((tab) => (
            <a
              key={tab.id}
              href={`/admin/farmers?tab=${tab.id}`}
              className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                currentTab === tab.id
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
              <span
                className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                  currentTab === tab.id
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {tab.count}
              </span>
            </a>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-4 font-semibold">Farm Details</th>
                <th className="px-6 py-4 font-semibold">Location</th>
                <th className="px-6 py-4 font-semibold">Method</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Rating</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayedFarmers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No farmers found in this category.
                  </td>
                </tr>
              ) : (
                displayedFarmers.map((farmer) => {
                  const isPending = !farmer.isVerified && farmer.rating === 0; // Mock pending check
                  return (
                    <tr
                      key={farmer.userId}
                      className="hover:bg-gray-50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {farmer.farmName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {farmer.userId}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {farmer.farmLocation}
                      </td>
                      <td className="px-6 py-4">
                        <span className="capitalize text-gray-600">
                          {farmer.farmingMethod}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                            farmer.isVerified
                              ? "bg-emerald-100 text-emerald-800"
                              : isPending
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
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
                        <div className="flex items-center text-amber-500">
                          <span className="mr-1">★</span>
                          <span className="text-gray-900 font-medium">
                            {farmer.rating.toFixed(1)}
                          </span>
                          <span className="text-gray-500 text-xs ml-1">
                            ({farmer.totalReviews})
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {!farmer.isVerified && (
                          <div className="flex items-center justify-end gap-2">
                            <form
                              action={async () => {
                                "use server";
                                await approveFarmerAction(farmer.userId);
                              }}
                            >
                              <button className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-md font-medium text-xs transition-colors border border-emerald-200">
                                Approve
                              </button>
                            </form>
                            <form
                              action={async () => {
                                "use server";
                                await rejectFarmerAction(farmer.userId);
                              }}
                            >
                              <button className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md font-medium text-xs transition-colors border border-red-200">
                                Reject
                              </button>
                            </form>
                          </div>
                        )}
                        {farmer.isVerified && (
                          <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                            View Details
                          </button>
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
