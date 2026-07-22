"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { loginAction } from "@/lib/auth/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
    >
      {pending ? "Signing in..." : "Sign In"}
    </button>
  );
}

export default function LoginPage() {
  const [role, setRole] = useState<"consumer" | "farmer" | "admin">("consumer");
  const [state, formAction] = useActionState(loginAction, null);

  return (
    <div className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex min-h-[600px]">
      <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Sign in to your FarmFresh account
          </p>
        </div>

        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-6">
          {(["consumer", "farmer", "admin"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg capitalize transition-all duration-300 ${
                role === r
                  ? "bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <form action={formAction} className="space-y-5">
          <input type="hidden" name="role" value={role} />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
              placeholder="Enter your password"
            />
          </div>

          {state?.error && (
            <p className="text-red-500 text-sm mt-2 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-900/50">
              {state.error}
            </p>
          )}

          <SubmitButton />
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
          >
            Register here
          </Link>
        </p>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 text-center space-y-1">
          <p className="font-semibold text-gray-600 dark:text-gray-300">
            Demo Credentials:
          </p>
          <p>Consumer: arjun@email.com / consumer123</p>
          <p>Farmer: rajesh@farmfresh.com / farmer123</p>
          <p>Admin: admin@farmfresh.com / admin123</p>
        </div>
      </div>

      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-emerald-500 to-teal-700 p-12 flex-col justify-center items-center relative overflow-hidden">
        <div
          className="absolute top-10 right-10 text-6xl opacity-20 animate-bounce"
          style={{ animationDuration: "3s" }}
        >
          🌾
        </div>
        <div
          className="absolute bottom-20 left-10 text-6xl opacity-20 animate-bounce"
          style={{ animationDuration: "4s" }}
        >
          🚜
        </div>
        <div className="absolute top-1/2 right-20 text-5xl opacity-20 animate-pulse">
          🍎
        </div>

        <div className="relative z-10 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">FarmFresh</h2>
          <p className="text-emerald-100 text-lg leading-relaxed">
            Connecting local farmers directly with consumers. Fresh produce,
            fair prices, sustainable agriculture.
          </p>
        </div>
      </div>
    </div>
  );
}
