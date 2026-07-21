"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { registerAction } from "@/lib/auth/actions";

function SubmitButton({ isLastStep }: { isLastStep: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-6 rounded-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg ml-auto"
    >
      {pending ? "Processing..." : isLastStep ? "Create Account" : "Next Step"}
    </button>
  );
}

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"consumer" | "farmer">("consumer");
  const [state, formAction] = useActionState(registerAction, null);

  const totalSteps = role === "farmer" ? 3 : 2;

  const nextStep = (e: React.MouseEvent) => {
    e.preventDefault();
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = (e: React.MouseEvent) => {
    e.preventDefault();
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden p-8 sm:p-12 my-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Join FarmFresh</h1>
        <p className="text-gray-500 dark:text-gray-400">Create your account to get started</p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-10">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                step >= i + 1
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-500"
              }`}
            >
              {i + 1}
            </div>
            {i < totalSteps - 1 && (
              <div
                className={`w-16 h-1 transition-colors duration-300 ${
                  step > i + 1 ? "bg-emerald-600" : "bg-gray-200 dark:bg-gray-800"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <form action={formAction} className="space-y-6">
        <input type="hidden" name="role" value={role} />

        {/* STEP 1: Role Selection */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">How do you want to use FarmFresh?</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole("consumer")}
                className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 ${
                  role === "consumer"
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-emerald-300"
                }`}
              >
                <div className="text-3xl mb-3">🛒</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Consumer</h3>
                <p className="text-sm text-gray-500 mt-1">Buy fresh produce directly from local farmers.</p>
              </button>
              
              <button
                type="button"
                onClick={() => setRole("farmer")}
                className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 ${
                  role === "farmer"
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-emerald-300"
                }`}
              >
                <div className="text-3xl mb-3">🚜</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Farmer</h3>
                <p className="text-sm text-gray-500 mt-1">Sell your harvest directly to consumers.</p>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Basic Info */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Basic Information</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input type="text" name="name" required className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input type="email" name="email" required className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                <input type="password" name="password" required minLength={6} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                <input type="tel" name="phone" required className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
              <textarea name="address" required rows={2} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none"></textarea>
            </div>
          </div>
        )}

        {/* STEP 3: Farmer Details */}
        {step === 3 && role === "farmer" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Farm Details</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Farm Name</label>
                <input type="text" name="farmName" required className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location / City</label>
                <input type="text" name="farmLocation" required className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
                <input type="text" name="state" required className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pincode</label>
                <input type="text" name="pincode" required className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Crop Types (comma separated)</label>
                <input type="text" name="cropTypes" placeholder="e.g. Wheat, Potatoes, Tomatoes" required className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Farming Method</label>
                <select name="farmingMethod" required className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none">
                  <option value="organic">Organic</option>
                  <option value="conventional">Conventional</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Farm Description</label>
                <textarea name="description" required rows={3} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none"></textarea>
              </div>
            </div>
          </div>
        )}

        {state?.error && (
          <p className="text-red-500 text-sm mt-2 bg-red-50 p-3 rounded-xl">
            {state.error}
          </p>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            >
              Back
            </button>
          ) : (
            <div></div> // Empty div for spacing
          )}
          
          {step < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-6 rounded-xl transition-all shadow-md"
            >
              Next Step
            </button>
          ) : (
            <SubmitButton isLastStep={true} />
          )}
        </div>
      </form>

      <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{" "}
        <Link href="/login" className="text-emerald-600 font-medium hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
