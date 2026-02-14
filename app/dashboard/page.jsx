"use client";
import logo from "../../public/logo.png";
import React from "react";
import { Star, MapPin, ArrowRight, User } from "lucide-react";
import Image from "next/image";

const DashboardHome = () => {
  const prayerTimes = [
    { name: "Fajr", time: "05:45 AM" },
    { name: "Sunrise", time: "07:12 AM" },
    { name: "Dhuhr", time: "12:30 PM" },
    { name: "Asr", time: "03:45 PM" },
    { name: "Maghrib", time: "05:58 PM" },
    { name: "Isha", time: "07:25 PM" },
  ];

  return (
    <div className="max-w-6xl mx-auto p-8 bg-[#F8F9FA] min-h-screen text-slate-800">
      {/* Header Section */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[#1E293B]">Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back, Abdullah Rahman</p>
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
              <div className="text-2xl font-bold text-[#1E293B]">2</div>
              <div className="text-sm text-slate-500 font-medium">
                Favorite Mosques
              </div>
            </div>
          </div>
          <button className="mt-auto flex items-center gap-1 text-[13px] font-semibold text-[#C9A24D] hover:opacity-80 transition-opacity">
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
                Dhaka, Bangladesh
              </div>
              <div className="text-sm text-slate-500 font-medium">
                Current Location
              </div>
            </div>
          </div>
          <button className="mt-auto flex items-center gap-1 text-[13px] font-semibold text-[#1F6F8B] hover:opacity-80 transition-opacity">
            Update location <ArrowRight size={14} />
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col h-full">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100">
              {/* Replace with your actual image path */}
              <Image
                width={"fill"}
                height={"fill"}
                src={logo}
                alt="Profile"
                className="w-full h-full object-cover"
              />
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
          <button className="mt-auto flex items-center gap-1 text-[13px] font-semibold text-[#238B57] hover:opacity-80 transition-opacity">
            Edit profile <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Prayer Times Section */}
      <div className="bg-white p-8 rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-100">
        <h2 className="text-xl font-bold text-[#1E293B] mb-6">
          Today's Prayer Times
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {prayerTimes.map((item, index) => (
            <div
              key={index}
              className="bg-[#F0F7FF] rounded-xl py-5 px-4 flex flex-col items-center justify-center text-center transition-transform hover:scale-[1.02] cursor-default"
            >
              <span className="text-[13px] text-slate-500 font-medium mb-1">
                {item.name}
              </span>
              <span className="text-[15px] font-bold text-[#1E293B]">
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
