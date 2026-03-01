"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Check,
  Search,
  Filter,
  MapPin,
  Mail,
  Smartphone,
  Calendar,
  ChevronDown,
  Bell,
} from "lucide-react";
import { Inter, Lato } from "next/font/google";
import subscriptionService from "@/app/services/subscriptions";
import { mosqueService } from "@/app/services/mosque";

const inter = Inter({
  subsets: ["latin"],
});
const lato = Lato({
  subsets: ["latin"],
  weight: ["400"],
});

const DURATION_OPTIONS = [
  { label: "7", sub: "Days", value: 7 },
  { label: "15", sub: "Days", value: 15 },
  { label: "30", sub: "Days", value: 30 },
];
const PRAYER_LIST = [
  { id: "fajr", name: "Fajr", desc: "Dawn prayer notification" },
  { id: "dhuhr", name: "Dhuhr", desc: "Noon prayer notification" },
  { id: "asr", name: "Asr", desc: "Afternoon prayer notification" },
  { id: "maghrib", name: "Maghrib", desc: "Sunset prayer notification" },
  { id: "isha", name: "Isha", desc: "Night prayer notification" },
  { id: "jumuah", name: "Jumu'ah", desc: "Friday prayer reminder" },
];

export default function SubscriptionFlow() {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState("whatsapp");
  const [email, setEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [selectedMosques, setSelectedMosques] = useState([]);
  const [duration, setDuration] = useState(30);
  const [reminderOffset, setReminderOffset] = useState("10");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPrayers, setSelectedPrayers] = useState(
    PRAYER_LIST.map((p) => p.id),
  );
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  const [mosques, setMosques] = useState([]);
  const [mosquesLoading, setMosquesLoading] = useState(false);
  const [mosqueSearch, setMosqueSearch] = useState("");

  const isAllSelected = selectedPrayers.length === PRAYER_LIST.length;

  useEffect(() => {
    const fetchMosques = async () => {
      setMosquesLoading(true);
      try {
        const response = await mosqueService.list({ is_active: true });
        const mosqueList = Array.isArray(response)
          ? response
          : Array.isArray(response?.results)
            ? response.results
            : [];

        setMosques(mosqueList);

        if (mosqueList.length > 0) {
          const firstMosqueId = mosqueList[0]?.id;
          if (firstMosqueId && selectedMosques.length === 0) {
            setSelectedMosques([firstMosqueId]);
          }
        }
      } catch (error) {
        console.error("Failed to load mosques:", error);
      } finally {
        setMosquesLoading(false);
      }
    };

    fetchMosques();
  }, []);

  const filteredMosques = useMemo(() => {
    const search = mosqueSearch.trim().toLowerCase();
    if (!search) return mosques;

    return mosques.filter((mosque) => {
      const name = mosque?.name?.toLowerCase() || "";
      const address = mosque?.address?.toLowerCase() || "";
      const city = mosque?.city_name?.toLowerCase() || "";
      return name.includes(search) || address.includes(search) || city.includes(search);
    });
  }, [mosques, mosqueSearch]);

  const getEndDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + duration);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const toggleMosque = (id) => {
    setSelectedMosques((prev) =>
      prev.includes(id) ? prev.filter((mId) => mId !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    if (isAllSelected) setSelectedPrayers([]);
    else setSelectedPrayers(PRAYER_LIST.map((p) => p.id));
  };

  const togglePrayer = (id) => {
    setSelectedPrayers((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const nextStep = () => {
    if (step === 2 && selectedMosques.length === 0) {
      setApiError("Please select at least one mosque.");
      return;
    }
    setApiError("");
    setStep((prev) => Math.min(prev + 1, 4));
  };
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleMethodContinue = () => {
    setApiError("");

    if (method === "email") {
      if (!email) {
        setApiError("Please enter your email address.");
        return;
      }
    } else if (method === "whatsapp") {
      if (!whatsappNumber) {
        setApiError("Please enter your WhatsApp number.");
        return;
      }
    }

    nextStep();
  };

  const handleCompleteSubscription = async () => {
    setApiError("");
    setApiSuccess("");
    setApiLoading(true);

    try {
      // Validate email is provided
      if (!email) {
        setApiError("Please provide an email address.");
        setApiLoading(false);
        return;
      }

      if (selectedMosques.length === 0) {
        setApiError("Please select at least one mosque.");
        setApiLoading(false);
        return;
      }

      if (selectedPrayers.length === 0) {
        setApiError("Please select at least one prayer time.");
        setApiLoading(false);
        return;
      }

      const payload = {
        email,
        phone: whatsappNumber,
        notification_method: method,
        subscription_type: "daily",
        selected_mosques: selectedMosques,
        duration_days: duration,
        notification_minutes_before: Number(reminderOffset),
        selected_prayers: selectedPrayers,
      };

      await subscriptionService.create(payload);

      setApiSuccess("You have been subscribed successfully.");
      setStep(4);
    } catch (error) {
      console.error("Subscription error:", error);
      const detail =
        error.response?.data?.detail ||
        (typeof error.response?.data === "object"
          ? Object.values(error.response.data).flat().join(", ")
          : "Failed to create subscription. Please try again.");
      setApiError(detail);
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <>
      <div className="py-[196px] text-center bg-gradient-to-b from-[#1F8A5B] to-[#1F6F8B] w-full">
        <h1
          className={`font-bold text-4xl md:text-[66px] text-white ${lato.className}`}
        >
          <span className="text-[#26FFA0] italic">Subscribe</span> to Prayer
          Times
        </h1>
        <p className={`md:text-2xl text-[#D0E0FF] ${inter.className} mt-4`}>
          Never miss a prayer with automated notifications
        </p>
      </div>

      <main className="px-4 sm:px-6 mt-30">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-6 md:p-10 border border-gray-50">
          {/* STEPPER INDICATOR */}
          {step < 4 && (
            <div className="flex items-center justify-center mb-10 max-w-lg mx-auto">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= 1 ? "bg-[#238B57] text-white" : "bg-gray-100 text-gray-400"}`}
                >
                  {step > 1 ?
                    <Check size={16} />
                    : "1"}
                </div>
                <span className="text-xs font-medium mt-2 text-slate-500">
                  Method
                </span>
              </div>
              <div
                className={`flex-1 h-0.5 mx-4 transition-colors ${step >= 2 ? "bg-[#238B57]" : "bg-gray-200"}`}
              ></div>

              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= 2 ? "bg-[#238B57] text-white" : "bg-gray-100 text-gray-400"}`}
                >
                  {step > 2 ?
                    <Check size={16} />
                    : "2"}
                </div>
                <span className="text-xs font-medium mt-2 text-slate-500">
                  Mosques
                </span>
              </div>
              <div
                className={`flex-1 h-0.5 mx-4 transition-colors ${step >= 3 ? "bg-[#238B57]" : "bg-gray-200"}`}
              ></div>

              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= 3 ? "bg-[#238B57] text-white" : "bg-gray-100 text-gray-400"}`}
                >
                  3
                </div>
                <span className="text-xs font-medium mt-2 text-slate-500">
                  Preferences
                </span>
              </div>
            </div>
          )}

          {/* ================= STEP 1: METHOD ================= */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold text-center text-slate-800 mb-2">
                Choose Notification Method
              </h2>
              <p className="text-center text-sm text-slate-500 mb-8">
                Select how you want to receive prayer alerts.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div
                  onClick={() => setMethod("whatsapp")}
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${method === "whatsapp" ? "border-[#238B57] bg-[#F2F9F5]" : "border-gray-100 hover:border-gray-200"}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                      <Smartphone size={20} />
                    </div>
                    <span className="font-bold text-slate-800">WhatsApp</span>
                  </div>
                  <p className="text-xs text-slate-500 ml-13">
                    Get instant updates via WhatsApp messages.
                  </p>
                </div>

                <div
                  onClick={() => setMethod("email")}
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${method === "email" ? "border-[#238B57] bg-[#F2F9F5]" : "border-gray-100 hover:border-gray-200"}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                      <Mail size={20} />
                    </div>
                    <span className="font-bold text-slate-800">Email</span>
                  </div>
                  <p className="text-xs text-slate-500 ml-13">
                    Receive daily prayer schedules in your inbox.
                  </p>
                </div>
              </div>

              {/* Contact Inputs */}
              <div className="space-y-4 mb-8">
                {method === "whatsapp" && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      WhatsApp Number *
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="+880 1XXX-XXXXXX"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#238B57] focus:border-[#238B57] transition-all"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Format: +880 1XXX-XXXXXX (Example: +880 1711223344)
                    </p>
                  </div>
                )}

                {method === "email" && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      Email Address *
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#238B57] focus:border-[#238B57] transition-all"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      We'll send daily prayer schedules to this email
                    </p>
                  </div>
                )}
              </div>

              {apiError && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-xs text-left">
                  {apiError}
                </div>
              )}

              <button
                onClick={handleMethodContinue}
                className="w-full bg-[#238B57] hover:bg-[#1a6e44] text-white font-bold rounded-xl py-4 text-sm transition-colors shadow-sm"
              >
                Continue
              </button>
            </div>
          )}

          {/* ================= STEP 2: MOSQUES ================= */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold text-center text-slate-800 mb-2">
                Select Mosques
              </h2>
              <p className="text-center text-sm text-slate-500 mb-8">
                Choose which mosques you want updates from.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search mosques..."
                    value={mosqueSearch}
                    onChange={(e) => setMosqueSearch(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#238B57]"
                  />
                </div>
                <button className="flex items-center justify-center gap-2 border border-gray-200 px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-gray-50 transition-colors">
                  <Filter size={16} /> Filters
                </button>
                <button className="flex items-center justify-center gap-2 bg-[#238B57] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1a6e44] transition-colors">
                  <MapPin size={16} /> Use My Location
                </button>
              </div>

              <div className="space-y-3 mb-8">
                {mosquesLoading && (
                  <div className="text-sm text-slate-500 text-center py-6">
                    Loading mosques...
                  </div>
                )}

                {!mosquesLoading && filteredMosques.length === 0 && (
                  <div className="text-sm text-slate-500 text-center py-6 border border-dashed border-gray-200 rounded-xl">
                    No mosque found.
                  </div>
                )}

                {!mosquesLoading && filteredMosques.map((mosque) => (
                  <div
                    key={mosque.id}
                    onClick={() => toggleMosque(mosque.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${selectedMosques.includes(mosque.id) ? "border-[#238B57] bg-[#F2F9F5]" : "border-gray-100 bg-white hover:border-gray-200"}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-lg shadow-sm">
                        🕌
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-800">
                          {mosque.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {mosque.city_name ? `${mosque.city_name} • ` : ""}
                          {mosque.address}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${selectedMosques.includes(mosque.id) ? "bg-[#238B57] border-[#238B57] text-white" : "border-gray-300"}`}
                    >
                      {selectedMosques.includes(mosque.id) && (
                        <Check size={14} strokeWidth={3} />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={prevStep}
                  className="w-1/3 border border-gray-200 text-slate-600 hover:bg-gray-50 font-bold rounded-xl py-4 text-sm transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="w-2/3 bg-[#238B57] hover:bg-[#1a6e44] text-white font-bold rounded-xl py-4 text-sm transition-colors shadow-sm"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 3: PREFERENCES ================= */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold text-slate-800 mb-1">
                Prayer Preferences
              </h2>
              <p className="text-sm text-slate-500 mb-8">
                Select which prayers you want notifications for
              </p>

              {apiError && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-xs text-left">
                  {apiError}
                </div>
              )}

              {/* Notification Duration Section */}
              <div className="bg-[#F6FBF9] border border-[#E8F5EE] rounded-2xl p-5 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-[#238B57] p-1.5 rounded-lg text-white">
                      <Calendar size={16} />
                    </div>
                    <span className="text-sm font-bold text-slate-800">
                      Notification Duration
                    </span>
                  </div>

                  {/* CUSTOM THEMED DROPDOWN */}
                  <div className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 shadow-sm hover:border-[#238B57] transition-all"
                    >
                      <Bell size={14} className="text-[#238B57]" />
                      <span className="text-[12px] font-bold text-slate-700">
                        {reminderOffset} mins early
                      </span>
                      <ChevronDown
                        size={12}
                        className={`text-slate-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {isDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setIsDropdownOpen(false)}
                        ></div>
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                          {["10", "20", "30"].map((val) => (
                            <div
                              key={val}
                              onClick={() => {
                                setReminderOffset(val);
                                setIsDropdownOpen(false);
                              }}
                              className={`flex items-center justify-between px-4 py-3 text-sm cursor-pointer transition-colors ${reminderOffset === val ?
                                "bg-[#F2F9F5] text-[#238B57] font-bold"
                                : "text-slate-600 hover:bg-gray-50"
                                }`}
                            >
                              <span>{val} minutes early</span>
                              {reminderOffset === val && (
                                <Check size={14} strokeWidth={3} />
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <p className="text-[13px] text-slate-500 mb-4">
                  How many days do you want to receive notifications?
                </p>
                {/*
                 */}
                <div className="grid grid-cols-4 gap-3 mb-5 ">
                  {DURATION_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setDuration(opt.value)}
                      className={`flex flex-col items-center justify-center py-3 rounded-xl border-2 transition-all ${duration === opt.value ? "bg-white border-[#238B57] shadow-sm" : "bg-white border-gray-100 text-gray-400"}`}
                    >
                      <span
                        className={`text-lg font-bold ${duration === opt.value ? "text-[#238B57]" : "text-slate-700"}`}
                      >
                        {opt.label}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider font-medium">
                        {opt.sub}
                      </span>
                    </button>
                    // h
                  ))}
                </div>

                <div className="bg-white border border-gray-100 rounded-xl p-4">
                  <p className="text-xs font-bold text-slate-800">
                    Summary:{" "}
                    <span className="font-medium text-slate-600">
                      {duration} days • {reminderOffset}m offset
                    </span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Notifications will arrive {reminderOffset} minutes before
                    each prayer until {getEndDate()}.
                  </p>
                </div>
              </div>

              {/* Select Prayers Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-800 mb-4">
                  Select Prayers
                </h3>
                <div
                  onClick={toggleAll}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${isAllSelected ? "bg-[#E8F5EE] border-[#238B57]" : "bg-white border-gray-100"}`}
                >
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">
                      All Prayers
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Receive notifications for all 5 daily prayers
                    </p>
                  </div>
                  {isAllSelected && (
                    <div className="bg-[#238B57] text-white p-1 rounded-full">
                      <Check size={14} strokeWidth={4} />
                    </div>
                  )}
                </div>

                {PRAYER_LIST.map((prayer) => (
                  <div
                    key={prayer.id}
                    onClick={() => togglePrayer(prayer.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${selectedPrayers.includes(prayer.id) ? "border-[#238B57] bg-white shadow-sm" : "border-gray-100 bg-white"}`}
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">
                        {prayer.name}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {prayer.desc}
                      </p>
                    </div>
                    {selectedPrayers.includes(prayer.id) && !isAllSelected && (
                      <div className="text-[#238B57]">
                        <Check size={18} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-4 mt-10">
                <button
                  onClick={prevStep}
                  className="flex-1 bg-gray-50 text-slate-500 font-bold rounded-xl py-4 text-sm hover:bg-gray-100 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleCompleteSubscription}
                  disabled={apiLoading}
                  className="flex-[2] bg-[#238B57] hover:bg-[#1a6e44] text-white font-bold rounded-xl py-4 text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:bg-[#238B57]/60 disabled:cursor-not-allowed"
                >
                  {apiLoading ? (
                    <>Processing...</>
                  ) : (
                    <>
                      Complete Subscription <Check size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 4: SUCCESS ================= */}
          {step === 4 && (
            <div className="animate-in zoom-in-95 duration-500 text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-[#238B57] mx-auto mb-6 shadow-sm">
                <Check size={40} strokeWidth={3} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Successfully Subscribed!
              </h2>
              <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto">
                Alhamdulillah! You will now receive prayer time notifications{" "}
                {reminderOffset} minutes before the adhan for the next{" "}
                {duration} days.
              </p>
              <button
                onClick={() => setStep(1)}
                className="bg-[#238B57] hover:bg-[#1a6e44] text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-colors shadow-sm"
              >
                Back to Home
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
