"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

export default function AccountSettings() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6 lg:p-12">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Account Settings</h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage your account preferences
        </p>
      </div>

      {/* Settings Sections */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Notification Preferences */}
        <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100">
          <h2 className="text-base font-bold text-slate-800 mb-6">
            Notification Preferences
          </h2>

          <div className="space-y-6">
            {/* Item 1 */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">
                  Prayer Time Notifications
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Receive notifications for prayer times
                </p>
              </div>
              {/* Checkbox Placeholder to match the image */}
              <div className="w-[22px] h-[22px] bg-slate-600 rounded-md cursor-pointer hover:bg-slate-700 transition-colors"></div>
            </div>

            {/* Item 2 */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">
                  Mosque Updates
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Get updates from your favorite mosques
                </p>
              </div>
              {/* Checkbox Placeholder */}
              <div className="w-[22px] h-[22px] bg-slate-600 rounded-md cursor-pointer hover:bg-slate-700 transition-colors"></div>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100">
          <h2 className="text-base font-bold text-slate-800 mb-6">
            Privacy Settings
          </h2>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                Location Services
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Allow app to access your location
              </p>
            </div>
            {/* Checkbox Placeholder */}
            <div className="w-[22px] h-[22px] bg-slate-600 rounded-md cursor-pointer hover:bg-slate-700 transition-colors"></div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50/50 rounded-xl p-6 md:p-8 border border-red-100">
          <h2 className="text-base font-bold text-red-600 mb-2">Danger Zone</h2>
          <p className="text-sm text-slate-500 mb-6">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <button className="bg-[#E50000] hover:bg-red-700 text-white font-medium text-sm px-6 py-2.5 rounded-lg transition-colors shadow-sm">
            Delete Account
          </button>
        </div>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#1E7461] hover:bg-[#165a4b] rounded-full flex items-center justify-center shadow-lg text-white transition-transform hover:scale-105 active:scale-95 z-50">
        <MessageCircle size={24} fill="white" />
      </button>
    </div>
  );
}
