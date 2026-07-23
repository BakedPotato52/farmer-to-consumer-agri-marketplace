import {
  getPlatformStats,
  getTopFarmers,
  getTopProducts,
  getCategoryDistribution,
  getOrderTrends,
} from "@/lib/data/analytics";
import { CATEGORY_ICONS } from "@/lib/types";

export default async function PlatformAnalytics() {
  const [stats, topFarmers, topProducts, categoryDist, orderTrends] =
    await Promise.all([
      getPlatformStats(),
      getTopFarmers(),
      getTopProducts(),
      getCategoryDistribution(),
      getOrderTrends(),
    ]);

  const maxCategoryRevenue = Math.max(...categoryDist.map((c) => c.revenue), 1);
  const maxTrendRevenue = Math.max(...orderTrends.map((t) => t.revenue), 1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-card p-6 md:p-8 rounded-3xl organic-shadow">
        <h1 className="font-heading text-3xl font-extrabold text-primary">Financial & Platform Analytics</h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Deep-dive telemetry into revenue breakdown, farmer performance rankings, and category growth trends.
        </p>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Total Gross Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          change="+12.5% MoM"
          icon="payments"
        />
        <KpiCard
          title="Avg Order Value (AOV)"
          value={`₹${stats.averageOrderValue.toFixed(0)}`}
          change="+3.2% vs last month"
          icon="shopping_bag"
        />
        <KpiCard
          title="Fulfillment Rate"
          value={`${stats.orderFulfilmentRate.toFixed(1)}%`}
          change="Optimal performance"
          icon="task_alt"
        />
        <KpiCard
          title="Repeat Buyers"
          value={`${stats.repeatCustomerRate.toFixed(1)}%`}
          change="+5.8% Retention"
          icon="groups"
        />
      </div>

      {/* Visual Graphs Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Trends Bar Graph */}
        <div className="glass-card organic-shadow rounded-3xl p-8 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-heading text-xl font-bold text-primary">Revenue Trends</h2>
              <p className="text-on-surface-variant text-xs font-medium">Monthly revenue performance (6 Months)</p>
            </div>
            <span className="text-xs font-bold text-outline uppercase bg-surface-container-low px-3 py-1 rounded-lg">
              Historical
            </span>
          </div>

          <div className="flex-1 flex items-end gap-3 h-56 pt-4">
            {orderTrends.map((trend, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div
                  className="w-full bg-primary/20 hover:bg-primary rounded-t-xl transition-all duration-300 relative"
                  style={{
                    height: `${(trend.revenue / maxTrendRevenue) * 100}%`,
                    minHeight: "12px",
                  }}
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-on-primary text-[10px] font-bold py-1 px-2 rounded-lg whitespace-nowrap z-10 transition-opacity">
                    ₹{trend.revenue.toLocaleString()}
                  </div>
                </div>
                <span className="text-xs font-bold text-outline">{trend.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Revenue Distribution Bars */}
        <div className="glass-card organic-shadow rounded-3xl p-8 flex flex-col justify-between">
          <div className="mb-6">
            <h2 className="font-heading text-xl font-bold text-primary">Revenue by Category</h2>
            <p className="text-on-surface-variant text-xs font-medium">Distribution across produce categories</p>
          </div>

          <div className="space-y-4 flex-1 justify-center flex flex-col">
            {categoryDist.map((cat, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-on-surface capitalize flex items-center gap-1.5">
                    <span className="text-lg">
                      {CATEGORY_ICONS[cat.category as keyof typeof CATEGORY_ICONS] || "📦"}
                    </span>
                    {cat.category}
                  </span>
                  <span className="text-primary font-heading font-extrabold">₹{cat.revenue.toLocaleString()}</span>
                </div>
                <div className="w-full bg-surface-container-high rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-primary h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${(cat.revenue / maxCategoryRevenue) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performers Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Top Farmers */}
        <div className="glass-card organic-shadow rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-outline-variant/10">
            <h2 className="font-heading text-lg font-bold text-primary">Top Performing Farmers</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-on-surface">
              <thead className="bg-surface-container-low text-xs font-bold text-outline uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Rank</th>
                  <th className="px-6 py-4">Farmer</th>
                  <th className="px-6 py-4 text-right">Revenue</th>
                  <th className="px-6 py-4 text-center">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {topFarmers.map((item, i) => (
                  <tr key={i} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-outline">#{i + 1}</td>
                    <td className="px-6 py-4 font-heading font-bold text-primary">{item.farmer.user.name}</td>
                    <td className="px-6 py-4 font-heading font-bold text-primary text-right">
                      ₹{item.revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-amber-500 text-xs">
                      {item.farmer.rating.toFixed(1)} ★
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="glass-card organic-shadow rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-outline-variant/10">
            <h2 className="font-heading text-lg font-bold text-primary">Top Selling Harvest Items</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-on-surface">
              <thead className="bg-surface-container-low text-xs font-bold text-outline uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-right">Orders</th>
                  <th className="px-6 py-4 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {topProducts.map((item, i) => (
                  <tr key={i} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-4 font-heading font-bold text-primary">{item.product.name}</td>
                    <td className="px-6 py-4 text-xs font-medium text-on-surface-variant capitalize">
                      {CATEGORY_ICONS[item.product.category as keyof typeof CATEGORY_ICONS]} {item.product.category}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold">{item.orders}</td>
                    <td className="px-6 py-4 font-heading font-bold text-primary text-right">
                      ₹{item.revenue.toLocaleString()}
                    </td>
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

function KpiCard({
  title,
  value,
  change,
  icon,
}: {
  title: string;
  value: string;
  change: string;
  icon: string;
}) {
  return (
    <div className="glass-card organic-shadow rounded-3xl p-6 flex flex-col justify-between hover:translate-y-[-2px] transition-all">
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs font-bold text-outline uppercase tracking-wider">{title}</span>
        <div className="w-9 h-9 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center">
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
      </div>
      <div>
        <div className="font-heading text-2xl font-extrabold text-primary tracking-tight">{value}</div>
        <div className="text-[11px] font-bold text-secondary mt-1">{change}</div>
      </div>
    </div>
  );
}
