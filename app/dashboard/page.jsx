"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Star, MapPin, ArrowRight, User, LogOut, Building2, CalendarDays } from "lucide-react";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { useAuth } from "../providers/AuthProvider";
import { useAxios } from "../providers/AxiosProvider";
import { mosqueService } from "../services/mosque";
import TimeCard from "../components/cards/TimeCard";

const DashboardHome = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const axios = useAxios();
  const isImam = Boolean(user?.is_imam || user?.user_type === "imam");

  const [favoritesCount, setFavoritesCount] = useState(null);
  const [locationName, setLocationName] = useState(null);
  const [prayerTimes, setPrayerTimes] = useState([]);
  const [prayerLoading, setPrayerLoading] = useState(true);

  useEffect(() => {
    mosqueService
      .getFavorites()
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.results ?? [];
        setFavoritesCount(list.length);
      })
      .catch(() => setFavoritesCount(0));
  }, []);

  useEffect(() => {
    setPrayerLoading(true);
    const fetchData = async () => {
      try {
        // Get city from profile
        let cityId = null;
        try {
          const profileRes = await axios.get("/api/users/profile/me/");
          if (profileRes.data?.current_city_name) setLocationName(profileRes.data.current_city_name);
          cityId = profileRes.data?.current_city || null;
        } catch { }

        // Find mosque in user's city, fallback to first verified mosque
        let mosqueId = null;
        if (cityId) {
          const res = await mosqueService.list({ city: cityId, limit: 1 });
          const items = Array.isArray(res) ? res : (res?.results ?? []);
          if (items.length > 0) mosqueId = items[0].id;
        }
        if (!mosqueId) {
          const res = await mosqueService.list({ limit: 1 });
          const items = Array.isArray(res) ? res : (res?.results ?? []);
          if (items.length > 0) mosqueId = items[0].id;
        }
        if (!mosqueId) return;

        // Fetch today's prayer times for that mosque
        const data = await mosqueService.getPrayerTimes(mosqueId);
        if (data?.prayer_times) {
          setPrayerTimes(
            data.prayer_times.map((prayer, index) => {
              const isNext = index === data.next_prayer_index;
              if (prayer.name === "Sunrise") {
                return { waqt: prayer.name, time: prayer.time, subTime: null, subLabel: null, isNext: false };
              }
              return {
                waqt: prayer.name,
                time: prayer.jamaah || prayer.time,
                subTime: prayer.beginning || prayer.sunset || null,
                subLabel: prayer.beginning ? "Beginning" : (prayer.sunset ? "Sunset" : null),
                isNext,
              };
            })
          );
        }
      } catch {
        setPrayerTimes([]);
      } finally {
        setPrayerLoading(false);
      }
    };
    fetchData();
  }, [axios]);

  // Get user display name
  const userName = user
    ? `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username || user.email
    : "User";

  const getAbsoluteImageUrl = (url) => {
    if (!url || url === "null" || url === "undefined") return null;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;

    const baseUrl =
      typeof window !== "undefined"
        ? process.env.NEXT_PUBLIC_API_URL || window.location.origin
        : process.env.NEXT_PUBLIC_API_URL || "";

    return `${baseUrl}${url}`;
  };

  const profileImageUrl = getAbsoluteImageUrl(user?.profile_image);

  if (isImam) {
    return (
      <div className="max-w-6xl mx-auto p-8 bg-[#F8F9FA] min-h-screen text-slate-800">
        <header className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-[#1E293B]">Imam Dashboard</h1>
            <p className="text-slate-500 mt-1">Welcome back, {userName}</p>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col h-full">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-[#EEF7FB] rounded-xl flex items-center justify-center text-blue-400">
                <Building2 size={24} color="#1F6F8B" />
              </div>
              <div>
                <div className="text-[17px] font-bold text-[#1E293B] leading-tight">Register Your Mosque</div>
                <div className="text-sm text-slate-500 font-medium">Add, edit, delete mosque information</div>
              </div>
            </div>
            <button
              onClick={() => router.push("/dashboard/imam-mosques")}
              className="mt-auto flex items-center gap-1 text-[13px] font-semibold text-[#1F6F8B] hover:opacity-80 transition-opacity"
            >
              Open mosque manager <ArrowRight size={14} />
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col h-full">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-[#E9F3EE] rounded-xl flex items-center justify-center text-[#238B57]">
                <CalendarDays size={24} />
              </div>
              <div>
                <div className="text-[17px] font-bold text-[#1E293B] leading-tight">Monthly Prayer Timetable</div>
                <div className="text-sm text-slate-500 font-medium">Maintain adhan and iqamah timetable</div>
              </div>
            </div>
            <button
              onClick={() => router.push("/dashboard/imam-mosques")}
              className="mt-auto flex items-center gap-1 text-[13px] font-semibold text-[#238B57] hover:opacity-80 transition-opacity"
            >
              Manage timetable <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8 bg-[#F8F9FA] min-h-screen text-slate-800">
      {/* Header Section */}
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-[#1E293B]">Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back, {userName}</p>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          title="Logout"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </header>

      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Favorite Mosques Card */}
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col h-full">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-[#C9A24D1A]">
              <Star
                size={24}
                fill="currentColor"
                color="#C9A24D"
                fillOpacity={0.2}
              />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#1E293B]">
                {favoritesCount !== null ? favoritesCount : "…"}
              </div>
              <div className="text-sm text-slate-500 font-medium">
                Favorite Mosques
              </div>
            </div>
          </div>
          <button
            onClick={() => router.push("/dashboard/favorite-mosque")}
            className="mt-auto flex items-center gap-1 text-[13px] font-semibold text-[#C9A24D] hover:opacity-80 transition-opacity"
          >
            View all <ArrowRight size={14} />
          </button>
        </div>

        {/* Current Location Card */}
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col h-full">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-[#EEF7FB] rounded-xl flex items-center justify-center text-blue-400">
              <MapPin
                size={24}
                fill="currentColor"
                color="#1F6F8B"
                fillOpacity={0.2}
              />
            </div>
            <div>
              <div className="text-[17px] font-bold text-[#1E293B] leading-tight">
                {locationName || "Not set"}
              </div>
              <div className="text-sm text-slate-500 font-medium">
                Current Location
              </div>
            </div>
          </div>
          <button
            onClick={() => router.push("/dashboard/location")}
            className="mt-auto flex items-center gap-1 text-[13px] font-semibold text-[#1F6F8B] hover:opacity-80 transition-opacity"
          >
            Update location <ArrowRight size={14} />
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col h-full">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100">
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#1b9c5e] text-white">
                  <User size={24} />
                </div>
              )}
            </div>
            <div>
              <div className="text-[17px] font-bold text-[#1E293B] leading-tight">
                Profile
              </div>
              <div className="text-sm text-slate-500 font-medium">
                Manage your account
              </div>
            </div>
          </div>
          <button
            onClick={() => router.push("/dashboard/profile")}
            className="mt-auto flex items-center gap-1 text-[13px] font-semibold text-[#238B57] hover:opacity-80 transition-opacity"
          >
            Edit profile <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Prayer Times Section */}
      <div className="bg-white p-8 rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-100">
        <h2 className="text-xl font-bold text-[#1E293B] mb-6">
          Today's Prayer Times
        </h2>

        {prayerLoading ? (
          <div className="text-center text-slate-400 py-6">Loading…</div>
        ) : prayerTimes.length === 0 ? (
          <div className="text-center text-slate-400 py-6">No prayer times available for today.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {prayerTimes.map((item, index) => (
              <TimeCard key={index} time={item} isNext={item.isNext} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Wrap with ProtectedRoute to ensure only authenticated users can access
const ProtectedDashboard = () => {
  return (
    <ProtectedRoute>
      <DashboardHome />
    </ProtectedRoute>
  );
};

export default ProtectedDashboard;

