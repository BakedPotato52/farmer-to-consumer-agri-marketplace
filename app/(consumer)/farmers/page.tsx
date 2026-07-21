import Link from "next/link";
import { getVerifiedFarmers } from "@/lib/data/farmers";

export default async function FarmersPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const method = searchParams.method as string | undefined;
  const location = searchParams.location as string | undefined;

  let farmers = await getVerifiedFarmers();

  if (method) {
    farmers = farmers.filter((f) => f.farmingMethod === method);
  }
  if (location) {
    const locLower = location.toLowerCase();
    farmers = farmers.filter((f) => 
      f.farmLocation.toLowerCase().includes(locLower) || 
      f.state.toLowerCase().includes(locLower)
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Our Farmers</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Meet the dedicated people who grow your food. All our farmers are verified for quality and sustainable practices.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8 max-w-4xl mx-auto">
        <form method="GET" action="/farmers" className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 w-full">
            <input
              type="text"
              name="location"
              defaultValue={location || ""}
              placeholder="Search by location or state..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <div className="sm:w-64 w-full shrink-0">
            <select
              name="method"
              defaultValue={method || ""}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="">All Farming Methods</option>
              <option value="organic">Organic</option>
              <option value="conventional">Conventional</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-6 rounded-xl transition-colors shadow-sm"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Farmer Grid */}
      {farmers.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="text-4xl mb-4">🚜</div>
          <h3 className="text-xl font-bold mb-2">No farmers found</h3>
          <p className="text-gray-500">Try adjusting your filters to find farmers.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farmers.map((farmer) => {
            const methodColors = {
              organic: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
              conventional: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
              mixed: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
            };

            return (
              <Link
                key={farmer.userId}
                href={`/farmers/${farmer.userId}`}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-emerald-100 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/10 z-0"></div>
                
                <div className="relative z-10 w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-full flex items-center justify-center font-bold text-4xl shadow-lg mb-4 border-4 border-white dark:border-gray-800 group-hover:scale-105 transition-transform">
                  {farmer.farmName.charAt(0)}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors flex items-center gap-1 justify-center">
                  {farmer.farmName}
                  {farmer.isVerified && (
                    <span className="text-blue-500 text-lg" title="Verified">✓</span>
                  )}
                </h3>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">
                  {farmer.farmLocation}, {farmer.state}
                </p>
                
                <div className="flex gap-2 mb-6">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border uppercase tracking-wide ${methodColors[farmer.farmingMethod]}`}>
                    {farmer.farmingMethod}
                  </span>
                </div>
                
                <div className="w-full grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
                  <div>
                    <div className="text-amber-400 text-sm mb-1">
                      {"★".repeat(Math.round(farmer.rating))}
                    </div>
                    <div className="text-xs font-medium text-gray-500">{farmer.rating.toFixed(1)} Rating</div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white text-sm mb-1">{farmer.totalProducts}</div>
                    <div className="text-xs font-medium text-gray-500">Products</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
