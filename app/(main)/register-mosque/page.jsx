"use client";

import React, { useState } from "react";
import {
  Check,
  MapPin,
  Mail,
  Smartphone,
  ChevronRight,
  Clock,
  Info,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Send,
  Globe,
} from "lucide-react";
import { Inter, Lato } from "next/font/google";
import { mosqueService } from "../../services/mosque";

const inter = Inter({ subsets: ["latin"] });
const lato = Lato({ subsets: ["latin"], weight: ["400", "700", "900"] });

// --- Data Structures ---
const PRAYERS = [
  {
    label: "Fajr",
    beginningKey: "fajr_beginning",
    jamaahKey: "fajr_jamaah",
  },
  {
    label: "Sunrise",
    beginningKey: "sunrise",
    jamaahKey: null,
  },
  {
    label: "Dhuhr",
    beginningKey: "dhuhr_beginning",
    jamaahKey: "dhuhr_jamaah",
  },
  {
    label: "Asr",
    beginningKey: "asr_beginning",
    jamaahKey: "asr_jamaah",
  },
  {
    label: "Maghrib",
    beginningKey: "maghrib_sunset",
    jamaahKey: "maghrib_jamaah",
  },
  {
    label: "Isha",
    beginningKey: "isha_beginning",
    jamaahKey: "isha_jamaah",
  },
];

const FACILITIES = [
  { id: "wudu", label: "Wudu Area" },
  { id: "parking", label: "Parking" },
  { id: "ac", label: "AC" },
  { id: "ladies", label: "Ladies Section" },
  { id: "wheelchair", label: "Wheelchair Access" },
  { id: "library", label: "Library" },
];

export default function RegisterMosqueFlow() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    mosqueName: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    area: "",
    facilities: [],
    additionalInfo: "",
    prayerTimes: {
      fajr_beginning: "",
      fajr_jamaah: "",
      sunrise: "",
      dhuhr_beginning: "",
      dhuhr_jamaah: "",
      asr_beginning: "",
      asr_jamaah: "",
      maghrib_sunset: "",
      maghrib_jamaah: "",
      isha_beginning: "",
      isha_jamaah: "",
    },
  });

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const toggleFacility = (id) => {
    setFormData((prev) => {
      const exists = prev.facilities.includes(id);
      return {
        ...prev,
        facilities: exists
          ? prev.facilities.filter((f) => f !== id)
          : [...prev.facilities, id],
      };
    });
  };

  const [submissionError, setSubmissionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const buildWhatsAppMessage = () => {
    const prayerTimeLines = PRAYERS.map((prayer) => {
      const beginningValue = formData.prayerTimes[prayer.beginningKey] || "-";
      const jamaahValue = prayer.jamaahKey
        ? formData.prayerTimes[prayer.jamaahKey] || "-"
        : "N/A";

      return `${prayer.label}: Beginning ${beginningValue}, Iqamah ${jamaahValue}`;
    });

    const lines = [
      "Assalamu Alaikum,",
      "",
      "New mosque registration request:",
      `🕌 Mosque Name: ${formData.mosqueName || "-"}`,
      `👤 Contact Person: ${formData.contactPerson || "-"}`,
      `📞 Phone: ${formData.phone || "-"}`,
      `📧 Email: ${formData.email || "-"}`,
      `📍 Address: ${formData.address || "-"}`,
      `📍 Area/District: ${formData.area || "-"}`,
      `📝 Additional Info: ${formData.additionalInfo || "-"}`,
      "",
      "Prayer Times:",
      ...prayerTimeLines,
      "",
      `Facilities: ${formData.facilities.length
        ? formData.facilities.join(", ")
        : "Not specified"
      }`,
      "",
      "Please review and contact back in shaa Allah.",
    ];

    return lines.join("\n");
  };

  const handlePrayerTimeChange = (field) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      prayerTimes: {
        ...prev.prayerTimes,
        [field]: value,
      },
    }));
  };

  const getCurrentCoordinates = () =>
    new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ latitude: null, longitude: null });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => resolve({ latitude: null, longitude: null }),
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    });

  const handleSubmitToWhatsApp = async () => {
    setSubmissionError("");

    if (!formData.mosqueName || !formData.phone || !formData.address) {
      setSubmissionError(
        "Please fill Mosque Name, Phone Number and Address before continuing."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const { latitude, longitude } = await getCurrentCoordinates();

      await mosqueService.registerMosqueRequest({
        mosque_name: formData.mosqueName,
        contact_person: formData.contactPerson,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        area: formData.area,
        latitude,
        longitude,
        facilities: formData.facilities,
        additional_info: formData.additionalInfo,
        prayer_times: formData.prayerTimes,
      });

      const adminNumber =
        process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+8801738060329";
      const numericPhone = adminNumber.replace(/[^\d]/g, "");
      const text = encodeURIComponent(buildWhatsAppMessage());
      const url = `https://wa.me/${numericPhone}?text=${text}`;

      if (typeof window !== "undefined") {
        window.open(url, "_blank");
      }

      setStep(5);
    } catch (error) {
      const message =
        error?.response?.data?.detail ||
        "Failed to submit request. Please try again.";
      setSubmissionError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen bg-[#F8FAFC] flex flex-col `}>
      {/* Hero Header Section */}
      <div className="py-[196px] text-center bg-gradient-to-b from-[#1F8A5B] to-[#1F6F8B] w-full">
        <h1
          className={`font-bold text-4xl md:text-[66px] text-white ${lato.className}`}
        >
          <span className="text-[#26FFA0] italic">Register</span> Your Mosque
        </h1>
        <p className={`md:text-2xl text-[#D0E0FF] ${inter.className} mt-4`}>
          Join our platform and help your community stay connected
        </p>
      </div>

      {/* --- MAIN FORM CARD --- */}
      <main className="flex-grow px-4 mt-[120px] relative z-20 pb-24">
        <div className="max-w-[840px] mx-auto bg-white rounded-[40px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.12)] p-8 md:p-14 border border-white/50">
          {/* STEPPER INDICATOR */}
          {step < 5 && (
            <div className="flex items-start md:items-center justify-between mb-16 max-w-[600px] mx-auto relative">
              <div className="absolute top-4 left-0 w-full h-[3px] bg-slate-100 -z-0 rounded-full" />
              <div
                className="absolute top-4 left-0 h-[3px] bg-[#238B57] transition-all duration-700 ease-in-out -z-0 rounded-full"
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              />
              {["Basic Info", "Location", "Prayer Times", "Details"].map(
                (label, idx) => (
                  <div
                    key={label}
                    className="flex flex-col md:items-center relative z-10 bg-white px-2"
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${step >= idx + 1 ? "bg-[#238B57] text-white" : "bg-slate-100 text-slate-400"}`}
                    >
                      {step > idx + 1 ?
                        <Check size={16} strokeWidth={3} />
                        : idx + 1}
                    </div>
                    <span
                      className={`text-[11px] font-bold mt-3 uppercase tracking-widest ${step >= idx + 1 ? "text-[#238B57]" : "text-slate-400"}`}
                    >
                      {label}
                    </span>
                  </div>
                ),
              )}
            </div>
          )}

          {/* STEP 1: BASIC INFO */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Basic Information
              </h2>
              <p className="text-slate-500 mb-10">Tell us about your mosque</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">
                    Mosque Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter mosque name"
                    value={formData.mosqueName}
                    onChange={handleChange("mosqueName")}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#238B57]/10 focus:border-[#238B57] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    placeholder="+880 16XXXXXXXX"
                    value={formData.phone}
                    onChange={handleChange("phone")}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#238B57]/10 focus:border-[#238B57] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={formData.contactPerson}
                    onChange={handleChange("contactPerson")}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#238B57]/10 focus:border-[#238B57] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="mosque@example.com"
                    value={formData.email}
                    onChange={handleChange("email")}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#238B57]/10 focus:border-[#238B57] transition-all"
                  />
                </div>
              </div>

              <button
                onClick={nextStep}
                className="w-full py-5 bg-[#238B57] text-white font-bold rounded-2xl shadow-xl shadow-green-900/10 hover:bg-[#1a6d44] transition-all"
              >
                Continue to Location
              </button>
            </div>
          )}

          {/* STEP 2: LOCATION */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Location Details
              </h2>
              <p className="text-slate-500 mb-10">
                Where is your mosque located?
              </p>

              <div className="space-y-6 mb-10">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">
                    Full Address *
                  </label>
                  <input
                    type="text"
                    placeholder="Street address, building name, etc."
                    value={formData.address}
                    onChange={handleChange("address")}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#238B57]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">
                    Area/District *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Uttara, Gulshan, Mohammadpur"
                    value={formData.area}
                    onChange={handleChange("area")}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#238B57]"
                  />
                </div>

                <div className="bg-[#F0F9FF] border border-[#E0F2FE] rounded-2xl p-5 flex gap-4">
                  <div className="text-blue-500">
                    <Info size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Location Tips
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Provide detailed address information to help people find
                      your mosque easily. Include nearby landmarks if possible.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={prevStep}
                  className="flex-1 py-4 text-slate-500 font-bold bg-slate-50 rounded-xl"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="flex-[2] py-4 bg-[#238B57] text-white font-bold rounded-xl"
                >
                  Continue to Prayer Times
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PRAYER TIMES */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Prayer Times
              </h2>
              <p className="text-slate-500 mb-10">
                Enter your mosque's prayer schedule
              </p>

              <div className="overflow-hidden border border-slate-100 rounded-2xl mb-10">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                      <th className="px-6 py-4">Prayer</th>
                      <th className="px-6 py-4">Beginning Time</th>
                      <th className="px-6 py-4">Iqamah Time (Optional)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {PRAYERS.map((prayer) => (
                      <tr key={prayer.label}>
                        <td className="px-6 py-5 font-bold text-slate-700 text-sm">
                          {prayer.label}
                        </td>
                        <td className="px-6 py-5">
                          <input
                            type="time"
                            step="60"
                            placeholder="00:00 AM"
                            value={formData.prayerTimes[prayer.beginningKey]}
                            onChange={handlePrayerTimeChange(prayer.beginningKey)}
                            className="w-full text-sm bg-transparent border-b border-slate-100 focus:border-[#238B57] focus:outline-none pb-1"
                          />
                        </td>
                        <td className="px-6 py-5">
                          <input
                            type="time"
                            step="60"
                            placeholder="00:00 AM"
                            value={
                              prayer.jamaahKey
                                ? formData.prayerTimes[prayer.jamaahKey]
                                : ""
                            }
                            onChange={
                              prayer.jamaahKey
                                ? handlePrayerTimeChange(prayer.jamaahKey)
                                : undefined
                            }
                            disabled={!prayer.jamaahKey}
                            className="w-full text-sm bg-transparent border-b border-slate-100 focus:border-[#238B57] focus:outline-none pb-1"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={prevStep}
                  className="flex-1 py-4 text-slate-500 font-bold bg-slate-50 rounded-xl"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="flex-[2] py-4 bg-[#238B57] text-white font-bold rounded-xl shadow-lg shadow-green-900/10"
                >
                  Continue to Details
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: ADDITIONAL DETAILS */}
          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Additional Details
              </h2>
              <p className="text-slate-500 mb-10">
                Tell us more about your mosque's facilities
              </p>

              <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-800 mb-6">
                  Facilities Available
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {FACILITIES.map((facility) => (
                    <div
                      key={facility.id}
                      onClick={() => toggleFacility(facility.id)}
                      className={`flex items-center gap-3 p-4 bg-slate-50 rounded-xl border transition-all group cursor-pointer ${formData.facilities.includes(facility.id)
                          ? "border-[#238B57] bg-[#E8F5EE]"
                          : "border-transparent"
                        }`}
                    >
                      <div className="w-5 h-5 rounded border-2 border-slate-200 bg-white flex items-center justify-center group-hover:border-[#238B57]">
                        {formData.facilities.includes(facility.id) && (
                          <Check size={14} className="text-[#238B57]" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">
                        {facility.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 mb-10">
                <label className="text-sm font-bold text-slate-700">
                  Additional Information
                </label>
                <textarea
                  rows={4}
                  placeholder="Any other details about your mosque (capacity, special programs, etc.)"
                  value={formData.additionalInfo}
                  onChange={handleChange("additionalInfo")}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#238B57] outline-none transition-all"
                />
              </div>

              <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-2xl p-6 mb-10 flex gap-4">
                <div className="bg-[#238B57] text-white w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                  <Smartphone size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    What happens next?
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    After clicking continue, you'll be redirected to WhatsApp to
                    communicate with our admin team. They will verify your
                    details and provide you with access to the mosque portal.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={prevStep}
                  className="flex-1 py-4 text-slate-500 font-bold bg-slate-50 rounded-xl"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmitToWhatsApp}
                  disabled={isSubmitting}
                  className="flex-[2] py-4 bg-[#238B57] text-white font-bold rounded-xl flex items-center justify-center gap-2"
                >
                  {isSubmitting ? "Submitting..." : "Continue to WhatsApp"} <Send size={18} />
                </button>
              </div>

              {submissionError && (
                <p className="mt-4 text-sm text-red-500 text-center">
                  {submissionError}
                </p>
              )}
            </div>
          )}

          {/* SUCCESS MESSAGE */}
          {step === 5 && (
            <div className="animate-in zoom-in-95 duration-700 text-center py-10">
              <div className="w-24 h-24 bg-[#F0FDF4] text-[#238B57] rounded-full flex items-center justify-center mx-auto mb-8">
                <Check size={48} strokeWidth={4} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
                Request Submitted!
              </h2>
              <p className="text-slate-500 max-w-md mx-auto leading-relaxed mb-10">
                Your mosque registration request has been sent. We will review
                the information and get back to you shortly.
              </p>
              <button
                onClick={() => setStep(1)}
                className="px-12 py-4 bg-[#238B57] text-white font-bold rounded-xl"
              >
                Return Home
              </button>
            </div>
          )}
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-slate-100 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="flex items-center gap-2 font-bold text-xl mb-6">
              <div className="w-8 h-8 bg-[#238B57] rounded-full flex items-center justify-center text-white text-lg">
                🕌
              </div>
              <span className="text-slate-900">Prayer Times</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              The world's most accurate prayer time app for muslims around the
              world.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:bg-[#238B57] hover:text-white transition-all"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
          {/* Footer columns... */}
          <div>
            <h4 className="font-bold text-slate-900 mb-8">Quick Links</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li>Home</li>
              <li>Find Mosque</li>
              <li>About Us</li>
              <li>Support</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-8">Contact Us</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li className="flex items-center gap-3">
                <Mail size={16} /> info@prayertime.com
              </li>
              <li className="flex items-center gap-3">
                <Smartphone size={16} /> +880 123 456 789
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-8">Newsletter</h4>
            <div className="relative">
              <input
                type="text"
                placeholder="Email Address"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#238B57] text-white p-1.5 rounded-lg">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
