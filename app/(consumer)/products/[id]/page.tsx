import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductById } from "@/lib/data/products";
import { getFarmerById } from "@/lib/data/farmers";
import { getReviewsByProduct } from "@/lib/data/reviews";
import AddToCartButton from "./AddToCartButton";
import { FaRegCheckCircle } from "react-icons/fa";
import { MdOutlineRateReview, MdVerified } from "react-icons/md";
import { FaLocationDot, FaStar } from "react-icons/fa6";

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

  const bgGradients: Record<string, string> = {
    vegetables: "from-emerald-700/80 to-emerald-900/90",
    fruits: "from-amber-600/80 to-red-800/90",
    dairy: "from-sky-700/80 to-blue-900/90",
    grains: "from-amber-700/80 to-yellow-900/90",
    herbs: "from-teal-700/80 to-emerald-900/90",
  };
  const bgGradient = bgGradients[product.category] || "from-primary to-primary-container";

  return (
    <div className="pt-8 pb-16 max-w-[1280px] mx-auto px-4 md:px-10 min-h-screen">
      {/* Breadcrumb */}
      <nav className="flex items-center text-on-surface-variant text-sm gap-2 mb-8">
        <Link href="/products" className="hover:text-primary transition-colors">
          Marketplace
        </Link>
        <span>/</span>
        <span className="capitalize">{product.category}</span>
        <span>/</span>
        <span className="text-primary font-semibold">{product.name}</span>
      </nav>

      {/* Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Visual Showcase */}
        <div className="lg:col-span-7 space-y-6">
          <div className={`relative aspect-square md:aspect-4/3 rounded-3xl bg-linear-to-br ${bgGradient} organic-shadow flex items-center justify-center  overflow-hidden`}>
            {product.image || (product.images && product.images.length > 0) ? (
              <img
                src={product.image || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover rounded-3xl"
              />
            ) : (
              <div className="text-9xl opacity-20 transform -rotate-12 scale-150 select-none">
                {product.category === "vegetables" && "🥬"}
                {product.category === "fruits" && "🍎"}
                {product.category === "dairy" && "🥛"}
                {product.category === "grains" && "🌾"}
                {product.category === "herbs" && "🌿"}
              </div>
            )}

            {/* Badges Overlay */}
            <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
              {product.isOrganic && (
                <span className="bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
                  <span className="material-symbols-outlined text-[16px]"><FaRegCheckCircle /></span>
                  Certified Organic
                </span>
              )}
              <span className="bg-white/80 backdrop-blur-md text-primary px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm">
                Fresh Harvest
              </span>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="glass-card rounded-3xl p-8 organic-shadow space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-2xl font-bold text-on-surface">
                Customer Reviews
              </h2>
              <span className="text-sm text-outline">({reviews.length} reviews)</span>
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-8 text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl text-outline mb-2"><MdOutlineRateReview /></span>
                <p className="text-sm">No reviews yet for this product. Be the first to share your thoughts!</p>
              </div>
            ) : (
              <div className="space-y-6 divide-y divide-outline-variant/10">
                {reviews.map((review) => (
                  <div key={review.id} className="pt-4 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-on-surface text-sm">{review.consumerName}</div>
                      <span className="text-xs text-outline">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex text-amber-500 text-sm">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className="material-symbols-outlined text-[18px]"
                          style={{ fontVariationSettings: star <= review.rating ? "'FILL' 1" : "'FILL' 0" }}
                        >
                          <FaStar />
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-on-surface-variant leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Product Info & Purchase Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Action Box */}
          <div className="glass-card rounded-3xl p-8 organic-shadow space-y-6 sticky top-24 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:overscroll-contain">
            <div>
              <span className="text-xs font-bold text-outline uppercase tracking-wider block mb-1">
                {product.category}
              </span>
              <h1 className="font-heading text-3xl font-extrabold text-primary mb-3">
                {product.name}
              </h1>

              {/* Price & Rating */}
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <span className="font-heading text-4xl font-extrabold text-primary">₹{product.price}</span>
                  <span className="text-sm text-outline ml-1">/ {product.unit}</span>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  <span
                    className="material-symbols-outlined text-amber-500 text-[18px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    <FaStar />
                  </span>
                  <span className="text-sm font-bold text-amber-900">{product.rating.toFixed(1)}</span>
                  <span className="text-xs text-amber-700">({product.totalReviews})</span>
                </div>
              </div>

              {/* Stock availability */}
              <div className="flex items-center gap-2 mb-6">
                <span className={`w-2.5 h-2.5 rounded-full ${product.quantityAvailable > 0 ? "bg-emerald-500" : "bg-error"}`} />
                <span className="text-xs font-semibold text-on-surface-variant">
                  {product.quantityAvailable > 0
                    ? `${product.quantityAvailable} ${product.unit}s available in stock`
                    : "Currently Out of Stock"}
                </span>
              </div>

              <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                {product.description}
              </p>
            </div>

            {/* Add to Basket Component */}
            <AddToCartButton product={product} farmerName={farmer.farmName} />
          </div>

          {/* Farmer Card */}
          <div className="bg-surface-container-low rounded-3xl p-6 organic-shadow border border-outline-variant/10 space-y-4">
            <span className="text-xs font-bold text-outline uppercase tracking-wider block">Grown With Integrity By</span>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary text-on-primary font-heading font-bold text-lg flex items-center justify-center shadow-md">
                {farmer.farmName.charAt(0)}
              </div>
              <div>
                <h4 className="font-heading text-lg font-bold text-primary flex items-center gap-1.5">
                  {farmer.farmName}
                  {farmer.isVerified && (
                    <span className="material-symbols-outlined text-secondary-fixed-dim text-[18px]"><MdVerified /></span>
                  )}
                </h4>
                <p className="text-xs text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]"><FaLocationDot /></span>
                  {farmer.farmLocation}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-4 border-t border-outline-variant/10">
              <div>
                <span className="text-outline block">Farming Method</span>
                <span className="font-semibold text-on-surface capitalize">{farmer.farmingMethod}</span>
              </div>
              <div className="text-right">
                <span className="text-outline block">Farmer Rating</span>
                <span className="font-semibold text-on-surface">{farmer.rating.toFixed(1)} ★</span>
              </div>
            </div>

            <Link
              href={`/farmers/${farmer.userId}`}
              className="block w-full text-center py-3 px-4 rounded-xl border border-primary/30 text-primary font-heading text-sm font-semibold hover:bg-primary/5 transition-colors"
            >
              Visit Farm Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
