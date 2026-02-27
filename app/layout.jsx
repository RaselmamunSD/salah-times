import { Poppins } from "next/font/google";
import "./globals.css";
import FloatingChatButton from "./components/shared/FloatingChatButton";
import { AxiosProvider } from "./providers/AxiosProvider";
import { AuthProvider } from "./providers/AuthProvider";

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
        <AxiosProvider>
          <AuthProvider>
            {children}

            {/* Floating Action Button */}
            <FloatingChatButton />
          </AuthProvider>
        </AxiosProvider>
      </body>
    </html>
  );
}
