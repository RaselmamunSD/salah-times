"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Star,
  MapPin,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import { IoIosNotificationsOutline } from "react-icons/io";
import Image from "next/image";
import { useAuth } from "../providers/AuthProvider";
import { ProtectedRoute } from "../components/ProtectedRoute";

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

function DashboardLayoutContent({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  // Get user display name
  const userName = user
    ? `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username || user.email
    : "User";

  // Get user initials for avatar
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

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
                src="/logo.png"
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
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${isActive
                        ? "bg-[#E9F3EE] text-[#238B57] font-semibold"
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
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              >
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
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-700">{userName}</p>
                <p className="text-xs text-slate-500">Welcome back!</p>
              </div>
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#1b9c5e] cursor-pointer shadow-sm bg-[#1b9c5e] flex items-center justify-center">
                {user?.profile_image ? (
                  <img
                    src={user.profile_image}
                    alt={userName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-sm font-semibold">
                    {userInitials}
                  </span>
                )}
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

// Export wrapped version with protection
export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </ProtectedRoute>
  );
}

