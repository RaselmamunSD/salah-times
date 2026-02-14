import { Poppins } from "next/font/google";
import "./globals.css";
import { MessageCircle } from "lucide-react";
import FloatingChatButton from "./components/shared/FloatingChatButton";

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
    <html lang="en" data-theme="light">
      <body className={`${poppins.className} antialiased`}>
        {children} {/* Floating Action Button */}
        <FloatingChatButton />
      </body>
    </html>
  );
}
