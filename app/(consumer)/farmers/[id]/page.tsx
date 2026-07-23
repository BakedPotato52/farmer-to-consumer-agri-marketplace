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

  return (
    <div className="w-full min-h-screen pb-16 bg-background">
      {/* Hero Banner Section */}
      <section className="relative h-[320px] md:h-[400px] overflow-hidden bg-gradient-to-r from-primary to-primary-container text-white flex items-end pb-12">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_70%_20%,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />

        <div className="relative z-10 max-w-[1280px] mx-auto w-full px-4 md:px-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center md:items-end gap-6">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white text-primary font-heading font-extrabold text-5xl flex items-center justify-center shadow-2xl border-4 border-white shrink-0">
              {farmer.farmName.charAt(0)}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold mb-2 shadow-sm">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span className="capitalize">{farmer.farmingMethod} Farmer</span>
              </div>
              <h1 className="font-heading text-3xl md:text-5xl font-extrabold text-white mb-1 tracking-tight">
                {farmer.farmName}
              </h1>
              <p className="text-sm md:text-base text-white/90 flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
                {farmer.farmLocation}, {farmer.state}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Quick Bar */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-10 -mt-6 relative z-20">
        <div className="glass-card organic-shadow rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-4 p-6 text-center">
          <div>
            <span className="font-heading text-3xl font-extrabold text-primary block">
              {farmer.rating.toFixed(1)} ★
            </span>
            <span className="text-xs text-outline font-medium uppercase tracking-wider">Rating</span>
          </div>
          <div className="border-l border-outline-variant/20">
            <span className="font-heading text-3xl font-extrabold text-primary block">
              {farmer.totalReviews}
            </span>
            <span className="text-xs text-outline font-medium uppercase tracking-wider">Reviews</span>
          </div>
          <div className="border-l border-outline-variant/20">
            <span className="font-heading text-3xl font-extrabold text-primary block">
              {products.length}
            </span>
            <span className="text-xs text-outline font-medium uppercase tracking-wider">Live Products</span>
          </div>
          <div className="border-l border-outline-variant/20">
            <span className="font-heading text-3xl font-extrabold text-primary block capitalize">
              {farmer.farmingMethod}
            </span>
            <span className="text-xs text-outline font-medium uppercase tracking-wider">Method</span>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-10 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Farm Details & Reviews */}
        <div className="lg:col-span-4 space-y-6">
          {/* About Farm */}
          <div className="glass-card rounded-3xl p-8 organic-shadow space-y-6">
            <h2 className="font-heading text-2xl font-bold text-primary">About Our Farm</h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {farmer.description}
            </p>

            <div className="space-y-3 pt-4 border-t border-outline-variant/10">
              <span className="text-xs font-bold text-outline uppercase tracking-wider block">Crops Grown</span>
              <div className="flex flex-wrap gap-2">
                {farmer.cropTypes.map((crop) => (
                  <span
                    key={crop}
                    className="px-3 py-1 bg-surface-container-low text-on-surface-variant text-xs font-semibold rounded-full border border-outline-variant/20"
                  >
                    {crop}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Farmer Reviews */}
          <div className="glass-card rounded-3xl p-8 organic-shadow space-y-4">
            <h2 className="font-heading text-xl font-bold text-primary">
              Customer Reviews ({farmer.totalReviews})
            </h2>

            {reviews.length === 0 ? (
              <p className="text-xs text-outline italic">No reviews yet for this farmer.</p>
            ) : (
              <div className="space-y-4 divide-y divide-outline-variant/10">
                {reviews.map((review) => (
                  <div key={review.id} className="pt-3 first:pt-0 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-on-surface">{review.consumerName}</span>
                      <div className="flex text-amber-500">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className="material-symbols-outlined text-[14px]"
                            style={{ fontVariationSettings: star <= review.rating ? "'FILL' 1" : "'FILL' 0" }}
                          >
                            star
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Products List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-heading text-2xl font-bold text-primary">
              Products Available from {farmer.farmName}
            </h2>
            <span className="text-xs text-outline">({products.length} products)</span>
          </div>

          {products.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-3xl p-16 text-center organic-shadow border border-outline-variant/10">
              <span className="material-symbols-outlined text-4xl text-outline mb-2">inventory_2</span>
              <h3 className="font-heading text-lg font-bold text-on-surface mb-1">No products listed</h3>
              <p className="text-xs text-on-surface-variant">Check back soon for fresh seasonal harvests!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {products.map((product) => {
                const bgGradients: Record<string, string> = {
                  vegetables: "from-emerald-700/80 to-emerald-900/90",
                  fruits: "from-amber-600/80 to-red-800/90",
                  dairy: "from-sky-700/80 to-blue-900/90",
                  grains: "from-amber-700/80 to-yellow-900/90",
                  herbs: "from-teal-700/80 to-emerald-900/90",
                };
                const gradient = bgGradients[product.category] || "from-primary to-primary-container";

                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="bg-white rounded-2xl organic-shadow overflow-hidden group flex flex-col hover:translate-y-[-4px] transition-all duration-300 border border-outline-variant/10"
                  >
                    <div className={`h-40 relative bg-gradient-to-br ${gradient} flex items-center justify-center p-4`}>
                      <div className="text-7xl opacity-30 transform -rotate-12 group-hover:scale-110 transition-transform duration-700 select-none">
                        {product.category === "vegetables" && "🥬"}
                        {product.category === "fruits" && "🍎"}
                        {product.category === "dairy" && "🥛"}
                        {product.category === "grains" && "🌾"}
                        {product.category === "herbs" && "🌿"}
                      </div>
                      {product.isOrganic && (
                        <div className="absolute top-3 right-3">
                          <span className="bg-amber-100/90 backdrop-blur-md text-amber-900 text-[10px] font-bold py-0.5 px-2.5 rounded-full flex items-center gap-1 shadow-sm">
                            ORGANIC
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-heading text-lg font-bold text-on-surface mb-1 group-hover:text-primary transition-colors line-clamp-1">
                        {product.name}
                      </h3>

                      <div className="mt-auto flex items-center justify-between pt-3 border-t border-outline-variant/10">
                        <div>
                          <span className="font-heading text-lg font-bold text-primary">₹{product.price}</span>
                          <span className="text-xs text-outline"> / {product.unit}</span>
                        </div>
                        <span className="bg-primary hover:bg-primary-container text-on-primary px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all">
                          View
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
