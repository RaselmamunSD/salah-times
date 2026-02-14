"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  MapPin,
  Star,
  Navigation,
  Clock,
  CalendarDays,
  MessageCircle,
  X,
  Download,
  Calendar,
} from "lucide-react";
import { Inter, Lato } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});
const lato = Lato({
  subsets: ["latin"],
  weight: ["400"],
});

// Mock data based on the screenshot
const mosques = Array(4).fill({
  name: "Baitul Mukarram National Mosque",
  city: "Dhaka",
  address: "Dhaka 1000, Bangladesh",
  distance: "2.3 km away",
  nextPrayer: "Next: Dhuhr - 12:30 PM",
});

// Generate realistic mock data for February 2026 to populate the modal table
const timetableData = Array.from({ length: 28 }, (_, i) => {
  const day = i + 1;
  // Slowly incrementing times to simulate real prayer time progression
  const adhanFajr = `05:${String(25 + Math.floor(day / 6)).padStart(2, "0")}`;
  const iqamahFajr = `05:${String(40 + Math.floor(day / 6)).padStart(2, "0")}`;

  return {
    date: `${day} February 2026`,
    fajr: { a: adhanFajr, i: iqamahFajr },
    dhuhr: { a: "12:10", i: "12:30" },
    asr: {
      a: `03:${String(25 + Math.floor(day / 5)).padStart(2, "0")}`,
      i: `03:${String(40 + Math.floor(day / 5)).padStart(2, "0")}`,
    },
    maghrib: {
      a: `05:${String(50 + Math.floor(day / 4)).padStart(2, "0")}`,
      i: `05:${String(55 + Math.floor(day / 4)).padStart(2, "0")}`,
    },
    isha: {
      a: `07:${String(5 + Math.floor(day / 3)).padStart(2, "0")}`,
      i: `07:${String(25 + Math.floor(day / 3)).padStart(2, "0")}`,
    },
  };
});

export default function FindMosque() {
  const [selectedMosque, setSelectedMosque] = useState(null);

  const openModal = (mosqueName) => {
    setSelectedMosque(mosqueName);

    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedMosque(null);
    document.body.style.overflow = "unset";
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20 relative">
      {/* Hero Header Section */}
      <div className="py-[196px] text-center bg-gradient-to-b from-[#1F8A5B] to-[#1F6F8B] w-full">
        <h1
          className={`font-bold text-4xl lg:text-[66px] text-white ${lato.className}`}
        >
          <span className="text-[#26FFA0] italic">About</span> Salaah-Times
        </h1>
        <p className={`lg:text-2xl text-[#D0E0FF] ${inter.className} mt-4`}>
          Your reliable Islamic digital companion for accurate prayer times
          across
          <br />
          United Kingdom.
        </p>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-10">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-2 md:p-3 flex flex-col md:flex-row items-center gap-3 mb-8">
          <div className="relative flex-1 w-full">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by mosque name or area..."
              className="w-full pl-12 pr-4 py-3 text-sm text-slate-700 focus:outline-none placeholder:text-gray-400 bg-transparent"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#F2F9F5] text-[#238B57] px-6 py-3 rounded-lg text-sm font-semibold hover:bg-[#e4f2eb] transition-colors">
              <Filter size={16} /> Filters
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#1E8A5E] text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-[#17734d] transition-colors shadow-sm">
              <Navigation size={16} className="rotate-45 -ml-1" /> Use My
              Location
            </button>
          </div>
        </div>

        {/* Results Header */}
        <div className="mb-4 text-sm text-slate-500">
          Found <span className="font-bold text-slate-800">5</span> mosques
        </div>

        {/* Grid Layout: Map & Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Map View */}
          <div className="lg:col-span-5 h-[400px] lg:h-[calc(100vh-320px)] lg:sticky lg:top-6 rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-[#E5E3DF] relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="absolute top-4 left-4 bg-white px-3 py-1.5 rounded shadow text-xs font-medium text-[#1A73E8]">
              View larger map
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <MapPin
                size={32}
                fill="#EA4335"
                className="text-[#C5221F] drop-shadow-md"
              />
              <div className="w-4 h-1 bg-black/20 rounded-[100%] mt-1 blur-[1px]"></div>
            </div>
            <div className="absolute bottom-6 right-2 flex flex-col bg-white rounded shadow-sm overflow-hidden">
              <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 border-b border-gray-100 font-bold text-lg">
                +
              </button>
              <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 font-bold text-xl">
                −
              </button>
            </div>
          </div>

          {/* Right Column: Mosque Cards */}
          <div className="lg:col-span-7 space-y-4">
            {mosques.map((mosque, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-5 md:p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 relative hover:shadow-md transition-shadow"
              >
                <button className="absolute top-5 right-5 text-[#F59E0B] hover:scale-110 transition-transform">
                  <Star size={20} strokeWidth={1.5} />
                </button>

                <div className="flex gap-4 mb-5">
                  <div className="w-14 h-14 bg-[#1E6B65] rounded-xl flex items-center justify-center text-2xl shadow-inner flex-shrink-0">
                    🕌
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-slate-800 pr-8">
                      {mosque.name}
                    </h3>
                    <div className="flex flex-col text-[13px] text-slate-500 mt-1">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={12} /> {mosque.city}
                      </span>
                      <span className="ml-4.5">{mosque.address}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 text-[13px] text-slate-600 mb-5">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Navigation
                      size={14}
                      className="text-[#238B57] rotate-45"
                    />
                    <span>{mosque.distance}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <Clock size={14} className="text-[#238B57]" />
                    <span>{mosque.nextPrayer}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-50">
                  <button
                    onClick={() => openModal(mosque.name)}
                    className="flex items-center gap-2 text-[13px] font-bold text-[#1E7461] hover:text-[#165a4b] transition-colors"
                  >
                    <CalendarDays size={16} />
                    View Monthly Timetable
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* TIMETABLE MODAL */}
      {/* ========================================= */}
      {selectedMosque && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#1C815A] px-6 py-4 flex items-start justify-between text-white shrink-0">
              <div>
                <h2 className="text-xl font-bold">Monthly Prayer Timetable</h2>
                <p className="text-sm text-white/80 mt-1">
                  {selectedMosque} - February 2026
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Top Dotted Border Separator */}
            <div className="w-full border-b-[3px] border-dotted border-[#5B9BD5] opacity-50"></div>

            {/* Modal Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto px-6 py-4 bg-white">
              {/* Legend */}
              <div className="bg-[#F2F8F5] border border-gray-100 rounded-lg p-3 mb-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm">
                <span className="font-bold text-slate-700">
                  Prayer Time Legend
                </span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div>
                    Adhan (Beginning Time)
                  </div>
                  <div className="flex items-center gap-1.5 text-[#238B57] font-medium">
                    <div className="w-2.5 h-2.5 rounded-sm bg-[#238B57]"></div>
                    Iqamah (Congregation Time)
                  </div>
                </div>
              </div>

              {/* Timetable */}
              <div className="overflow-x-auto rounded-lg border border-[#D1E5D9]">
                <table className="w-full text-center border-collapse whitespace-nowrap">
                  {/* Table Header */}
                  <thead className="bg-[#1C815A] text-white">
                    <tr>
                      <th className="py-3 px-4 font-semibold text-left border-r border-white/20 w-32">
                        Date
                      </th>
                      {["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].map(
                        (prayer) => (
                          <th
                            key={prayer}
                            className="py-2 px-2 font-medium border-r last:border-r-0 border-white/20 w-24"
                          >
                            <div className="font-bold">{prayer}</div>
                            <div className="text-[10px] text-white/70 font-normal">
                              Adhan / Iqamah
                            </div>
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  {/* Table Body */}
                  <tbody>
                    {timetableData.map((row, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-[#D1E5D9] hover:bg-[#F9FCFA] transition-colors"
                      >
                        <td className="py-2.5 px-4 text-sm font-semibold text-slate-700 text-left border-r border-[#D1E5D9]">
                          {row.date}
                        </td>
                        {[
                          row.fajr,
                          row.dhuhr,
                          row.asr,
                          row.maghrib,
                          row.isha,
                        ].map((time, tIdx) => (
                          <td
                            key={tIdx}
                            className="py-2.5 px-2 border-r last:border-r-0 border-[#D1E5D9]"
                          >
                            <div className="text-xs text-slate-500 font-medium mb-0.5">
                              {time.a}
                            </div>
                            <div className="text-xs text-[#238B57] font-bold">
                              {time.i}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Note Footer inside content */}
              <div className="mt-4 flex items-start gap-2 bg-[#F8FAFC] p-3 rounded-lg border border-gray-100 text-xs text-slate-500">
                <Calendar
                  size={14}
                  className="mt-0.5 text-slate-400 shrink-0"
                />
                <p>
                  <span className="font-bold text-slate-600">Note:</span> Prayer
                  times may vary slightly. Please confirm with the mosque
                  administration. Times shown are for February 2026.
                </p>
              </div>
            </div>

            {/* Bottom Dotted Border Separator */}
            <div className="w-full border-t-[3px] border-dotted border-[#5B9BD5] opacity-50"></div>

            {/* Modal Footer */}
            <div className="bg-white p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                <Calendar size={16} className="text-[#EA4335]" />
                Updated for February 2026
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#2C7B65] hover:bg-[#226350] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
                  <Download size={16} />
                  Download JPG
                </button>
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#238B57] hover:bg-[#1A6E44] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
                  <Download size={16} />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
