"use client";
import logo from "../../../public/logo.png";
import React, { useState } from "react";
import {
  MessageCircle,
  X,
  Clock,
  MapPin,
  HelpCircle,
  Send,
} from "lucide-react";
import Image from "next/image";

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const quickActions = [
    { icon: <Clock size={18} />, label: "Today's Prayer Times" },
    { icon: <MapPin size={18} />, label: "Nearest Mosque" },
    { icon: <Clock size={18} />, label: "Jumu'ah Time" },
    { icon: <HelpCircle size={18} />, label: "Help / Report Issue" },
  ];

  return (
    <div className="fixed bottom-18 lg:bottom-68 right-8 z-[100] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[340px] sm:w-[380px] bg-white rounded-2xl shadow-2xl overflow-hidden origin-bottom-right animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1F8A5B] to-[#1B6A4E] p-4 flex items-center justify-between text-white rounded-t-2xl">
            <div className="flex items-center gap-3">
              <Image
                src={logo}
                width={40}
                height={40}
                alt="Logo"
                className="rounded-full"
              />
              <div>
                <h3 className="font-bold text-[16px]">Salaah Assistant</h3>
                <p className="text-white/80 text-xs">Always here to help</p>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 bg-white">
            <div className="mb-5 text-[#475569] text-[15px] leading-relaxed">
              <p>Assalamu Alaikum! 👋</p>
              <p>I'm your Salaah Assistant. How can I help you today?</p>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2.5">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="w-full flex items-center gap-3 bg-[#F2F9F5] hover:bg-[#e4f2eb] text-[#334155] p-3.5 rounded-xl transition-colors text-[15px] font-medium border border-transparent hover:border-[#D1E5D9]"
                >
                  <span className="text-[#1F8A5B]">{action.icon}</span>
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Input Area */}
          <div className="p-4 bg-white border-t border-dashed border-gray-200">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 bg-white border border-gray-200 rounded-full px-4 py-2.5 text-[15px] focus:outline-none focus:border-[#1F8A5B] focus:ring-1 focus:ring-[#1F8A5B] transition-shadow placeholder:text-gray-400"
              />
              <button className="w-11 h-11 bg-[#1E8A5E] hover:bg-[#17734d] text-white rounded-full flex items-center justify-center shrink-0 transition-transform hover:scale-105 active:scale-95 shadow-sm">
                <Send size={18} className="-ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={toggleChat}
        className="w-16 h-16 bg-gradient-to-b from-[#249970] to-[#1B6A4E] hover:from-[#1e8460] hover:to-[#165740] rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(31,138,91,0.3)] text-white transition-transform hover:scale-105 active:scale-95"
      >
        {isOpen ?
          <X size={28} />
        : <MessageCircle size={28} fill="white" />}
      </button>
    </div>
  );
}
