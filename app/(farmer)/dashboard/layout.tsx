import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { logoutAction } from "@/lib/auth/actions";
import { ReactNode } from "react";
import Navigation from "./navigation";
import { cookies } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  await cookies();
  const session = await getSession();
  
  if (!session || session.role !== "farmer") {
    redirect("/login");
  }

  const initials = session.name ? session.name.charAt(0).toUpperCase() : "F";

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile sidebar toggle checkbox */}
      <input type="checkbox" id="sidebar-toggle" className="peer hidden" />
      
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform -translate-x-full peer-checked:translate-x-0 md:relative md:translate-x-0 transition-transform duration-200 ease-in-out flex flex-col">
        <div className="p-6 flex items-center justify-between md:block">
          <h1 className="text-2xl font-bold text-emerald-600">FarmFresh</h1>
          <label htmlFor="sidebar-toggle" className="md:hidden cursor-pointer text-gray-500 hover:text-gray-700 text-xl font-bold">
            ✕
          </label>
        </div>
        
        <Navigation />

        <div className="p-4 border-t border-gray-200">
          <form action={logoutAction}>
            <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-red-50 text-gray-700 hover:text-red-700 transition-all duration-200">
              <span>🚪</span> Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <label htmlFor="sidebar-toggle" className="md:hidden mr-4 cursor-pointer text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </label>
            <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">{session.name}</span>
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              {initials}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
      
      {/* Overlay for mobile sidebar */}
      <label htmlFor="sidebar-toggle" className="fixed inset-0 bg-black/50 z-40 hidden peer-checked:block md:peer-checked:hidden cursor-pointer"></label>
    </div>
  );
}
