import Link from "next/link";
import { filterProducts } from "@/lib/data/products";
import { getAllFarmers } from "@/lib/data/farmers";
import { ProductCategory } from "@/lib/types";
import { BiSearch } from "react-icons/bi";

export default async function ProductsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;

  const cat =
    typeof searchParams.category === "string"
      ? (searchParams.category as ProductCategory)
      : undefined;
  const isOrganic = searchParams.organic === "true";
  const minPrice = searchParams.minPrice
    ? Number(searchParams.minPrice)
    : undefined;
  const maxPrice = searchParams.maxPrice
    ? Number(searchParams.maxPrice)
    : undefined;
  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;
  const sortBy =
    typeof searchParams.sortBy === "string"
      ? (searchParams.sortBy as any)
      : undefined;

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
    <div className="pt-8 pb-16 max-w-[1280px] mx-auto px-4 md:px-10 min-h-screen">
      {/* Welcome Hero Text */}
      <div className="py-8">
        <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
          Today&apos;s Harvest
        </h1>
        <p className="font-body-md text-lg text-on-surface-variant max-w-2xl mt-2">
          Connecting you directly with local farmers bringing the season&apos;s finest organic produce to your table.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 shrink-0">
          <form
            method="GET"
            action="/products"
            className="bg-surface-container-low p-6 rounded-2xl organic-shadow space-y-6 sticky top-16"
          >
            <div>
              <h3 className="font-heading text-xl font-bold text-on-surface mb-4">Search & Filters</h3>
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  defaultValue={search || ""}
                  placeholder="Search harvest..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                  <BiSearch />
                </span>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-heading text-lg font-bold text-on-surface mb-3">Category</h3>
              <div className="space-y-2.5">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="category"
                    value=""
                    defaultChecked={!cat}
                    className="w-4 h-4 text-primary focus:ring-primary border-outline"
                  />
                  <span className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors">
                    All Harvests
                  </span>
                </label>
                {["vegetables", "fruits", "dairy", "grains", "herbs"].map((c) => (
                  <label key={c} className="flex items-center gap-3 cursor-pointer group capitalize">
                    <input
                      type="radio"
                      name="category"
                      value={c}
                      defaultChecked={cat === c}
                      className="w-4 h-4 text-primary focus:ring-primary border-outline"
                    />
                    <span className="text-sm font-medium text-on-surface-variant group-hover:text-primary transition-colors">
                      {c}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Organic Toggle */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="organic"
                  value="true"
                  defaultChecked={isOrganic}
                  className="w-5 h-5 rounded border-outline text-primary focus:ring-primary"
                />
                <span className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-secondary">eco</span>
                  Organic Certified Only
                </span>
              </label>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="font-heading text-lg font-bold text-on-surface mb-3">Price Range (₹)</h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  name="minPrice"
                  defaultValue={minPrice || ""}
                  placeholder="Min ₹"
                  className="w-full px-3 py-2 bg-white border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
                <span className="text-outline">-</span>
                <input
                  type="number"
                  name="maxPrice"
                  defaultValue={maxPrice || ""}
                  placeholder="Max ₹"
                  className="w-full px-3 py-2 bg-white border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Sort By */}
            <div>
              <h3 className="font-heading text-lg font-bold text-on-surface mb-3">Sort By</h3>
              <select
                name="sortBy"
                defaultValue={sortBy || ""}
                className="w-full bg-white border border-outline-variant/30 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Default (Newest)</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary text-on-primary rounded-xl font-heading text-sm font-semibold hover:bg-primary-container transition-all active:scale-[0.98] organic-shadow"
            >
              Apply Filters
            </button>

            <Link
              href="/products"
              className="block w-full text-center text-xs font-semibold text-outline hover:text-primary transition-colors pt-1"
            >
              Clear All Filters
            </Link>
          </form>
        </aside>

        {/* Product Grid Section */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between mb-6 gap-4 pb-4 border-b border-outline-variant/10">
            <p className="text-sm text-on-surface-variant">
              Showing <span className="font-bold text-on-surface">{products.length}</span> results for your selection
            </p>
          </div>

          {products.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-3xl p-16 text-center organic-shadow border border-outline-variant/10">
              <div className="w-16 h-16 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mx-auto mb-4 organic-shadow">
                <span className="material-symbols-outlined text-3xl">eco</span>
              </div>
              <h3 className="font-heading text-2xl font-bold text-on-surface mb-2">No produce found</h3>
              <p className="text-on-surface-variant max-w-sm mx-auto mb-6">
                Try adjusting your search query or clear filters to discover other seasonal items.
              </p>
              <Link
                href="/products"
                className="inline-block px-6 py-3 bg-primary text-on-primary rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Reset Filters
              </Link>
            </div>
          ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => {
                const farmer = farmerMap.get(product.farmerId);
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
                    className="bg-white rounded-2xl organic-shadow overflow-hidden group flex flex-col hover:-translate-y-1 transition-all duration-300 border border-outline-variant/10"
                  >
                    <div className={`aspect-square relative overflow-hidden bg-linear-to-br ${gradient} flex items-center justify-center p-6`}>
                      <div className="text-8xl opacity-30 transform -rotate-12 group-hover:scale-110 transition-transform duration-700 select-none">
                        {product.category === "vegetables" && "🥬"}
                        {product.category === "fruits" && "🍎"}
                        {product.category === "dairy" && "🥛"}
                        {product.category === "grains" && "🌾"}
                        {product.category === "herbs" && "🌿"}
                      </div>
                      {product.isOrganic && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-amber-100/90 backdrop-blur-md text-amber-900 text-xs font-bold py-1 px-3 rounded-full flex items-center gap-1 shadow-sm">
                            <span className="material-symbols-outlined text-[14px]">verified</span> Organic
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <div className="mb-1">
                        <span className="text-[10px] text-outline font-bold uppercase tracking-wider">
                          {product.category}
                        </span>
                      </div>
                      <h3 className="font-heading text-lg font-bold text-on-surface mb-1 group-hover:text-primary transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mb-4 text-on-surface-variant text-sm">
                        <span className="material-symbols-outlined text-secondary text-[16px]">person</span>
                        <span className="line-clamp-1">{farmer?.farmName || "Local Farm"}</span>
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-3 border-t border-outline-variant/10">
                        <div className="flex flex-col">
                          <span className="font-heading text-xl font-bold text-primary">₹{product.price}</span>
                          <span className="text-xs text-outline">per {product.unit}</span>
                        </div>
                        <span className="bg-primary hover:bg-primary-container text-on-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm">
                          <span className="material-symbols-outlined text-[16px]">visibility</span> View
                        </span>
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
