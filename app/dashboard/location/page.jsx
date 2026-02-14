"use client";

import React from "react";
import { MapPin } from "lucide-react";

export default function LocationManagement() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6 lg:p-12">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          Location Management
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage your location for accurate prayer times
        </p>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Current Location Card */}
        <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100">
          <h2 className="text-base font-bold text-slate-800 mb-6">
            Current Location
          </h2>

          <div className="space-y-6">
            {/* Input Field Area */}
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                Location
              </label>
              <input
                type="text"
                readOnly
                value="Dhaka, Bangladesh (GPS)"
                className="w-full bg-gray-50/50 border border-gray-200 rounded-lg px-4 py-3 text-[14px] text-slate-500 focus:outline-none cursor-default"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button className="flex items-center gap-2 bg-[#216B7B] hover:bg-[#1a5562] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                <MapPin size={16} />
                Use GPS Location
              </button>

              <button className="bg-[#E9F3EE] hover:bg-[#dcece4] text-[#238B57] px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
                Change Manually
              </button>
            </div>
          </div>
        </div>

        {/* Location Note Card */}
        <div className="bg-[#F2F8FA] rounded-xl p-6 md:p-8 border border-[#E5F0F4]">
          <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-1.5">
            <span>📍</span> Location Note
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Your location is used to show accurate prayer times based on your
            geographical position. When you update your location, prayer times
            will automatically update to match your new area.
          </p>
        </div>
      </div>
    </div>
  );
}
