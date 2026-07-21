import { getSession } from "@/lib/auth/session";
import { getOrdersByFarmer } from "@/lib/data/orders";
import Link from "next/link";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, OrderStatus, ORDER_STATUS_FLOW } from "@/lib/types";
import { updateOrderStatusAction } from "./actions";
import { cookies } from "next/headers";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await cookies();
  const session = await getSession();
  if (!session) return null;

  const resolvedSearchParams = await searchParams;
  const statusFilter = resolvedSearchParams.status;
  
  let orders = await getOrdersByFarmer(session.userId);
  
  if (statusFilter && statusFilter !== 'all') {
    orders = orders.filter(o => o.status === statusFilter);
  }

  // Sort by newest first
  orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const tabs = ['all', 'pending', 'confirmed', 'packed', 'shipped', 'delivered'];

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const currentIndex = ORDER_STATUS_FLOW.indexOf(currentStatus);
    if (currentIndex >= 0 && currentIndex < ORDER_STATUS_FLOW.length - 1) {
      return ORDER_STATUS_FLOW[currentIndex + 1];
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and track your customer orders.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 flex overflow-x-auto gap-2">
        {tabs.map(tab => {
          const isActive = (statusFilter || 'all') === tab;
          return (
            <Link 
              key={tab} 
              href={`/dashboard/orders${tab === 'all' ? '' : `?status=${tab}`}`}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                isActive 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Link>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Items</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-4xl mb-3">🛒</span>
                      <p className="text-lg font-medium text-gray-700 mb-1">No orders found</p>
                      <p className="text-sm">When you receive orders, they will appear here.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const nextStatus = getNextStatus(order.status);
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <Link href={`/dashboard/orders/${order.id}`} className="text-emerald-600 hover:underline font-medium">
                          #{order.id.split('-')[0]}
                        </Link>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">{order.consumerName}</td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-gray-500">
                          {order.items.length} items
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">₹{order.totalAmount}</td>
                      <td className="px-6 py-4">
                        <span 
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: ORDER_STATUS_COLORS[order.status] + '20',
                            color: ORDER_STATUS_COLORS[order.status]
                          }}
                        >
                          {ORDER_STATUS_LABELS[order.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link href={`/dashboard/orders/${order.id}`} className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors">
                            View
                          </Link>
                          {nextStatus && (
                            <form action={async () => {
                              "use server";
                              await updateOrderStatusAction(order.id, nextStatus);
                            }}>
                              <button type="submit" className="text-emerald-600 hover:text-emerald-800 font-medium text-sm transition-colors">
                                Mark {ORDER_STATUS_LABELS[nextStatus]}
                              </button>
                            </form>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
