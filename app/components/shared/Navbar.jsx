"use client";

import { useState, useEffect } from "react";
import { Nunito } from "next/font/google";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

const nunito = Nunito({
  subsets: ["latin"],
});

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const navLinks = ["Home", "Find Mosque", "Subscribe", "About", "Support"];
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const solidBg = !isHome || scrolled || isOpen;

  return (
    <nav
      className={`w-[320px] lg:w-[1100px] mt-6 px-4 md:px-0 ${nunito.className} fixed z-50 transition-all duration-300 ${
        solidBg ?
          "bg-[#1b8a6b]/90 shadow-xl rounded-[20px]"
        : "bg-white/20 backdrop-blur-md rounded-[20px]"
      }`}
    >
      <div className="border border-white/20 rounded-[20px] px-6 md:px-11 py-[10px] flex items-center justify-between">
        {/* Desktop Links - Hidden on Mobile */}
        <div className="hidden md:flex gap-8 text-white">
          {navLinks.map((link) => (
            <Link
              key={link}
              href="#"
              className="hover:text-emerald-300 transition-colors font-light text-xl"
            >
              {link}
            </Link>
          ))}
        </div>

        {/* Mobile Hamburger Icon */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            {isOpen ?
              <X size={32} />
            : <Menu size={32} />}
          </button>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4 md:gap-6">
          <Link
            href="#"
            className="text-[#26FFA0] font-semibold text-lg md:text-xl"
          >
            Login
          </Link>
          <button className="bg-gradient-to-b from-[#ADFFDB] to-[#00FF8F] cursor-pointer text-[#006E3E] font-semibold px-4 py-2 md:p-3 rounded-[10px] transition-all shadow-xl text-base md:text-[20px] whitespace-nowrap">
            Registration
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden absolute top-full left-4 right-4 mt-2 transition-all duration-300 ease-in-out transform ${
          isOpen ?
            "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="bg-[#1b8a6b]/90 backdrop-blur-xl border border-white/20 rounded-[20px] p-6 flex flex-col gap-4 shadow-2xl">
          {navLinks.map((link) => (
            <Link
              key={link}
              href="#"
              onClick={() => setIsOpen(false)}
              className="text-white text-xl font-light hover:text-[#26FFA0] py-2 border-b border-white/10 last:border-none"
            >
              {link}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
