"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdAnalytics, MdCategory, MdOutlineDashboard, MdPerson, MdSettings, MdShoppingCart } from "react-icons/md";

export default function AdminNavigation() {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Overview", icon: <MdOutlineDashboard /> },
    { href: "/admin/farmers", label: "Farmers", icon: <MdPerson /> },
    { href: "/admin/orders", label: "Global Orders", icon: <MdShoppingCart /> },
    { href: "/admin/categories", label: "Categories", icon: <MdCategory /> },
    { href: "/admin/analytics", label: "Analytics", icon: <MdAnalytics /> },
    { href: "/admin/settings", label: "Platform Settings", icon: <MdSettings /> },
  ];

  return (
    <nav className="flex-1 space-y-1.5 px-3">
      {links.map((link) => {
        const isActive =
          pathname === link.href ||
          (link.href !== "/admin" && pathname.startsWith(link.href));
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-heading text-sm font-semibold transition-all duration-200 ${
              isActive
                ? "bg-secondary-container text-on-secondary-container shadow-sm"
                : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
