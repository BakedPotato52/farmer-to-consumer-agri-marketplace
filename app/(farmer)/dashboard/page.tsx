import { getSession } from "@/lib/auth/session";
import { getFarmerSalesSummary } from "@/lib/data/analytics";
import { getOrdersByFarmer } from "@/lib/data/orders";
import { getProductsByFarmer } from "@/lib/data/products";
import { getFarmerById } from "@/lib/data/farmers";
import Link from "next/link";
import { cookies } from "next/headers";
import {
  MdAddCircleOutline,
  MdInventory2,
  MdOutlinePayments,
  MdOutlineTrendingUp,
  MdShoppingCart,
} from "react-icons/md";
import { FaStar } from "react-icons/fa6";

export default async function DashboardOverview() {
  await cookies();
  const session = await getSession();
  if (!session) return null;

  const farmerId = session.userId;

  const [salesSummary, orders, products, profile] = await Promise.all([
    getFarmerSalesSummary(farmerId),
    getOrdersByFarmer(farmerId),
    getProductsByFarmer(farmerId),
    getFarmerById(farmerId),
  ]);

  const recentOrders = orders
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  const statusBadgeStyle: Record<string, string> = {
    pending: "bg-amber-100 text-amber-900 border-amber-200",
    confirmed:
      "bg-secondary-container text-on-secondary-container border-secondary/20",
    packed: "bg-purple-100 text-purple-900 border-purple-200",
    shipped: "bg-sky-100 text-sky-900 border-sky-200",
    delivered: "bg-primary text-on-primary",
    cancelled: "bg-error-container text-on-error-container border-error/20",
  };

  const chartData = [
    { day: "Mon", height: "60%" },
    { day: "Tue", height: "85%" },
    { day: "Wed", height: "45%" },
    { day: "Thu", height: "95%", active: true },
    { day: "Fri", height: "70%" },
    { day: "Sat", height: "55%" },
    { day: "Sun", height: "35%" },
  ];

  return (
    <div className="space-y-8">
      {/* ── 4 Hero Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Sales */}
        <div className="glass-card organic-shadow rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-primary-container rounded-xl text-on-primary-container">
              <span className="material-symbols-outlined">
                <MdOutlinePayments />
              </span>
            </div>
            <div className="flex items-center gap-1 text-secondary text-xs font-bold">
              <span className="material-symbols-outlined text-sm">
                <MdOutlineTrendingUp />
              </span>
              <span>+12%</span>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">
              Total Sales
            </p>
            <h3 className="font-heading text-2xl font-extrabold text-primary mt-1">
              ₹{(salesSummary?.totalRevenue || 0).toLocaleString()}
            </h3>
          </div>
        </div>

        {/* Active Orders */}
        <div className="glass-card organic-shadow rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-secondary-container rounded-xl text-on-secondary-container">
              <span className="material-symbols-outlined">
                <MdShoppingCart />
              </span>
            </div>
            <span className="px-2 py-0.5 bg-surface-container-highest rounded text-on-background text-[10px] font-bold uppercase">
              Today
            </span>
          </div>
          <div className="mt-4">
            <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">
              Active Orders
            </p>
            <h3 className="font-heading text-2xl font-extrabold text-primary mt-1">
              {salesSummary?.pendingOrders || 0} orders
            </h3>
          </div>
        </div>

        {/* Total Products */}
        <div className="glass-card organic-shadow rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-tertiary-fixed rounded-xl text-on-tertiary-fixed">
              <span className="material-symbols-outlined">
                <MdInventory2 />
              </span>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">
              Total Products
            </p>
            <h3 className="font-heading text-2xl font-extrabold text-primary mt-1">
              {products.filter((p) => p.isActive).length} items
            </h3>
          </div>
        </div>

        {/* Average Rating */}
        <div className="glass-card organic-shadow rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-amber-100 rounded-xl text-amber-900">
              <span
                className="material-symbols-outlined text-amber-600"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                <FaStar />
              </span>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">
              Average Rating
            </p>
            <h3 className="font-heading text-2xl font-extrabold text-primary mt-1">
              {profile?.rating?.toFixed(1) || "5.0"} stars
            </h3>
          </div>
        </div>
      </div>

      {/* ── Visual Data & Quick Actions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 glass-card organic-shadow rounded-3xl p-8 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="font-heading text-xl font-bold text-primary">
                Sales Performance
              </h4>
              <p className="text-on-surface-variant text-xs font-medium">
                Last 7 days revenue trend
              </p>
            </div>
            <span className="text-xs font-bold text-outline uppercase bg-surface-container-low px-3 py-1 rounded-lg">
              Weekly
            </span>
          </div>

          <div className="flex-1 flex items-end justify-between gap-4 min-h-50 pt-4">
            {chartData.map((item) => (
              <div
                key={item.day}
                className="flex flex-col items-center gap-3 w-full h-full justify-end"
              >
                <div
                  className={`w-full rounded-t-xl transition-all duration-500 ${
                    item.active
                      ? "bg-primary border-2 border-dashed border-primary-fixed shadow-md"
                      : "bg-primary/20 hover:bg-primary"
                  }`}
                  style={{ height: item.height }}
                />
                <span
                  className={`text-xs ${item.active ? "font-bold text-primary" : "text-outline"}`}
                >
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & Low Inventory Alerts */}
        <div className="space-y-6">
          <div className="glass-card organic-shadow rounded-3xl p-6 space-y-4">
            <h4 className="text-xs font-bold text-outline uppercase tracking-wider mb-2">
              Quick Actions
            </h4>
            <Link
              href="/dashboard/products/new"
              className="w-full bg-primary text-on-primary flex items-center justify-center gap-2 py-3.5 rounded-xl font-heading text-sm font-semibold hover:bg-primary-container transition-all active:scale-[0.98] organic-shadow"
            >
              <span className="material-symbols-outlined text-[20px]">
                <MdAddCircleOutline />
              </span>
              Add New Product
            </Link>
            <Link
              href="/dashboard/orders"
              className="w-full border-2 border-primary/20 text-primary flex items-center justify-center gap-2 py-3.5 rounded-xl font-heading text-sm font-semibold hover:bg-primary/5 transition-all active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[20px]">
                <MdShoppingCart />
              </span>
              Manage Orders
            </Link>
          </div>
        </div>
      </div>

      {/* ── Recent Orders Table ── */}
      <div className="glass-card organic-shadow rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
          <h3 className="font-heading text-xl font-bold text-primary">
            Recent Orders
          </h3>
          <Link
            href="/dashboard/orders"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            View all orders →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-on-surface">
            <thead className="bg-surface-container-low text-xs font-bold text-outline uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {recentOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-outline italic"
                  >
                    No recent orders recorded yet.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-surface-container-low/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-xs font-bold text-primary">
                      <Link
                        href={`/dashboard/orders/${order.id}`}
                        className="hover:underline"
                      >
                        #{order.id.slice(-6).toUpperCase()}
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      {order.consumerName}
                    </td>
                    <td className="px-6 py-4 text-xs text-on-surface-variant">
                      {order.items.length} items
                    </td>
                    <td className="px-6 py-4 font-heading font-bold text-primary">
                      ₹{order.totalAmount}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          statusBadgeStyle[order.status] ||
                          "bg-surface-container text-on-surface"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-outline">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
