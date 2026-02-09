import { Inter, Poppins } from "next/font/google";
import ActionButtons from "./components/home/ActionButtons";
import Hero from "./components/home/Hero";
import LocationCard from "./components/home/LocationCard";
import Navbar from "./components/shared/Navbar";
import TimeSection from "./components/home/TimeSection";
import MosquesNearYou from "./components/home/MosquesNearYou";
import RegisterMosque from "./components/home/RegisterMosque";

const inter = Inter({
  subsets: ["latin"],
});

export default function Home() {
  return (
    <main
      className={`${inter.className} h-205.5 w-full px-4 lg:px-8 py-27 flex flex-col items-center bg-linear-to-br from-[#1F8A5B] to-[#1F6F8B] `}
    >
      <div className="relative flex flex-col items-center justify-center w-full max-w-4xl mt-12.5 mb-20">
        <Hero />
        <LocationCard />
        <ActionButtons />
        <TimeSection />
      </div>
      <MosquesNearYou />
      <RegisterMosque />
    </main>
  );
}
