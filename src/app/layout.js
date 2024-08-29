import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster"
import ThemeProvider from "@/components/ui/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Converto - Infinite File Converter",
  description: "Infinite File Converter",
  creator: "Ahmad Sidik Rofiudin",
  keywords: "image converter, audio converter, video converter, unlimited image converter, unlimited video converter, unlimited audio converter, free convert image, free convert audio, converter image online, converter audio online, converter video online"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <link rel="icon" type="image/png" sizes="16x16" href="/Converto-logo.png"></link>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main>
            {children}
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
