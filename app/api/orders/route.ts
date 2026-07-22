import { NextRequest, NextResponse } from "next/server";
import { getAllOrders, getOrdersByConsumer, getOrdersByFarmer, createOrder } from "@/lib/data/orders";
import { getSession } from "@/lib/auth/session";
import type { Order } from "@/lib/types";

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
    return NextResponse.json({ error: "Unauthorized. Consumer access required." }, { status: 403 });
  }

  try {
    const body = await request.json();
    
    // Validate required fields
    const required = ["farmerId", "farmerName", "items", "totalAmount", "deliveryAddress", "deliverySlot", "deliveryDate"];
    for (const field of required) {
      if (body[field] === undefined) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    const newOrder = await createOrder({
      consumerId: session.userId,
      consumerName: session.name,
      ...body
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
  }
}
