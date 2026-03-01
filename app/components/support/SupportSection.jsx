"use client";

import React, { useState } from "react";

export default function SupportSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setSubmitError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${apiBase}/api/support-messages/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const firstError =
          (typeof errorData === "object" && Object.values(errorData)[0]) ||
          "Failed to send message.";
        throw new Error(Array.isArray(firstError) ? firstError[0] : firstError);
      }

      setSubmitSuccess("Your message has been sent successfully.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setSubmitError(error.message || "Failed to send message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] py-15 flex flex-col items-center px-4 sm:px-6 relative">
      {/* Top Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-16">
        {/* WhatsApp Card */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex flex-col items-start border border-gray-100/50">
          <div className="w-12 h-12 bg-[#25D366] rounded-2xl flex items-center justify-center mb-4 text-white">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413" />
            </svg>
          </div>
          <h3 className="text-[17px] font-bold text-slate-800 mb-1">
            WhatsApp Support
          </h3>
          <p className="text-[13px] text-slate-500 mb-4 font-medium">
            Get instant help via WhatsApp
          </p>
          <a
            href="#"
            className="mt-auto text-[13px] font-semibold text-[#25D366] flex items-center gap-1 hover:opacity-80 transition-opacity"
          >
            Chat Now
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>

        {/* Email Card */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex flex-col items-start border border-gray-100/50">
          <div className="w-12 h-12 bg-[#2D6A85] rounded-2xl flex items-center justify-center mb-4 text-white">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </div>
          <h3 className="text-[17px] font-bold text-slate-800 mb-1">
            Email Support
          </h3>
          <p className="text-[13px] text-slate-500 mb-4 font-medium">
            Send us a detailed inquiry
          </p>
          <a
            href="#"
            className="mt-auto text-[13px] font-semibold text-[#2D6A85] flex items-center gap-1 hover:opacity-80 transition-opacity"
          >
            Email Us
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>

        {/* Phone Card */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex flex-col items-start border border-gray-100/50">
          <div className="w-12 h-12 bg-[#1A8D5F] rounded-2xl flex items-center justify-center mb-4 text-white">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          </div>
          <h3 className="text-[17px] font-bold text-slate-800 mb-1">
            Phone Support
          </h3>
          <p className="text-[13px] text-slate-500 mb-4 font-medium">
            Call us during business hours
          </p>
          <a
            href="#"
            className="mt-auto text-[13px] font-semibold text-[#1A8D5F] flex items-center gap-1 hover:opacity-80 transition-opacity"
          >
            +880 1XXX-XXXXXX
          </a>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="w-full max-w-3xl flex flex-col items-center mb-20">
        <h2 className="text-[30px] font-semibold text-[#1E293B] mb-2">
          Frequently Asked Questions
        </h2>
        <p className="text-[14px] text-slate-500 mb-8 font-medium">
          Find quick answers to common questions
        </p>

        <div className="w-full flex flex-col gap-3">
          {[
            "How accurate are the prayer times?",
            "How do I subscribe to notifications?",
            "Can I follow multiple mosques?",
            "How do I update my subscription preferences?",
            "What if I find incorrect prayer times?",
            "Is this service free?",
          ].map((question, index) => (
            <div
              key={index}
              className="w-full bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-4 px-6 flex justify-between items-center cursor-pointer border border-gray-100/50 hover:bg-gray-50/50 transition-colors"
            >
              <span className="text-[14px] font-bold text-[#1E293B]">
                {question}
              </span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#64748B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] p-8 md:p-10 border border-gray-100/50 mb-12">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-2xl font-bold text-[#1E293B] mb-2">
            Send Us a Message
          </h2>
          <p className="text-[14px] text-slate-500 font-medium">
            Can't find what you're looking for? Contact us directly
          </p>
        </div>

        {submitSuccess && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            {submitSuccess}
          </div>
        )}

        {submitError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-slate-700">
                Your Name *
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-[14px] text-slate-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#238B57] focus:border-[#238B57] transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-slate-700">
                Your Email *
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-[14px] text-slate-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#238B57] focus:border-[#238B57] transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-slate-700">
              Subject *
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-[14px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#238B57] focus:border-[#238B57] transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-slate-700">
              Your Message *
            </label>
            <textarea
              placeholder="Tell us how we can help..."
              rows={5}
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-[14px] text-slate-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#238B57] focus:border-[#238B57] transition-all resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#208B55] hover:bg-[#1a7346] text-white font-semibold rounded-lg py-3.5 mt-2 flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}
