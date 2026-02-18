import { Inter, Poppins } from "next/font/google";
import Hero from "../components/home/Hero";
import LocationCard from "../components/home/LocationCard";
import ActionButtons from "../components/home/ActionButtons";
import TimeSection from "../components/home/TimeSection";
import MosquesNearYou from "../components/home/MosquesNearYou";
import RegisterMosque from "../components/home/RegisterMosque";
import TrustSection from "../components/home/TrustSection";

const inter = Inter({
  subsets: ["latin"],
});

export default function Main() {
  return (
    <main className={`${inter.className} w-full  flex flex-col items-center`}>
      <div
        className="flex flex-col items-center justify-center mb-12 lg:mb-20
             bg-linear-to-br from-[#1F8A5B] to-[#1F6F8B] w-full pt-24 lg:pt-100 lg:h-[920px] px-4 lg:px-0"
      >
        <Hero />
        <LocationCard />
        <ActionButtons />
        <TimeSection />
      </div>

      <MosquesNearYou />
      <RegisterMosque />
      <TrustSection />
    </main>
  );
}
