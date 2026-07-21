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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Welcome back. Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Farmers" value={stats.totalFarmers.toString()} subtitle={`${stats.verifiedFarmers} verified`} icon="👨‍🌾" color="blue" />
        <StatCard title="Total Consumers" value={stats.totalConsumers.toString()} icon="👥" color="purple" />
        <StatCard title="Total Orders" value={stats.totalOrders.toString()} icon="📦" color="emerald" />
        <StatCard title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString("en-IN")}`} icon="💰" color="amber" />
        <StatCard title="Fulfilment Rate" value={`${stats.orderFulfilmentRate.toFixed(1)}%`} icon="✅" color="indigo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pending Farmers */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-[500px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Pending Approvals</h2>
            <Link href="/admin/farmers" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">View all</Link>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {pendingFarmers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 text-sm">
                <span className="text-3xl mb-2">🎉</span>
                All caught up!
              </div>
            ) : (
              pendingFarmers.map(farmer => (
                <div key={farmer.userId} className="p-4 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                  <div className="font-medium text-gray-900">{farmer.farmName}</div>
                  <div className="text-xs text-gray-500 mb-3">{farmer.farmLocation}</div>
                  <div className="flex gap-2">
                    <Link href={`/admin/farmers`} className="flex-1 text-center bg-emerald-600 text-white text-xs py-2 rounded-md hover:bg-emerald-700 transition-colors font-medium">
                      Review
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-[500px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">View all</Link>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 font-semibold rounded-tl-lg">Order ID</th>
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold rounded-tr-lg">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">#{order.id.slice(-6)}</td>
                    <td className="px-4 py-3 text-gray-600">{order.consumerName}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">₹{order.totalAmount.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                        order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-6 md:items-center justify-around">
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">Average Order Value</div>
          <div className="text-2xl font-bold text-gray-900">₹{stats.averageOrderValue.toFixed(2)}</div>
        </div>
        <div className="hidden md:block w-px h-12 bg-gray-200"></div>
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">Repeat Customer Rate</div>
          <div className="text-2xl font-bold text-gray-900">{stats.repeatCustomerRate.toFixed(1)}%</div>
        </div>
        <div className="hidden md:block w-px h-12 bg-gray-200"></div>
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">Total Pending Approvals</div>
          <div className="text-2xl font-bold text-gray-900">{stats.pendingApprovals}</div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon, color }: { title: string, value: string, subtitle?: string, icon: string, color: string }) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    indigo: 'bg-indigo-50 text-indigo-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="text-sm font-medium text-gray-500">{title}</div>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${colorMap[color]}`}>
          {icon}
        </div>
      </div>
      <div className="mt-auto">
        <div className="text-2xl font-bold text-gray-900 tracking-tight">{value}</div>
        {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
      </div>
    </div>
  );
}
