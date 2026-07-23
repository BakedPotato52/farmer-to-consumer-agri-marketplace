"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Overview", icon: "dashboard" },
    { href: "/dashboard/products", label: "Products", icon: "inventory_2" },
    { href: "/dashboard/orders", label: "Orders", icon: "shopping_cart" },
    { href: "/dashboard/profile", label: "Profile", icon: "person" },
  ];

  return (
    <nav className="flex-1 space-y-1.5 px-3">
      {links.map((link) => {
        const isActive =
          pathname === link.href ||
          (link.href !== "/dashboard" && pathname.startsWith(link.href));
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
