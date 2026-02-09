import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "./components/shared/Navbar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Salah Times",
  description: "A reliable islamic digital companion for accurate prayer times",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} antialiased flex flex-col items-center`}
      >
        <Navbar />

        {children}
      </body>
    </html>
  );
}
