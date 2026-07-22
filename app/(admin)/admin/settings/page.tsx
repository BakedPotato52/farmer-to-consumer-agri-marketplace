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
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Platform Settings
        </h1>
        <p className="text-gray-500 mt-1">
          Configure global marketplace parameters and preferences.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
              General Settings
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Platform Name
                </label>
                <input
                  type="text"
                  defaultValue="FarmFresh"
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500 py-2.5 px-3 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Support Email
                </label>
                <input
                  type="email"
                  defaultValue="support@farmfresh.com"
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500 py-2.5 px-3 border"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
              Financials
            </h2>

            <div className="max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Platform Commission Rate (%)
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Percentage fee taken from each successful order.
              </p>
              <div className="relative rounded-lg shadow-sm">
                <input
                  type="number"
                  step="0.1"
                  defaultValue="5.0"
                  className="w-full border-gray-300 rounded-lg pr-8 focus:border-emerald-500 focus:ring-emerald-500 py-2.5 px-3 border"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex items-center gap-4">
            <button
              type="submit"
              className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-sm"
            >
              Save Changes
            </button>

            {isSaved && (
              <span className="text-sm text-emerald-600 font-medium flex items-center gap-1 animate-in fade-in">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Settings saved successfully
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
