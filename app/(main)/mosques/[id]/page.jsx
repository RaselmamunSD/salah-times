"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  Bell,
  Calendar,
  ChevronRight,
  Clock3,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Inter, Poppins } from "next/font/google";
import mosqueIcon from "../../../../public/icons/mosque.png";
import { mosqueService } from "../../../services/mosque";
import MonthlyTimetableModal from "../../../components/shared/MonthlyTimetableModal";

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const TABS = [
  { id: "prayer", label: "Prayer Times" },
  { id: "location", label: "Location & Map" },
  { id: "announcements", label: "Announcements" },
  { id: "contact", label: "Contact" },
];

const formatBackendTime = (value) => {
  if (!value) return "--";
  if (String(value).includes("AM") || String(value).includes("PM")) return String(value);

  const [hour = "0", minute = "0"] = String(value).split(":");
  const h = Number(hour);
  const suffix = h >= 12 ? "PM" : "AM";
  const normalized = h % 12 || 12;
  return `${normalized}:${String(minute).slice(0, 2).padStart(2, "0")} ${suffix}`;
};

const prayerMeta = {
  Fajr: { label: "Beginning Time", fallback: "fajr_beginning", fallbackJamaah: "fajr_jamaah" },
  Sunrise: { label: "Time", fallback: "sunrise", fallbackJamaah: null },
  Dhuhr: { label: "Beginning Time", fallback: "dhuhr_beginning", fallbackJamaah: "dhuhr_jamaah" },
  Asr: { label: "Beginning Time", fallback: "asr_beginning", fallbackJamaah: "asr_jamaah" },
  Maghrib: { label: "Sunset Time", fallback: "maghrib_sunset", fallbackJamaah: "maghrib_jamaah" },
  Isha: { label: "Beginning Time", fallback: "isha_beginning", fallbackJamaah: "isha_jamaah" },
};

const defaultAnnouncements = [
  {
    title: "Jumu'ah Khutbah Schedule",
    body: "First Jumu'ah: 12:30 PM, Second Jumu'ah: 1:30 PM",
    date: "Every Friday",
  },
  {
    title: "Ramadan Preparation",
    body: "Special arrangements for Taraweeh prayers will be announced soon.",
    date: "Community Notice",
  },
];

export default function MosqueDetailsPage() {
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState("prayer");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mosque, setMosque] = useState(null);
  const [prayerData, setPrayerData] = useState(null);
  const [showMonthly, setShowMonthly] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const [mosqueDetails, todayPrayer] = await Promise.all([
          mosqueService.get(id),
          mosqueService.getPrayerTimes(id).catch(() => null),
        ]);

        if (!mounted) return;
        setMosque(mosqueDetails || null);
        setPrayerData(todayPrayer || null);
      } catch (err) {
        if (!mounted) return;
        setError(err?.response?.data?.detail || "Unable to load mosque details right now.");
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
    const order = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

    if (Array.isArray(prayerData?.prayer_times) && prayerData.prayer_times.length) {
      return order.map((name) => {
        const item = prayerData.prayer_times.find((p) => p?.name === name);

        if (!item) {
          return { name, beginning: "--", jamaah: "--" };
        }

        if (name === "Sunrise") {
          return {
            name,
            beginning: item.time || "--",
            jamaah: "-",
          };
        }

        return {
          name,
          beginning: item.beginning || item.sunset || "--",
          jamaah: item.jamaah || "--",
        };
      });
    }

    return order.map((name) => {
      const meta = prayerMeta[name];
      const beginning = mosque?.[meta.fallback] ? formatBackendTime(mosque[meta.fallback]) : "--";
      const jamaah = meta.fallbackJamaah
        ? (mosque?.[meta.fallbackJamaah] ? formatBackendTime(mosque[meta.fallbackJamaah]) : "--")
        : "-";

      return { name, beginning, jamaah };
    });
  }, [mosque, prayerData]);

  const nextPrayerName = prayerData?.next_prayer_name || null;
  const nextPrayerTimeLeft = prayerData?.time_until_next || null;

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

  const mapCenter = useMemo(() => {
    const latitude = Number(mosque?.latitude);
    const longitude = Number(mosque?.longitude);

    if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
      return { latitude, longitude };
    }

    return { latitude: 23.8103, longitude: 90.4125 };
  }, [mosque?.latitude, mosque?.longitude]);

  const mapEmbedUrl = useMemo(() => {
    return `https://maps.google.com/maps?q=${mapCenter.latitude},${mapCenter.longitude}&z=15&output=embed`;
  }, [mapCenter.latitude, mapCenter.longitude]);

  const directionsUrl = useMemo(
    () => `https://www.google.com/maps/dir/?api=1&destination=${mapCenter.latitude},${mapCenter.longitude}`,
    [mapCenter.latitude, mapCenter.longitude]
  );

  const mapLargerUrl = useMemo(
    () => `https://www.google.com/maps?q=${mapCenter.latitude},${mapCenter.longitude}&z=15`,
    [mapCenter.latitude, mapCenter.longitude]
  );

  const announcements = useMemo(() => {
    const dynamic = [];

    if (mosque?.additional_info) {
      dynamic.push({
        title: "Mosque Update",
        body: mosque.additional_info,
        date: mosque?.updated_at
          ? new Date(mosque.updated_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
          : "Recent",
      });
    }

    return dynamic.length ? dynamic : defaultAnnouncements;
  }, [mosque?.additional_info, mosque?.updated_at]);

  return (
    <div className={`min-h-screen bg-[#F2F4F6] pb-10 ${inter.className}`}>
      <section className="bg-gradient-to-b from-[#1D8A58] to-[#1E6F8D] text-white pt-28 pb-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/15 flex items-center justify-center">
            <Image src={mosqueIcon} alt="Mosque" width={42} height={42} className="brightness-0 invert" />
          </div>
          <h1 className={`text-3xl md:text-[48px] leading-tight font-semibold ${poppins.className}`}>
            <span className="text-[#52FFB6] italic">{mosque?.name || "Mosque"}</span>{" "}
            <span>National Mosque</span>
          </h1>
          <p className="mt-3 flex items-center justify-center gap-1 text-[#D9E9F1]">
            <MapPin size={14} />
            <span>{mosque?.city_name || "Dhaka"}</span>
          </p>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 -mt-3 md:-mt-5">
        <div className="rounded-xl border border-[#CFE3DA] bg-[#ECF6F2] p-3 md:p-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#1E8A5E] text-white flex items-center justify-center">
              <Bell size={16} />
            </div>
            <div>
              <p className="text-sm md:text-base font-semibold text-[#1E2A39]">Get Prayer Time Notifications</p>
              <p className="text-xs md:text-sm text-[#62758C]">Subscribe to receive updates from this mosque</p>
            </div>
          </div>
          <button
            type="button"
            className="bg-[#1E8A5E] text-white text-xs md:text-sm font-medium px-4 py-2 rounded-lg inline-flex items-center gap-1 hover:bg-[#19724d] transition-colors"
          >
            Subscribe <ChevronRight size={14} />
          </button>
        </div>

        <section className="mt-3 rounded-xl border border-[#DDE5EA] bg-white overflow-hidden">
          <div className="border-b border-[#E6EDF2] px-2 md:px-3">
            <div className="flex overflow-x-auto">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-xs md:text-sm border-b-2 whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? "border-[#2A9D6B] text-[#2A9D6B]"
                      : "border-transparent text-[#64748B] hover:text-[#2A9D6B]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 md:p-5 min-h-[420px]">
            {loading && <p className="text-sm text-slate-500">Loading mosque details...</p>}
            {!loading && error && <p className="text-sm text-red-500">{error}</p>}

            {!loading && !error && activeTab === "prayer" && (
              <div>
                <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                  <div>
                    <h2 className={`text-xl md:text-2xl font-semibold text-[#1E293B] ${poppins.className}`}>
                      Today&apos;s Prayer Times
                    </h2>
                    <p className="mt-1 text-xs md:text-sm text-[#6B7C93] inline-flex items-center gap-1">
                      <Calendar size={14} />
                      {todayText}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wide text-[#8FA0B5]">Next Prayer</p>
                    <p className="text-base md:text-xl font-semibold text-[#1E8A5E]">
                      {nextPrayerName ? `${nextPrayerName} in ${nextPrayerTimeLeft || "-"}` : "Updating..."}
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {prayerRows.map((row) => {
                    const isNext = nextPrayerName === row.name;
                    const meta = prayerMeta[row.name] || prayerMeta.Fajr;
                    const isSunrise = row.name === "Sunrise";
                    const rightValue = isSunrise ? row.beginning : row.jamaah;
                    const subtitle = isSunrise
                      ? "No Iqamah for Sunrise"
                      : `${meta.label}: ${row.beginning}`;

                    return (
                      <div
                        key={row.name}
                        className={`rounded-lg border p-3 md:p-4 flex items-center justify-between ${
                          isNext ? "bg-[#ECF8F2] border-[#2A9D6B]" : "bg-white border-[#E5ECF1]"
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-[#1F2B3A]">{row.name}</p>
                          <p className="text-xs text-[#74879D] mt-0.5">
                            {subtitle}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className={`text-lg md:text-2xl font-semibold ${isNext ? "text-[#1E8A5E]" : "text-[#223243]"}`}>
                            {rightValue}
                          </p>
                          <p className="text-[11px] text-[#8AA0B6]">
                            {!isSunrise && row.jamaah !== "-" ? "Iqamah" : ""}
                          </p>
                          {isNext && (
                            <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-[#1E8A5E] text-white">
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
                  onClick={() => setShowMonthly(true)}
                  className="mt-3 text-sm text-[#1A6F93] hover:text-[#13536e] font-medium"
                >
                  View Monthly Timetable
                </button>
              </div>
            )}

            {!loading && !error && activeTab === "location" && (
              <div>
                <h2 className={`text-lg font-semibold text-[#1E293B] mb-3 ${poppins.className}`}>Location & Directions</h2>
                <div className="mb-3 text-sm">
                  <p className="text-[#1F2E3E] font-medium mb-1 inline-flex items-center gap-1.5">
                    <MapPin size={14} className="text-[#2A9D6B]" />
                    Address
                  </p>
                  <p className="text-[#1F2E3E]">{mosque?.address || "Dhaka, Bangladesh"}</p>
                </div>

                <div className="relative h-[340px] md:h-[420px] rounded-lg overflow-hidden border border-[#E3EBF0] bg-slate-100">
                  <iframe
                    title="Mosque map"
                    src={mapEmbedUrl}
                    className="w-full h-full border-0"
                    loading="lazy"
                  />
                  <a
                    href={mapLargerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-3 left-3 z-10 rounded bg-white/95 px-2.5 py-1.5 text-[13px] font-medium text-[#1A73E8] shadow-sm hover:underline"
                  >
                    View larger map
                  </a>
                </div>

                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 w-full inline-flex items-center justify-center bg-[#1E8A5E] text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-[#19724d]"
                >
                  Get Directions
                </a>
              </div>
            )}

            {!loading && !error && activeTab === "announcements" && (
              <div>
                <h2 className={`text-lg font-semibold text-[#1E293B] mb-3 ${poppins.className}`}>Recent Announcements</h2>
                <div className="space-y-3">
                  {announcements.map((item, idx) => (
                    <div key={`${item.title}-${idx}`} className="rounded-lg border border-[#D9E6EF] bg-[#EEF5FA] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-[#223447]">{item.title}</p>
                          <p className="text-sm text-[#5E738A] mt-1">{item.body}</p>
                        </div>
                        <span className="text-[11px] text-[#7E91A6] whitespace-nowrap">{item.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!loading && !error && activeTab === "contact" && (
              <div>
                <h2 className={`text-lg font-semibold text-[#1E293B] mb-4 ${poppins.className}`}>Contact Information</h2>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-[#24384B]">
                    <Phone size={14} className="text-[#1E8A5E]" />
                    <span>{mosque?.phone || "+880 0000000000"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#24384B]">
                    <Mail size={14} className="text-[#1E8A5E]" />
                    <span>{mosque?.email || "info@mosque.org"}</span>
                  </div>
                </div>

                <div className="mt-5 border-t border-[#E7EDF2] pt-4">
                  <h3 className="text-sm font-semibold text-[#263A4E] mb-1">About This Mosque</h3>
                  <p className="text-sm text-[#63788F]">
                    {mosque?.additional_info ||
                      "This mosque serves the local community with regular daily prayers, Jumu'ah congregation and Islamic learning activities."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="mt-3 text-xs text-[#7B8FA4] flex items-center gap-1">
          <Clock3 size={13} />
          Prayer times may vary slightly. Please confirm with mosque management.
        </div>
      </main>

      {showMonthly && (
        <MonthlyTimetableModal
          mosqueId={id}
          mosqueName={mosque?.name}
          onClose={() => setShowMonthly(false)}
        />
      )}
    </div>
  );
}
