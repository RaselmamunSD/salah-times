import { Nunito } from "next/font/google";

const nunito = Nunito({
  subsets: ["latin"],
});
export default function ActionButtons() {
  return (
    <div
      className={`flex flex-col md:flex-row gap-4 mt-12 w-full max-w-lg ${nunito.className}`}
    >
      <button className="flex-1 cursor-pointer bg-white text-[#006E3E] font-semibold p-3 rounded-xl shadow-lg hover:bg-slate-50 transition-colors text-[20px]">
        Find Mosque Near Me
      </button>
      <button className="flex-1 cursor-pointer text-[20px] bg-transparent border-2 border-white/30 text-white font-semibold p-3 rounded-xl hover:bg-white/10 transition-colors">
        View All Prayer Times
      </button>
    </div>
  );
}
