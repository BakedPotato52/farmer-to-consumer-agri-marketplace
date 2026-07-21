import { getSession } from "@/lib/auth/session";
import { CartProvider } from "@/lib/cart/CartProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default async function ConsumerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar session={session} />
      <CartProvider>
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </CartProvider>
      <Footer />
    </div>
  );
}
