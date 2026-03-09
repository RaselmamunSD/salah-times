"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Download, FileImage } from "lucide-react";
import { mosqueService } from "../../services/mosque";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Format "HH:MM:SS" or "HH:MM" to "h:mm AM/PM" */
function fmt(timeStr) {
  if (!timeStr) return "--:--";
  try {
    const [h, m] = timeStr.split(":").map(Number);
    const period = h < 12 ? "AM" : "PM";
    const h12 = h % 12 || 12;
    return `${h12}:${String(m).padStart(2, "0")} ${period}`;
  } catch {
    return timeStr;
  }
}

export default function MonthlyTimetableModal({ mosqueId, mosqueName, onClose }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1); // 1-based
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const tableRef = useRef(null);

  const load = useCallback(async (y, m) => {
    setLoading(true);
    setError("");
    try {
      const data = await mosqueService.getMonthlyTimetable(mosqueId, { year: y, month: m });
      const list = Array.isArray(data) ? data : (data?.results ?? data?.entries ?? []);
      const sorted = [...list].sort((a, b) => a.day - b.day);
      setRows(sorted);
    } catch {
      setError("Could not load timetable. Please try again.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [mosqueId]);

  useEffect(() => {
    load(year, month);
  }, [year, month, load]);

  function prevMonth() {
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else setMonth(m => m + 1);
  }

  async function downloadImage() {
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(tableRef.current, { scale: 2, useCORS: true });
      const link = document.createElement("a");
      link.download = `${mosqueName || "mosque"}-timetable-${MONTH_NAMES[month - 1]}-${year}.jpg`;
      link.href = canvas.toDataURL("image/jpeg", 0.92);
      link.click();
    } catch {
      alert("Image download failed. Please try again.");
    }
  }

  async function downloadPDF() {
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(tableRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/jpeg", 0.92);
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = (canvas.height * pdfW) / canvas.width;
      pdf.addImage(imgData, "JPEG", 0, 0, pdfW, pdfH);
      pdf.save(`${mosqueName || "mosque"}-timetable-${MONTH_NAMES[month - 1]}-${year}.pdf`);
    } catch {
      alert("PDF download failed. Please try again.");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0 bg-[#1a7f55]">
          <div>
            <h2 className="text-lg font-bold text-white">Monthly Prayer Timetable</h2>
            <p className="text-emerald-200 text-xs mt-0.5">{mosqueName} — {MONTH_NAMES[month - 1]} {year}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors">
              <ChevronLeft size={20} />
            </button>
            <span className="text-white font-semibold text-sm min-w-[120px] text-center">
              {MONTH_NAMES[month - 1]} {year}
            </span>
            <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors">
              <ChevronRight size={20} />
            </button>
            <div className="w-px h-6 bg-white/30 mx-1"></div>
            <button
              onClick={downloadImage}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-white/15 text-white hover:bg-white/25 transition-colors"
              title="Download as JPG"
            >
              <FileImage size={15} />
              <span className="hidden sm:inline text-xs">JPG</span>
            </button>
            <button
              onClick={downloadPDF}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-white/15 text-white hover:bg-white/25 transition-colors"
              title="Download as PDF"
            >
              <Download size={15} />
              <span className="hidden sm:inline text-xs">PDF</span>
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors ml-1">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-auto flex-1 px-4 py-4">
          {loading && (
            <div className="flex items-center justify-center py-16 text-slate-500">
              Loading timetable…
            </div>
          )}

          {!loading && error && (
            <div className="flex items-center justify-center py-16 text-red-500">{error}</div>
          )}

          {!loading && !error && rows.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
              <p className="text-base font-medium">No timetable available for this month.</p>
              <p className="text-sm">The mosque admin has not uploaded data for {MONTH_NAMES[month - 1]} {year} yet.</p>
            </div>
          )}

          {!loading && !error && rows.length > 0 && (
            <div ref={tableRef} className="rounded-xl overflow-hidden border border-slate-200">
              {/* Legend */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 px-4 py-2.5 bg-slateald-50 border-b border-slate-100 text-xs text-slate-500">
                <span className="font-semibold text-slate-600">Prayer Time Legend</span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-slate-400"></span>
                  Adhan (Beginning Time)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-600"></span>
                  Iqamah (Congregation Time)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-amber-500"></span>
                  Friday / Jummah
                </span>
              </div>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#1a7f55] text-white">
                    <th className="px-3 py-3 text-left font-semibold">Date</th>
                    <th className="px-2 py-3 text-center font-semibold" colSpan={2}>Fajr</th>
                    <th className="px-2 py-3 text-center font-semibold" colSpan={1}>Sunrise</th>
                    <th className="px-2 py-3 text-center font-semibold" colSpan={2}>Dhuhr</th>
                    <th className="px-2 py-3 text-center font-semibold" colSpan={2}>Asr</th>
                    <th className="px-2 py-3 text-center font-semibold" colSpan={2}>Maghrib</th>
                    <th className="px-2 py-3 text-center font-semibold" colSpan={2}>Isha</th>
                    <th
                      className="px-2 py-3 text-center font-semibold"
                      colSpan={2}
                      style={{ background: "linear-gradient(135deg,#92400e,#b45309)" }}
                    >
                      🕌 Jummah
                    </th>
                  </tr>
                  <tr className="bg-emerald-50 text-[#1a7f55] text-xs font-semibold border-b border-emerald-200">
                    <th className="px-3 py-2 text-left text-slate-500 font-normal">Adhan / Iqamah</th>
                    <th className="px-2 py-2 text-center">Adhan</th><th className="px-2 py-2 text-center">Iqamah</th>
                    <th className="px-2 py-2 text-center">Time</th>
                    <th className="px-2 py-2 text-center">Adhan</th><th className="px-2 py-2 text-center">Iqamah</th>
                    <th className="px-2 py-2 text-center">Adhan</th><th className="px-2 py-2 text-center">Iqamah</th>
                    <th className="px-2 py-2 text-center">Adhan</th><th className="px-2 py-2 text-center">Iqamah</th>
                    <th className="px-2 py-2 text-center">Adhan</th><th className="px-2 py-2 text-center">Iqamah</th>
                    <th className="px-2 py-2 text-center text-amber-700">Khutbah</th>
                    <th className="px-2 py-2 text-center text-amber-700">Iqamah</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => {
                    const date = new Date(row.year, row.month - 1, row.day);
                    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
                    const isFriday = date.getDay() === 5 || row.is_friday === true;
                    const isToday =
                      row.year === today.getFullYear() &&
                      row.month === today.getMonth() + 1 &&
                      row.day === today.getDate();

                    let rowBg;
                    if (isFriday) {
                      rowBg = "bg-amber-50";
                    } else if (isToday) {
                      rowBg = "bg-emerald-50 font-semibold";
                    } else {
                      rowBg = i % 2 === 0 ? "bg-white" : "bg-slate-50";
                    }

                    return (
                      <tr key={row.day} className={rowBg}>
                        <td className="px-3 py-2 whitespace-nowrap font-medium text-slate-700">
                          {isToday && (
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 align-middle"></span>
                          )}
                          <span className={isFriday ? "text-amber-800 font-semibold" : ""}>
                            {dayName} {row.day}
                          </span>
                          {isFriday && (
                            <span
                              className="ml-1.5 inline-block text-[10px] font-bold px-1.5 py-0 rounded-full text-white leading-5"
                              style={{ background: "linear-gradient(135deg,#f59e0b,#fbbf24)" }}
                            >
                              Jum
                            </span>
                          )}
                        </td>
                        <td className="px-2 py-2 text-center text-slate-500 text-xs">{fmt(row.fajr_adhan)}</td>
                        <td className="px-2 py-2 text-center text-emerald-700 font-semibold text-xs">{fmt(row.fajr_iqamah)}</td>
                        <td className="px-2 py-2 text-center text-slate-500 text-xs">{fmt(row.sunrise)}</td>
                        <td className="px-2 py-2 text-center text-slate-500 text-xs">{fmt(row.dhuhr_adhan)}</td>
                        <td className="px-2 py-2 text-center text-emerald-700 font-semibold text-xs">{fmt(row.dhuhr_iqamah)}</td>
                        <td className="px-2 py-2 text-center text-slate-500 text-xs">{fmt(row.asr_adhan)}</td>
                        <td className="px-2 py-2 text-center text-emerald-700 font-semibold text-xs">{fmt(row.asr_iqamah)}</td>
                        <td className="px-2 py-2 text-center text-slate-500 text-xs">{fmt(row.maghrib_adhan)}</td>
                        <td className="px-2 py-2 text-center text-emerald-700 font-semibold text-xs">{fmt(row.maghrib_iqamah)}</td>
                        <td className="px-2 py-2 text-center text-slate-500 text-xs">{fmt(row.isha_adhan)}</td>
                        <td className="px-2 py-2 text-center text-emerald-700 font-semibold text-xs">{fmt(row.isha_iqamah)}</td>
                        {isFriday ? (
                          <>
                            <td className="px-2 py-2 text-center text-amber-700 text-xs bg-amber-50/60">
                              {row.jumuah_adhan ? fmt(row.jumuah_adhan) : <span className="text-slate-300">—</span>}
                            </td>
                            <td className="px-2 py-2 text-center text-amber-800 font-semibold text-xs bg-amber-50/60">
                              {row.jumuah_iqamah ? fmt(row.jumuah_iqamah) : <span className="text-slate-300">—</span>}
                            </td>
                          </>
                        ) : (
                          <td className="px-2 py-2 text-center text-slate-200 text-xs" colSpan={2}>—</td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
                <span>📅 Updated for {MONTH_NAMES[month - 1]} {year}</span>
                <span className="text-slate-400">{mosqueName}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
