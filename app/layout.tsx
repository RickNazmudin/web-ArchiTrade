import "./globals.css";
import "../styles/grains.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "ArchiTrade Komunitas Traders",
  description:
    "ArchiTrade adalah komunitas trader yang berbagi pengetahuan dan wawasan mereka tentang strategi trading, analisis pasar, dan peluang investasi.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={cn("min-h-screen bg-black antialiased", inter.variable)}>
        <div className="grain"></div>
        {children}
      </body>
    </html>
  );
}
