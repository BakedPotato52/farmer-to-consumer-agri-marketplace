import { store, generateId } from "@/lib/data/store";
import type { Order, OrderStatus } from "@/lib/types";

export function getAllOrders(): Order[] {
  return [...store.orders];
}

export function getOrderById(id: string): Order | undefined {
  return store.orders.find((o) => o.id === id);
}

export function getOrdersByConsumer(consumerId: string): Order[] {
  return store.orders.filter((o) => o.consumerId === consumerId);
}

export function getOrdersByFarmer(farmerId: string): Order[] {
  return store.orders.filter((o) => o.farmerId === farmerId);
}

export function createOrder(
  data: Omit<Order, "id" | "status" | "createdAt" | "updatedAt">,
): Order {
  const now = new Date().toISOString();
  const newOrder: Order = {
    ...data,
    id: generateId(),
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };
  store.orders.push(newOrder);
  return newOrder;
}

export function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Order | undefined {
  const index = store.orders.findIndex((o) => o.id === id);
  if (index === -1) return undefined;

  store.orders[index] = {
    ...store.orders[index],
    status,
    updatedAt: new Date().toISOString(),
  };
  return store.orders[index];
}

export function cancelOrder(id: string): Order | undefined {
  return updateOrderStatus(id, "cancelled");
}
