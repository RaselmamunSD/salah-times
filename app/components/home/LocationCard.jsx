import { MapPin } from "lucide-react";
import { Inter } from "next/font/google";
const inter = Inter({
  subsets: ["latin"],
});
export default function LocationCard() {
  // In a real SSR scenario, you'd fetch this from headers or a GeoIP API
  const location = "Dhaka, Bangladesh";

  return (
    <div
      className={`w-full max-w-md mt-4 lg:mt-10 ${inter.className} lg:h-full`}
    >
      <div className="bg-white/10 backdrop-blur-lg h-[80px] lg:h-full border border-[#5d9ca3] rounded-3xl p-3 lg:p-6 overflow-hidden">
        <div className="lg:flex justify-between items-center mb-4">
          {" "}
          <div className="flex justify-between">
            <span className="text-white/60 text-xs lg:text-sm font-medium">
              Current Location
            </span>
            <button className=" text-white/80 text-xs flex items-center gap-1 hover:text-white">
              <MapPin size={12} /> Change
            </button>
          </div>
          <button className="hidden text-white/80 text-xs lg:flex items-center gap-1 hover:text-white">
            <MapPin size={12} /> Change
          </button>
          <div className="lg:hidden text-white lg:text-2xl font-medium text-center py-2">
            {location}
          </div>
        </div>
        <div className="hidden lg:block text-white lg:text-2xl font-medium text-center py-2">
          {location}
        </div>
      </div>
    </div>
  );
}
