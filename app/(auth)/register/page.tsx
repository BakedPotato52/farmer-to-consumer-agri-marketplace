"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { registerAction } from "@/lib/auth/actions";
import { MdAgriculture, MdCheckCircle, MdEgg, MdGrass, MdLock, MdMail, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { FaArrowLeft, FaRegArrowAltCircleLeft, FaShoppingBasket } from "react-icons/fa";
import { FaArrowRight, FaLeaf, FaRegUser } from "react-icons/fa6";
import { AiOutlineReload } from "react-icons/ai";
import { BiLocationPlus } from "react-icons/bi";
import { IoNutritionOutline } from "react-icons/io5";
import { LuFlower2 } from "react-icons/lu";

/* ─── Crop Tag Data ─── */
const CROP_OPTIONS = [
  { label: "Vegetables", icon: <FaLeaf /> },
  { label: "Fruits", icon: <IoNutritionOutline /> },
  { label: "Grains", icon: <MdGrass /> },
  { label: "Flowers", icon: <LuFlower2 /> },
  { label: "Dairy & Eggs", icon: <MdEgg /> },
];

const FARMING_METHODS = [
  { value: "organic", label: "Organic Certified", sub: "Verified Status" },
  { value: "regenerative", label: "Regenerative", sub: "Soil Health" },
  { value: "hydroponic", label: "Hydroponic", sub: "Water Efficient" },
];

/* ─── Submit Button ─── */
function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full md:w-auto px-10 py-4 bg-primary text-on-primary rounded-xl font-heading text-sm font-semibold hover:bg-primary-container shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed organic-shadow"
    >
      {pending ? (
        <>
          <span className="material-symbols-outlined animate-spin text-[20px]"><AiOutlineReload /></span>
          Processing...
        </>
      ) : (
        <>
          {label}
          <span className="material-symbols-outlined text-[20px]">
            {label.includes("Complete") ? <MdCheckCircle /> : <FaArrowRight />}
          </span>
        </>
      )}
    </button>
  );
}

/* ─── Page ─── */
export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"consumer" | "farmer">("consumer");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [state, formAction] = useActionState(registerAction, null);

  const totalSteps = role === "farmer" ? 2 : 1;
  const isLastStep = step >= totalSteps;

  const toggleCrop = (crop: string) => {
    setSelectedCrops((prev) => (prev.includes(crop) ? prev.filter((c) => c !== crop) : [...prev, crop]));
  };

  const toggleMethod = (method: string) => {
    setSelectedMethods((prev) => (prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]));
  };

  const handleNextStep = (e: React.MouseEvent) => {
    e.preventDefault();
    if (step < totalSteps) setStep(step + 1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-background">
      {/* ── Radial BG ── */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 0% 0%, #fff1eb 0%, transparent 50%), radial-gradient(circle at 100% 100%, #ffeae1 0%, transparent 50%)",
        }}
      />

      {/* ── Header ── */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-center py-6">
        <Link href="/" className="flex items-center gap-2">
          <span
            className="material-symbols-outlined text-primary text-3xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            <MdAgriculture />
          </span>
          <span className="font-heading text-2xl font-bold text-primary tracking-tight">FarmFresh</span>
        </Link>
      </header>

      {/* ── Main ── */}
      <main className="w-full max-w-135 mt-24 mb-10 px-4">
        {/* Progress Bar */}
        <div className="w-full mb-6">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-semibold text-on-surface-variant">
              Step {step} of {totalSteps}
            </span>
            <span className="text-sm font-bold text-primary">
              {step === 1 ? "Personal Details" : "Farm Details"}
            </span>
          </div>
          <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* ── Step 1: Personal Details Card ── */}
        {step === 1 && (
          <div className="glass-card rounded-3xl p-8 md:p-12 organic-shadow flex flex-col gap-8">
            <div className="text-center space-y-2">
              <h1 className="font-heading text-3xl font-bold text-on-surface">
                Join the FarmFresh Community
              </h1>
              <p className="text-on-surface-variant">
                Experience the bounty of local, organic agriculture delivered with modern precision.
              </p>
            </div>

            <form action={isLastStep ? formAction : undefined} className="flex flex-col gap-6">
              <input type="hidden" name="role" value={role} />
              <input type="hidden" name="cropTypes" value={selectedCrops.join(",")} />
              <input type="hidden" name="farmingMethod" value={selectedMethods.join(",")} />

              {/* Role Selection */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-on-surface-variant block">
                  I want to join as a:
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {/* Consumer */}
                  <button
                    type="button"
                    onClick={() => setRole("consumer")}
                    className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all duration-300 ${role === "consumer"
                      ? "bg-secondary-container/20 border-secondary ring-1 ring-secondary"
                      : "border-outline-variant/30 bg-surface/50 hover:border-secondary/50"
                      }`}
                  >
                    <span className="material-symbols-outlined text-3xl text-on-surface-variant">
                      <FaShoppingBasket />
                    </span>
                    <span className="text-sm font-semibold">Consumer</span>
                  </button>
                  {/* Farmer */}
                  <button
                    type="button"
                    onClick={() => setRole("farmer")}
                    className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all duration-300 ${role === "farmer"
                      ? "bg-secondary-container/20 border-secondary ring-1 ring-secondary"
                      : "border-outline-variant/30 bg-surface/50 hover:border-secondary/50"
                      }`}
                  >
                    <span className="material-symbols-outlined text-3xl text-on-surface-variant">
                      <MdAgriculture />
                    </span>
                    <span className="text-sm font-semibold">Farmer</span>
                  </button>
                </div>
              </div>

              {/* Input Fields */}
              <div className="space-y-4">
                {/* Full Name */}
                <div className="relative">
                  <label className="sr-only" htmlFor="full_name">Full Name</label>
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-outline">
                    <span className="material-symbols-outlined text-[20px]"><FaRegUser /></span>
                  </div>
                  <input
                    id="full_name"
                    name="name"
                    type="text"
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-outline-variant/30 bg-surface/50 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="Full Name"
                  />
                </div>

                {/* Email */}
                <div className="relative">
                  <label className="sr-only" htmlFor="reg_email">Email Address</label>
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-outline">
                    <span className="material-symbols-outlined text-[20px]"><MdMail /></span>
                  </div>
                  <input
                    id="reg_email"
                    name="email"
                    type="email"
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-outline-variant/30 bg-surface/50 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="Email Address"
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <label className="sr-only" htmlFor="reg_password">Password</label>
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-outline">
                    <span className="material-symbols-outlined text-[20px]"><MdLock /></span>
                  </div>
                  <input
                    id="reg_password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    className="w-full pl-12 pr-12 py-4 rounded-xl border border-outline-variant/30 bg-surface/50 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-4 flex items-center text-outline hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                    </span>
                  </button>
                </div>

                {/* Hidden fields for consumer flow */}
                {role === "consumer" && (
                  <>
                    <input type="hidden" name="phone" value="" />
                    <input type="hidden" name="address" value="" />
                  </>
                )}
              </div>

              {/* Error */}
              {state?.error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-error-container/30 border border-error/20">
                  <span className="material-symbols-outlined text-error text-[18px]">error</span>
                  <p className="text-sm text-on-error-container">{state.error}</p>
                </div>
              )}

              {/* Action Button */}
              {isLastStep ? (
                <SubmitButton label="Create Account" />
              ) : (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="group w-full bg-primary text-on-primary py-4 rounded-xl text-sm font-semibold hover:bg-primary-container transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden organic-shadow"
                >
                  <span className="relative z-10">Continue to Step 2</span>
                  <span className="material-symbols-outlined relative z-10 group-hover:translate-x-1 transition-transform text-[20px]">
                    <FaArrowRight />
                  </span>
                </button>
              )}
            </form>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-sm text-on-surface-variant">
                Already have an account?{" "}
                <Link className="text-primary font-bold hover:underline decoration-secondary" href="/login">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        )}

      </main>
      {/* ── Step 2: Farm Details (Farmer Only) ── */}
      {step === 2 && role === "farmer" && (
        <div className="glass-card organic-shadow rounded-3xl overflow-hidden">
          {/* Header */}
          <div className="p-8 md:p-12 border-b border-outline-variant/10 bg-surface-container-low/30">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-on-surface mb-2">
              Tell us about your land
            </h1>
            <p className="text-on-surface-variant max-w-xl">
              We use these details to connect you with local buyers who value your specific farming practices and
              seasonal yields.
            </p>
          </div>

          {/* Form */}
          <form action={formAction} className="p-8 md:p-12 space-y-8">
            <input type="hidden" name="role" value="farmer" />
            {/* Carry forward step-1 data via hidden fields */}
            <input type="hidden" name="cropTypes" value={selectedCrops.join(",")} />
            <input type="hidden" name="farmingMethod" value={selectedMethods[0] || "organic"} />

            {/* We need step-1 fields to be submitted too — they're in the DOM from step 1 but hidden.
                  For the server action to work, we duplicate the personal fields here. */}
            <input type="hidden" name="name" id="carry_name" />
            <input type="hidden" name="email" id="carry_email" />
            <input type="hidden" name="password" id="carry_password" />
            <input type="hidden" name="phone" value="" />
            <input type="hidden" name="address" value="" />

            {/* Farm Identity Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-on-surface-variant ml-1">Farm Name</label>
                <input
                  name="farmName"
                  type="text"
                  required
                  className="w-full bg-white/50 border border-outline-variant/30 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-outline text-on-surface"
                  placeholder="e.g., Willow Creek Organics"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-on-surface-variant ml-1">
                  Location (City, State)
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant text-[20px]">
                    <BiLocationPlus />
                  </span>
                  <input
                    name="farmLocation"
                    type="text"
                    required
                    className="w-full bg-white/50 border border-outline-variant/30 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-outline text-on-surface"
                    placeholder="Sonoma, CA"
                  />
                </div>
              </div>
            </div>

            {/* Hidden state/pincode fields for server action compatibility */}
            <input type="hidden" name="state" value="" />
            <input type="hidden" name="pincode" value="" />

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface-variant ml-1">Farm Description</label>
              <textarea
                name="description"
                rows={4}
                className="w-full bg-white/50 border border-outline-variant/30 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-outline resize-none text-on-surface"
                placeholder="Share your story, your mission, and what makes your produce unique..."
                />
              </div>

            {/* Crop Types — Tag Selector */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-on-surface-variant ml-1">
                Primary Crop Types
                </label>
              <div className="flex flex-wrap gap-2">
                {CROP_OPTIONS.map((crop) => (
                  <button
                    key={crop.label}
                    type="button"
                    onClick={() => toggleCrop(crop.label)}
                    className={`px-5 py-2 rounded-full border text-sm transition-all duration-300 flex items-center gap-2 ${selectedCrops.includes(crop.label)
                      ? "bg-secondary-container text-on-secondary-container border-secondary"
                      : "border-outline-variant/30 hover:border-primary/50"
                      }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{crop.icon}</span>
                    {crop.label}
                  </button>
                ))}
              </div>
              </div>

            {/* Farming Methods */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-on-surface-variant ml-1">Farming Methods</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {FARMING_METHODS.map((method) => (
                  <label
                    key={method.value}
                    className={`relative flex items-center p-4 rounded-2xl border cursor-pointer transition-all group ${selectedMethods.includes(method.value)
                      ? "bg-primary-fixed/20 border-primary"
                      : "border-outline-variant/20 bg-white/40 hover:bg-white/60"
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedMethods.includes(method.value)}
                      onChange={() => toggleMethod(method.value)}
                      className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary transition-all"
                    />
                    <div className="ml-3">
                      <span className="block text-sm font-semibold text-on-surface">{method.label}</span>
                      <span className="text-[10px] text-outline uppercase tracking-wider">{method.sub}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Error */}
            {state?.error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-error-container/30 border border-error/20">
                <span className="material-symbols-outlined text-error text-[18px]">error</span>
                <p className="text-sm text-on-error-container">{state.error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="order-2 md:order-1 flex items-center gap-2 text-on-surface-variant text-sm font-semibold hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]"><FaRegArrowAltCircleLeft /></span>
                Back to Personal Info
              </button>
              <div className="order-1 md:order-2 w-full md:w-auto">
                <SubmitButton label="Complete Registration" />
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ── Footer ── */}
      <footer className="w-full py-8 px-4 text-center mt-auto">
        <p className="text-xs text-on-surface-variant">
          © {new Date().getFullYear()} FarmFresh Marketplace. Modern Organic Agriculture.
        </p>
      </footer>
    </div>
  );
}
