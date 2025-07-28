import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CardScroll from "@/components/ui/scroll-element";
import Link from "next/link";
import { ToolsMarquee } from "./_components/fold-image";
import Footer from "./_components/footer";
import { MarqueeDemo } from "./_components/marquee";
import { TextRevealDemo } from "./_components/text-revel-demo";
import { HeroVideoDialogDemo } from "./_components/video-card";
import { WorldMapDemo } from "./_components/world-map-demo";
import Image from 'next/image';

export default function Page() {
  return (
    <div>
      <div className="relative min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white overflow-hidden">
        <div className="relative h-full w-full bg-transparent">
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f1a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f1a_1px,transparent_1px)] bg-[size:16px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)]"></div>

          <nav className="relative z-10 flex items-center justify-between p-6">
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold">Archi</span>
              <span className="text-xl font-semibold text-[#4863A0]">
                Trade
              </span>
            </div>
            <Image 
              src="/logo.png" // Langsung dari root public
              alt="Logo"
              width={70}
              height={50}
            />
          </nav>
          <main
            className="relative z-10 before:absolute before:top-0 before:left-0 before:w-full

     before:h-full before:content-[''] before:opacity-[0.05] before:z-10 before:pointer-events-none

     before:bg-[url('https://res.cloudinary.com/dzl9yxixg/image/upload/noise_yvdidf.gif')]"
          >
            <div className="mx-auto max-w-6xl px-6 pt-20 pb-20 text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-radial from-zinc-300/10 to-transparent opacity-20 blur-2xl"></div>
                <h1 className="relative mb-6 text-5xl font-bold leading-tight tracking-tighter md:text-7xl">
                  Trader Cerdas Peluang Tanpa Batas
                  <br />
                  Archi <span className=" text-appPrimary">Trade</span>
                </h1>
              </div>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-zinc-400">
                Menjadi komunitas trading dan investasi terdepan di Indonesia yang memberdayakan setiap individu untuk mencapai kebebasan finansial melalui edukasi, kolaborasi, dan inovasi yang berkelanjutan.
                <br />
                Membangun Reputasi Positif Menjadi rujukan utama untuk informasi trading dan investasi yang kredibel dan terpercaya di mata komunitas online.
              </p>
              <div className="flex flex-col items-center gap-4">
                <a href="https://t.me/+s22nBUElvnw0Y2Y1">
                  <Button 
                    className="rounded-full bg-appPrimary px-8 py-6 text-lg font-semibold text-black hover:bg-[#FFFFFF] shadow-[0_0_20px_rgba(72, 99, 160, 1)] hover:shadow-[0_0_30px_rgba(72, 99, 160, 1)] transition-all duration-300 active:bg-white active:text-[#4863A0]"
                  >
                    Bergabung Sekarang
                  </Button>
                </a>
                <Link
                  href="https://www.youtube.com/@ArchiTrade99"
                  className="text-sm text-zinc-400 hover:text-white"
                >
                  Pelajari Lebih Lanjut
                </Link>
              </div>
            </div>

           <Card className="absolute hidden md:block left-5 lg:left-20 top-[30%] lg:top-52 rounded-2xl bg-zinc-800/80 p-3 lg:p-4 backdrop-blur w-auto max-w-[180px] lg:max-w-[220px]">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="rounded-full bg-zinc-700 p-1.5 lg:p-2">
                  <div className="h-3 w-3 lg:h-4 lg:w-4 rounded-full bg-[#4863A0]" />
                </div>
                <span className="font-medium text-xs lg:text-sm">
                  Membangun Basis Anggota <span className="text-appPrimary">Aktif</span>
                </span>
              </div>
            </Card>

            <Card className="absolute hidden md:block right-5 lg:right-20 top-[55%] lg:top-80 rounded-2xl bg-zinc-800/80 p-3 lg:p-4 backdrop-blur w-auto max-w-[180px] lg:max-w-[220px]">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="rounded-full bg-zinc-700 p-1.5 lg:p-2">
                  <div className="h-3 w-3 lg:h-4 lg:w-4 rounded-full bg-[#4863A0]" />
                </div>
                <span className="font-medium text-xs lg:text-sm">Meningkatkan Keterlibatan Komunitas</span>
              </div>
            </Card>

            <MarqueeDemo />
          </main>
        </div>
      </div>
      <HeroVideoDialogDemo />
      <CardScroll />
      <TextRevealDemo />
      <ToolsMarquee />
      {/* <UserInteraction /> */}
      <WorldMapDemo />

      <Footer />
    </div>
  );
}
