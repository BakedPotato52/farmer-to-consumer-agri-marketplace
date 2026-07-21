import { NextRequest, NextResponse } from "next/server";
import { getOrderById, updateOrderStatus } from "@/lib/data/orders";
import { getSession } from "@/lib/auth/session";
import { OrderStatus } from "@/lib/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const order = await getOrderById(id);
  
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Check permissions
  if (session.role !== "admin" && 
      order.consumerId !== session.userId && 
      order.farmerId !== session.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(order);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const order = await getOrderById(id);
  
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  try {
    const { status } = await request.json();
    
    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    // Role-based restrictions
    if (session.role === "consumer") {
      if (order.consumerId !== session.userId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      if (status !== "cancelled" || order.status !== "pending") {
        return NextResponse.json({ error: "Consumers can only cancel pending orders" }, { status: 400 });
      }
    } else if (session.role === "farmer") {
      if (order.farmerId !== session.userId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      const allowedFarmerStatuses = ["confirmed", "packed", "shipped", "delivered"];
      if (!allowedFarmerStatuses.includes(status)) {
        return NextResponse.json({ error: "Invalid status update for farmer" }, { status: 400 });
      }
    }

    const updated = await updateOrderStatus(id, status as OrderStatus);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
  }
}
