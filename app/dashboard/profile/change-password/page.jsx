"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";

export default function ChangePassword() {
  const router = useRouter();
  const { changePassword } = useAuth();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      setError("All password fields are required.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const result = await changePassword(
        formData.oldPassword,
        formData.newPassword,
        formData.confirmPassword
      );

      if (!result.success) {
        setError(result.error || "Password change failed.");
        return;
      }

      setSuccess("Password updated successfully.");
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });

      setTimeout(() => {
        router.push("/dashboard/profile");
      }, 1200);
    } catch {
      setError("Password change failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6 md:p-12 font-sans text-slate-800">
      {/* Header Section */}
      <div className="max-w-2xl mb-8">
        <h1 className="text-2xl font-bold text-[#1E293B]">Change Password</h1>
        <p className="text-slate-500 text-sm mt-1">
          Update your account password
        </p>
      </div>

      {success && (
        <div className="max-w-2xl mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          {success}
        </div>
      )}

      {error && (
        <div className="max-w-2xl mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Form Card */}
      <div className="max-w-2xl bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password */}
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-slate-700">
              Current Password
            </label>
            <input
              type="password"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleInputChange}
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
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
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
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm new password"
              className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] text-slate-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#238B57] focus:border-[#238B57] transition-all"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#238B57] hover:bg-[#1a6e44] text-white font-bold rounded-xl py-4 text-[15px] transition-colors shadow-sm disabled:bg-[#238B57]/60 disabled:cursor-not-allowed"
            >
              {loading ? "Updating Password..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
