import { NextRequest, NextResponse } from "next/server";
import { getProductById, updateProduct, deleteProduct } from "@/lib/data/products";
import { getSession } from "@/lib/auth/session";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await getProductById(id);
  
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  
  return NextResponse.json(product);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "farmer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const product = await getProductById(id);
  
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  
  if (product.farmerId !== session.userId) {
    return NextResponse.json({ error: "Forbidden: You don't own this product" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const updated = await updateProduct(id, body);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "farmer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const product = await getProductById(id);
  
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  
  if (product.farmerId !== session.userId) {
    return NextResponse.json({ error: "Forbidden: You don't own this product" }, { status: 403 });
  }

  const success = await deleteProduct(id);
  if (success) {
    return new NextResponse(null, { status: 204 });
  }
  return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
}
