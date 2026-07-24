import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { getOrdersByConsumer } from "@/lib/data/orders";
import { MdOutlineLocalShipping } from "react-icons/md";
import { FaArrowRight, FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { RiProgress5Line } from "react-icons/ri";

export default async function OrdersPage() {
  const session = await getSession();

  if (!session || session.role !== "consumer") {
    redirect("/login");
  }

  const orders = await getOrdersByConsumer(session.userId);

  const statusBadgeStyle: Record<string, string> = {
    pending: "bg-amber-100 text-amber-900 border-amber-200",
    confirmed: "bg-blue-100 text-blue-900 border-blue-200",
    packed: "bg-purple-100 text-purple-900 border-purple-200",
    shipped: "bg-sky-100 text-sky-900 border-sky-200",
    delivered: "bg-secondary-container text-on-secondary-container border-secondary/20",
    cancelled: "bg-error-container text-on-error-container border-error/20",
  };

  return (
    <div className="pt-8 pb-16 max-w-[1280px] mx-auto px-4 md:px-10 min-h-screen">
      {/* Header Section */}
      <header className="mb-8">
        <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-primary mb-2 tracking-tight">
          Order History
        </h1>
        <p className="font-body-md text-lg text-on-surface-variant">
          Track, manage, and view your direct farm-to-table purchases.
        </p>
      </header>

      {orders.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-3xl p-16 text-center organic-shadow border border-outline-variant/10">
          <div className="w-16 h-16 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mx-auto mb-4 organic-shadow">
            <span className="material-symbols-outlined text-3xl"><MdOutlineLocalShipping /></span>
          </div>
          <h2 className="font-heading text-2xl font-bold text-on-surface mb-2">No orders placed yet</h2>
          <p className="text-on-surface-variant max-w-sm mx-auto mb-6 text-sm">
            Discover local organic farmers and bring fresh harvests directly to your table.
          </p>
          <Link
            href="/products"
            className="inline-block px-8 py-3.5 bg-primary text-on-primary rounded-xl font-heading text-sm font-semibold hover:bg-primary-container transition-all active:scale-[0.98] organic-shadow"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => {
            const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

            return (
              <div
                key={order.id}
                className="glass-card organic-shadow rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 transition-all hover:-translate-y-0.5 hover:shadow-lg duration-300 border border-outline-variant/10"
              >
                {/* Visual Icon / Image Badge */}
                <div className="w-full md:w-36 h-36 bg-surface-container-low rounded-2xl flex flex-col items-center justify-center shrink-0 border border-outline-variant/10 text-primary overflow-hidden relative">
                  {order.items[0]?.image ? (
                    <img
                      src={order.items[0].image}
                      alt={order.items[0].productName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-4xl mb-1"><MdOutlineLocalShipping /></span>
                      <span className="text-xs font-bold text-outline uppercase">{itemCount} {itemCount === 1 ? "Item" : "Items"}</span>
                    </>
                  )}
                </div>

                {/* Order Details */}
                <div className="flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                      <div>
                        <span className="text-xs font-bold text-outline uppercase tracking-wider block">
                          Order #{order.id.slice(-6).toUpperCase()}
                        </span>
                        <h3 className="font-heading text-xl font-bold text-on-surface">
                          Farmer: {order.farmerName}
                        </h3>
                      </div>

                      <div
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 border ${
                          statusBadgeStyle[order.status] || "bg-surface-container text-on-surface"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {order.status === "delivered"
                            ? <FaCircleCheck />
                            : order.status === "cancelled"
                              ? <FaCircleXmark />
                              : <RiProgress5Line />}
                        </span>
                        {order.status}
                      </div>
                    </div>

                    <p className="text-xs text-on-surface-variant">
                      Placed on{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>

                    {/* Items summary */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {order.items.map((item) => (
                        <span
                          key={item.productId}
                          className="px-2.5 py-1 bg-surface-container-low text-on-surface-variant text-xs font-medium rounded-lg border border-outline-variant/10 flex items-center gap-2"
                        >
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.productName}
                              className="w-5 h-5 object-cover rounded-md shrink-0"
                            />
                          )}
                          {item.quantity}x {item.productName}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-outline-variant/10">
                    <div>
                      <span className="text-xs text-outline block">Total Amount</span>
                      <span className="font-heading text-2xl font-bold text-primary">
                        ₹{order.totalAmount.toFixed(2)}
                      </span>
                    </div>

                    <Link
                      href={`/orders/${order.id}`}
                      className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-heading text-sm font-semibold hover:bg-primary-container transition-all active:scale-[0.98] organic-shadow flex items-center gap-2"
                    >
                      View Details
                      <span className="material-symbols-outlined text-[18px]"><FaArrowRight /></span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
