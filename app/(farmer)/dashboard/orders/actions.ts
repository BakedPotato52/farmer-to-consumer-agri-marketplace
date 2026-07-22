"use server";

import { updateOrderStatus } from "@/lib/data/orders";
import { getSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { OrderStatus } from "@/lib/types";
import { cookies } from "next/headers";

export async function updateOrderStatusAction(
  orderId: string,
  newStatus: OrderStatus,
) {
  await cookies();
  const session = await getSession();
  if (!session || session.role !== "farmer") {
    throw new Error("Unauthorized");
  }

  try {
    await updateOrderStatus(orderId, newStatus);
    revalidatePath("/dashboard/orders");
    revalidatePath(`/dashboard/orders/${orderId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update order status:", error);
    throw new Error("Failed to update order status");
  }
}
