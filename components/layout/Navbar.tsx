"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { BsCart4, BsBagCheck } from "react-icons/bs";
import { RiAccountCircleLine } from "react-icons/ri";
import { IoIosSearch, IoMdPeople } from "react-icons/io";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { IoStorefrontOutline } from "react-icons/io5";
import { MdLogout, MdOutlineDashboard } from "react-icons/md";
import { CartContext } from "@/lib/cart/CartContext";

const CATEGORIES_NAV = [
  { name: "All Harvests", slug: "", icon: "🌾" },
  { name: "Vegetables", slug: "vegetables", icon: "🥬" },
  { name: "Fruits", slug: "fruits", icon: "🍎" },
  { name: "Dairy", slug: "dairy", icon: "🥛" },
  { name: "Grains", slug: "grains", icon: "🌾" },
  { name: "Herbs", slug: "herbs", icon: "🌿" },
];

export default function Navbar({
  session,
}: {
  session?: { name: string; role: string } | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const cartCtx = useContext(CartContext);
  const cartCount = cartCtx ? cartCtx.getItemCount() : 0;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/products");
    }
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Marketplace", href: "/products" },
    { label: "Farmers", href: "/farmers" },
  ];

  if (session?.role === "consumer") {
    navLinks.push({ label: "My Orders", href: "/orders" });
  }

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-outline-variant/10 ${
        isScrolled
          ? "bg-surface/90 backdrop-blur-xl shadow-md h-16"
          : "bg-surface/80 backdrop-blur-xl shadow-sm h-20"
      }`}
    >
      <div className="flex justify-between items-center h-full px-4 md:px-[40px] max-w-[1280px] mx-auto">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className="font-heading text-2xl font-extrabold text-primary flex items-center gap-2 tracking-tight group"
          >
            <span className="w-8 h-8 rounded-xl bg-primary text-on-primary flex items-center justify-center text-sm shadow-md group-hover:scale-105 transition-transform">
              🌱
            </span>
            FarmFresh
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Search + Cart + User */}
        <div className="flex items-center gap-3">
          {/* Functional Search Input (desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden lg:flex items-center bg-surface-container-low rounded-full px-4 py-2 border border-outline-variant/20 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/40 transition-all"
          >
            <button
              type="submit"
              className="text-on-surface-variant hover:text-primary transition-colors mr-2 cursor-pointer"
            >
              <IoIosSearch className="text-lg" />
            </button>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm w-44 text-on-surface placeholder:text-on-surface-variant outline-none"
              placeholder="Search harvest..."
            />
          </form>

          {/* Cart Icon with Live Item Count Badge */}
          <Link
            href="/cart"
            className={`p-2.5 rounded-xl transition-all active:scale-95 relative ${
              pathname === "/cart"
                ? "bg-primary/10 text-primary"
                : "text-on-surface-variant hover:bg-primary/5 hover:text-primary"
            }`}
            title="Shopping Cart"
          >
            <BsCart4 className="text-xl" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-error text-on-error text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {/* User / Account Menu */}
          {session ? (
            <div className="relative group">
              <button className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/20 transition-all cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-primary text-on-primary font-bold text-xs flex items-center justify-center uppercase">
                  {session.name.charAt(0)}
                </div>
                <span className="text-xs font-semibold text-on-surface hidden sm:inline-block max-w-24 truncate">
                  {session.name}
                </span>
              </button>

              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-surface-container-lowest shadow-xl border border-outline-variant/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-2 organic-shadow">
                <div className="p-3 border-b border-outline-variant/10">
                  <div className="text-sm font-bold text-on-surface truncate">
                    {session.name}
                  </div>
                  <div className="text-[11px] font-semibold text-primary uppercase tracking-wider mt-0.5">
                    {session.role} Account
                  </div>
                </div>

                <div className="py-1.5 space-y-1">
                  {session.role === "consumer" && (
                    <Link
                      href="/orders"
                      className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-on-surface hover:bg-surface-container-high rounded-xl transition-colors"
                    >
                      <BsBagCheck className="text-primary text-base" />
                      My Orders
                    </Link>
                  )}

                  <Link
                    href={
                      session.role === "admin"
                        ? "/admin"
                        : session.role === "farmer"
                        ? "/dashboard"
                        : "/orders"
                    }
                    className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-on-surface hover:bg-surface-container-high rounded-xl transition-colors"
                  >
                    <MdOutlineDashboard className="text-primary text-base" />
                    {session.role === "consumer" ? "Order History" : "Dashboard"}
                  </Link>

                  <form action="/api/auth/logout" method="POST">
                    <button
                      type="submit"
                      className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-sm font-semibold text-error hover:bg-error-container/30 rounded-xl transition-colors cursor-pointer"
                    >
                      <MdLogout className="text-base" />
                      Log out
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs font-bold text-primary px-4 py-2 hover:bg-primary/5 rounded-full transition-all"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="bg-primary text-on-primary text-xs font-bold px-4 py-2 rounded-full hover:bg-primary-container transition-all shadow-sm"
              >
                Sign up
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-on-surface-variant hover:bg-primary/5 rounded-xl cursor-pointer"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open mobile menu"
          >
            <AiOutlineMenu className="text-xl" />
          </button>
        </div>
      </div>

      {/* Category Sub-Bar Navigation for Marketplace Pages */}
      {(pathname === "/products" || pathname === "/") && (
        <div className="border-t border-outline-variant/10 bg-surface-container-lowest/60 backdrop-blur-md hidden sm:block">
          <div className="max-w-[1280px] mx-auto px-4 md:px-[40px] flex items-center gap-2 overflow-x-auto py-2 scrollbar-none text-xs">
            <span className="font-bold text-outline uppercase tracking-wider mr-2 text-[10px]">
              Categories:
            </span>
            {CATEGORIES_NAV.map((cat) => (
              <Link
                key={cat.name}
                href={cat.slug ? `/products?category=${cat.slug}` : "/products"}
                className="px-3 py-1 rounded-full bg-white border border-outline-variant/20 hover:border-primary/40 hover:bg-primary/5 text-on-surface font-semibold flex items-center gap-1.5 transition-all shrink-0"
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="absolute right-0 top-0 w-80 bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-bold font-heading text-primary flex items-center gap-2">
                  🌱 FarmFresh
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant cursor-pointer"
                >
                  <AiOutlineClose className="text-xl" />
                </button>
              </div>

              {/* Mobile Search Form */}
              <form onSubmit={handleSearchSubmit} className="mb-6">
                <div className="flex items-center bg-surface-container-low rounded-xl px-3 py-2.5 border border-outline-variant/30">
                  <IoIosSearch className="text-on-surface-variant text-lg mr-2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search fresh harvest..."
                    className="w-full text-sm bg-transparent outline-none text-on-surface"
                  />
                </div>
              </form>

              {/* Main Navigation Links */}
              <div className="space-y-1 mb-6">
                <span className="text-[10px] font-bold text-outline uppercase tracking-wider px-3 block mb-2">
                  Navigation
                </span>
                {[
                  { label: "Home", href: "/", icon: "🏠" },
                  { label: "Marketplace", href: "/products", icon: <IoStorefrontOutline /> },
                  { label: "Farmers Directory", href: "/farmers", icon: <IoMdPeople /> },
                  { label: "Shopping Cart", href: "/cart", icon: <BsCart4 />, badge: cartCount },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      pathname === item.href
                        ? "bg-primary/10 text-primary"
                        : "text-on-surface hover:bg-surface-container-high"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge ? (
                      <span className="bg-primary text-on-primary text-xs font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                ))}
              </div>

              {/* Quick Categories for Mobile */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-outline uppercase tracking-wider px-3 block mb-2">
                  Browse Harvest Categories
                </span>
                <div className="grid grid-cols-2 gap-2 px-1">
                  {CATEGORIES_NAV.slice(1).map((cat) => (
                    <Link
                      key={cat.name}
                      href={`/products?category=${cat.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 bg-surface-container-low rounded-xl text-xs font-semibold text-on-surface flex items-center gap-2 hover:bg-primary/10 transition-colors"
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom User Actions */}
            <div className="pt-6 border-t border-outline-variant/20">
              {session ? (
                <div className="space-y-3">
                  <div className="text-xs text-on-surface-variant">
                    Signed in as <span className="font-bold text-on-surface">{session.name}</span>
                  </div>
                  <Link
                    href={
                      session.role === "admin"
                        ? "/admin"
                        : session.role === "farmer"
                        ? "/dashboard"
                        : "/orders"
                    }
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-3 bg-primary text-on-primary rounded-xl text-sm font-bold shadow-sm"
                  >
                    {session.role === "consumer" ? "My Orders" : "Dashboard"}
                  </Link>
                  <form action="/api/auth/logout" method="POST">
                    <button
                      type="submit"
                      className="w-full text-center px-4 py-2.5 border border-error/30 text-error rounded-xl text-xs font-bold hover:bg-error-container/20 transition-colors cursor-pointer"
                    >
                      Log out
                    </button>
                  </form>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center px-4 py-3 border border-outline-variant/30 text-primary rounded-xl text-xs font-bold"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center px-4 py-3 bg-primary text-on-primary rounded-xl text-xs font-bold shadow-sm"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
