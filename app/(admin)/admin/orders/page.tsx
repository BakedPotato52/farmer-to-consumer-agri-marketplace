import { getAllOrders } from "@/lib/data/orders";
import {
  ORDER_STATUS_FLOW,
  ORDER_STATUS_LABELS,
  OrderStatus,
} from "@/lib/types";
import Link from "next/link";

export default async function OrdersManagement({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const resolvedParams = await searchParams;
  const currentStatus = resolvedParams.status || "all";

  const allOrders = await getAllOrders();

  const displayedOrders =
    currentStatus === "all"
      ? allOrders
      : allOrders.filter((o) => o.status === currentStatus);

  const statusCounts = allOrders.reduce(
    (acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const tabs = [
    { id: "all", label: "All Orders", count: allOrders.length },
    ...ORDER_STATUS_FLOW.map((status) => ({
      id: status,
      label: ORDER_STATUS_LABELS[status],
      count: statusCounts[status] || 0,
    })),
    {
      id: "cancelled",
      label: "Cancelled",
      count: statusCounts["cancelled"] || 0,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Card */}
      <div className="glass-card p-6 md:p-8 rounded-3xl organic-shadow">
        <h1 className="font-heading text-3xl font-extrabold text-primary">Global Order Monitoring</h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Oversee platform transaction activity, fulfillment progress, and multi-merchant logistics ({allOrders.length} total orders).
        </p>
      </div>

      <div className="glass-card organic-shadow rounded-3xl overflow-hidden flex flex-col">
        {/* Tabs Bar */}
        <div className="p-3 bg-surface-container-low border-b border-outline-variant/10 flex overflow-x-auto gap-2">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={`/admin/orders?status=${tab.id}`}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                currentStatus === tab.id
                  ? "bg-secondary-container text-on-secondary-container shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-container-high/50"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`py-0.5 px-2 rounded-full text-[10px] font-extrabold ${
                  currentStatus === tab.id
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-high text-outline"
                }`}
              >
                {tab.count}
              </span>
            </Link>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-on-surface">
            <thead className="bg-surface-container-low text-xs font-bold text-outline uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Order ID & Items</th>
                <th className="px-6 py-4">Parties</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date Placed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {displayedOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-outline italic">
                    No orders found in this category.
                  </td>
                </tr>
              ) : (
                displayedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {order.items[0]?.image ? (
                          <img
                            src={order.items[0].image}
                            alt={order.items[0].productName}
                            className="w-10 h-10 object-cover rounded-xl border border-outline-variant/15 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                            #{order.id.slice(-3).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-mono font-bold text-primary text-sm">
                            #{order.id.slice(-6).toUpperCase()}
                          </div>
                          <div className="text-xs text-outline mt-0.5">
                            {order.items.length} {order.items.length === 1 ? "item" : "items"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 space-y-1">
                      <div className="text-xs">
                        <span className="text-outline uppercase font-bold text-[10px] block">Buyer:</span>
                        <span className="font-semibold text-on-surface">{order.consumerName}</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-outline uppercase font-bold text-[10px] block">Farmer:</span>
                        <span className="font-semibold text-primary">{order.farmerName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-heading font-bold text-primary text-base">
                      ₹{order.totalAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
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

function StatusBadge({ status }: { status: OrderStatus }) {
  const styles: Record<OrderStatus, string> = {
    pending: "bg-amber-100 text-amber-900 border-amber-200",
    confirmed: "bg-secondary-container text-on-secondary-container border-secondary/20",
    packed: "bg-purple-100 text-purple-900 border-purple-200",
    shipped: "bg-sky-100 text-sky-900 border-sky-200",
    delivered: "bg-primary text-on-primary border-primary",
    cancelled: "bg-error-container text-on-error-container border-error/20",
  };

  return (
    <span
      className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${styles[status]}`}
    >
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}
