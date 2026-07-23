"use client";

import { useState } from "react";

export default function PlatformSettings() {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="glass-card p-6 md:p-8 rounded-3xl organic-shadow">
        <h1 className="font-heading text-3xl font-extrabold text-primary">Platform Configuration & Settings</h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Manage commission parameters, support contacts, notification toggles, and global marketplace defaults.
        </p>
      </div>

      <div className="glass-card organic-shadow rounded-3xl p-6 md:p-8 space-y-8">
        {isSaved && (
          <div className="p-4 rounded-xl bg-secondary-container/40 text-on-secondary-container border border-secondary/20 text-xs font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            Platform settings updated successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          {/* Section 1: General Platform Details */}
          <div className="space-y-6">
            <h2 className="font-heading text-lg font-bold text-primary flex items-center gap-2 border-b border-outline-variant/10 pb-3">
              <span className="material-symbols-outlined text-[20px]">tune</span>
              1. General Information & Identity
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-outline uppercase tracking-wider">
                  Marketplace Name
                </label>
                <input
                  type="text"
                  defaultValue="FarmFresh Direct"
                  className="w-full px-4 py-3 bg-white border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 text-on-surface"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-outline uppercase tracking-wider">
                  Customer Support Email
                </label>
                <input
                  type="email"
                  defaultValue="support@farmfresh.com"
                  className="w-full px-4 py-3 bg-white border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 text-on-surface"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Commission & Financials */}
          <div className="space-y-6">
            <h2 className="font-heading text-lg font-bold text-primary flex items-center gap-2 border-b border-outline-variant/10 pb-3">
              <span className="material-symbols-outlined text-[20px]">percent</span>
              2. Financial Parameters
            </h2>

            <div className="max-w-md space-y-2">
              <label className="block text-xs font-bold text-outline uppercase tracking-wider">
                Platform Commission Fee (%)
              </label>
              <p className="text-xs text-outline">
                Percentage cut automatically deducted on each completed consumer order.
              </p>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  defaultValue="5.0"
                  className="w-full px-4 py-3 bg-white border border-outline-variant/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 text-on-surface font-heading font-bold"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-outline font-bold">%</span>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-6 border-t border-outline-variant/10 flex justify-end">
            <button
              type="submit"
              className="bg-primary text-on-primary px-8 py-3.5 rounded-xl font-heading text-sm font-semibold hover:bg-primary-container transition-all active:scale-[0.98] organic-shadow flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">save</span>
              Save Platform Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
