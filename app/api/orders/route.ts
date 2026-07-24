import { NextRequest, NextResponse } from "next/server";
import {
  getAllOrders,
  getOrdersByConsumer,
  getOrdersByFarmer,
  createOrder,
} from "@/lib/data/orders";
import { getSession } from "@/lib/auth/session";
import type { Order, OrderItem } from "@/lib/types";

export async function GET(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let orders: Order[] = [];

  if (session.role === "admin") {
    orders = await getAllOrders();
  } else if (session.role === "consumer") {
    orders = await getOrdersByConsumer(session.userId);
  } else if (session.role === "farmer") {
    orders = await getOrdersByFarmer(session.userId);
  }

  return NextResponse.json(orders);
}

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session || session.role !== "consumer") {
    return NextResponse.json(
      { error: "Unauthorized. Consumer access required." },
      { status: 403 },
    );
  }

  try {
    const body = await request.json();
    const createdOrders: Order[] = [];

    // Support itemsByFarmer (grouping cart items by farmer)
    if (body.itemsByFarmer && typeof body.itemsByFarmer === "object") {
      const farmerIds = Object.keys(body.itemsByFarmer);

      for (const farmerId of farmerIds) {
        const rawItems = body.itemsByFarmer[farmerId];
        if (!Array.isArray(rawItems) || rawItems.length === 0) continue;

        const orderItems: OrderItem[] = rawItems.map((item: any) => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          pricePerUnit: item.price,
          unit: item.unit || "kg",
          totalPrice: item.price * item.quantity,
          image: item.image,
        }));

        const itemsTotal = orderItems.reduce(
          (sum, item) => sum + item.totalPrice,
          0,
        );
        const farmerName = rawItems[0]?.farmerName || "Local Farmer";

        const order = await createOrder({
          consumerId: session.userId,
          consumerName: session.name,
          farmerId,
          farmerName,
          items: orderItems,
          totalAmount: itemsTotal + 40, // subtotal + delivery fee
          deliveryAddress: body.deliveryAddress || "",
          deliverySlot: body.deliverySlot || "Morning (8AM - 12PM)",
          deliveryDate: body.deliveryDate || new Date().toISOString().split("T")[0],
          notes: body.notes || "",
        });

        createdOrders.push(order);
      }

      return NextResponse.json({ orders: createdOrders }, { status: 201 });
    }

    // Direct single-farmer order fallback
    const required = [
      "farmerId",
      "farmerName",
      "items",
      "deliveryAddress",
      "deliverySlot",
      "deliveryDate",
    ];
    for (const field of required) {
      if (body[field] === undefined) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }

    const orderItems: OrderItem[] = body.items.map((item: any) => ({
      productId: item.productId,
      productName: item.productName || item.name,
      quantity: item.quantity,
      pricePerUnit: item.pricePerUnit || item.price,
      unit: item.unit || "kg",
      totalPrice: item.totalPrice || item.price * item.quantity,
      image: item.image,
    }));

    const newOrder = await createOrder({
      consumerId: session.userId,
      consumerName: session.name,
      farmerId: body.farmerId,
      farmerName: body.farmerName,
      items: orderItems,
      totalAmount: body.totalAmount || 0,
      deliveryAddress: body.deliveryAddress,
      deliverySlot: body.deliverySlot,
      deliveryDate: body.deliveryDate,
      notes: body.notes || "",
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: error?.message || "Invalid request data" },
      { status: 400 },
    );
  }
}
