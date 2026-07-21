import { getProductById } from "@/lib/data/products";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import EditProductForm from "./edit-form";
import { cookies } from "next/headers";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await cookies();
  const session = await getSession();
  if (!session || session.role !== "farmer") {
    redirect("/login");
  }

  const { id } = await params;
  const product = await getProductById(id);

  if (!product || product.farmerId !== session.userId) {
    redirect("/dashboard/products");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
      </div>
      <EditProductForm product={product} />
    </div>
  );
}
