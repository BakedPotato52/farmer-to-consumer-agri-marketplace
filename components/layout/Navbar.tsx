"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar({ session }: { session?: { name: string; role: string } | null }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass shadow-sm py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl md:text-3xl transition-transform group-hover:scale-110">🌱</span>
            <span className="text-xl md:text-2xl font-bold tracking-tight font-heading gradient-text">
              FarmFresh
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium hover:text-brand-600 transition-colors">Home</Link>
            <Link href="/products" className="text-sm font-medium hover:text-brand-600 transition-colors">Products</Link>
            <Link href="/farmers" className="text-sm font-medium hover:text-brand-600 transition-colors">Farmers</Link>
            <Link href="/about" className="text-sm font-medium hover:text-brand-600 transition-colors">About</Link>
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-5">
            <button className="p-2 hover:bg-brand-50 rounded-full transition-colors text-gray-700 dark:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </button>
            
            <Link href="/cart" className="relative p-2 hover:bg-brand-50 rounded-full transition-colors text-gray-700 dark:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
              <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-accent-500 text-[10px] font-bold text-white">
                3
              </span>
            </Link>

            {session ? (
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-200 hover:border-brand-300 transition-colors">
                  <div className="h-6 w-6 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-bold">
                    {session.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium">{session.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                  <div className="py-2">
                    <Link href={session.role === 'admin' ? '/admin' : session.role === 'farmer' ? '/dashboard' : '/profile'} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-brand-50 dark:hover:bg-gray-700">
                      Dashboard
                    </Link>
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-brand-50 dark:hover:bg-gray-700">
                      Profile
                    </Link>
                    <form action="/api/auth/logout" method="POST">
                      <button type="submit" className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                        Logout
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm font-medium hover:text-brand-600 transition-colors">Log in</Link>
                <Link href="/register" className="text-sm font-medium bg-brand-600 text-white px-4 py-2 rounded-full hover:bg-brand-700 transition-colors shadow-sm hover:shadow-md">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 text-gray-700 dark:text-gray-200"
            onClick={() => setMobileMenuOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-black/50 md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="absolute right-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-900 shadow-xl p-6 animate-shimmer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-bold font-heading gradient-text">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            
            <nav className="flex flex-col gap-4">
              <Link href="/" className="text-lg font-medium border-b border-gray-100 pb-2">Home</Link>
              <Link href="/products" className="text-lg font-medium border-b border-gray-100 pb-2">Products</Link>
              <Link href="/farmers" className="text-lg font-medium border-b border-gray-100 pb-2">Farmers</Link>
              <Link href="/about" className="text-lg font-medium border-b border-gray-100 pb-2">About</Link>
              <Link href="/cart" className="text-lg font-medium border-b border-gray-100 pb-2 flex justify-between">
                Cart
                <span className="bg-accent-500 text-white text-xs py-1 px-2 rounded-full">3</span>
              </Link>
            </nav>
            
            <div className="mt-8 flex flex-col gap-3">
              {session ? (
                <>
                  <div className="font-medium mb-2 text-brand-700">Hi, {session.name}</div>
                  <Link href={session.role === 'admin' ? '/admin' : session.role === 'farmer' ? '/dashboard' : '/profile'} className="bg-brand-50 text-brand-700 px-4 py-2 rounded-lg text-center font-medium">
                    Dashboard
                  </Link>
                  <form action="/api/auth/logout" method="POST">
                    <button type="submit" className="w-full text-center px-4 py-2 text-red-600 border border-red-200 rounded-lg font-medium">
                      Logout
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login" className="w-full text-center px-4 py-2 border border-brand-200 text-brand-700 rounded-lg font-medium">
                    Log in
                  </Link>
                  <Link href="/register" className="w-full text-center px-4 py-2 bg-brand-600 text-white rounded-lg font-medium">
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
