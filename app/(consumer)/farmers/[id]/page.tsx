import { notFound } from "next/navigation";
import Link from "next/link";
import { getFarmerById } from "@/lib/data/farmers";
import { filterProducts } from "@/lib/data/products";
import { getReviewsByFarmer } from "@/lib/data/reviews";

export default async function FarmerProfilePage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const farmer = await getFarmerById(id);
  if (!farmer) {
    notFound();
  }

  const products = await filterProducts({ farmerId: id });
  const reviews = await getReviewsByFarmer(id);

  const methodColors = {
    organic:
      "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400",
    conventional:
      "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
    mixed:
      "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400",
  };

  return (
    <div className="w-full">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-emerald-600 to-teal-800 text-white pt-24 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center md:items-end gap-8">
          <div className="w-32 h-32 md:w-40 md:h-40 bg-white text-emerald-600 rounded-full flex items-center justify-center font-bold text-6xl shadow-2xl border-4 border-emerald-100 shrink-0">
            {farmer.farmName.charAt(0)}
          </div>
          <div className="text-center md:text-left flex-1">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <h1 className="text-4xl md:text-5xl font-bold">
                {farmer.farmName}
              </h1>
              {farmer.isVerified && (
                <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider flex items-center shadow-sm">
                  ✓ Verified
                </span>
              )}
            </div>
            <p className="text-emerald-100 text-lg flex items-center justify-center md:justify-start gap-2">
              <span>
                📍 {farmer.farmLocation}, {farmer.state}
              </span>
              <span className="hidden md:inline">•</span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-white/20 backdrop-blur-sm border border-white/30`}
              >
                {farmer.farmingMethod}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Farm Details */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                About the Farm
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                {farmer.description}
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Crops Grown
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {farmer.cropTypes.map((crop) => (
                      <span
                        key={crop}
                        className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-sm font-medium border border-emerald-100 dark:border-emerald-800"
                      >
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Farm Stats
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl text-center">
                      <div className="text-2xl font-bold text-amber-500">
                        {farmer.rating.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">
                        Rating
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl text-center">
                      <div className="text-2xl font-bold text-emerald-600">
                        {farmer.totalProducts}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">
                        Products
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Reviews ({farmer.totalReviews})
              </h2>

              {reviews.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No reviews for this farmer yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {reviews.slice(0, 3).map((review) => (
                    <div
                      key={review.id}
                      className="pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm text-gray-900 dark:text-gray-200">
                          {review.consumerName}
                        </span>
                        <div className="text-amber-400 text-xs">
                          {"★".repeat(review.rating)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                  {reviews.length > 3 && (
                    <button className="w-full text-center text-sm text-emerald-600 font-medium pt-2">
                      View all reviews
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Products */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 pl-2">
              Products by {farmer.farmName}
            </h2>

            {products.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="text-4xl mb-4">🌾</div>
                <h3 className="text-lg font-bold">No products available</h3>
                <p className="text-gray-500">
                  This farmer hasn't listed any products yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {products.map((product) => {
                  const bgColors: Record<string, string> = {
                    vegetables: "from-green-400 to-emerald-500",
                    fruits: "from-orange-400 to-red-500",
                    dairy: "from-blue-300 to-blue-500",
                    grains: "from-yellow-400 to-amber-500",
                    herbs: "from-teal-400 to-emerald-600",
                  };
                  const bgGradient =
                    bgColors[product.category] || "from-gray-300 to-gray-400";

                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col"
                    >
                      <div
                        className={`h-40 w-full bg-gradient-to-br ${bgGradient} relative`}
                      >
                        {product.isOrganic && (
                          <div className="absolute top-2 right-2 bg-white/90 text-emerald-700 text-xs font-bold px-2 py-1 rounded shadow-sm">
                            ORGANIC
                          </div>
                        )}
                      </div>

                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg line-clamp-1 mb-2 group-hover:text-emerald-600 transition-colors">
                          {product.name}
                        </h3>

                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
                          <div className="font-bold text-gray-900 dark:text-white">
                            ₹{product.price}{" "}
                            <span className="text-xs text-gray-500 font-normal">
                              / {product.unit}
                            </span>
                          </div>
                          <div className="text-amber-400 text-xs">
                            ★ {product.rating.toFixed(1)}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
