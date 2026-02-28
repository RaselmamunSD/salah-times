"use client";

import { Inter, Poppins } from "next/font/google";
import { useEffect, useState } from "react";
import Hero from "../components/home/Hero";
import LocationCard from "../components/home/LocationCard";
import ActionButtons from "../components/home/ActionButtons";
import TimeSection from "../components/home/TimeSection";
import MosquesNearYou from "../components/home/MosquesNearYou";
import RegisterMosque from "../components/home/RegisterMosque";
import Newsletter from "../components/home/Newsletter";
import TrustSection from "../components/home/TrustSection";

const inter = Inter({
  subsets: ["latin"],
});

export default function Main() {
  const [currentLocation, setCurrentLocation] = useState({
    name: "Dhaka, Bangladesh",
    latitude: null,
    longitude: null,
  });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const refreshNow = () => setRefreshKey((prev) => prev + 1);

    const interval = setInterval(refreshNow, 30000);
    window.addEventListener("focus", refreshNow);

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshNow();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", refreshNow);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <main className={`${inter.className} w-full  flex flex-col items-center`}>
      <div
        className="flex flex-col items-center justify-center mb-12 md:mb-20
             bg-linear-to-br from-[#1F8A5B] to-[#1F6F8B] w-full pt-24 md:pt-100 md:h-[920px] px-4 md:px-0"
      >
        <Hero />
        <LocationCard
          location={currentLocation}
          onLocationChange={setCurrentLocation}
        />
        <ActionButtons />
        <TimeSection currentLocation={currentLocation} refreshKey={refreshKey} />
      </div>

      <MosquesNearYou currentLocation={currentLocation} refreshKey={refreshKey} />
      <RegisterMosque />
      <Newsletter />
      <TrustSection />
    </main>
  );
}
