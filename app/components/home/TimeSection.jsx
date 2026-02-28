"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import calendar from "../../../public/icons/calendar.png";
import rightArrow from "../../../public/icons/rightArrow.png";
import TimeCard from "../cards/TimeCard";
import { Inter, Poppins } from "next/font/google";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { mosqueService } from "../../services/mosque";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const inter = Inter({
  subsets: ["latin"],
});
const TimeSection = ({ currentLocation, refreshKey }) => {
  const [prayerData, setPrayerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        setLoading(true);
        let mosqueId = 1;

        if (currentLocation?.latitude && currentLocation?.longitude) {
          const nearbyMosques = await mosqueService.getNearby(
            currentLocation.latitude,
            currentLocation.longitude,
            10
          );

          if (Array.isArray(nearbyMosques) && nearbyMosques.length > 0) {
            mosqueId = nearbyMosques[0].id;
          }
        }

        const data = await mosqueService.getPrayerTimes(mosqueId);
        setPrayerData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching prayer times:", err);
        setError("Unable to load prayer times");
      } finally {
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, [currentLocation?.latitude, currentLocation?.longitude, refreshKey]);

  // Format prayer times for TimeCard component
  const formatPrayerTimes = () => {
    if (!prayerData || !prayerData.prayer_times) return [];

    return prayerData.prayer_times.map((prayer, index) => {
      const isNext = index === prayerData.next_prayer_index;

      if (prayer.name === "Sunrise") {
        return {
          waqt: prayer.name,
          time: prayer.time,
          subTime: null,
          subLabel: null,
          isNext: false,
        };
      }

      return {
        waqt: prayer.name,
        time: prayer.jamaah,
        subTime: prayer.beginning || prayer.sunset,
        subLabel: prayer.beginning ? "Beginning" : "Sunset",
        isNext: isNext,
      };
    });
  };

  const times = formatPrayerTimes();
  return (
    <div
      className={`lg::w-[1216px] bg-white md:shadow-xl md:rounded-2xl ${poppins.className} p-6 md:shadow-2xl mt-4 md:mt-14`}
    >
      {loading ? (
        <div className="text-center py-10">
          <p className="text-[#64748B]">Loading prayer times...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <>
          <div className="md:flex justify-between">
            <div>
              <h1 className="text-[24px] font-semibold mb-[3px] flex items-center gap-2 flex-wrap">
                <span>Today&apos;s</span>
                <div className="flex items-center gap-2">
                  <button className="text-[#1F8A5B] hover:opacity-70 transition-opacity">
                    <ChevronLeft size={20} />
                  </button>
                  <span className="text-[#1F8A5B]">
                    {prayerData?.mosque_name || "Mosque"}
                  </span>
                  <button className="text-[#1F8A5B] hover:opacity-70 transition-opacity">
                    <ChevronRight size={20} />
                  </button>
                </div>
                <span>Prayer Times</span>
              </h1>
              <p
                className={`text-[#64748B] ${inter.className} text-base flex items-center gap-1 mb-4 md:mb-0`}
              >
                <Image src={calendar} width={16} height={16} alt="calendar" />{" "}
                {prayerData?.date || "Loading..."}
              </p>
            </div>
            <div>
              <p className="text-[#64748B] text-[14px]">Next Prayer</p>
              <p className="text-[#1F8A5B] font-semibold text-2xl">
                {prayerData?.time_until_next || "N/A"}
              </p>
            </div>
          </div>

          {/* Time Cards */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-2 md:mt-6">
            {times.map((time, index) => (
              <TimeCard key={index} time={time} isNext={time.isNext} />
            ))}
          </div>

          {/* Subscription part */}
          <div
            className={`bg-gradient-to-br from-[#E9F5F0] to-[#EEF7FB] p-4 ${inter.className} rounded-[14px] mt-6`}
          >
            <div className="md:flex justify-between items-center space-y-2 md:space-y-0">
              {/* Subscribe Texts */}
              <div>
                <h3 className="text-base font-medium text-[#1E293B]">
                  Never Miss a Prayer
                </h3>
                <p className="text-[#64748B] text-sm">
                  Get notifications via WhatsApp or Email
                </p>
              </div>
              <div>
                {/* Subscribe button */}
                <Link
                  href="/subscribe"
                  className="bg-[#1F8A5B] py-3 px-6 text-white rounded-[10px] flex items-center gap-1 justify-center text-base cursor-pointer"
                >
                  Subscribe{" "}
                  <Image
                    src={rightArrow}
                    width={18}
                    height={18}
                    alt="right arrow"
                  />
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TimeSection;
