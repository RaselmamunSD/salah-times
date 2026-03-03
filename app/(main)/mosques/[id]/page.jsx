"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  Bell,
  Calendar,
  CalendarDays,
  ChevronRight,
  Clock4,
  Clock3,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  Megaphone,
} from "lucide-react";
import { Inter, Lato } from "next/font/google";
import { mosqueService } from "../../../services/mosque";

const inter = Inter({ subsets: ["latin"] });
const lato = Lato({ subsets: ["latin"], weight: ["400", "700", "900"] });

const TABS = [
  { id: "prayer", label: "Prayer Times" },
  { id: "location", label: "Location & Map" },
  { id: "announcements", label: "Announcements" },
  { id: "contact", label: "Contact" },
];

const toDisplay = (value) => (value && String(value).trim() ? value : "--");

const formatBackendTime = (value) => {
  if (!value) return "--";
  if (String(value).includes("AM") || String(value).includes("PM")) return String(value);

  const [hour = "0", minute = "0"] = String(value).split(":");
  const h = Number(hour);
  const suffix = h >= 12 ? "PM" : "AM";
  const normalized = h % 12 || 12;
  return `${normalized}:${String(minute).slice(0, 2).padStart(2, "0")} ${suffix}`;
};

export default function MosqueDetailsPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("prayer");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mosque, setMosque] = useState(null);
  const [prayerData, setPrayerData] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const [mosqueDetails, prayerTimes] = await Promise.all([
          mosqueService.get(id),
          mosqueService.getPrayerTimes(id).catch(() => null),
        ]);

        if (!mounted) return;
        setMosque(mosqueDetails || null);
        setPrayerData(prayerTimes || null);
      } catch (err) {
        if (!mounted) return;
        setError(
          err?.response?.data?.detail || "Unable to load mosque details right now."
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (id) fetchData();

    return () => {
      mounted = false;
    };
  }, [id]);

  const prayerRows = useMemo(() => {
    const REQUIRED_PRAYERS = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

    if (
      Array.isArray(prayerData?.prayer_times) &&
      prayerData.prayer_times.length >= 6
    ) {
      return REQUIRED_PRAYERS.map((prayerName) => {
        const item = prayerData.prayer_times.find(p => p?.name === prayerName);

        if (!item) {
          return {
            name: prayerName,
            beginning: "--",
            jamaah: "--",
          };
        }

        if (item?.name === "Sunrise") {
          return {
            name: "Sunrise",
            beginning: toDisplay(item.time),
            jamaah: "-",
          };
        }

        return {
          name: item?.name,
          beginning: toDisplay(item?.beginning || item?.sunset),
          jamaah: toDisplay(item?.jamaah),
        };
      });
    }

    // Fallback to mosque data
    if (!mosque) return [];

    return [
      { name: "Fajr", beginning: formatBackendTime(mosque.fajr_beginning), jamaah: formatBackendTime(mosque.fajr_jamaah) },
      { name: "Sunrise", beginning: formatBackendTime(mosque.sunrise), jamaah: "-" },
      { name: "Dhuhr", beginning: formatBackendTime(mosque.dhuhr_beginning), jamaah: formatBackendTime(mosque.dhuhr_jamaah) },
      { name: "Asr", beginning: formatBackendTime(mosque.asr_beginning), jamaah: formatBackendTime(mosque.asr_jamaah) },
      { name: "Maghrib", beginning: formatBackendTime(mosque.maghrib_sunset), jamaah: formatBackendTime(mosque.maghrib_jamaah) },
      { name: "Isha", beginning: formatBackendTime(mosque.isha_beginning), jamaah: formatBackendTime(mosque.isha_jamaah) },
    ];
  }, [mosque, prayerData]);
  const announcements = useMemo(() => {
    const rows = [];
    if (mosque?.additional_info) {
      rows.push({
        title: "Mosque Announcement",
        text: mosque.additional_info,
        date: "Recently updated",
      });
    }
    if (mosque?.updated_at) {
      const dateText = new Date(mosque.updated_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      rows.push({
        title: "Profile Updated",
        text: "Mosque profile information was updated by the admin.",
        date: dateText,
      });
    }
    return rows;
  }, [mosque?.additional_info, mosque?.updated_at]);

  const mapCenter = useMemo(() => {
    const latitude = Number(mosque?.latitude);
    const longitude = Number(mosque?.longitude);

    if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
      return { latitude, longitude };
    }

    return { latitude: 23.8103, longitude: 90.4125 };
  }, [mosque?.latitude, mosque?.longitude]);

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
      `https://www.openstreetmap.org/?mlat=${mapCenter.latitude}&mlon=${mapCenter.longitude}#map=14/${mapCenter.latitude}/${mapCenter.longitude}`,
    [mapCenter.latitude, mapCenter.longitude]
  );

  const todayText = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    []
  );

  return (
    <div className="min-h-screen bg-[#F2F6F8] pb-16">
      <div className="py-[120px] text-center bg-gradient-to-b from-[#1F8A5B] to-[#1F6F8B] w-full">
        <h1 className={`font-bold text-3xl md:text-5xl text-white ${lato.className}`}>
          <span className="text-[#26FFA0] italic">{mosque?.name || "Mosque Details"}</span>
        </h1>
        <p className={`text-[#D0E0FF] ${inter.className} mt-3 flex items-center justify-center gap-2`}>
          <MapPin size={15} />
          {mosque?.city_name || "Dhaka"}
        </p>
      </div>

      <main className="max-w-6xl mx-auto px-4 -mt-10">
        <div className="mb-6 rounded-[14px] border border-[#B5D8C7] bg-[#EDF6F3] px-4 md:px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#1E8A5E] text-white flex items-center justify-center">
              <Bell size={20} />
            </div>
            <div>
              <p className="text-[25px] font-bold leading-tight text-[#263342]">
                Get Prayer Time Notifications
              </p>
              <p className="text-[18px] text-[#7B8CA3] mt-1">
                Subscribe to receive updates from this mosque
              </p>
            </div>
          </div>
          <button
            type="button"
            className="bg-[#1E8A5E] text-white text-[17px] font-semibold px-9 py-3 rounded-xl inline-flex items-center gap-1.5 hover:bg-[#18724d] transition-colors"
          >
            Subscribe <ChevronRight size={15} />
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_18px_45px_rgba(15,23,42,0.06)] overflow-hidden">
          <div className="border-b border-slate-200 px-2 md:px-4">
            <div className="flex items-center gap-1 md:gap-2 overflow-x-auto pt-3">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-[17px] font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id
                    ? "border-[#2B9B6B] text-[#2B9B6B]"
                    : "border-transparent text-[#607289] hover:text-[#2B9B6B]"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 md:p-6 min-h-[520px]">
            {loading && <p className="text-sm text-slate-500">Loading mosque details...</p>}
            {!loading && error && <p className="text-sm text-red-500">{error}</p>}

            {!loading && !error && activeTab === "prayer" && (
              <div>
                <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h2 className="text-[44px] font-bold text-[#263342] leading-tight">
                      Today&apos;s Prayer Times
                    </h2>
                    <p className="mt-2 text-[22px] text-[#7B8CA3] flex items-center gap-2">
                      <Calendar size={16} />
                      {todayText}
                    </p>
                  </div>
                  <div className="text-right pt-1">
                    <p className="text-[20px] text-[#97A3B6]">Next Prayer</p>
                    <p className="text-[37px] font-bold text-[#1E8A5E] leading-tight">
                      {prayerData?.next_prayer_name
                        ? `${prayerData.next_prayer_name} in ${prayerData?.time_until_next || "-"}`
                        : "Updating..."}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {prayerRows.map((row, index) => {
                    const isNextPrayer = prayerData?.next_prayer_index === index;

                    return (
                      <div
                        key={`${row.name}-${index}`}
                        className={`rounded-2xl border px-6 py-4 flex items-center justify-between gap-4 ${isNextPrayer
                          ? "bg-[#EAF4F1] border-[#2B9B6B] shadow-[inset_0_0_0_1px_rgba(43,155,107,0.12)]"
                          : "bg-white border-[#E2E8F0]"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isNextPrayer ? "bg-[#1E8A5E] text-white" : "bg-[#F1F5F9] text-[#6B7F99]"}`}>
                            <Clock4 size={18} />
                          </div>
                          <div>
                            <p className="text-[32px] font-bold text-[#263342] leading-tight">{row.name}</p>
                            <p className="text-[16px] text-[#7588A0] mt-1">
                              {row.name === "Maghrib" ? "Sunset Time" : "Beginning Time"}: {row.beginning}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p
                            className={`font-bold leading-none ${isNextPrayer ? "text-[32px] text-[#1E8A5E]" : "text-[32px] text-[#263342]"
                              }`}
                          >
                            {row.jamaah}
                          </p>
                          <p className="text-[15px] text-[#7B8CA3] mt-1">
                            {row.jamaah !== "-" ? "Iqamah" : ""}
                          </p>
                          {isNextPrayer && (
                            <span className="inline-flex mt-2 bg-[#1E8A5E] text-white text-[12px] font-semibold px-3 py-1 rounded-full">
                              Next Prayer
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  className="mt-5 inline-flex items-center gap-2 text-[#19749A] text-[29px] font-medium hover:text-[#145e7d] transition-colors"
                >
                  <CalendarDays size={20} />
                  View Monthly Timetable
                </button>
              </div>
            )}

            {!loading && !error && activeTab === "location" && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-800">Location & Directions</h2>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
                  <p className="font-semibold text-slate-800 mb-1">Address</p>
                  <p>{mosque?.address || "Address not available."}</p>
                </div>
                <div className="h-[360px] rounded-xl overflow-hidden border border-slate-200 relative">
                  <iframe
                    title="Mosque location map"
                    src={mapEmbedUrl}
                    className="absolute inset-0 w-full h-full border-0"
                    loading="lazy"
                  />
                </div>
                <a
                  href={mapLargerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[#1E8A5E] text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#186e4a] transition-colors"
                >
                  Open Large Map <ExternalLink size={14} />
                </a>
              </div>
            )}

            {!loading && !error && activeTab === "announcements" && (
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Announcements</h2>
                {announcements.length === 0 ? (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
                    No announcements available yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {announcements.map((item, idx) => (
                      <div key={`${item.title}-${idx}`} className="rounded-xl border border-slate-200 p-4">
                        <div className="flex items-center justify-between gap-3 mb-1">
                          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                            <Megaphone size={15} className="text-[#1E8A5E]" />
                            {item.title}
                          </h3>
                          <span className="text-xs text-slate-400">{item.date}</span>
                        </div>
                        <p className="text-sm text-slate-600">{item.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {!loading && !error && activeTab === "contact" && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-800">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
                    <p className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">
                      Phone
                    </p>
                    <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                      <Phone size={14} className="text-[#1E8A5E]" />
                      {mosque?.phone || "Not provided"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
                    <p className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">
                      Email
                    </p>
                    <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                      <Mail size={14} className="text-[#1E8A5E]" />
                      {mosque?.email || "Not provided"}
                    </p>
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 bg-white border border-slate-100 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="text-slate-500 flex items-center gap-2">
            <Clock3 size={15} />
            Last Updated: {mosque?.updated_at ? new Date(mosque.updated_at).toLocaleString() : "N/A"}
          </div>
          <button
            type="button"
            onClick={() => setActiveTab("prayer")}
            className="text-[#1E8A5E] font-semibold inline-flex items-center gap-1 hover:text-[#176b48]"
          >
            View Prayer Times <ChevronRight size={15} />
          </button>
        </div>

        <div className="mt-4 text-xs text-slate-400 flex items-center gap-1.5">
          <CalendarDays size={13} />
          Prayer schedule may vary slightly. Please confirm with mosque management.
        </div>
      </main>
    </div>
  );
}
