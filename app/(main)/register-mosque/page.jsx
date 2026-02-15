"use client";

import React, { useState } from "react";
import {
  Mail,
  MessageCircle,
  Search,
  CheckCircle2,
  ChevronRight,
  Bell,
  MapPin,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SubscribeFlow = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    method: "",
    mosque: "",
    preferences: ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"],
  });

  const steps = [
    { id: 1, label: "Method" },
    { id: 2, label: "Mosque" },
    { id: 3, label: "Preferences" },
  ];

  const handleNext = () => setStep((prev) => prev + 1);

  // --- Sub-Components (Internal to the main component) ---

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-10 relative max-w-sm mx-auto">
      <div className="absolute top-5 left-0 w-full h-[2px] bg-gray-100 -z-0"></div>
      {steps.map((s) => (
        <div
          key={s.id}
          className="relative z-10 flex flex-col items-center flex-1"
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 border-4 ${
              step >= s.id ?
                "bg-[#10b981] border-emerald-100 text-white"
              : "bg-white border-gray-100 text-gray-400"
            }`}
          >
            {step > s.id ?
              <Check size={18} strokeWidth={3} />
            : s.id}
          </div>
          <span
            className={`text-[11px] mt-2 font-bold uppercase tracking-wider ${
              step >= s.id ? "text-[#065f46]" : "text-gray-400"
            }`}
          >
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfdfd] font-sans text-slate-900">
      {/* Top Banner Section */}
      <section className="bg-gradient-to-br from-[#065f46] via-[#065f46] to-[#0d9488] pt-20 pb-40 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Subscribe{" "}
            <span className="font-light text-emerald-200">to Prayer Times</span>
          </h1>
          <p className="text-emerald-50/80 text-sm md:text-base max-w-md mx-auto leading-relaxed">
            Stay connected with your local community. Never miss a prayer with
            our automated smart notifications.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-[850px] mx-auto -mt-24 px-4 pb-24">
        <div className="bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 md:p-14 border border-gray-50 relative overflow-hidden">
          {/* Subtle Background Accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/50 rounded-full -mr-16 -mt-16 blur-3xl"></div>

          <StepIndicator />

          <AnimatePresence mode="wait">
            {/* STEP 1: METHOD */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Choose Notification Method
                </h2>
                <p className="text-gray-500 mb-10 text-sm">
                  Select how you would like to receive your daily alerts
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button
                    onClick={() => {
                      setFormData({ ...formData, method: "WhatsApp" });
                      handleNext();
                    }}
                    className="group relative p-8 border-2 border-gray-100 rounded-3xl hover:border-emerald-500 hover:bg-emerald-50/30 transition-all duration-300 text-left"
                  >
                    <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <MessageCircle className="text-emerald-600" size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">
                      WhatsApp
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Instant alerts directly to your mobile app.
                    </p>
                  </button>

                  <button
                    onClick={() => {
                      setFormData({ ...formData, method: "Email" });
                      handleNext();
                    }}
                    className="group relative p-8 border-2 border-gray-100 rounded-3xl hover:border-emerald-500 hover:bg-emerald-50/30 transition-all duration-300 text-left"
                  >
                    <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Mail className="text-blue-600" size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">
                      Email Address
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Daily schedule sent to your inbox every morning.
                    </p>
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: MOSQUE */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl mx-auto"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Select Your Mosque
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Find the mosque you want to follow prayer times for
                  </p>
                </div>

                <div className="relative mb-6">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search by mosque name, city, or zip code..."
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {[
                    "Baitul Mukarram National Mosque",
                    "Mohakhali Central Mosque",
                    "Gulshan Society Mosque",
                  ].map((mosque) => (
                    <div
                      key={mosque}
                      className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:border-emerald-200 hover:bg-emerald-50/20 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                          <MapPin
                            size={18}
                            className="text-gray-500 group-hover:text-emerald-600"
                          />
                        </div>
                        <span className="font-semibold text-gray-700">
                          {mosque}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setFormData({ ...formData, mosque });
                          handleNext();
                        }}
                        className="bg-[#065f46] text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-emerald-800 shadow-md active:scale-95 transition-all"
                      >
                        Select
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 3: PREFERENCES */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl mx-auto"
              >
                <div className="text-center mb-10">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Prayer Preferences
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Which prayer alerts would you like to receive?
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-10">
                  {["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"].map(
                    (prayer) => (
                      <label
                        key={prayer}
                        className="relative flex items-center justify-between p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-emerald-50 border-2 border-transparent has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50 transition-all"
                      >
                        <span className="font-bold text-gray-700">
                          {prayer}
                        </span>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-6 h-6 accent-emerald-600 rounded-lg"
                        />
                      </label>
                    ),
                  )}
                </div>

                <button
                  onClick={handleNext}
                  className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold py-5 rounded-2xl shadow-xl shadow-emerald-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  Complete Registration <ChevronRight size={20} />
                </button>
              </motion.div>
            )}

            {/* STEP 4: SUCCESS */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-6"
              >
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <CheckCircle2 size={56} strokeWidth={1.5} />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-800 mb-3">
                  Successfully Subscribed!
                </h2>
                <p className="text-gray-500 mb-10 max-w-xs mx-auto">
                  You are now set up to receive {formData.method} alerts for{" "}
                  <span className="font-bold text-gray-700">
                    {formData.mosque}
                  </span>
                  .
                </p>
                <button
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 text-[#065f46] font-bold hover:text-emerald-700 transition-colors border-b-2 border-emerald-100 hover:border-[#065f46] pb-1"
                >
                  Go to Dashboard <ChevronRight size={18} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Help Link */}
        <p className="text-center mt-8 text-gray-400 text-sm">
          Having trouble?{" "}
          <a
            href="#"
            className="text-emerald-600 font-semibold hover:underline"
          >
            Contact Support
          </a>
        </p>
      </main>
    </div>
  );
};

export default SubscribeFlow;
