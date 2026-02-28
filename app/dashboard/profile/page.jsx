"use client";

import React, { useState, useRef, useEffect } from "react";
import { MapPin, Lock, Camera, X } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/app/providers/AuthProvider";
import authService from "@/app/services/auth";

export default function UserProfile() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const fileInputRef = useRef(null);

  // Helper to ensure we always have an absolute URL for images
  const getAbsoluteImageUrl = (url) => {
    if (!url) return null;

    // If backend already returned a full URL, just use it
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // Otherwise, prefix with API base URL so Next.js can load the image correctly
    const baseUrl =
      typeof window !== "undefined"
        ? process.env.NEXT_PUBLIC_API_URL || window.location.origin
        : process.env.NEXT_PUBLIC_API_URL || "";

    return `${baseUrl}${url}`;
  };

  // Set current image from user context when available
  useEffect(() => {
    if (user?.profile_image) {
      setCurrentImage(getAbsoluteImageUrl(user.profile_image));
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }
      setProfileImage(file);
      setError("");
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("first_name");
    const lastName = formData.get("last_name");

    try {
      // Prepare profile data
      const profileData = new FormData();
      profileData.append("first_name", firstName);
      profileData.append("last_name", lastName);

      // Add profile image if selected
      if (profileImage) {
        profileData.append("profile_image", profileImage);
      }

      await authService.updateProfile(profileData);

      // Refresh user data in context
      await refreshUser();

      setSuccess("Profile updated successfully!");

      // Update current image if new one was uploaded
      if (imagePreview) {
        setCurrentImage(imagePreview);
      }

      // Reset file input
      setProfileImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    } catch (err) {
      console.error("Update profile error:", err);
      const errorMessage = err.response?.data
        ? JSON.stringify(err.response.data)
        : "Failed to update profile. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Determine which image to show: preview > current > placeholder
  const displayImage = imagePreview || currentImage;

  // Build display name from user data
  const displayName = user
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
    : '';
  const displayEmail = user?.email || '';

  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-[#F8F9FA] p-6 md:p-12 text-slate-800">
      {/* Page Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-[#1E293B]">User Profile</h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage your personal information
        </p>
      </header>

      {/* Success Message */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* LEFT COLUMN - Profile Summary */}
        <div className="w-full md:w-1/3">
          <div className="bg-white rounded-2xl p-8 shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col items-center text-center">
            {/* Avatar with Upload Button */}
            <div className="relative mb-4">
              <div className={`w-28 h-28 rounded-full overflow-hidden border-4 border-gray-50 shadow-sm flex items-center justify-center ${!displayImage ? 'bg-gray-100 border-2 border-dashed border-gray-300' : ''}`}>
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt="Profile Picture"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="w-8 h-8 text-gray-400" />
                )}
              </div>

              {/* Remove Button */}
              {imagePreview && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}

              {/* Change Profile Picture Button */}
              <label
                htmlFor="profile-upload"
                className="absolute bottom-1 right-1 bg-[#238B57] hover:bg-[#1a6e44] text-white p-2 rounded-full cursor-pointer shadow-md transition-colors border-2 border-white flex items-center justify-center hover:scale-105 active:scale-95"
                title="Change Profile Picture"
              >
                <Camera size={14} />
                <input
                  id="profile-upload"
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <h2 className="text-xl font-bold text-[#1E293B]">
              {displayName || 'User Name'}
            </h2>
            <p className="text-sm text-slate-400 mb-6 font-medium">
              {displayEmail || 'user@example.com'}
            </p>

            <div className="flex items-center gap-2 text-slate-500 text-[13px] border-t border-gray-50 pt-4 w-full justify-center">
              <MapPin size={16} className="text-slate-400" />
              <span>Dhaka, Bangladesh</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Forms */}
        <div className="w-full md:w-2/3 space-y-6">
          {/* Personal Information Form */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-100">
            <h3 className="text-[17px] font-bold text-[#1E293B] mb-6">
              Personal Information
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-slate-700">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  defaultValue={user?.first_name || ''}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#238B57] focus:border-[#238B57] transition-all bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-bold text-slate-700">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  defaultValue={user?.last_name || ''}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#238B57] focus:border-[#238B57] transition-all bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-bold text-slate-700">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  defaultValue={user?.email || ''}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#238B57] focus:border-[#238B57] transition-all bg-white"
                  disabled
                />
              </div>

              <div className="flex justify-end items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="px-6 py-2.5 rounded-xl text-[14px] font-bold text-slate-500 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl text-[14px] font-bold text-white bg-[#238B57] hover:bg-[#1a6e44] transition-colors shadow-sm disabled:bg-[#238B57]/50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading && (
                    <span className="loading loading-spinner loading-sm"></span>
                  )}
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
    </div >
  );
}

