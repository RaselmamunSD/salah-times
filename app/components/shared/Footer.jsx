import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/logo.png";
import { Nunito } from "next/font/google";
import {
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  MessageCircle,
} from "lucide-react";
import NewsletterFooter from "./NewsletterFooter";

const nunito = Nunito({ subsets: ["latin"] });

export default function Footer() {
  return (
    <footer
      className={`${nunito.className} bg-white pt-16 pb-8 px-4 md:px-10 border-t border-gray-100 md:mt-25`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 mb-12">
          {/* Section 1: Logo & Socials */}
          <div className="flex flex-col gap-6">
            <div className="relative w-24 h-24">
              <Image
                src={logo}
                alt="Salaah Logo"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-[#333] text-lg leading-snug max-w-[280px]">
              Your reliable Islamic digital companion for accurate prayer times.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<Facebook size={20} />} />
              <SocialIcon icon={<Twitter size={20} />} />
              <SocialIcon icon={<Instagram size={20} />} />
              <SocialIcon icon={<MessageCircle size={20} />} />
            </div>
          </div>

          {/* Section 2: Quick Links */}
          <div>
            <h3 className="text-[#006E3E] font-bold text-xl mb-6">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-4 text-[#333] text-lg">
              {["Home", "Find Mosque", "Subscribe", "About Us", "Support"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="hover:text-[#006E3E] transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Section 3: Contact Us */}
          <div>
            <h3 className="text-[#006E3E] font-bold text-xl mb-6">
              Contact Us
            </h3>
            <div className="flex flex-col gap-4 text-[#333] text-lg">
              <div className="flex items-center gap-3">
                <Phone size={20} className="text-black" />
                <span>+880 1738-060329</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-black" />
                <span>rasel.mamun314@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Section 4: Newsletter */}
          <NewsletterFooter />
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8 text-center">
          <p className="text-[#333] text-lg">
            © 2026{" "}
            <span className="text-[#006E3E] font-bold">Salaah-Times</span>. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon }) {
  return (
    <div className="w-10 h-10 rounded-full bg-[#E6F3EE] flex items-center justify-center text-[#006E3E] cursor-pointer hover:bg-[#006E3E] hover:text-white transition-all">
      {icon}
    </div>
  );
}
