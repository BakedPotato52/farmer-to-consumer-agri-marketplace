"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { BsCart4 } from "react-icons/bs";
import { RiAccountCircleLine } from "react-icons/ri";
import { IoIosSearch, IoMdInformation, IoMdPeople } from "react-icons/io";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { IoStorefrontOutline } from "react-icons/io5";

export default function Navbar({ session }: { session?: { name: string; role: string } | null }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-outline-variant/10 ${isScrolled
        ? "bg-surface/80 backdrop-blur-xl shadow-md h-16"
        : "bg-surface/80 backdrop-blur-xl shadow-sm h-20"
      }`}
    >
      <div className="flex justify-between items-center h-full px-4 md:px-[40px] max-w-[1280px] mx-auto">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-12">
          <Link href="/" className="font-heading text-xl font-bold text-primary">
            FarmFresh
          </Link>
          <nav className="hidden md:flex gap-8">
            <Link href="/products" className="text-sm font-semibold text-primary border-b-2 border-primary pb-1">
              Marketplace
            </Link>
            <Link href="/farmers" className="text-sm text-on-surface-variant hover:text-primary transition-colors">
              Farmers
            </Link>
            <Link href="/about" className="text-sm text-on-surface-variant hover:text-primary transition-colors">
              Our Story
            </Link>
          </nav>
        </div>

        {/* Right: Search + Actions */}
        <div className="flex items-center gap-4">
          {/* Search (desktop) */}
          <div className="hidden lg:flex items-center bg-surface-container-low rounded-full px-4 py-2 border border-outline-variant/20">
            <span className="material-symbols-outlined text-on-surface-variant text-sm mr-2"><IoIosSearch /></span>
            <input
              className="bg-transparent border-none focus:ring-0 text-sm w-48 text-on-surface placeholder:text-on-surface-variant"
              placeholder="Search harvest..."
              type="text"
            />
          </div>

          {/* Cart */}
          <Link
            href="/cart"
            className="p-2 text-on-surface-variant hover:bg-primary/5 rounded-lg transition-all active:scale-95 relative"
          >
            <span className="material-symbols-outlined"><BsCart4 /></span>
          </Link>

          {/* User / Auth */}
          {session ? (
            <div className="relative group">
              <button className="p-2 text-on-surface-variant hover:bg-primary/5 rounded-lg transition-all active:scale-95">
                <span className="material-symbols-outlined"><RiAccountCircleLine /></span>
              </button>
              <div className="absolute right-0 mt-2 w-52 rounded-xl bg-surface-container-lowest shadow-lg border border-outline-variant/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 organic-shadow">
                <div className="p-3 border-b border-outline-variant/10">
                  <div className="text-sm font-semibold text-on-surface">{session.name}</div>
                  <div className="text-xs text-on-surface-variant capitalize">{session.role}</div>
                </div>
                <div className="py-1">
                  <Link
                    href={session.role === "admin" ? "/admin" : session.role === "farmer" ? "/dashboard" : "/orders"}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-on-surface hover:bg-surface-container-high rounded-lg mx-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">dashboard</span>
                    Dashboard
                  </Link>
                  <form action="/api/auth/logout" method="POST">
                    <button
                      type="submit"
                      className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-error hover:bg-error-container/30 rounded-lg mx-1 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      Log out
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ) : (
              <Link
                href="/login"
                className="p-2 text-on-surface-variant hover:bg-primary/5 rounded-lg transition-all active:scale-95"
              >
                <span className="material-symbols-outlined"><RiAccountCircleLine /></span>
              </Link>
          )}

          {/* Mobile Menu */}
          <button
            className="md:hidden p-2 text-on-surface-variant hover:bg-primary/5 rounded-lg"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="material-symbols-outlined"><AiOutlineMenu /></span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-60 bg-black/40 md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="absolute right-0 top-0 w-72 bg-surface-container-lowest shadow-xl p-6 overflow-y-auto"
            style={{
              top: isScrolled ? "0rem" : "0rem",
              height: `calc(100vh - ${isScrolled ? "0rem" : "0rem"})`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <span className="text-lg font-bold font-heading text-primary">FarmFresh</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-surface-container rounded-lg">
                <span className="material-symbols-outlined"><AiOutlineClose /></span>
              </button>
            </div>
            <nav className="flex flex-col gap-2">
              {[
                { label: "Marketplace", href: "/products", icon: <IoStorefrontOutline /> },
                { label: "Farmers", href: "/farmers", icon: <IoMdPeople /> },
                { label: "Cart", href: "/cart", icon: <BsCart4 /> },
                { label: "Our Story", href: "/about", icon: <IoMdInformation /> },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-3 text-on-surface  border border-outline-variant/15 rounded-xl shadow-sm transition-colors hover:bg-surface-container-high"
                >
                  <span className="text-on-surface-variant">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-8 pt-6 border-t border-outline-variant/20 flex flex-col gap-3">
              {session ? (
                <>
                  <div className="text-sm text-on-surface-variant mb-1">
                    Signed in as <span className="font-semibold text-on-surface">{session.name}</span>
                  </div>
                  <Link
                    href={session.role === "admin" ? "/admin" : session.role === "farmer" ? "/dashboard" : "/orders"}
                    className="w-full text-center px-4 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-semibold"
                  >
                    Dashboard
                  </Link>
                  <form action="/api/auth/logout" method="POST">
                    <button
                      type="submit"
                      className="w-full text-center px-4 py-2.5 border border-error/30 text-error rounded-xl text-sm font-semibold"
                    >
                      Log out
                    </button>
                  </form>
                </>
              ) : (
                <>
                    <Link
                      href="/login"
                      className="w-full text-center px-4 py-2.5 border border-outline-variant/30 text-primary rounded-xl text-sm font-semibold"
                    >
                    Log in
                  </Link>
                    <Link
                      href="/register"
                      className="w-full text-center px-4 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-semibold"
                    >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
