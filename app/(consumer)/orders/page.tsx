import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { getOrdersByConsumer } from "@/lib/data/orders";

export default async function OrdersPage() {
  const session = await getSession();
  
  if (!session || session.role !== "consumer") {
    redirect("/login");
  }

  const orders = await getOrdersByConsumer(session.userId);

  const statusColors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    packed: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    shipped: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
    delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No orders yet</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
            You haven't placed any orders. Discover fresh, local produce and support your community farmers!
          </p>
          <Link 
            href="/products"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-all hover:shadow-lg"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
            
            return (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-inner">
                        🛍️
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          Order #{order.id.slice(-6).toUpperCase()}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                    </div>
                    
                    <div className={`px-3 py-1.5 rounded-lg text-sm font-bold uppercase tracking-wider ${statusColors[order.status] || "bg-gray-100 text-gray-800"}`}>
                      {order.status}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Farmer</div>
                      <div className="font-medium text-gray-900 dark:text-white">{order.farmerName}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Items</div>
                      <div className="font-medium text-gray-900 dark:text-white">{itemCount} items</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Total Amount</div>
                      <div className="font-bold text-emerald-600 dark:text-emerald-400 text-lg">₹{order.totalAmount.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/30 px-6 py-3 flex justify-between items-center text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700">
                  View Order Details
                  <span>→</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
