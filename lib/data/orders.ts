import { store, generateId } from "@/lib/data/store";
import type { Order, OrderStatus } from "@/lib/types";
import {
  saveOrderToFirestore,
  updateOrderInFirestore,
  fetchOrdersFromFirestore,
} from "@/lib/firebase/services";

export async function getAllOrders(): Promise<Order[]> {
  const orders = await fetchOrdersFromFirestore();
  return orders.length > 0 ? orders : store.orders;
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const orders = await getAllOrders();
  return orders.find((o) => o.id === id);
}

export async function getOrdersByConsumer(consumerId: string): Promise<Order[]> {
  const orders = await getAllOrders();
  return orders.filter((o) => o.consumerId === consumerId);
}

export async function getOrdersByFarmer(farmerId: string): Promise<Order[]> {
  const orders = await getAllOrders();
  return orders.filter((o) => o.farmerId === farmerId);
}

export async function createOrder(
  data: Omit<Order, "id" | "status" | "createdAt" | "updatedAt">,
): Promise<Order> {
  const now = new Date().toISOString();
  const newOrder: Order = {
    ...data,
    id: generateId(),
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };
  store.orders.push(newOrder);
  await saveOrderToFirestore(newOrder);
  return newOrder;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<Order | undefined> {
  const orders = await getAllOrders();
  const existing = orders.find((o) => o.id === id) || store.orders.find((o) => o.id === id);
  if (!existing) return undefined;

  const now = new Date().toISOString();
  const updated = {
    ...existing,
    status,
    updatedAt: now,
  };

  const index = store.orders.findIndex((o) => o.id === id);
  if (index !== -1) {
    store.orders[index] = updated;
  } else {
    store.orders.push(updated);
  }

  await updateOrderInFirestore(id, { status, updatedAt: now });
  return updated;
}

export async function cancelOrder(id: string): Promise<Order | undefined> {
  return updateOrderStatus(id, "cancelled");
}
