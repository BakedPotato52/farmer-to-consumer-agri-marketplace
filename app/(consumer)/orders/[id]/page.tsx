import { notFound } from "next/navigation";
import Link from "next/link";
import { getOrderById } from "@/lib/data/orders";
import { ORDER_STATUS_FLOW } from "@/lib/types";
import ReviewForm from "./ReviewForm";
import {
  FaArrowLeft,
  FaCircleCheck,
  FaCircleXmark,
  FaLocationDot,
} from "react-icons/fa6";
import {
  MdOutlineInventory,
  MdOutlineLocalShipping,
  MdPendingActions,
} from "react-icons/md";
import { RiErrorWarningLine, RiHomeLine } from "react-icons/ri";

export default async function OrderDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  const currentStatusIndex = ORDER_STATUS_FLOW.indexOf(order.status);

  const statusIcons: Record<string, React.ReactNode> = {
    pending: <MdPendingActions />,
    confirmed: <FaCircleCheck />,
    packed: <MdOutlineInventory />,
    shipped: <MdOutlineLocalShipping />,
    delivered: <RiHomeLine />,
    cancelled: <FaCircleXmark />,
  };
  return (
    <div className="pt-8 pb-16 max-w-[1280px] mx-auto px-4 md:px-10 min-h-screen">
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-secondary-container text-on-secondary-container font-heading text-xs font-bold rounded-full">
              Order #{order.id.slice(-6).toUpperCase()}
            </span>
            <span className="text-xs text-outline font-medium capitalize">
              {order.status} · {new Date(order.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h1 className="font-heading text-4xl font-extrabold text-primary">
            {order.status === "delivered"
              ? "Order Delivered"
              : "Order in Progress"}
          </h1>
        </div>

        <Link
          href="/orders"
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-outline-variant/30 text-primary font-heading text-sm font-semibold rounded-xl hover:bg-primary/5 transition-colors self-start md:self-end"
        >
          <span className="material-symbols-outlined text-[18px]">
            <FaArrowLeft />
          </span>
          Back to Orders
        </Link>
      </header>

      {/* Progress Timeline */}
      {order.status !== "cancelled" && (
        <section className="glass-card organic-shadow rounded-3xl p-6 md:p-8 mb-8 overflow-x-auto">
          <h2 className="font-heading text-xl font-bold text-primary mb-6">
            Delivery Timeline
          </h2>
          <div className="min-w-150 flex items-center justify-between relative py-4">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-surface-container-high z-0" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary z-0 transition-all duration-700"
              style={{
                width: `${(Math.max(0, currentStatusIndex) / (ORDER_STATUS_FLOW.length - 1)) * 100}%`,
              }}
            />

            {ORDER_STATUS_FLOW.map((status, index) => {
              const isCompleted = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;

              return (
                <div
                  key={status}
                  className="relative z-10 flex flex-col items-center gap-2"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCompleted
                        ? "bg-primary text-on-primary shadow-md"
                        : "bg-surface-container-high text-outline"
                    } ${isCurrent ? "ring-4 ring-primary-fixed" : ""}`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {statusIcons[status]}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${
                      isCompleted ? "text-primary" : "text-outline"
                    }`}
                  >
                    {status}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {order.status === "cancelled" && (
        <div className="glass-card rounded-3xl p-6 border border-error/20 bg-error-container/20 mb-8 flex items-center gap-4">
          <span className="material-symbols-outlined text-error text-3xl">
            <RiErrorWarningLine />
          </span>
          <div>
            <h3 className="font-heading font-bold text-on-error-container text-lg">
              Order Cancelled
            </h3>
            <p className="text-xs text-on-surface-variant">
              This order has been cancelled.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Items */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-card organic-shadow rounded-3xl p-6 md:p-8 space-y-6">
            <h2 className="font-heading text-xl font-bold text-primary">
              Items Ordered
            </h2>

            <div className="divide-y divide-outline-variant/10">
              {order.items.map((item) => (
                <div
                  key={item.productId}
                  className="py-4 first:pt-0 last:pb-0 space-y-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-16 h-16 object-cover rounded-2xl border border-outline-variant/15 shrink-0 shadow-xs"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary font-heading font-extrabold text-2xl flex items-center justify-center shrink-0">
                          {item.productName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <Link
                          href={`/products/${item.productId}`}
                          className="font-heading text-lg font-bold text-primary hover:underline block"
                        >
                          {item.productName}
                        </Link>
                        <p className="text-xs text-outline mt-0.5">
                          {item.quantity} × ₹{item.pricePerUnit} per {item.unit}
                        </p>
                      </div>
                    </div>
                    <span className="font-heading text-lg font-bold text-on-surface shrink-0">
                      ₹{item.totalPrice.toFixed(2)}
                    </span>
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

        {/* Right Column: Information */}
        <div className="lg:col-span-4 space-y-6">
          {/* Summary Box */}
          <div className="glass-card organic-shadow rounded-3xl p-6 space-y-4">
            <h2 className="font-heading text-lg font-bold text-on-surface border-b border-outline-variant/10 pb-3">
              Payment Summary
            </h2>
            <div className="flex justify-between text-sm text-on-surface-variant">
              <span>Total Amount</span>
              <span className="font-heading text-2xl font-bold text-primary">
                ₹{order.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="glass-card organic-shadow rounded-3xl p-6 space-y-4">
            <h2 className="font-heading text-lg font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">
                <FaLocationDot />
              </span>
              Delivery Details
            </h2>
            <div className="space-y-3 text-xs text-on-surface-variant">
              <div>
                <span className="text-outline uppercase font-bold block mb-1">
                  Address
                </span>
                <p className="text-on-surface font-medium">
                  {order.deliveryAddress}
                </p>
              </div>
              <div>
                <span className="text-outline uppercase font-bold block mb-1">
                  Date & Time Slot
                </span>
                <p className="text-on-surface font-medium">
                  {new Date(order.deliveryDate).toLocaleDateString()} ·{" "}
                  {order.deliverySlot}
                </p>
              </div>
              {order.notes && (
                <div>
                  <span className="text-outline uppercase font-bold block mb-1">
                    Notes
                  </span>
                  <p className="italic text-on-surface">{order.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Farmer Card */}
          <div className="bg-surface-container-low rounded-3xl p-6 organic-shadow border border-outline-variant/10 space-y-3">
            <span className="text-xs font-bold text-outline uppercase tracking-wider block">
              Grower
            </span>
            <div className="flex items-center justify-between">
              <div className="font-heading font-bold text-primary text-base">
                {order.farmerName}
              </div>
              <Link
                href={`/farmers/${order.farmerId}`}
                className="text-xs font-semibold text-primary hover:underline"
              >
                View Profile →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
