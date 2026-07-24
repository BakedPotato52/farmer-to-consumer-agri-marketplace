"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { loginAction } from "@/lib/auth/actions";
import {
  MdAgriculture,
  MdLock,
  MdMail,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import { FaLeaf } from "react-icons/fa6";
import { RiErrorWarningLine } from "react-icons/ri";

const HERO_IMAGE = "login_image.jpg";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-4 bg-primary text-on-primary font-heading text-sm font-semibold rounded-xl organic-shadow hover:bg-primary-container transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
    >
      {pending ? "Signing in..." : "Sign In"}
    </button>
  );
}

export default function LoginPage() {
  const [role, setRole] = useState<"consumer" | "farmer" | "admin">("consumer");
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction] = useActionState(loginAction, null);

  return (
    <main className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-surface">
      {/* ── Left: Login Form ── */}
      <section className="w-full h-dvh md:w-[45%] lg:w-[40%] flex items-center justify-center p-8 md:p-16 lg:p-24 bg-surface z-10 relative">
        <div className="w-full max-w-md">
          {/* Brand */}
          <div className="mb-12">
            <h1 className="font-heading flex items-center gap-2 text-3xl font-bold text-primary tracking-tight">
              <span
                className="material-symbols-outlined text-primary text-3xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                <MdAgriculture />
              </span>
              <span className="font-heading text-2xl font-bold text-primary tracking-tight">
                FarmFresh
              </span>
            </h1>
            <p className="text-on-surface-variant mt-2">
              Welcome back to the source of goodness.
            </p>
          </div>

          {/* Form */}
          <form action={formAction} className="space-y-6">
            <input type="hidden" name="role" value={role} />

            {/* Role Selector */}
            <div className="mb-8">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-3 block">
                Are you a...
              </label>
              <div className="flex p-1 bg-surface-container-low rounded-xl border border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setRole("consumer")}
                  className={`flex-1 py-3 px-4 text-sm font-semibold rounded-lg z-10 transition-all duration-200 ${
                    role === "consumer"
                      ? "bg-primary text-on-primary shadow-sm"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  Consumer
                </button>
                <button
                  type="button"
                  onClick={() => setRole("farmer")}
                  className={`flex-1 py-3 px-4 text-sm font-semibold rounded-lg z-10 transition-all duration-200 ${
                    role === "farmer"
                      ? "bg-primary text-on-primary shadow-sm"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  Farmer
                </button>
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`flex-1 py-3 px-4 text-sm font-semibold rounded-lg z-10 transition-all duration-200 ${
                    role === "admin"
                      ? "bg-primary text-on-primary shadow-sm"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label
                className="text-sm font-semibold text-on-surface-variant"
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                  <MdMail />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white border border-outline-variant/30 rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm placeholder:text-outline"
                  placeholder="name@email.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label
                  className="text-sm font-semibold text-on-surface-variant"
                  htmlFor="password"
                >
                  Password
                </label>
                <a
                  className="text-sm font-semibold text-primary hover:underline decoration-primary/30"
                  href="#"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                  <MdLock />
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-12 pr-12 py-4 bg-white border border-outline-variant/30 rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm placeholder:text-outline"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                  </span>
                </button>
              </div>
            </div>

            {/* Keep me logged in */}
            <div className="flex items-center space-x-3">
              <input
                id="remember"
                type="checkbox"
                className="w-5 h-5 rounded-md border-outline-variant/50 text-primary focus:ring-primary/20 cursor-pointer"
              />
              <label
                className="text-on-surface-variant select-none cursor-pointer"
                htmlFor="remember"
              >
                Keep me logged in
              </label>
            </div>

            {/* Error */}
            {state?.error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-error-container/30 border border-error/20">
                <span className="material-symbols-outlined text-error text-[18px]">
                  <RiErrorWarningLine />
                </span>
                <p className="text-sm text-on-error-container">{state.error}</p>
              </div>
            )}

            {/* CTA */}
            <SubmitButton />

            {/* Create Account */}
            <p className="text-center text-on-surface-variant pt-2">
              New here?{" "}
              <Link
                className="text-primary font-semibold hover:underline decoration-primary/30"
                href="/register"
              >
                Create an account
              </Link>
            </p>
          </form>

          {/* Demo credentials
          <div className="mt-8 pt-6 border-t border-outline-variant/10 text-xs text-outline text-center space-y-1">
            <p className="font-semibold text-on-surface-variant uppercase tracking-wider text-[10px]">Demo Credentials</p>
            <p>Consumer: arjun@email.com / consumer123</p>
            <p>Farmer: rajesh@farmfresh.com / farmer123</p>
            <p>Admin: admin@farmfresh.com / admin123</p>
          </div> */}
        </div>
      </section>

      {/* ── Right: Immersive Photography ── */}
      <section className="hidden md:block md:w-[55%] lg:w-[60%] overflow-hidden h-dvh sticky top-0">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-105"
          style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-primary/60 via-transparent to-black/20" />

        {/* Eco Badge */}
        <div className="absolute top-12 right-12">
          <div className="glass-card py-3 px-5 rounded-full flex items-center gap-3 organic-shadow">
            <span
              className="material-symbols-outlined text-primary-container"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              <FaLeaf />
            </span>
            <span className="text-sm font-semibold text-on-primary-fixed">
              Eco-Certified Marketplace
            </span>
          </div>
        </div>

        {/* Content Panel */}
        <div className="absolute inset-0 flex flex-col items-center justify-end p-16 lg:p-24 space-y-6">
          <div className="glass-card p-8 lg:p-12 rounded-4xl max-w-xl organic-shadow">
            <span className="inline-block py-1 px-3 bg-primary-container text-on-primary-container rounded-full text-xs font-medium mb-4 uppercase tracking-widest">
              The FarmFresh Promise
            </span>
            <h2 className="font-heading text-4xl lg:text-5xl font-bold text-on-primary-fixed mb-4 leading-tight">
              Connecting you to the source.
            </h2>
            <p className="text-on-primary-fixed/90 text-lg max-w-lg leading-relaxed">
              Empowering local farmers and bringing the freshest organic yields
              directly to your table, bypassing the industrial complex.
            </p>
            <div className="flex gap-12 mt-8">
              <div>
                <p className="font-heading text-3xl font-bold text-shadow-on-primary-fixed-variant">
                  100%
                </p>
                <p className="text-xs text-on-primary-fixed/70 uppercase tracking-widest font-medium">
                  Traceable
                </p>
              </div>
              <div>
                <p className="font-heading text-3xl font-bold text-shadow-on-primary-fixed-variant">
                  24h
                </p>
                <p className="text-xs text-on-primary-fixed/70 uppercase tracking-widest font-medium">
                  Farm-to-Table
                </p>
              </div>
              <div>
                <p className="font-heading text-3xl font-bold text-shadow-on-primary-fixed-variant">
                  5k+
                </p>
                <p className="text-xs text-on-primary-fixed/70 uppercase tracking-widest font-medium">
                  Local Farmers
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
