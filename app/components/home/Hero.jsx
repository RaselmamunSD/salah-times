import Image from "next/image";
import logo from "../../../public/logo.png";
import { Inter } from "next/font/google";
const inter = Inter({
  subsets: ["latin"],
});
export default function Hero() {
  return (
    <div
      className={`flex flex-col items-center text-center animate-fade-in ${inter.className} `}
    >
      <Image src={logo} width={234} height={234} alt="logo" />

      <h1
        className={` text-white/90 text-lg md:text-2xl font-light tracking-wide`}
      >
        Your reliable Islamic digital companion for accurate prayer times
      </h1>
    </div>
  );
}
