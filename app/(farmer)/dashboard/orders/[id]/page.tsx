import { getOrderById } from "@/lib/data/orders";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  OrderStatus,
  ORDER_STATUS_FLOW,
} from "@/lib/types";
import { updateOrderStatusAction } from "../actions";
import { cookies } from "next/headers";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await cookies();
  const session = await getSession();
  if (!session || session.role !== "farmer") {
    redirect("/login");
  }

  const { id } = await params;
  const order = await getOrderById(id);

  if (!order || order.farmerId !== session.userId) {
    notFound();
  }

  const currentIndex = ORDER_STATUS_FLOW.indexOf(order.status);
  const nextStatus =
    currentIndex >= 0 && currentIndex < ORDER_STATUS_FLOW.length - 1
      ? ORDER_STATUS_FLOW[currentIndex + 1]
      : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/orders"
            className="text-gray-500 hover:text-gray-900 transition-colors"
          >
            ← Back to Orders
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Order #{order.id.split("-")[0]}
          </h1>
          <span
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: ORDER_STATUS_COLORS[order.status] + "20",
              color: ORDER_STATUS_COLORS[order.status],
            }}
          >
            {ORDER_STATUS_LABELS[order.status]}
          </span>
        </div>

        {nextStatus && (
          <form
            action={async () => {
              "use server";
              await updateOrderStatusAction(order.id, nextStatus);
            }}
          >
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
            >
              Mark as {ORDER_STATUS_LABELS[nextStatus]}
            </button>
          </form>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Order Items</h2>
            </div>
            <ul className="divide-y divide-gray-100">
              {order.items.map((item, idx) => (
                <li
                  key={idx}
                  className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-emerald-50 rounded-lg flex items-center justify-center text-2xl">
                      📦
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {item.productName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item.quantity} {item.unit} × ₹{item.pricePerUnit}
                      </p>
                    </div>
                  </div>
                  <div className="font-bold text-gray-900">
                    ₹{item.totalPrice}
                  </div>
                </li>
              ))}
            </ul>
            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                <span>Total Amount</span>
                <span className="text-emerald-700">₹{order.totalAmount}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">
                Order Timeline
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {ORDER_STATUS_FLOW.map((status, index) => {
                  const isCompleted =
                    ORDER_STATUS_FLOW.indexOf(order.status) >= index;
                  const isCurrent = order.status === status;

                  if (
                    order.status === "cancelled" &&
                    status !== "cancelled" &&
                    status !== "pending"
                  ) {
                    return null; // Skip if cancelled
                  }

                  return (
                    <div key={status} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10 ${
                            isCompleted
                              ? "bg-emerald-500 text-white"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {isCompleted ? "✓" : index + 1}
                        </div>
                        {index < ORDER_STATUS_FLOW.length - 1 && (
                          <div
                            className={`w-0.5 h-full my-1 ${
                              ORDER_STATUS_FLOW.indexOf(order.status) > index
                                ? "bg-emerald-500"
                                : "bg-gray-200"
                            }`}
                          ></div>
                        )}
                      </div>
                      <div className="pb-8">
                        <h4
                          className={`font-semibold ${isCompleted ? "text-gray-900" : "text-gray-500"}`}
                        >
                          {ORDER_STATUS_LABELS[status]}
                        </h4>
                        {isCurrent && (
                          <p className="text-sm text-gray-500 mt-1">
                            Current Status
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">
                Customer Details
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500 font-medium">Name</p>
                <p className="font-semibold text-gray-900">
                  {order.consumerName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Delivery Address
                </p>
                <p className="text-gray-900 whitespace-pre-line">
                  {order.deliveryAddress}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">
                Delivery Information
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500 font-medium">Date</p>
                <p className="font-semibold text-gray-900">
                  {new Date(order.deliveryDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Time Slot</p>
                <p className="font-semibold text-gray-900">
                  {order.deliverySlot}
                </p>
              </div>
              {order.notes && (
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Order Notes
                  </p>
                  <p className="text-gray-900 italic bg-amber-50 p-3 rounded-lg text-sm mt-1">
                    {order.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
