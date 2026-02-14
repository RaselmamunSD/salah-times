"use client";

import React from "react";

export default function ChangePassword() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6 lg:p-12 font-sans text-slate-800">
      {/* Header Section */}
      <div className="max-w-2xl mb-8">
        <h1 className="text-2xl font-bold text-[#1E293B]">Change Password</h1>
        <p className="text-slate-500 text-sm mt-1">
          Update your account password
        </p>
      </div>

      {/* Form Card */}
      <div className="max-w-2xl bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
        <form className="space-y-6">
          {/* Current Password */}
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-slate-700">
              Current Password
            </label>
            <input
              type="password"
              placeholder="Enter current password"
              className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] text-slate-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#238B57] focus:border-[#238B57] transition-all"
            />
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-slate-700">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] text-slate-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#238B57] focus:border-[#238B57] transition-all"
            />
          </div>

          {/* Confirm New Password */}
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-slate-700">
              Confirm New Password
            </label>
            <input
              type="password"
              placeholder="Confirm new password"
              className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] text-slate-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#238B57] focus:border-[#238B57] transition-all"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#238B57] hover:bg-[#1a6e44] text-white font-bold rounded-xl py-4 text-[15px] transition-colors shadow-sm"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
