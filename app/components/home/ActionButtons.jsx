import { Nunito } from "next/font/google";
import Link from "next/link";

const nunito = Nunito({
  subsets: ["latin"],
});
export default function ActionButtons() {
  return (
    <div
      className={`flex flex-col md:flex-row gap-4 mt-6 lg:mt-12 w-full max-w-lg ${nunito.className}`}
    >
      <Link
        href={"/find-mosque"}
        className="flex-1 flex justify-center items-center cursor-pointer bg-white text-[#006E3E] font-semibold p-3 rounded-xl shadow-lg hover:bg-slate-50 transition-colors lg:text-[20px]"
      >
        Find Mosque Near Me
      </Link>
      <button className="flex-1 cursor-pointer lg:text-[20px] bg-transparent border-2 border-white/30 text-white font-semibold p-3 rounded-xl hover:bg-white/10 transition-colors">
        View All Prayer Times
      </button>
    </div>
  );
}
