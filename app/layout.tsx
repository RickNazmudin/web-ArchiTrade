import "./globals.css";
import "../styles/grains.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import Footer from "@/components/modules/landing/footer";

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
    <html lang="id" className="dark" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-black antialiased flex flex-col",
          inter.variable,
        )}
      >
        <div className="grain"></div>
        <div className="flex flex-col min-h-screen">
          <main className="flex-1">{children}</main>
          {/* <Footer /> */}
        </div>
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              background: "#18181b",
              border: "1px solid #27272a",
              color: "#fafafa",
            },
            duration: 4000,
          }}
        />
      </body>
    </html>
  );
}
