import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductById } from "@/lib/data/products";
import { getFarmerById } from "@/lib/data/farmers";
import { getReviewsByProduct } from "@/lib/data/reviews";
import AddToCartButton from "./AddToCartButton";

export default async function ProductDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const product = await getProductById(id);
  
  if (!product) {
    notFound();
  }

  const farmer = await getFarmerById(product.farmerId);
  if (!farmer) {
    notFound();
  }

  const reviews = await getReviewsByProduct(id);

  const bgColors: Record<string, string> = {
    vegetables: "from-green-400 to-emerald-500",
    fruits: "from-orange-400 to-red-500",
    dairy: "from-blue-300 to-blue-500",
    grains: "from-yellow-400 to-amber-500",
    herbs: "from-teal-400 to-emerald-600",
  };
  const bgGradient = bgColors[product.category] || "from-gray-300 to-gray-400";

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb / Back Link */}
      <div className="mb-6">
        <Link href="/products" className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-2 text-sm font-medium">
          ← Back to Products
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left Column: Image & Details */}
        <div className="flex-1 space-y-8">
          {/* Image Placeholder */}
          <div className={`w-full aspect-[4/3] rounded-3xl bg-gradient-to-br ${bgGradient} shadow-lg relative overflow-hidden flex items-center justify-center`}>
            {product.isOrganic && (
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-emerald-700 text-sm font-bold px-3 py-1.5 rounded-xl shadow-sm z-10">
                ORGANIC
              </div>
            )}
            <div className="text-9xl opacity-20 transform -rotate-12 scale-150">
              {product.category === "vegetables" && "🥬"}
              {product.category === "fruits" && "🍎"}
              {product.category === "dairy" && "🥛"}
              {product.category === "grains" && "🌾"}
              {product.category === "herbs" && "🌿"}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Customer Reviews</h2>
            
            {reviews.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 italic">No reviews yet. Be the first to review this product!</p>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 dark:border-gray-700 last:border-0 pb-6 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-gray-900 dark:text-white">{review.consumerName}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center text-amber-400 text-sm mb-3">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sidebar info */}
        <div className="w-full lg:w-96 shrink-0 space-y-6">
          {/* Product Action Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 sticky top-24">
            <div className="mb-2 flex items-center gap-2">
              <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                {product.category}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                ₹{product.price}
                <span className="text-lg font-normal text-gray-500 ml-1">/ {product.unit}</span>
              </div>
              <div className="flex items-center text-amber-400 text-sm bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg">
                ★ {product.rating.toFixed(1)} <span className="text-gray-500 ml-1">({product.totalReviews})</span>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              {product.description}
            </p>
            
            <div className="mb-6 flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${product.quantityAvailable > 0 ? "bg-green-500" : "bg-red-500"}`}></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {product.quantityAvailable > 0 ? `${product.quantityAvailable} ${product.unit}s available` : "Out of stock"}
              </span>
            </div>

            <AddToCartButton product={product} farmerName={farmer.farmName} />
          </div>

          {/* Farmer Info Card */}
          <div className="bg-emerald-50 dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-emerald-100 dark:border-gray-700">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Grown By</h3>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-inner">
                {farmer.farmName.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-1">
                  {farmer.farmName}
                  {farmer.isVerified && (
                    <span className="text-blue-500 text-sm" title="Verified Farmer">✓</span>
                  )}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{farmer.farmLocation}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm mb-6 pb-6 border-b border-emerald-200 dark:border-gray-700">
              <div className="text-center">
                <div className="font-bold text-gray-900 dark:text-white">{farmer.rating.toFixed(1)} ★</div>
                <div className="text-gray-500">Rating</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-900 dark:text-white capitalize">{farmer.farmingMethod}</div>
                <div className="text-gray-500">Method</div>
              </div>
            </div>
            
            <Link 
              href={`/farmers/${farmer.userId}`}
              className="block w-full text-center py-2 px-4 rounded-xl border-2 border-emerald-600 text-emerald-600 font-medium hover:bg-emerald-600 hover:text-white transition-colors dark:border-emerald-500 dark:text-emerald-400 dark:hover:bg-emerald-500 dark:hover:text-white"
            >
              View Farm Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
