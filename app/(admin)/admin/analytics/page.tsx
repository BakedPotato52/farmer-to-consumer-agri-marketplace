import { 
  getPlatformStats, 
  getTopFarmers, 
  getTopProducts, 
  getCategoryDistribution, 
  getOrderTrends 
} from "@/lib/data/analytics";
import { CATEGORY_ICONS } from "@/lib/types";

export default async function PlatformAnalytics() {
  const [
    stats, 
    topFarmers, 
    topProducts, 
    categoryDist, 
    orderTrends
  ] = await Promise.all([
    getPlatformStats(),
    getTopFarmers(),
    getTopProducts(),
    getCategoryDistribution(),
    getOrderTrends()
  ]);

  const maxCategoryRevenue = Math.max(...categoryDist.map(c => c.revenue), 1);
  const maxTrendRevenue = Math.max(...orderTrends.map(t => t.revenue), 1);

  return (
    <div className="space-y-8 animate-in fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Platform Analytics</h1>
        <p className="text-gray-500 mt-1">Deep dive into marketplace performance metrics.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} change="+12.5%" />
        <KpiCard title="Avg Order Value" value={`₹${stats.averageOrderValue.toFixed(0)}`} change="+3.2%" />
        <KpiCard title="Fulfilment Rate" value={`${stats.orderFulfilmentRate.toFixed(1)}%`} change="-1.4%" negative />
        <KpiCard title="Repeat Customers" value={`${stats.repeatCustomerRate.toFixed(1)}%`} change="+5.8%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Trends */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Revenue Trends (Last 6 Months)</h2>
          <div className="flex-1 flex items-end gap-2 h-64 mt-auto">
            {orderTrends.map((trend, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div 
                  className="w-full bg-emerald-500 rounded-t-sm transition-all duration-500 relative group-hover:bg-emerald-600"
                  style={{ height: `${(trend.revenue / maxTrendRevenue) * 100}%`, minHeight: '4px' }}
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-10 transition-opacity">
                    ₹{trend.revenue.toLocaleString()}
                  </div>
                </div>
                <div className="text-xs text-gray-500">{trend.month}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Revenue by Category</h2>
          <div className="space-y-5 flex-1 justify-center flex flex-col">
            {categoryDist.map((cat, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700 capitalize flex items-center gap-1.5">
                    {CATEGORY_ICONS[cat.category as keyof typeof CATEGORY_ICONS] || "📦"} {cat.category}
                  </span>
                  <span className="font-semibold text-gray-900">₹{cat.revenue.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-2.5 rounded-full" 
                    style={{ width: `${(cat.revenue / maxCategoryRevenue) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Top Farmers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Top Performing Farmers</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3 font-semibold">Rank</th>
                  <th className="px-6 py-3 font-semibold">Farmer Name</th>
                  <th className="px-6 py-3 font-semibold text-right">Revenue</th>
                  <th className="px-6 py-3 font-semibold text-center">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topFarmers.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-500">#{i + 1}</td>
                    <td className="px-6 py-3 font-medium text-gray-900">{item.farmer.user.name}</td>
                    <td className="px-6 py-3 font-medium text-gray-900 text-right">₹{item.revenue.toLocaleString()}</td>
                    <td className="px-6 py-3 text-center">
                      <span className="inline-flex items-center text-amber-500 font-medium">
                        {item.farmer.rating.toFixed(1)} ★
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Top Selling Products</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3 font-semibold">Product</th>
                  <th className="px-6 py-3 font-semibold">Category</th>
                  <th className="px-6 py-3 font-semibold text-right">Orders</th>
                  <th className="px-6 py-3 font-semibold text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topProducts.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">{item.product.name}</td>
                    <td className="px-6 py-3 text-gray-600 capitalize">
                      {CATEGORY_ICONS[item.product.category as keyof typeof CATEGORY_ICONS]} {item.product.category}
                    </td>
                    <td className="px-6 py-3 text-right text-gray-600">{item.orders}</td>
                    <td className="px-6 py-3 font-medium text-emerald-600 text-right">₹{item.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, change, negative = false }: { title: string, value: string, change: string, negative?: boolean }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="text-sm font-medium text-gray-500 mb-1">{title}</div>
      <div className="flex items-end justify-between">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className={`text-xs font-medium px-2 py-0.5 rounded ${
          negative 
            ? 'bg-red-50 text-red-600' 
            : 'bg-emerald-50 text-emerald-600'
        }`}>
          {change}
        </div>
      </div>
    </div>
  );
}
