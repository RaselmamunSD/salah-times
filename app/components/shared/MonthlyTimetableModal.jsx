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
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-xl font-bold text-slate-800 min-w-[180px] text-center">
              {MONTH_NAMES[month - 1]} {year}
            </h2>
            <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={downloadImage}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
              title="Download as JPG"
            >
              <FileImage size={16} />
              <span className="hidden sm:inline">JPG</span>
            </button>
            <button
              onClick={downloadPDF}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
              title="Download as PDF"
            >
              <Download size={16} />
              <span className="hidden sm:inline">PDF</span>
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors ml-1">
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
                  </tr>
                  <tr className="bg-emerald-50 text-[#1a7f55] text-xs font-semibold border-b border-emerald-200">
                    <th className="px-3 py-2 text-left"></th>
                    <th className="px-2 py-2 text-center">Adhan</th><th className="px-2 py-2 text-center">Iqamah</th>
                    <th className="px-2 py-2 text-center">Time</th>
                    <th className="px-2 py-2 text-center">Adhan</th><th className="px-2 py-2 text-center">Iqamah</th>
                    <th className="px-2 py-2 text-center">Adhan</th><th className="px-2 py-2 text-center">Iqamah</th>
                    <th className="px-2 py-2 text-center">Adhan</th><th className="px-2 py-2 text-center">Iqamah</th>
                    <th className="px-2 py-2 text-center">Adhan</th><th className="px-2 py-2 text-center">Iqamah</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => {
                    const date = new Date(row.year, row.month - 1, row.day);
                    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
                    const isToday =
                      row.year === today.getFullYear() &&
                      row.month === today.getMonth() + 1 &&
                      row.day === today.getDate();
                    return (
                      <tr
                        key={row.day}
                        className={
                          isToday
                            ? "bg-emerald-50 font-semibold"
                            : i % 2 === 0 ? "bg-white" : "bg-slate-50"
                        }
                      >
                        <td className="px-3 py-2 whitespace-nowrap font-medium text-slate-700">
                          {isToday && (
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 align-middle"></span>
                          )}
                          {dayName} {row.day}
                        </td>
                        <td className="px-2 py-2 text-center text-slate-600">{fmt(row.fajr_adhan)}</td>
                        <td className="px-2 py-2 text-center text-slate-600">{fmt(row.fajr_iqamah)}</td>
                        <td className="px-2 py-2 text-center text-slate-500">{fmt(row.sunrise)}</td>
                        <td className="px-2 py-2 text-center text-slate-600">{fmt(row.dhuhr_adhan)}</td>
                        <td className="px-2 py-2 text-center text-slate-600">{fmt(row.dhuhr_iqamah)}</td>
                        <td className="px-2 py-2 text-center text-slate-600">{fmt(row.asr_adhan)}</td>
                        <td className="px-2 py-2 text-center text-slate-600">{fmt(row.asr_iqamah)}</td>
                        <td className="px-2 py-2 text-center text-slate-600">{fmt(row.maghrib_adhan)}</td>
                        <td className="px-2 py-2 text-center text-slate-600">{fmt(row.maghrib_iqamah)}</td>
                        <td className="px-2 py-2 text-center text-slate-600">{fmt(row.isha_adhan)}</td>
                        <td className="px-2 py-2 text-center text-slate-600">{fmt(row.isha_iqamah)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 text-right">
                {mosqueName} — {MONTH_NAMES[month - 1]} {year}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
