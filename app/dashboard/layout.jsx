"use client";
import logo from "../../public/logo.png";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Star,
  MapPin,
  Settings,
  LogOut,
  Menu,
  X,
  MessageCircle,
} from "lucide-react";
import { IoIosNotificationsOutline } from "react-icons/io";
import Image from "next/image";

const navItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  { name: "Profile", icon: User, href: "/dashboard/profile" },
  { name: "Favorite Mosques", icon: Star, href: "/dashboard/favorite-mosque" },
  {
    name: "Subscribe Mosques",
    icon: IoIosNotificationsOutline,
    href: "/dashboard/subscribe-mosque",
  },
  { name: "Location", icon: MapPin, href: "/dashboard/location" },
  { name: "Settings", icon: Settings, href: "/dashboard/settings" },
];

const topNavItems = [
  { name: "Home", href: "/" },
  { name: "Find Mosque", href: "/find-mosque" },
  { name: "Subscribe", href: "/subscribe" },
  { name: "About", href: "/about" },
  { name: "Support", href: "/support" },
];

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  console.log(pathname);
  return (
    <>
      <div className="bg-[#F8F9FA] flex text-slate-700">
        {/* MOBILE OVERLAY */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* SIDEBAR */}
        <aside
          className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
        >
          <div className="flex flex-col h-full">
            {/* Logo Section */}
            <Link href="/" className="p-6 flex items-center gap-3">
              <Image
                src={logo}
                alt="Logo"
                width={36}
                height={36}
                className="rounded-full"
              />
              <span className="font-semibold text-[#1E293B] text-lg">
                My Dashboard
              </span>
            </Link>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 space-y-1 mt-4">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.name === "Favorite Mosques" && pathname === "/");
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${
                      isActive ?
                        "bg-[#E9F3EE] text-[#238B57] font-semibold"
                      : "text-slate-500 hover:bg-gray-50 hover:text-slate-800"
                    }
                  `}
                  >
                    <item.icon
                      size={20}
                      className={isActive ? "text-[#238B57]" : "text-slate-400"}
                    />
                    <span className="text-[14px]">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Logout Section */}
            <div className="p-4 border-t border-gray-50">
              <button className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                <LogOut size={20} />
                <span className="text-[14px] font-semibold">Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col min-w-0 h-screen md:overflow-hidden">
          {/* HEADER / TOP NAV */}
          <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 md:px-12 shrink-0">
            <button
              className="md:hidden p-2 text-slate-500"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-8 ml-auto mr-12">
              {topNavItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="text-[15px] font-medium text-slate-500 hover:text-[#238B57] transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-black cursor-pointer shadow-sm">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                  alt="User profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </header>

          {/* PAGE CONTENT SCROLL AREA */}
          <main className="p-3 md:p-12 relative">{children}</main>
        </div>
      </div>
    </>
  );
}
