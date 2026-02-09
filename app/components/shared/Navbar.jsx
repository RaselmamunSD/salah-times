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

  const links = (
    <>
      <Link
        href="/"
        className="hover:text-emerald-300 transition-colors font-light text-xl"
      >
        Home
      </Link>
      <Link
        href="/find-mosque"
        className="hover:text-emerald-300 transition-colors font-light text-xl"
      >
        Find Mosque
      </Link>
      <Link
        href="/subscribe"
        className="hover:text-emerald-300 transition-colors font-light text-xl"
      >
        Subscribe
      </Link>
      <Link
        href="/about"
        className="hover:text-emerald-300 transition-colors font-light text-xl"
      >
        About
      </Link>
      <Link
        href="/support"
        className="hover:text-emerald-300 transition-colors font-light text-xl"
      >
        Support
      </Link>
    </>
  );
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
          "bg-[#1b8a6b]/90 shadow-xl rounded-[20px] border border-white/20"
        : "bg-white/20 backdrop-blur-md rounded-[20px] border border-white/20"
      }`}
    >
      <div className="px-6 md:px-11 py-[10px] flex items-center justify-between">
        {/* Desktop Links - Hidden on Mobile */}
        <div className="hidden md:flex gap-8 text-white">{links}</div>

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
            href="/login"
            className="text-[#26FFA0] font-semibold text-lg md:text-xl"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-gradient-to-b from-[#ADFFDB] to-[#00FF8F] cursor-pointer text-[#006E3E] font-semibold px-4 py-2 md:p-3 rounded-[10px] transition-all shadow-xl text-base md:text-[20px] whitespace-nowrap"
          >
            Registration
          </Link>
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
        <div className="bg-[#1b8a6b]/90 backdrop-blur-xl border border-white/20 rounded-[20px] p-6 flex flex-col gap-4 shadow-2xl text-white">
          {links}
        </div>
      </div>
    </nav>
  );
}
