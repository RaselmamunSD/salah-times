"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import { mosqueService } from "../../services/mosque";
import { useAxios } from "../../providers/AxiosProvider";

const inter = Inter({
  subsets: ["latin"],
});
const lato = Lato({
  subsets: ["latin"],
  weight: ["400"],
});

const monthName = (monthIndex) =>
  new Date(2026, monthIndex, 1).toLocaleString("en-US", { month: "long" });

const formatTimeShort = (value) => {
  if (!value) return "--:--";
  const parts = String(value).split(":");
  return `${parts[0]?.padStart(2, "0") || "--"}:${parts[1]?.padStart(2, "0") || "--"}`;
};

const addMinutes = (timeValue, minutes) => {
  if (!timeValue) return "--:--";
  const [h = "0", m = "0"] = String(timeValue).split(":");
  const date = new Date();
  date.setHours(Number(h), Number(m), 0, 0);
  date.setMinutes(date.getMinutes() + minutes);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
};

const to12Hour = (timeValue) => {
  if (!timeValue || timeValue === "--:--") return "--:--";
  const [h = "0", m = "0"] = String(timeValue).split(":");
  const hour = Number(h);
  const suffix = hour >= 12 ? "PM" : "AM";
  const normalized = hour % 12 || 12;
  return `${String(normalized).padStart(2, "0")}:${String(m).padStart(2, "0")} ${suffix}`;
};

export default function FindMosque() {
  const axios = useAxios();
  const [selectedMosque, setSelectedMosque] = useState(null);
  const [mosques, setMosques] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [jumuahOnly, setJumuahOnly] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [timetableLoading, setTimetableLoading] = useState(false);
  const [timetableData, setTimetableData] = useState([]);
  const [activeMonth, setActiveMonth] = useState(new Date().getMonth());
  const [activeYear, setActiveYear] = useState(new Date().getFullYear());

  const loadFavorites = async () => {
    try {
      const favoritesResponse = await mosqueService.getFavorites();
      const ids = new Set(
        (Array.isArray(favoritesResponse) ? favoritesResponse : [])
          .map((item) => item?.mosque?.id)
          .filter(Boolean)
      );
      setFavoriteIds(ids);
    } catch {
      setFavoriteIds(new Set());
    }
  };

  const buildMosqueItem = (mosque) => ({
    id: mosque.id,
    name: mosque.name,
    city: mosque.city_name || "Dhaka",
    address: mosque.address || "Bangladesh",
    latitude: mosque.latitude ? Number(mosque.latitude) : null,
    longitude: mosque.longitude ? Number(mosque.longitude) : null,
    distanceText: mosque.distance_km ? `${mosque.distance_km} km away` : "N/A",
    nextPrayer: mosque.dhuhr_jamaah
      ? `Next: Dhuhr - ${to12Hour(formatTimeShort(mosque.dhuhr_jamaah))}`
      : "Next prayer time unavailable",
  });

  const fetchMosques = async (params = {}) => {
    setLoading(true);
    try {
      const response = await mosqueService.list(params);
      const items = Array.isArray(response)
        ? response
        : Array.isArray(response?.results)
          ? response.results
          : [];
      setMosques(items.map(buildMosqueItem));
    } catch (error) {
      console.error("Failed to fetch mosques:", error);
      setMosques([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
    fetchMosques();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = {};
      if (searchValue.trim()) {
        params.search = searchValue.trim();
      }
      if (jumuahOnly) {
        params.has_jumuah = true;
      }
      fetchMosques(params);
    }, 350);

    return () => clearTimeout(timeout);
  }, [searchValue, jumuahOnly]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleUseMyLocation = async () => {
    if (!navigator.geolocation) {
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await mosqueService.getNearby(
            position.coords.latitude,
            position.coords.longitude,
            10
          );
          const items = Array.isArray(response) ? response : [];
          setMosques(items.map(buildMosqueItem));
        } catch (error) {
          console.error("Failed to load nearby mosques:", error);
        } finally {
          setLoading(false);
        }
      },
      () => {
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleToggleFavorite = async (mosqueId) => {
    try {
      if (favoriteIds.has(mosqueId)) {
        await mosqueService.removeFavorite(mosqueId);
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          next.delete(mosqueId);
          return next;
        });
      } else {
        await mosqueService.addFavorite(mosqueId);
        setFavoriteIds((prev) => new Set(prev).add(mosqueId));
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  const openModal = async (mosque) => {
    setSelectedMosque(mosque);
    setTimetableLoading(true);
    setTimetableData([]);

    document.body.style.overflow = "hidden";

    try {
      const mosqueDetails = await mosqueService.get(mosque.id);
      const cityId = mosqueDetails?.city;
      if (!cityId) {
        setTimetableLoading(false);
        return;
      }

      const response = await axios.get("/api/prayer-times/monthly/", {
        params: {
          city: cityId,
          month: activeMonth + 1,
          year: activeYear,
        },
      });

      const rows = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.results)
          ? response.data.results
          : [];

      const mappedRows = rows.map((row) => ({
        date: `${row.day} ${monthName((row.month || activeMonth + 1) - 1)} ${row.year || activeYear}`,
        fajr: { a: formatTimeShort(row.fajr), i: addMinutes(formatTimeShort(row.fajr), 15) },
        dhuhr: { a: formatTimeShort(row.dhuhr), i: addMinutes(formatTimeShort(row.dhuhr), 15) },
        asr: { a: formatTimeShort(row.asr), i: addMinutes(formatTimeShort(row.asr), 15) },
        maghrib: { a: formatTimeShort(row.maghrib), i: addMinutes(formatTimeShort(row.maghrib), 5) },
        isha: { a: formatTimeShort(row.isha), i: addMinutes(formatTimeShort(row.isha), 15) },
      }));

      setTimetableData(mappedRows);
    } catch (error) {
      console.error("Failed to fetch monthly timetable:", error);
      setTimetableData([]);
    } finally {
      setTimetableLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedMosque(null);
    document.body.style.overflow = "unset";
  };

  const resultsCount = useMemo(() => mosques.length, [mosques]);

  const mapCenter = useMemo(() => {
    const withCoordinates = mosques.find(
      (mosque) => Number.isFinite(mosque.latitude) && Number.isFinite(mosque.longitude)
    );

    if (withCoordinates) {
      return {
        latitude: withCoordinates.latitude,
        longitude: withCoordinates.longitude,
      };
    }

    return {
      latitude: 23.8103,
      longitude: 90.4125,
    };
  }, [mosques]);

  const mapEmbedUrl = useMemo(() => {
    const delta = 0.05;
    const left = mapCenter.longitude - delta;
    const right = mapCenter.longitude + delta;
    const top = mapCenter.latitude + delta;
    const bottom = mapCenter.latitude - delta;

    return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${mapCenter.latitude}%2C${mapCenter.longitude}`;
  }, [mapCenter.latitude, mapCenter.longitude]);

  const mapLargerUrl = useMemo(
    () =>
      `https://www.openstreetmap.org/?mlat=${mapCenter.latitude}&mlon=${mapCenter.longitude}#map=13/${mapCenter.latitude}/${mapCenter.longitude}`,
    [mapCenter.latitude, mapCenter.longitude]
  );

  const downloadTimetable = (format) => {
    if (!selectedMosque || !timetableData.length) {
      return;
    }

    const lines = [
      `${selectedMosque.name} - Monthly Prayer Timetable`,
      `Month: ${monthName(activeMonth)} ${activeYear}`,
      "",
      "Date | Fajr(A/I) | Dhuhr(A/I) | Asr(A/I) | Maghrib(A/I) | Isha(A/I)",
      ...timetableData.map(
        (row) =>
          `${row.date} | ${row.fajr.a}/${row.fajr.i} | ${row.dhuhr.a}/${row.dhuhr.i} | ${row.asr.a}/${row.asr.i} | ${row.maghrib.a}/${row.maghrib.i} | ${row.isha.a}/${row.isha.i}`
      ),
    ];

    if (format === "pdf") {
      const blob = new Blob([lines.join("\n")], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${selectedMosque.name.replace(/\s+/g, "-")}-timetable.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = 1400;
    canvas.height = Math.max(900, 120 + timetableData.length * 28);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#1E293B";
    ctx.font = "bold 28px Arial";
    ctx.fillText(`${selectedMosque.name} - ${monthName(activeMonth)} ${activeYear}`, 40, 60);
    ctx.font = "16px Arial";

    let y = 100;
    timetableData.forEach((row) => {
      const rowText = `${row.date}  |  F:${row.fajr.a}/${row.fajr.i}  D:${row.dhuhr.a}/${row.dhuhr.i}  A:${row.asr.a}/${row.asr.i}  M:${row.maghrib.a}/${row.maghrib.i}  I:${row.isha.a}/${row.isha.i}`;
      ctx.fillText(rowText, 40, y);
      y += 26;
    });

    const imageUrl = canvas.toDataURL("image/jpeg", 0.95);
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `${selectedMosque.name.replace(/\s+/g, "-")}-timetable.jpg`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20 relative">
      {/* Hero Header Section */}
      <div className="py-[196px] text-center bg-gradient-to-b from-[#1F8A5B] to-[#1F6F8B] w-full">
        <h1
          className={`font-bold text-4xl md:text-[66px] text-white ${lato.className}`}
        >
          <span className="text-[#26FFA0] italic">Find</span> a Mosque
        </h1>
        <p className={`md:text-2xl text-[#D0E0FF] ${inter.className} mt-4`}>
          Discover mosques near you with accurate prayer times
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
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-sm text-slate-700 focus:outline-none placeholder:text-gray-400 bg-transparent"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setJumuahOnly((prev) => !prev)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#F2F9F5] text-[#238B57] px-6 py-3 rounded-lg text-sm font-semibold hover:bg-[#e4f2eb] transition-colors"
            >
              <Filter size={16} /> Filters
            </button>
            <button
              onClick={handleUseMyLocation}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#1E8A5E] text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-[#17734d] transition-colors shadow-sm"
            >
              <Navigation size={16} className="rotate-45 -ml-1" /> Use My
              Location
            </button>
          </div>
        </div>

        {/* Results Header */}
        <div className="mb-4 text-sm text-slate-500">
          Found <span className="font-bold text-slate-800">{resultsCount}</span> mosques
          {jumuahOnly && (
            <span className="ml-2 text-[#238B57] font-medium">(Jumuah filter on)</span>
          )}
        </div>

        {/* Grid Layout: Map & Cards */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Map View */}
          <div className="md:col-span-5 h-[400px] md:h-[calc(100vh-320px)] md:sticky md:top-6 rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-[#E5E3DF] relative">
            <iframe
              title="Map"
              src={mapEmbedUrl}
              className="absolute inset-0 w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <a
              href={mapLargerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-4 left-4 bg-white px-3 py-1.5 rounded shadow text-xs font-medium text-[#238B57] z-10"
            >
              View larger map
            </a>
          </div>

          {/* Right Column: Mosque Cards */}
          <div className="md:col-span-7 space-y-4">
            {!loading && mosques.length === 0 && (
              <div className="bg-white rounded-xl p-6 text-sm text-slate-500 border border-gray-100">
                No mosques found.
              </div>
            )}

            {mosques.map((mosque, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-5 md:p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 relative hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => handleToggleFavorite(mosque.id)}
                  className="absolute top-5 right-5 text-[#F59E0B] hover:scale-110 transition-transform"
                >
                  <Star
                    size={20}
                    strokeWidth={1.5}
                    fill={favoriteIds.has(mosque.id) ? "currentColor" : "none"}
                  />
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
                    <span>{mosque.distanceText}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <Clock size={14} className="text-[#238B57]" />
                    <span>{mosque.nextPrayer}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-50">
                  <button
                    onClick={() => openModal(mosque)}
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
                  {selectedMosque.name} - {monthName(activeMonth)} {activeYear}
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
                    {timetableLoading && (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-8 text-sm text-slate-500"
                        >
                          Loading timetable...
                        </td>
                      </tr>
                    )}

                    {!timetableLoading && timetableData.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-8 text-sm text-slate-500"
                        >
                          No timetable data available for this month.
                        </td>
                      </tr>
                    )}

                    {!timetableLoading && timetableData.map((row, idx) => (
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
                Updated for {monthName(activeMonth)} {activeYear}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => downloadTimetable("jpg")}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#2C7B65] hover:bg-[#226350] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  <Download size={16} />
                  Download JPG
                </button>
                <button
                  onClick={() => downloadTimetable("pdf")}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#238B57] hover:bg-[#1A6E44] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
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
