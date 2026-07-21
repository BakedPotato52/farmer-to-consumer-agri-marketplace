import { getSession } from "@/lib/auth/session";
import { getFarmerSalesSummary } from "@/lib/data/analytics";
import { getOrdersByFarmer } from "@/lib/data/orders";
import { getProductsByFarmer } from "@/lib/data/products";
import { getFarmerById } from "@/lib/data/farmers";
import Link from "next/link";
import { cookies } from "next/headers";

export default async function DashboardOverview() {
  await cookies();
  const session = await getSession();
  if (!session) return null;

  const farmerId = session.userId;
  
  const [salesSummary, orders, products, profile] = await Promise.all([
    getFarmerSalesSummary(farmerId),
    getOrdersByFarmer(farmerId),
    getProductsByFarmer(farmerId),
    getFarmerById(farmerId)
  ]);

  const recentOrders = orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const statusColors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    confirmed: "bg-blue-100 text-blue-800",
    packed: "bg-purple-100 text-purple-800",
    shipped: "bg-cyan-100 text-cyan-800",
    delivered: "bg-emerald-100 text-emerald-800",
    cancelled: "bg-red-100 text-red-800",
  };

  // Mock bar chart data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const chartData = [30, 45, 25, 60, 80, 55]; // Percentages

  return (
    <div className="space-y-6">
      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-lg text-2xl">💰</div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{(salesSummary?.totalRevenue || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-50 rounded-lg text-2xl">📋</div>
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900">{salesSummary?.pendingOrders || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-lg text-2xl">📦</div>
            <div>
              <p className="text-sm font-medium text-gray-500">Active Products</p>
              <p className="text-2xl font-bold text-gray-900">{products.filter(p => p.isActive).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 rounded-lg text-2xl">⭐</div>
            <div>
              <p className="text-sm font-medium text-gray-500">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">{profile?.rating?.toFixed(1) || "0.0"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">Recent Orders</h3>
            <Link href="/dashboard/orders" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Order ID</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Items</th>
                  <th className="px-6 py-3 font-medium">Total</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No orders found.</td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <Link href={`/dashboard/orders/${order.id}`} className="text-emerald-600 hover:underline font-medium">
                          #{order.id.split('-')[0]}
                        </Link>
                      </td>
                      <td className="px-6 py-4">{order.consumerName}</td>
                      <td className="px-6 py-4">{order.items.length} items</td>
                      <td className="px-6 py-4 font-medium">₹{order.totalAmount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions & Chart */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/dashboard/products/new" className="block w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-center rounded-lg font-medium transition-colors">
                + Add New Product
              </Link>
              <Link href="/dashboard/orders" className="block w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-center rounded-lg font-medium transition-colors border border-emerald-200">
                View All Orders
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Monthly Sales</h3>
            <div className="h-48 flex items-end justify-between gap-2 pt-4">
              {chartData.map((h, i) => (
                <div key={i} className="flex flex-col items-center flex-1 gap-2 group">
                  <div className="w-full bg-emerald-100 rounded-t-sm relative flex items-end justify-center group-hover:bg-emerald-200 transition-colors" style={{ height: `100%` }}>
                    <div className="w-full bg-emerald-500 rounded-t-sm transition-all duration-500" style={{ height: `${h}%` }}></div>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">{months[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
