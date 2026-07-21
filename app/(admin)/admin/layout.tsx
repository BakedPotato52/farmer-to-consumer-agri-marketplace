import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { logoutAction } from "@/lib/auth/actions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || session.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans text-gray-900">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-900 text-white flex-shrink-0 flex flex-col">
        <div className="p-6">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            <span className="font-bold text-xl tracking-tight text-emerald-400">FarmFresh Admin</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          <NavLink href="/admin" icon="📊" label="Dashboard" exact />
          <NavLink href="/admin/farmers" icon="👨‍🌾" label="Farmers" />
          <NavLink href="/admin/orders" icon="🛒" label="Orders" />
          <NavLink href="/admin/categories" icon="📂" label="Categories" />
          <NavLink href="/admin/analytics" icon="📈" label="Analytics" />
          <NavLink href="/admin/settings" icon="⚙️" label="Settings" />
          
          <div className="my-6 border-t border-gray-800"></div>
          
          <form action={logoutAction}>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors text-sm font-medium">
              <span className="text-lg">🚪</span>
              Logout
            </button>
          </form>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shrink-0">
          <div className="font-semibold text-lg text-gray-800">Admin Portal</div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-gray-900">{session.name}</span>
              <span className="text-xs text-emerald-600 font-medium capitalize">{session.role}</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
              {session.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

// Note: In a real app we'd use usePathname for active state, 
// but since it's a server component we'll use a simple CSS trick or rely on Next.js client-side navigation features
function NavLink({ href, icon, label, exact = false }: { href: string; icon: string; label: string; exact?: boolean }) {
  // Using active state visually through a Client Component or Next.js built-in active links if preferred.
  // For simplicity here, hover states will look good.
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors group text-sm font-medium"
    >
      <span className="text-lg group-hover:scale-110 transition-transform">{icon}</span>
      {label}
    </Link>
  );
}
