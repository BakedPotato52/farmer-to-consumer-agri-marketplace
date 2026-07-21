'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { updateProfileAction } from './actions';
import { FarmerProfile } from '@/lib/types';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
    >
      {pending ? 'Saving Changes...' : 'Save Changes'}
    </button>
  );
}

export default function ProfileForm({ profile }: { profile: FarmerProfile }) {
  const [state, formAction] = useActionState(updateProfileAction, null);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {state?.success && (
        <div className="bg-emerald-50 text-emerald-700 p-4 m-6 mb-0 rounded-lg text-sm font-medium border border-emerald-100">
          {state.message}
        </div>
      )}
      {state?.error && (
        <div className="bg-red-50 text-red-700 p-4 m-6 mb-0 rounded-lg text-sm font-medium border border-red-100">
          {state.error}
        </div>
      )}

      <form action={formAction} className="p-6 sm:p-8 space-y-8">
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2">Basic Information</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="farmName" className="block text-sm font-medium text-gray-700">Farm Name *</label>
              <input type="text" id="farmName" name="farmName" defaultValue={profile.farmName} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
            </div>

            <div className="space-y-2">
              <label htmlFor="farmingMethod" className="block text-sm font-medium text-gray-700">Farming Method *</label>
              <select id="farmingMethod" name="farmingMethod" defaultValue={profile.farmingMethod} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white">
                <option value="organic">Organic</option>
                <option value="conventional">Conventional</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="cropTypes" className="block text-sm font-medium text-gray-700">Crop Types (comma separated)</label>
              <input type="text" id="cropTypes" name="cropTypes" defaultValue={profile.cropTypes.join(', ')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" placeholder="e.g. Wheat, Tomatoes, Potatoes" />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Farm Description</label>
              <textarea id="description" name="description" rows={5} defaultValue={profile.description} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"></textarea>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2">Location</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="farmLocation" className="block text-sm font-medium text-gray-700">Farm Address / Location *</label>
              <input type="text" id="farmLocation" name="farmLocation" defaultValue={profile.farmLocation} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
            </div>

            <div className="space-y-2">
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">State *</label>
              <input type="text" id="state" name="state" defaultValue={profile.state} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
            </div>

            <div className="space-y-2">
              <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">Pincode *</label>
              <input type="text" id="pincode" name="pincode" defaultValue={profile.pincode} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
