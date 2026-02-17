import Image from "next/image";
import logo from "../../../public/logo.png";
import { Inter, Lato } from "next/font/google";
const inter = Inter({
  subsets: ["latin"],
});
const lato = Lato({
  subsets: ["latin"],
  weight: ["400"],
});
export default function Hero() {
  return (
    <div
      className={`flex flex-col items-center text-center animate-fade-in ${inter.className} `}
    >
      <h1
        className={`font-bold text-4xl lg:text-[66px] text-white ${lato.className}`}
      >
        <span className="text-[#26FFA0] italic">Salaah</span> -Times
      </h1>
      <Image
        src={logo}
        width={234}
        height={234}
        alt="logo"
        className="lg:h-[234px] lg:w-[234px] h-[150px] w-[150px]"
      />

      <h1
        className={` text-white/90 text-sm md:text-2xl font-light tracking-wide`}
      >
        Your reliable Islamic digital companion for accurate prayer times
      </h1>
    </div>
  );
}
