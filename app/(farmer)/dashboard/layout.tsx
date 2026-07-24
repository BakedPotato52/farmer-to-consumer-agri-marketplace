import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { logoutAction } from "@/lib/auth/actions";
import { ReactNode } from "react";
import Navigation from "./navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { MdLogout, MdOutlineMenu } from "react-icons/md";
import { RiSearchLine } from "react-icons/ri";

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
    <div className="flex h-screen bg-background text-on-surface overflow-hidden">
      {/* Mobile sidebar toggle checkbox */}
      <input type="checkbox" id="sidebar-toggle" className="peer hidden" />

      {/* ── Sidebar ── */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-outline-variant/10 shadow-[4px_0_30px_0_rgba(69,26,3,0.08)] transform -translate-x-full peer-checked:translate-x-0 md:relative md:translate-x-0 transition-transform duration-200 ease-in-out flex flex-col p-6">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/">
            <h1 className="font-heading text-2xl font-bold text-primary tracking-tight">
              FarmFresh
            </h1>
            <p className="text-on-surface-variant text-[11px] font-semibold uppercase tracking-wider">
              Merchant Portal
            </p>
          </Link>
          <label
            htmlFor="sidebar-toggle"
            className="md:hidden cursor-pointer text-on-surface-variant hover:text-primary text-xl font-bold"
          >
            ✕
          </label>
        </div>

        <Navigation />

        {/* Profile Card & Logout */}
        <div className="mt-auto pt-6 border-t border-outline-variant/10 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-on-primary font-heading font-bold text-base flex items-center justify-center shadow-md shrink-0">
              {initials}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-heading text-sm font-bold text-primary truncate">
                {session.name}
              </span>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
                Verified Farmer
              </span>
            </div>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              className="flex items-center gap-2 px-3 py-2 w-full rounded-xl hover:bg-error-container/30 text-error text-xs font-semibold transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">
                <MdLogout />
              </span>
              Log out
            </button>
          </form>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-surface/80 backdrop-blur-md border-b border-outline-variant/10 h-16 flex items-center justify-between px-6 z-40">
          <div className="flex items-center gap-4">
            <label
              htmlFor="sidebar-toggle"
              className="md:hidden cursor-pointer text-on-surface-variant hover:text-primary"
            >
              <span className="material-symbols-outlined text-2xl">
                <MdOutlineMenu />
              </span>
            </label>
            <h2 className="font-heading text-lg font-bold text-primary">
              Merchant Dashboard
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center bg-surface-container-low px-3 py-1.5 rounded-full border border-outline-variant/20 text-xs">
              <span className="material-symbols-outlined text-on-surface-variant text-[16px] mr-2">
                <RiSearchLine />
              </span>
              <input
                type="text"
                placeholder="Search orders..."
                className="bg-transparent border-none outline-none text-xs w-36 text-on-surface placeholder:text-outline"
              />
            </div>

            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
              {initials}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
      </div>

      {/* Overlay for mobile sidebar */}
      <label
        htmlFor="sidebar-toggle"
        className="fixed inset-0 bg-black/50 z-40 hidden peer-checked:block md:peer-checked:hidden cursor-pointer"
      />
    </div>
  );
}
