"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Filter,
  X,
} from "lucide-react";
import { Inter, Lato } from "next/font/google";
import { mosqueService } from "../../services/mosque";
import MosqueCard from "@/app/components/cards/MosqueCard";

const inter = Inter({ subsets: ["latin"] });
const lato = Lato({ subsets: ["latin"], weight: ["400"] });

//new logics
const DEFAULT_VISIBLE_MOSQUES = 6;

const monthName = (monthIndex) =>
  new Date(2026, monthIndex, 1).toLocaleString("en-US", { month: "long" });

const formatTimeShort = (value) => {
  if (!value) return "--:--";
  try {
    const [h, m] = String(value).split(":").map(Number);
    const period = h < 12 ? "AM" : "PM";
    const h12 = h % 12 || 12;
    return `${h12}:${String(m).padStart(2, "0")} ${period}`;
  } catch {
    return "--:--";
  }
};

const haversineDistanceKm = (lat1, lon1, lat2, lon2) => {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};











export default function FindMosque({ currentLocation, refreshKey }) {

  //new
  const [mosques, setMosques] = useState([]);
  const [selectedMosque, setSelectedMosque] = useState(null);
  const [timetableLoading, setTimetableLoading] = useState(false);
  const [timetableData, setTimetableData] = useState([]);
  const [showAllMosques, setShowAllMosques] = useState(false);
  const [liveLocation, setLiveLocation] = useState(null);
  const [activeMonth] = useState(new Date().getMonth());
  const [activeYear] = useState(new Date().getFullYear());
  const geocodeCacheRef = useRef(new Map());
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLiveLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => { },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 15000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    const fetchMosques = async () => {
      try {
        let response = [];
        let favoriteIds = new Set();
        const liveLat = toNumber(liveLocation?.latitude);
        const liveLng = toNumber(liveLocation?.longitude);
        const currentLat = toNumber(currentLocation?.latitude);
        const currentLng = toNumber(currentLocation?.longitude);
        const queryLat = liveLat ?? currentLat;
        const queryLng = liveLng ?? currentLng;

        try {
          const favoritesResponse = await mosqueService.getFavorites();
          const favorites = Array.isArray(favoritesResponse) ? favoritesResponse : [];
          favoriteIds = new Set(favorites.map((item) => item?.mosque?.id).filter(Boolean));
        } catch {
          favoriteIds = new Set();
        }

        if (queryLat !== null && queryLng !== null) {
          response = await mosqueService.getNearby(
            queryLat,
            queryLng,
            10
          );

          const nearbyItems = Array.isArray(response)
            ? response
            : Array.isArray(response?.results)
              ? response.results
              : [];

          // If no nearby result, fall back to general mosque list so cards remain visible.
          if (nearbyItems.length === 0) {
            response = await mosqueService.list();
          }
        } else {
          response = await mosqueService.list();
        }

        const items = Array.isArray(response)
          ? response
          : Array.isArray(response?.results)
            ? response.results
            : [];

        const geocodeMosque = async (mosque) => {
          if (!googleMapsApiKey) return { lat: null, lng: null };

          const addressParts = [mosque?.address, mosque?.city_name, "Bangladesh"]
            .filter(Boolean)
            .join(", ");
          if (!addressParts) return { lat: null, lng: null };

          if (geocodeCacheRef.current.has(addressParts)) {
            return geocodeCacheRef.current.get(addressParts);
          }

          try {
            const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(addressParts)}&key=${googleMapsApiKey}`;
            const res = await fetch(url);
            if (!res.ok) return { lat: null, lng: null };
            const data = await res.json();
            const loc = data?.results?.[0]?.geometry?.location;
            const result = {
              lat: toNumber(loc?.lat),
              lng: toNumber(loc?.lng),
            };
            geocodeCacheRef.current.set(addressParts, result);
            return result;
          } catch {
            return { lat: null, lng: null };
          }
        };

        const formatted = await Promise.all(items.map(async (mosque) => {
          let mosqueLat = toNumber(mosque.latitude);
          let mosqueLng = toNumber(mosque.longitude);
          if (mosqueLat === null || mosqueLng === null) {
            const geo = await geocodeMosque(mosque);
            mosqueLat = geo.lat;
            mosqueLng = geo.lng;
          }
          const userLat = queryLat;
          const userLng = queryLng;

          let distance = null;
          if (
            userLat !== null &&
            userLng !== null &&
            mosqueLat !== null &&
            mosqueLng !== null
          ) {
            distance = haversineDistanceKm(userLat, userLng, mosqueLat, mosqueLng).toFixed(1);
          }

          return {
            id: mosque.id,
            name: mosque.name,
            location: mosque.city_name || mosque.address || "Dhaka",
            latitude: mosqueLat,
            longitude: mosqueLng,
            distance,
            prayer: "Dhuhr",
            time: "12:30 PM",
            isFavorite: favoriteIds.has(mosque.id),
          };
        }));

        setMosques(formatted);
      } catch {
        setMosques([]);
      }
    };

    fetchMosques();
  }, [currentLocation?.latitude, currentLocation?.longitude, liveLocation?.latitude, liveLocation?.longitude, refreshKey, googleMapsApiKey]);

  const handleFavoriteChanged = (mosqueId, isFavorite) => {
    setMosques((prev) =>
      prev.map((item) =>
        item.id === mosqueId ? { ...item, isFavorite } : item
      )
    );
  };





  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

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

  const displayedMosques = showAllMosques
    ? mosques
    : mosques.slice(0, DEFAULT_VISIBLE_MOSQUES);
  const canToggleViewAll = mosques.length > DEFAULT_VISIBLE_MOSQUES;
  console.log(mosques);






  // previous

  const [searchValue, setSearchValue] = useState("");
  const [jumuahOnly, setJumuahOnly] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  // 1. Setup Live Location Watcher
  useEffect(() => {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLiveLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => { },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 15000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // 2. Geocoding helper
  const geocodeMosque = async (mosque) => {
    if (!googleMapsApiKey) return { lat: null, lng: null };
    const addressParts = [mosque?.address, mosque?.city_name, "Bangladesh"]
      .filter(Boolean)
      .join(", ");
    if (!addressParts) return { lat: null, lng: null };
    if (geocodeCacheRef.current.has(addressParts)) return geocodeCacheRef.current.get(addressParts);

    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(addressParts)}&key=${googleMapsApiKey}`;
      const res = await fetch(url);
      if (!res.ok) return { lat: null, lng: null };
      const data = await res.json();
      const loc = data?.results?.[0]?.geometry?.location;
      const result = { lat: toNumber(loc?.lat), lng: toNumber(loc?.lng) };
      geocodeCacheRef.current.set(addressParts, result);
      return result;
    } catch {
      return { lat: null, lng: null };
    }
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
      if (error?.response?.status === 401) window.location.href = "/login";
    }
  };

  const openModal = (mosque) => {
    setSelectedMosque(mosque);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedMosque(null);
    document.body.style.overflow = "unset";
  };

  // Timetable Fetching
  useEffect(() => {
    if (!selectedMosque) return;
    const loadTimetable = async () => {
      setTimetableLoading(true);
      try {
        const res = await mosqueService.getMonthlyTimetable(selectedMosque.id, {
          month: activeMonth + 1,
          year: activeYear,
        });
        const rows = Array.isArray(res) ? res : res?.results || [];
        setTimetableData(rows.map(row => ({
          date: `${row.day} ${monthName(activeMonth)} ${activeYear}`,
          fajr: { a: formatTimeShort(row.fajr_adhan), i: formatTimeShort(row.fajr_iqamah) },
          sunrise: formatTimeShort(row.sunrise),
          dhuhr: { a: formatTimeShort(row.dhuhr_adhan), i: formatTimeShort(row.dhuhr_iqamah) },
          asr: { a: formatTimeShort(row.asr_adhan), i: formatTimeShort(row.asr_iqamah) },
          maghrib: { a: formatTimeShort(row.maghrib_adhan), i: formatTimeShort(row.maghrib_iqamah) },
          isha: { a: formatTimeShort(row.isha_adhan), i: formatTimeShort(row.isha_iqamah) },
        })));
      } catch { setTimetableData([]); }
      finally { setTimetableLoading(false); }
    };
    loadTimetable();
  }, [selectedMosque, activeMonth, activeYear]);

  const mapCenter = useMemo(() => ({
    lat: mosques[0]?.latitude || 23.8103,
    lng: mosques[0]?.longitude || 90.4125
  }), [mosques]);

  const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${mapCenter.lng - 0.05}%2C${mapCenter.lat - 0.05}%2C${mapCenter.lng + 0.05}%2C${mapCenter.lat + 0.05}&layer=mapnik&marker=${mapCenter.lat}%2C${mapCenter.lng}`;

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20 relative">
      {/* Hero Header */}
      <div className="py-[196px] text-center bg-gradient-to-b from-[#1F8A5B] to-[#1F6F8B] w-full">
        <h1 className={`font-bold text-4xl md:text-[66px] text-white ${lato.className}`}>
          <span className="text-[#26FFA0] italic">Find</span> a Mosque
        </h1>
        <p className={`md:text-2xl text-[#D0E0FF] ${inter.className} mt-4`}>
          Discover mosques near you with accurate prayer times
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-10">
        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-lg p-3 flex flex-col md:flex-row items-center gap-3 mb-8">
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by mosque name or area..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-sm focus:outline-none bg-transparent"
            />
          </div>
          <button
            onClick={() => setJumuahOnly(!jumuahOnly)}
            className={`px-6 py-3 rounded-lg text-sm font-semibold transition-colors ${jumuahOnly ? "bg-[#1E8A5E] text-white" : "bg-[#F2F9F5] text-[#238B57]"}`}
          >
            <Filter size={16} className="inline mr-2" /> {jumuahOnly ? "Jumuah Only" : "Filters"}
          </button>
          <button className="btn text-white bg-[#1F8A5B] rounded-lg">Use My Location</button>
        </div>

        {/* Results Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Map Column */}
          <div className="md:col-span-5 h-[400px] md:h-[calc(100vh-320px)] md:sticky md:top-6 rounded-xl overflow-hidden shadow-sm bg-[#E5E3DF] relative">
            <iframe title="Map" src={mapEmbedUrl} className="absolute inset-0 w-full h-full border-0" />
          </div>

          {/* Mosque List Column */}
          <div className="md:col-span-7 space-y-4">
            {loading ? (
              <div className="p-10 text-center text-slate-500">Searching mosques...</div>
            ) : (
              mosques.map((mosque) => (
                <MosqueCard
                  key={mosque.id}
                  mosque={mosque}
                  onFavoriteChanged={handleFavoriteChanged}
                  onViewMonthlyTimetable={openModal}
                />
              ))
            )}
            {!loading && mosques.length === 0 && (
              <div className="bg-white rounded-xl p-10 text-center text-slate-500 border border-dashed">
                No mosques found in this area.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Timetable Modal */}
      {selectedMosque && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden">
            <div className="bg-[#1C815A] px-6 py-4 flex items-center justify-between text-white">
              <div>
                <h2 className="text-xl font-bold">Monthly Timetable</h2>
                <p className="text-sm opacity-80">{selectedMosque.name}</p>
              </div>
              <button onClick={closeModal} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-slate-50 sticky top-0">
                  <tr>
                    <th className="p-3 text-left border-b font-bold">Date</th>
                    {["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].map(p => (
                      <th key={p} className="p-3 border-b font-bold">{p}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timetableLoading ? (
                    <tr><td colSpan={6} className="p-10 text-center">Loading times...</td></tr>
                  ) : timetableData.map((row, i) => (
                    <tr key={i} className="border-b hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-700">{row.date}</td>
                      {[row.fajr, row.dhuhr, row.asr, row.maghrib, row.isha].map((t, ti) => (
                        <td key={ti} className="p-3 text-center">
                          <div className="text-[10px] text-slate-400">{t.a}</div>
                          <div className="font-bold text-[#238B57]">{t.i}</div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}