import { Inter, Poppins } from "next/font/google";
import ActionButtons from "./components/home/ActionButtons";
import Hero from "./components/home/Hero";
import LocationCard from "./components/home/LocationCard";
import TimeSection from "./components/home/TimeSection";
import MosquesNearYou from "./components/home/MosquesNearYou";
import RegisterMosque from "./components/home/RegisterMosque";
import TrustSection from "./components/home/TrustSection";

const inter = Inter({
  subsets: ["latin"],
});

export default function Home() {
  return (
    <main className={`${inter.className} w-full  flex flex-col items-center`}>
      <div
        className="flex flex-col items-center justify-center mb-20
             bg-linear-to-br from-[#1F8A5B] to-[#1F6F8B] w-full pt-40 lg:pt-110 lg:h-[822px]"
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
