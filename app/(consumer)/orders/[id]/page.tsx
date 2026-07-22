import { notFound } from "next/navigation";
import Link from "next/link";
import { getOrderById } from "@/lib/data/orders";
import { ORDER_STATUS_FLOW } from "@/lib/types";
import ReviewForm from "./ReviewForm";

export default async function OrderDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  const currentStatusIndex = ORDER_STATUS_FLOW.indexOf(order.status);

  const statusIcons: Record<string, string> = {
    pending: "⏳",
    confirmed: "✅",
    packed: "📦",
    shipped: "🚚",
    delivered: "🏠",
    cancelled: "❌",
  };

  return (
    <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/orders"
          className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-2 text-sm font-medium"
        >
          ← Back to Orders
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            Order #{order.id.slice(-6).toUpperCase()}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-xl">
          ₹{order.totalAmount.toFixed(2)}
        </div>
      </div>

      {/* Progress Tracker */}
      {order.status !== "cancelled" && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8 mb-8 overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="flex justify-between items-center relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-700 z-0"></div>
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 z-0 transition-all duration-500"
                style={{
                  width: `${(Math.max(0, currentStatusIndex) / (ORDER_STATUS_FLOW.length - 1)) * 100}%`,
                }}
              ></div>

              {ORDER_STATUS_FLOW.map((status, index) => {
                const isCompleted = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;

                return (
                  <div
                    key={status}
                    className="relative z-10 flex flex-col items-center gap-2"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-colors duration-300 ${
                        isCompleted
                          ? "bg-emerald-500 text-white shadow-md shadow-emerald-200 dark:shadow-none"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                      } ${isCurrent ? "ring-4 ring-emerald-100 dark:ring-emerald-900/50" : ""}`}
                    >
                      {statusIcons[status]}
                    </div>
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        isCompleted
                          ? "text-emerald-700 dark:text-emerald-400"
                          : "text-gray-400"
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {order.status === "cancelled" && (
        <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 border border-red-100 dark:border-red-900/50 mb-8 flex items-center gap-4">
          <div className="text-3xl">❌</div>
          <div>
            <h3 className="font-bold text-red-800 dark:text-red-400 text-lg">
              Order Cancelled
            </h3>
            <p className="text-red-600 dark:text-red-300">
              This order has been cancelled.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Order Items
              </h2>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {order.items.map((item) => (
                <div key={item.productId} className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Link
                        href={`/products/${item.productId}`}
                        className="font-bold text-gray-900 dark:text-white hover:text-emerald-600 transition-colors text-lg"
                      >
                        {item.productName}
                      </Link>
                      <div className="text-sm text-gray-500 mt-1">
                        {item.quantity} × ₹{item.pricePerUnit} / {item.unit}
                      </div>
                    </div>
                    <div className="font-bold text-gray-900 dark:text-white">
                      ₹{item.totalPrice.toFixed(2)}
                    </div>
                  </div>

                  {order.status === "delivered" && (
                    <ReviewForm
                      orderId={order.id}
                      productId={item.productId}
                      farmerId={order.farmerId}
                      productName={item.productName}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Delivery Details */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Delivery Information
            </h2>

            <div className="space-y-4">
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">
                  Address
                </div>
                <div className="text-sm text-gray-900 dark:text-gray-300">
                  {order.deliveryAddress}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">
                  Date & Slot
                </div>
                <div className="text-sm text-gray-900 dark:text-gray-300">
                  {new Date(order.deliveryDate).toLocaleDateString()} <br />
                  {order.deliverySlot}
                </div>
              </div>

              {order.notes && (
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">
                    Notes
                  </div>
                  <div className="text-sm text-gray-900 dark:text-gray-300 italic">
                    {order.notes}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Farmer Details */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Farmer Details
            </h2>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center font-bold text-xl">
                {order.farmerName.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-gray-900 dark:text-white">
                  {order.farmerName}
                </div>
                <Link
                  href={`/farmers/${order.farmerId}`}
                  className="text-sm text-emerald-600 hover:underline"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
