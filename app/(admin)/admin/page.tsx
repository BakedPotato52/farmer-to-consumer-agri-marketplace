import { getPlatformStats } from "@/lib/data/analytics";
import { getAllOrders } from "@/lib/data/orders";
import { getPendingFarmers } from "@/lib/data/farmers";
import Link from "next/link";

export default async function AdminOverview() {
  const stats = await getPlatformStats();
  const allOrders = await getAllOrders();
  const pendingFarmers = await getPendingFarmers();

  const recentOrders = allOrders.slice(0, 10);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="glass-card p-6 md:p-8 rounded-3xl organic-shadow">
        <h1 className="font-heading text-3xl font-extrabold text-primary tracking-tight">
          Super Admin Control Center
        </h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Monitor platform metrics, approve new farmer merchants, and oversee global order fulfillment.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Farmers"
          value={stats.totalFarmers.toString()}
          subtitle={`${stats.verifiedFarmers} Verified`}
          icon="agriculture"
        />
        <StatCard
          title="Total Consumers"
          value={stats.totalConsumers.toString()}
          subtitle="Registered Buyers"
          icon="group"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders.toString()}
          subtitle="Placed Orders"
          icon="local_shipping"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString("en-IN")}`}
          subtitle="Gross Value"
          icon="payments"
        />
        <StatCard
          title="Fulfilment Rate"
          value={`${stats.orderFulfilmentRate.toFixed(1)}%`}
          subtitle="Success Rate"
          icon="verified"
        />
      </div>

      {/* Main Grid: Pending Approvals & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Pending Farmers */}
        <div className="lg:col-span-4 glass-card organic-shadow rounded-3xl p-6 flex flex-col h-[480px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-heading text-xl font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
              Pending Approvals
            </h2>
            <Link
              href="/admin/farmers"
              className="text-xs font-bold text-primary hover:underline"
            >
              View All ({pendingFarmers.length})
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-3">
            {pendingFarmers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-outline text-xs text-center space-y-2">
                <span className="material-symbols-outlined text-4xl">check_circle</span>
                <p className="font-heading font-bold text-on-surface text-sm">All caught up!</p>
                <p>No new farmer registration requests pending.</p>
              </div>
            ) : (
              pendingFarmers.map((farmer) => (
                <div
                  key={farmer.userId}
                  className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/15 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-primary text-sm">{farmer.farmName}</span>
                    <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                      Pending
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    {farmer.farmLocation}, {farmer.state}
                  </p>
                  <Link
                    href="/admin/farmers"
                    className="block w-full text-center py-2 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-primary-container transition-all"
                  >
                    Review Application
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-8 glass-card organic-shadow rounded-3xl p-6 flex flex-col h-[480px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-heading text-xl font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">orders</span>
              Recent Platform Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-primary hover:underline"
            >
              View All Orders →
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-xs text-left text-on-surface">
              <thead className="bg-surface-container-low text-outline uppercase font-bold tracking-wider sticky top-0">
                <tr>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-primary">
                      #{order.id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-4 py-3 font-semibold">{order.consumerName}</td>
                    <td className="px-4 py-3 font-heading font-bold text-primary">
                      ₹{order.totalAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${
                          order.status === "delivered"
                            ? "bg-secondary-container text-on-secondary-container border-secondary/20"
                            : order.status === "cancelled"
                            ? "bg-error-container text-on-error-container border-error/20"
                            : "bg-amber-100 text-amber-900 border-amber-200"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-outline">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Platform Insights */}
      <div className="glass-card organic-shadow rounded-3xl p-6 flex flex-col md:flex-row gap-6 md:items-center justify-around text-center">
        <div>
          <span className="text-xs font-bold text-outline uppercase tracking-wider block mb-1">Average Order Value</span>
          <span className="font-heading text-2xl font-bold text-primary">
            ₹{stats.averageOrderValue.toFixed(2)}
          </span>
        </div>
        <div className="hidden md:block w-px h-10 bg-outline-variant/20" />
        <div>
          <span className="text-xs font-bold text-outline uppercase tracking-wider block mb-1">Repeat Customer Rate</span>
          <span className="font-heading text-2xl font-bold text-primary">
            {stats.repeatCustomerRate.toFixed(1)}%
          </span>
        </div>
        <div className="hidden md:block w-px h-10 bg-outline-variant/20" />
        <div>
          <span className="text-xs font-bold text-outline uppercase tracking-wider block mb-1">Pending Approvals</span>
          <span className="font-heading text-2xl font-bold text-primary">
            {stats.pendingApprovals}
          </span>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: string;
}) {
  return (
    <div className="glass-card organic-shadow rounded-2xl p-5 flex flex-col justify-between hover:translate-y-[-2px] transition-all">
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs font-bold text-outline uppercase tracking-wider">{title}</span>
        <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-[18px]">{icon}</span>
        </div>
      </div>
      <div>
        <div className="font-heading text-2xl font-bold text-primary tracking-tight">{value}</div>
        {subtitle && <div className="text-[11px] text-outline font-medium mt-0.5">{subtitle}</div>}
      </div>
    </div>
  );
}
