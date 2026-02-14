"use client";

import React from "react";
import { MapPin, Lock, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function UserProfile() {
  return (
    <div className="min-h-screen max-w-7xl mx-auto  bg-[#F8F9FA] p-6 lg:p-12 text-slate-800">
      {/* Page Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-[#1E293B]">User Profile</h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage your personal information
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT COLUMN - Profile Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-2xl p-8 shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col items-center text-center">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-gray-50 mb-4 shadow-sm">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                alt="Abdullah Rahman"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-xl font-bold text-[#1E293B]">
              Abdullah Rahman
            </h2>
            <p className="text-sm text-slate-400 mb-6 font-medium">
              abdullah@example.com
            </p>

            <div className="flex items-center gap-2 text-slate-500 text-[13px] border-t border-gray-50 pt-4 w-full justify-center">
              <MapPin size={16} className="text-slate-400" />
              <span>Dhaka, Bangladesh</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Forms */}
        <div className="w-full lg:w-2/3 space-y-6">
          {/* Personal Information Form */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-100">
            <h3 className="text-[17px] font-bold text-[#1E293B] mb-6">
              Personal Information
            </h3>

            <form className="space-y-5">
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-slate-700">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue="Abdullah Rahman"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#238B57] focus:border-[#238B57] transition-all bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-bold text-slate-700">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue="abdullah@example.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#238B57] focus:border-[#238B57] transition-all bg-white"
                />
              </div>

              <div className="flex justify-end items-center gap-3 pt-4">
                <button
                  type="button"
                  className="px-6 py-2.5 rounded-xl text-[14px] font-bold text-slate-500 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-[14px] font-bold text-white bg-[#238B57] hover:bg-[#1a6e44] transition-colors shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Password Section */}
          <div className="bg-white rounded-2xl p-6 px-8 shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-[15px] font-bold text-[#1E293B]">Password</h3>
              <p className="text-[12px] text-slate-400 mt-0.5">
                Last changed 30 days ago
              </p>
            </div>
            <Link
              href="/dashboard/profile/change-password"
              className="flex items-center gap-2 text-[13px] font-bold text-[#238B57] hover:underline decoration-2 underline-offset-4"
            >
              <Lock size={16} />
              Change Password
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
