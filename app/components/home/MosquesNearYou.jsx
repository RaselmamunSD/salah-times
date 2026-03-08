"use client";

import { Poppins } from "next/font/google";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import rightArrowGreen from "../../../public/icons/rightArrowGreen.png";
import Image from "next/image";
import MosqueCard from "../cards/MosqueCard";
import { mosqueService } from "../../services/mosque";
import { Calendar, Download, X } from "lucide-react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

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

const MosquesNearYou = ({ currentLocation, refreshKey }) => {
  const [mosques, setMosques] = useState([]);
  const [selectedMosque, setSelectedMosque] = useState(null);
  const [timetableLoading, setTimetableLoading] = useState(false);
  const [timetableData, setTimetableData] = useState([]);
  const [activeMonth] = useState(new Date().getMonth());
  const [activeYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchMosques = async () => {
      try {
        let response = [];
        let favoriteIds = new Set();

        try {
          const favoritesResponse = await mosqueService.getFavorites();
          const favorites = Array.isArray(favoritesResponse) ? favoritesResponse : [];
          favoriteIds = new Set(favorites.map((item) => item?.mosque?.id).filter(Boolean));
        } catch {
          favoriteIds = new Set();
        }

        if (currentLocation?.latitude && currentLocation?.longitude) {
          response = await mosqueService.getNearby(
            currentLocation.latitude,
            currentLocation.longitude,
            10
          );
        } else {
          response = await mosqueService.list();
        }

        const items = Array.isArray(response)
          ? response
          : Array.isArray(response?.results)
            ? response.results
            : [];

        const formatted = items.slice(0, 6).map((mosque) => ({
          id: mosque.id,
          name: mosque.name,
          location: mosque.city_name || mosque.address || "Dhaka",
          distance: mosque.distance_km ? mosque.distance_km.toFixed(1) : "2.3",
          prayer: "Dhuhr",
          time: "12:30 PM",
          isFavorite: favoriteIds.has(mosque.id),
        }));

        setMosques(formatted);
      } catch {
        setMosques([]);
      }
    };

    fetchMosques();
  }, [currentLocation?.latitude, currentLocation?.longitude, refreshKey]);

  const handleFavoriteChanged = (mosqueId, isFavorite) => {
    setMosques((prev) =>
      prev.map((item) =>
        item.id === mosqueId ? { ...item, isFavorite } : item
      )
    );
  };

  const openModal = async (mosque) => {
    setSelectedMosque(mosque);
    setTimetableLoading(true);
    setTimetableData([]);
    document.body.style.overflow = "hidden";

    try {
      const rows = await mosqueService.getMonthlyTimetable(mosque.id, {
        month: activeMonth + 1,
        year: activeYear,
      });

      const mappedRows = rows.map((row) => ({
        date: `${row.day} ${monthName((row.month || activeMonth + 1) - 1)} ${row.year || activeYear}`,
        fajr: { a: formatTimeShort(row.fajr_adhan), i: formatTimeShort(row.fajr_iqamah) },
        sunrise: formatTimeShort(row.sunrise),
        dhuhr: { a: formatTimeShort(row.dhuhr_adhan), i: formatTimeShort(row.dhuhr_iqamah) },
        asr: { a: formatTimeShort(row.asr_adhan), i: formatTimeShort(row.asr_iqamah) },
        maghrib: { a: formatTimeShort(row.maghrib_adhan), i: formatTimeShort(row.maghrib_iqamah) },
        isha: { a: formatTimeShort(row.isha_adhan), i: formatTimeShort(row.isha_iqamah) },
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

  return (
    <>
      <div className="max-w-[1216px] mx-auto w-full md:mt-80 px-4 md:px-0">
        <div className="flex justify-between items-center mb-8">
          <h3
            className={`text-[24px] font-semibold text-[#1E293B] ${poppins.className}`}
          >
            Mosques Near You
          </h3>
          <Link
            href={`/mosques`}
            className="text-[#1F8A5B] text-base font-medium flex items-center gap-2.5 hover:text-[#157a49] transition-colors"
          >
            View All{" "}
            <Image
              src={rightArrowGreen}
              width={4.5}
              height={9}
              alt="right green arrow"
            />
          </Link>
        </div>
        {mosques.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mosques.map((mosque, index) => (
              <MosqueCard
                key={`${mosque.name}-${index}`}
                mosque={mosque}
                onFavoriteChanged={handleFavoriteChanged}
                onViewMonthlyTimetable={openModal}
              />
            ))}
          </div>
        ) : (
          <div className="text-sm text-[#64748B]">No verified mosques found yet.</div>
        )}
      </div>

      {selectedMosque && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 md:p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[92vh] md:h-[90vh] flex flex-col overflow-hidden">
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
                aria-label="Close timetable modal"
              >
                <X size={24} />
              </button>
            </div>

            <div className="w-full border-b-[3px] border-dotted border-[#5B9BD5] opacity-50"></div>

            <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 bg-white">
              <div className="bg-[#F2F8F5] border border-gray-100 rounded-lg p-3 mb-4 flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-sm">
                <span className="font-bold text-slate-700">
                  Prayer Time Legend
                </span>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div>
                    Adhan (Beginning Time)
                  </div>
                  <div className="flex items-center gap-1.5 text-[#238B57] font-medium">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#238B57]"></div>
                    Iqamah (Congregation Time)
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto rounded-lg border border-[#D1E5D9]">
                <table className="w-full text-center border-collapse whitespace-nowrap">
                  <thead className="bg-[#1C815A] text-white">
                    <tr>
                      <th className="py-3 px-4 font-semibold text-left border-r border-white/20 w-32">
                        Date
                      </th>
                      {["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].map(
                        (prayer) => (
                          <th
                            key={prayer}
                            className="py-2 px-2 font-medium border-r border-white/20 w-24"
                          >
                            <div className="font-bold">{prayer}</div>
                            <div className="text-[10px] text-white/70 font-normal">
                              Adhan / Iqamah
                            </div>
                          </th>
                        )
                      )}
                      <th className="py-2 px-2 font-medium border-white/20 w-20">
                        <div className="font-bold">Sunrise</div>
                        <div className="text-[10px] text-white/70 font-normal">Time</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {timetableLoading && (
                      <tr>
                        <td colSpan={7} className="py-8 text-sm text-slate-500">
                          Loading timetable...
                        </td>
                      </tr>
                    )}

                    {!timetableLoading && timetableData.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-sm text-slate-500">
                          No timetable data available for this month.
                        </td>
                      </tr>
                    )}

                    {!timetableLoading && timetableData.map((row, idx) => (
                      <tr key={idx} className="border-b border-[#D1E5D9]">
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
                        <td className="py-2.5 px-2 border-r border-[#D1E5D9]">
                          <div className="text-xs text-slate-500 font-medium">{row.sunrise}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="w-full border-t-[3px] border-dotted border-[#5B9BD5] opacity-50"></div>

            <div className="bg-white p-4 flex flex-col md:flex-row items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                <Calendar size={16} className="text-[#EA4335]" />
                Updated for {monthName(activeMonth)} {activeYear}
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={() => downloadTimetable("jpg")}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#2C7B65] hover:bg-[#226350] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  <Download size={16} />
                  Download JPG
                </button>
                <button
                  onClick={() => downloadTimetable("pdf")}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#238B57] hover:bg-[#1A6E44] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  <Download size={16} />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MosquesNearYou;
