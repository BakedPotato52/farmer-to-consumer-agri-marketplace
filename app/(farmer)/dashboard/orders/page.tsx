import { getSession } from "@/lib/auth/session";
import { getOrdersByFarmer } from "@/lib/data/orders";
import Link from "next/link";
import {
  ORDER_STATUS_LABELS,
  OrderStatus,
  ORDER_STATUS_FLOW,
} from "@/lib/types";
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

  if (statusFilter && statusFilter !== "all") {
    orders = orders.filter((o) => o.status === statusFilter);
  }

  orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const tabs = [
    "all",
    "pending",
    "confirmed",
    "packed",
    "shipped",
    "delivered",
  ];

  const statusBadgeStyle: Record<string, string> = {
    pending: "bg-amber-100 text-amber-900 border-amber-200",
    confirmed: "bg-secondary-container text-on-secondary-container border-secondary/20",
    packed: "bg-purple-100 text-purple-900 border-purple-200",
    shipped: "bg-sky-100 text-sky-900 border-sky-200",
    delivered: "bg-primary text-on-primary",
    cancelled: "bg-error-container text-on-error-container border-error/20",
  };

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const currentIndex = ORDER_STATUS_FLOW.indexOf(currentStatus);
    if (currentIndex >= 0 && currentIndex < ORDER_STATUS_FLOW.length - 1) {
      return ORDER_STATUS_FLOW[currentIndex + 1];
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-card p-6 md:p-8 rounded-3xl organic-shadow">
        <h1 className="font-heading text-3xl font-extrabold text-primary">Orders Management</h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Track customer orders, fulfill shipments, and update status workflow ({orders.length} orders listed).
        </p>
      </div>

      {/* Tabs Filter Bar */}
      <div className="glass-card p-2 rounded-2xl organic-shadow flex overflow-x-auto gap-2">
        {tabs.map((tab) => {
          const isActive = (statusFilter || "all") === tab;
          return (
            <Link
              key={tab}
              href={`/dashboard/orders${tab === "all" ? "" : `?status=${tab}`}`}
              className={`px-5 py-2.5 rounded-xl font-heading text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                isActive
                  ? "bg-secondary-container text-on-secondary-container shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-container-high/50"
              }`}
            >
              {tab}
            </Link>
          );
        })}
      </div>

      {/* Table */}
      <div className="glass-card organic-shadow rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-on-surface">
            <thead className="bg-surface-container-low text-xs font-bold text-outline uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Items Summary</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-outline italic">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <span className="material-symbols-outlined text-4xl text-outline">shopping_cart</span>
                      <p className="font-heading font-bold text-on-surface">No orders in this category</p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const nextStatus = getNextStatus(order.status);
                  return (
                    <tr key={order.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-bold text-primary">
                        <Link href={`/dashboard/orders/${order.id}`} className="hover:underline">
                          #{order.id.slice(-6).toUpperCase()}
                        </Link>
                      </td>
                      <td className="px-6 py-4 font-semibold text-on-surface">{order.consumerName}</td>
                      <td className="px-6 py-4 text-xs text-on-surface-variant">
                        {order.items.length} {order.items.length === 1 ? "item" : "items"}
                      </td>
                      <td className="px-6 py-4 font-heading font-bold text-primary">₹{order.totalAmount}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            statusBadgeStyle[order.status] || "bg-surface-container text-on-surface"
                          }`}
                        >
                          {ORDER_STATUS_LABELS[order.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-outline">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/orders/${order.id}`}
                            className="px-3 py-1.5 rounded-lg border border-outline-variant/30 text-xs font-semibold text-primary hover:bg-primary/5 transition-colors"
                          >
                            Details
                          </Link>
                          {nextStatus && (
                            <form
                              action={async () => {
                                "use server";
                                await updateOrderStatusAction(order.id, nextStatus);
                              }}
                            >
                              <button
                                type="submit"
                                className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-all active:scale-[0.98] shadow-sm"
                              >
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
