import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Converto",
  description: "Unlimited File Converter",
  creator: "Ahmad Sidik Rofiudin",
  keywords: "image converter, audio converter, video converter, unlimited image converter, unlimited video converter, unlimited audio converter, free convert image, free convert audio, converter image online, converter audio online, converter video online"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main>
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
