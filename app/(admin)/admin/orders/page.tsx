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
    { id: "all", label: "All", count: allOrders.length },
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Order Monitoring
        </h1>
        <p className="text-gray-500 mt-1">
          Track and manage all marketplace orders across farmers and consumers.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        {/* Tabs */}
        <div className="border-b border-gray-100 flex overflow-x-auto">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={`/admin/orders?status=${tab.id}`}
              className={`flex items-center px-5 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                currentStatus === tab.id
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
              <span
                className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                  currentStatus === tab.id
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {tab.count}
              </span>
            </Link>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-4 font-semibold">Order Info</th>
                <th className="px-6 py-4 font-semibold">Parties</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayedOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No orders found.
                  </td>
                </tr>
              ) : (
                displayedOrders.map((order) => {
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          #{order.id.split("-")[0]}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {order.items.length} items
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <span className="text-gray-500 text-xs uppercase tracking-wider block mb-0.5">
                            Consumer
                          </span>
                          <span className="font-medium text-gray-900">
                            {order.consumerName}
                          </span>
                        </div>
                        <div className="text-sm mt-2">
                          <span className="text-gray-500 text-xs uppercase tracking-wider block mb-0.5">
                            Farmer
                          </span>
                          <span className="font-medium text-gray-900">
                            {order.farmerName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          ₹{order.totalAmount.toLocaleString("en-IN")}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-sm font-medium text-emerald-600 hover:text-emerald-800">
                          View
                        </button>
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

function StatusBadge({ status }: { status: OrderStatus }) {
  const styles: Record<OrderStatus, string> = {
    pending: "bg-amber-100 text-amber-800",
    confirmed: "bg-blue-100 text-blue-800",
    packed: "bg-purple-100 text-purple-800",
    shipped: "bg-cyan-100 text-cyan-800",
    delivered: "bg-emerald-100 text-emerald-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${styles[status]}`}
    >
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}
