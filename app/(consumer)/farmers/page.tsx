import Link from "next/link";
import { getVerifiedFarmers } from "@/lib/data/farmers";
import { MdAgriculture, MdVerified } from "react-icons/md";
import { FaLocationDot, FaStar } from "react-icons/fa6";

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
    farmers = farmers.filter(
      (f) =>
        f.farmLocation.toLowerCase().includes(locLower) ||
        f.state.toLowerCase().includes(locLower),
    );
  }

  return (
    <div className="pt-8 pb-16 max-w-[1280px] mx-auto px-4 md:px-10 min-h-screen">
      {/* Header Section */}
      <header className="mb-8">
        <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-primary mb-3 tracking-tight">
          Meet Our Producers
        </h1>
        <p className="font-body-md text-lg text-on-surface-variant max-w-2xl">
          Connect directly with the local farmers providing your table with the freshest organic produce. Transparency from soil to shelf.
        </p>
      </header>

      {/* Filter & Search Bar */}
      <div className="bg-surface-container-low p-6 rounded-2xl organic-shadow mb-8">
        <form method="GET" action="/farmers" className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full relative">
            <input
              type="text"
              name="location"
              defaultValue={location || ""}
              placeholder="Search by location or state (e.g. Sonoma, California)..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline"
            />
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              <FaLocationDot />
            </span>
          </div>

          <div className="w-full md:w-64 shrink-0">
            <select
              name="method"
              defaultValue={method || ""}
              className="w-full px-4 py-3 bg-white border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 text-on-surface font-medium"
            >
              <option value="">All Farming Methods</option>
              <option value="organic">Organic Certified</option>
              <option value="conventional">Conventional</option>
              <option value="mixed">Mixed Methods</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full md:w-auto px-8 py-3 bg-primary text-on-primary rounded-xl font-heading text-sm font-semibold hover:bg-primary-container transition-all active:scale-[0.98] organic-shadow"
          >
            Filter Producers
          </button>
        </form>
      </div>

      {/* Farmers Grid */}
      {farmers.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-3xl p-16 text-center organic-shadow border border-outline-variant/10">
          <div className="w-16 h-16 rounded-full bg-on-secondary-container text-secondary-container flex items-center justify-center mx-auto mb-4 organic-shadow">
            <span className="material-symbols-outlined text-3xl"><MdAgriculture /></span>
          </div>
          <h3 className="font-heading text-2xl font-bold text-on-surface mb-2">No farmers found</h3>
          <p className="text-on-surface-variant max-w-sm mx-auto mb-6">
            Try adjusting your search criteria to discover local growers in other areas.
          </p>
          <Link
            href="/farmers"
            className="inline-block px-6 py-3 bg-primary text-on-primary rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Show All Farmers
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farmers.map((farmer) => (
            <div
              key={farmer.userId}
              className="group relative bg-white rounded-2xl overflow-hidden organic-shadow border border-outline-variant/10 transition-all hover:-translate-y-1 flex flex-col"
            >
              {/* Header Banner & Avatar */}
              <div className="h-32 bg-linear-to-r from-primary to-primary-container relative p-4 flex items-start justify-between overflow-hidden">
                {farmer.bannerImage || farmer.farmImage ? (
                  <>
                    <img
                      src={farmer.bannerImage || farmer.farmImage}
                      alt={farmer.farmName}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                  </>
                ) : null}
                <div className="flex gap-2 relative z-10">
                  <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold shadow-sm capitalize">
                    {farmer.farmingMethod}
                  </span>
                  {farmer.isVerified && (
                    <span className="px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold shadow-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]"><MdVerified /></span> Verified
                    </span>
                  )}
                </div>
              </div>

              {/* Avatar circle floating over banner */}
              <div className="px-6 -mt-12 relative z-10 flex justify-between items-end mb-3">
                <div className="w-20 h-20 rounded-full bg-primary text-on-primary border-4 border-white font-heading font-extrabold text-3xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform overflow-hidden shrink-0">
                  {farmer.farmImage ? (
                    <img
                      src={farmer.farmImage}
                      alt={farmer.farmName}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    farmer.farmName.charAt(0)
                  )}
                </div>
                <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  <span className="material-symbols-outlined text-amber-500 text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    <FaStar />
                  </span>
                  <span className="text-xs font-bold text-amber-900">{farmer.rating.toFixed(1)}</span>
                </div>
              </div>

              <div className="px-6 pb-6 flex-1 flex flex-col">
                <h3 className="font-heading text-xl font-bold text-primary mb-1 group-hover:text-primary-container transition-colors">
                  {farmer.farmName}
                </h3>
                <div className="flex items-center text-on-surface-variant text-xs mb-3">
                  <span className="material-symbols-outlined text-[16px] mr-1 text-outline"></span>
                  {farmer.farmLocation}, {farmer.state}
                </div>

                <p className="text-sm text-on-surface-variant line-clamp-2 mb-4 italic">
                  &ldquo;{farmer.description}&rdquo;
                </p>

                {/* Crops Badges */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {farmer.cropTypes.slice(0, 3).map((crop) => (
                    <span
                      key={crop}
                      className="px-2.5 py-1 bg-surface-container-low text-on-surface-variant text-xs font-medium rounded-lg"
                    >
                      {crop}
                    </span>
                  ))}
                  {farmer.cropTypes.length > 3 && (
                    <span className="px-2 py-1 bg-surface-container-low text-outline text-xs font-medium rounded-lg">
                      +{farmer.cropTypes.length - 3} more
                    </span>
                  )}
                </div>

                <Link
                  href={`/farmers/${farmer.userId}`}
                  className="mt-auto w-full py-3 rounded-xl bg-primary text-on-primary font-heading text-sm font-semibold text-center transition-all hover:bg-primary-container active:scale-[0.98] organic-shadow"
                >
                  View Farm Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
