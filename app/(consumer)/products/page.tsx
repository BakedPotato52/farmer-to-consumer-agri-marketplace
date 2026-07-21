import Link from "next/link";
import { filterProducts } from "@/lib/data/products";
import { getAllFarmers } from "@/lib/data/farmers";
import { ProductCategory } from "@/lib/types";

export default async function ProductsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  
  const categoryParam = searchParams.category as string;
  const category = categoryParam ? (categoryParam.split(",") as ProductCategory[]) : undefined;
  
  // Actually, filterProducts might take a single category or multiple. The types say `category?: ProductCategory;`
  // so let's just pass the first one if it's an array, or string.
  const cat = typeof searchParams.category === "string" ? searchParams.category as ProductCategory : undefined;
  const isOrganic = searchParams.organic === "true";
  const minPrice = searchParams.minPrice ? Number(searchParams.minPrice) : undefined;
  const maxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined;
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined;
  const sortBy = typeof searchParams.sortBy === "string" ? searchParams.sortBy as any : undefined;

  const products = await filterProducts({
    category: cat,
    isOrganic: isOrganic ? true : undefined,
    minPrice,
    maxPrice,
    search,
    sortBy,
  });

  const farmers = await getAllFarmers();
  const farmerMap = new Map(farmers.map((f) => [f.userId, f]));

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0">
          <form method="GET" action="/products" className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Filters</h2>
            
            {/* Search */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Search</label>
              <input
                type="text"
                name="search"
                defaultValue={search || ""}
                placeholder="Search products..."
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Category</label>
              <div className="space-y-2">
                {["vegetables", "fruits", "dairy", "grains", "herbs"].map((c) => (
                  <label key={c} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 capitalize cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value={c}
                      defaultChecked={cat === c}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    {c}
                  </label>
                ))}
              </div>
            </div>

            {/* Organic */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  name="organic"
                  value="true"
                  defaultChecked={isOrganic}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                Organic Only
              </label>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Price Range</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  name="minPrice"
                  defaultValue={minPrice || ""}
                  placeholder="Min"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  name="maxPrice"
                  defaultValue={maxPrice || ""}
                  placeholder="Max"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Sort By</label>
              <select
                name="sortBy"
                defaultValue={sortBy || ""}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="">Default</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-xl transition-colors shadow-sm"
            >
              Apply Filters
            </button>
            
            <Link
              href="/products"
              className="block w-full text-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mt-2"
            >
              Clear Filters
            </Link>
          </form>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Showing {products.length} {products.length === 1 ? "result" : "results"}
            </p>
          </div>

          {products.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="text-5xl mb-4">🌱</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No products found</h3>
              <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters to find what you're looking for.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const farmer = farmerMap.get(product.farmerId);
                const bgColors = {
                  vegetables: "from-green-400 to-emerald-500",
                  fruits: "from-orange-400 to-red-500",
                  dairy: "from-blue-300 to-blue-500",
                  grains: "from-yellow-400 to-amber-500",
                  herbs: "from-teal-400 to-emerald-600",
                };
                const bgGradient = bgColors[product.category] || "from-gray-300 to-gray-400";
                
                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col"
                  >
                    <div className={`h-48 w-full bg-gradient-to-br ${bgGradient} relative`}>
                      {product.isOrganic && (
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-emerald-700 text-xs font-bold px-2 py-1 rounded-lg shadow-sm">
                          ORGANIC
                        </div>
                      )}
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg line-clamp-1 group-hover:text-emerald-600 transition-colors">
                          {product.name}
                        </h3>
                      </div>
                      
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex-1">
                        By {farmer?.farmName || "Unknown Farmer"}
                      </div>
                      
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="font-bold text-gray-900 dark:text-white text-lg">
                          ₹{product.price} <span className="text-sm text-gray-500 font-normal">/ {product.unit}</span>
                        </div>
                        <div className="flex items-center text-amber-400 text-sm">
                          {"★".repeat(Math.round(product.rating))}
                          {"☆".repeat(5 - Math.round(product.rating))}
                          <span className="text-gray-400 ml-1">({product.totalReviews})</span>
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
  );
}
