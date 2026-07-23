import { getOrderById } from "@/lib/data/orders";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ORDER_STATUS_LABELS,
  OrderStatus,
  ORDER_STATUS_FLOW,
} from "@/lib/types";
import { updateOrderStatusAction } from "../actions";
import { cookies } from "next/headers";
import { FaArrowLeft, FaUser } from "react-icons/fa6";
import { FaCheckCircle, FaShoppingCart } from "react-icons/fa";
import { MdOutlineLocalShipping } from "react-icons/md";

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

  const statusBadgeStyle: Record<string, string> = {
    pending: "bg-amber-100 text-amber-900 border-amber-200",
    confirmed: "bg-secondary-container text-on-secondary-container border-secondary/20",
    packed: "bg-purple-100 text-purple-900 border-purple-200",
    shipped: "bg-sky-100 text-sky-900 border-sky-200",
    delivered: "bg-primary text-on-primary",
    cancelled: "bg-error-container text-on-error-container border-error/20",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/orders"
            className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]"><FaArrowLeft /></span>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-2xl font-bold text-primary">
                Order #{order.id.slice(-6).toUpperCase()}
              </h1>
              <span
                className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                  statusBadgeStyle[order.status] || "bg-surface-container text-on-surface"
                }`}
              >
                {ORDER_STATUS_LABELS[order.status]}
              </span>
            </div>
            <p className="text-xs text-outline">Placed on {new Date(order.createdAt).toLocaleString()}</p>
          </div>
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
              className="bg-primary text-on-primary px-6 py-3 rounded-xl font-heading text-sm font-semibold hover:bg-primary-container transition-all active:scale-[0.98] organic-shadow flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]"><FaCheckCircle /></span>
              Mark as {ORDER_STATUS_LABELS[nextStatus]}
            </button>
          </form>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Items & Progress Timeline */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass-card organic-shadow rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-outline-variant/10">
              <h2 className="font-heading text-lg font-bold text-primary">Items Ordered</h2>
            </div>
            <ul className="divide-y divide-outline-variant/10">
              {order.items.map((item, idx) => (
                <li key={idx} className="p-6 flex items-center justify-between hover:bg-surface-container-low/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-[24px]"><FaShoppingCart /></span>
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-primary text-base">{item.productName}</h3>
                      <p className="text-xs text-outline">
                        {item.quantity} {item.unit} × ₹{item.pricePerUnit} per {item.unit}
                      </p>
                    </div>
                  </div>
                  <div className="font-heading text-lg font-bold text-primary">
                    ₹{item.totalPrice.toFixed(2)}
                  </div>
                </li>
              ))}
            </ul>
            <div className="p-6 bg-surface-container-low border-t border-outline-variant/10 flex justify-between items-center">
              <span className="font-heading text-lg font-bold text-on-surface">Total Payable</span>
              <span className="font-heading text-2xl font-bold text-primary">₹{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="glass-card organic-shadow rounded-3xl p-6">
            <h2 className="font-heading text-lg font-bold text-primary mb-6">Fulfillment Workflow</h2>
            <div className="space-y-6 pl-2">
              {ORDER_STATUS_FLOW.map((status, index) => {
                const isCompleted = ORDER_STATUS_FLOW.indexOf(order.status) >= index;
                const isCurrent = order.status === status;

                if (order.status === "cancelled" && status !== "cancelled" && status !== "pending") {
                  return null;
                }

                return (
                  <div key={status} className="flex gap-4 items-start relative">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs z-10 transition-colors ${
                          isCompleted
                            ? "bg-primary text-on-primary shadow-sm"
                            : "bg-surface-container-high text-outline"
                        }`}
                      >
                        {isCompleted ? "✓" : index + 1}
                      </div>
                    </div>
                    <div>
                      <h4 className={`font-heading text-sm font-bold ${isCompleted ? "text-primary" : "text-outline"}`}>
                        {ORDER_STATUS_LABELS[status]}
                      </h4>
                      {isCurrent && (
                        <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block mt-0.5">
                          Current Stage
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Delivery Details */}
        <div className="space-y-6">
          <div className="glass-card organic-shadow rounded-3xl p-6 space-y-4">
            <h2 className="font-heading text-lg font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]"><FaUser /></span>
              Customer Details
            </h2>
            <div className="space-y-2 text-xs text-on-surface-variant">
              <div>
                <span className="text-outline font-bold uppercase tracking-wider block">Customer Name</span>
                <span className="font-semibold text-on-surface text-sm">{order.consumerName}</span>
              </div>
              <div>
                <span className="text-outline font-bold uppercase tracking-wider block mt-2">Delivery Address</span>
                <p className="text-on-surface font-medium whitespace-pre-line leading-relaxed">{order.deliveryAddress}</p>
              </div>
            </div>
          </div>

          <div className="glass-card organic-shadow rounded-3xl p-6 space-y-4">
            <h2 className="font-heading text-lg font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]"><MdOutlineLocalShipping /></span>
              Schedule Slot
            </h2>
            <div className="space-y-2 text-xs text-on-surface-variant">
              <div>
                <span className="text-outline font-bold uppercase tracking-wider block">Target Delivery Date</span>
                <span className="font-semibold text-on-surface">{new Date(order.deliveryDate).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-outline font-bold uppercase tracking-wider block mt-2">Window</span>
                <span className="font-semibold text-on-surface">{order.deliverySlot}</span>
              </div>
              {order.notes && (
                <div className="pt-2 border-t border-outline-variant/10">
                  <span className="text-outline font-bold uppercase tracking-wider block">Special Notes</span>
                  <p className="italic text-on-surface bg-amber-50 p-2.5 rounded-xl border border-amber-200 mt-1">
                    &ldquo;{order.notes}&rdquo;
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
