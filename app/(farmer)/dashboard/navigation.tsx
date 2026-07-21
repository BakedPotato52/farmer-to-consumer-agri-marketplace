'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'Overview', icon: '📊' },
    { href: '/dashboard/products', label: 'Products', icon: '📦' },
    { href: '/dashboard/orders', label: 'Orders', icon: '🛒' },
    { href: '/dashboard/profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <nav className="flex-1 px-4 space-y-2">
      {links.map((link) => {
        const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive
                ? 'bg-emerald-50 text-emerald-700 font-medium'
                : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            <span>{link.icon}</span> {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
