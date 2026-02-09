import Image from "next/image";
import React from "react";
import logo from "../../../public/logo.png";
const AuthLeftSide = () => {
  return (
    <div className="hidden lg:flex w-1/2 flex-col items-center justify-center bg-gradient-to-b from-[#1b9c5e] to-[#0f4e68] relative">
      <div className="relative w-80 h-80 rounded-full flex items-center justify-center">
        <Image
          src={logo}
          alt="Come to Salaah"
          width={320}
          height={320}
          className="object-contain rounded-full"
        />
      </div>
    </div>
  );
};

export default AuthLeftSide;
