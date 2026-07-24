"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateProfileAction } from "./actions";
import { FarmerProfile } from "@/lib/types";
import ImageUpload from "@/components/ui/ImageUpload";
import { MdStorefront } from "react-icons/md";
import { RiProgress5Line } from "react-icons/ri";
import { FaCheckCircle, FaExclamationTriangle, FaRegSave } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full sm:w-auto bg-primary text-on-primary px-8 py-3.5 rounded-xl font-heading text-sm font-semibold hover:bg-primary-container transition-all active:scale-[0.98] organic-shadow flex items-center justify-center gap-2 disabled:opacity-50"
    >
      {pending ? (
        <>
          <span className="material-symbols-outlined animate-spin text-[20px]"><RiProgress5Line /></span>
          Updating...
        </>
      ) : (
        <>
            <span className="material-symbols-outlined text-[20px]"><FaRegSave /></span>
            Save Changes
        </>
      )}
    </button>
  );
}

export default function ProfileForm({ profile }: { profile: FarmerProfile }) {
  const [state, formAction] = useActionState(updateProfileAction, null);

  return (
    <div className="glass-card organic-shadow rounded-3xl p-6 md:p-8 space-y-8">
      {state?.success && (
        <div className="p-4 rounded-xl bg-secondary-container/40 text-on-secondary-container border border-secondary/20 text-xs font-semibold flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]"><FaCheckCircle /></span>
          {state.message}
        </div>
      )}
      {state?.error && (
        <div className="p-4 rounded-xl bg-error-container/30 text-on-error-container border border-error/20 text-xs font-semibold flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]"><FaExclamationTriangle /></span>
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-8">
        {/* Section 1: Basic Farm Information */}
        <div className="space-y-6">
          <h2 className="font-heading text-lg font-bold text-primary flex items-center gap-2 border-b border-outline-variant/10 pb-3">
            <span className="material-symbols-outlined text-[20px]"><MdStorefront /></span>
            1. Farm Identity & Bio
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="farmName" className="block text-xs font-bold text-outline uppercase tracking-wider">
                Farm Name *
              </label>
              <input
                type="text"
                id="farmName"
                name="farmName"
                defaultValue={profile.farmName}
                required
                className="w-full px-4 py-3 bg-white border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 text-on-surface"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="farmingMethod" className="block text-xs font-bold text-outline uppercase tracking-wider">
                Farming Method *
              </label>
              <select
                id="farmingMethod"
                name="farmingMethod"
                defaultValue={profile.farmingMethod}
                required
                className="w-full px-4 py-3 bg-white border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 text-on-surface font-medium"
              >
                <option value="organic">Organic Certified</option>
                <option value="conventional">Conventional</option>
                <option value="mixed">Mixed Methods</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="cropTypes" className="block text-xs font-bold text-outline uppercase tracking-wider">
                Primary Crop Types (comma-separated)
              </label>
              <input
                type="text"
                id="cropTypes"
                name="cropTypes"
                defaultValue={profile.cropTypes.join(", ")}
                className="w-full px-4 py-3 bg-white border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 text-on-surface"
                placeholder="Tomatoes, Kale, Berries..."
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="description" className="block text-xs font-bold text-outline uppercase tracking-wider">
                Farm Story & Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                defaultValue={profile.description}
                className="w-full px-4 py-3 bg-white border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 text-on-surface resize-none"
                placeholder="Share your farm heritage, soil care techniques, and harvest philosophy..."
              />
            </div>

            <div className="sm:col-span-2">
              <ImageUpload
                label="Farm Hero Banner Image (Cloudinary Powered)"
                name="bannerImage"
                initialImages={profile.bannerImage ? [profile.bannerImage] : []}
                multiple={false}
                maxFiles={1}
              />
            </div>

            <div className="sm:col-span-2">
              <ImageUpload
                label="Farm Logo / Profile Avatar (Cloudinary Powered)"
                name="farmImage"
                initialImages={profile.farmImage ? [profile.farmImage] : []}
                multiple={false}
                maxFiles={1}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Location */}
        <div className="space-y-6">
          <h2 className="font-heading text-lg font-bold text-primary flex items-center gap-2 border-b border-outline-variant/10 pb-3">
            <span className="material-symbols-outlined text-[20px]"><FaLocationDot /></span>
            2. Farm Location Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="farmLocation" className="block text-xs font-bold text-outline uppercase tracking-wider">
                Address / City *
              </label>
              <input
                type="text"
                id="farmLocation"
                name="farmLocation"
                defaultValue={profile.farmLocation}
                required
                className="w-full px-4 py-3 bg-white border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 text-on-surface"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="state" className="block text-xs font-bold text-outline uppercase tracking-wider">
                State *
              </label>
              <input
                type="text"
                id="state"
                name="state"
                defaultValue={profile.state}
                required
                className="w-full px-4 py-3 bg-white border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 text-on-surface"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="pincode" className="block text-xs font-bold text-outline uppercase tracking-wider">
                Pincode *
              </label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                defaultValue={profile.pincode}
                required
                className="w-full px-4 py-3 bg-white border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 text-on-surface"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-outline-variant/10 flex justify-end">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
