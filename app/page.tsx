import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CardScroll from "@/components/ui/scroll-element";
import Link from "next/link";
import { ToolsMarquee } from "./_components/fold-image";
import Footer from "./_components/footer";
import { MarqueeDemo } from "./_components/marquee";
import { TextRevealDemo } from "./_components/text-revel-demo";
import dynamic from "next/dynamic";
const HeroVideoDialogDemo = dynamic(
  () =>
    import("./_components/video-card").then((mod) => mod.HeroVideoDialogDemo),
  { ssr: false },
);
const WorldMapDemo = dynamic(
  () => import("./_components/world-map-demo").then((mod) => mod.WorldMapDemo),
  { ssr: false },
);
import Image from "next/image";
import Header from "@/components/ui/header";

export default function Page() {
  return (
    <div>
      <div className="relative min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white overflow-hidden">
        <div className="relative h-full w-full bg-transparent">
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f1a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f1a_1px,transparent_1px)] bg-[size:16px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)]"></div>

          <Header />
          <main className="relative z-10 before:absolute before:top-0 before:left-0 before:w-full before:h-full before:content-[''] before:opacity-[0.05] before:z-10 before:pointer-events-none before:bg-[url('https://res.cloudinary.com/dzl9yxixg/image/upload/noise_yvdidf.gif')]">
            <div className="mx-auto max-w-6xl px-6 lg:px-24 pt-16 pb-20">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 text-center lg:text-left">
                  <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-radial from-zinc-300/8 to-transparent opacity-30 blur-2xl -z-10"></div>
                    <h1 className="relative mb-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
                      Trader Cerdas Peluang Tanpa Batas
                      <br />
                      Archi <span className=" text-appPrimary">Trade</span>
                    </h1>
                  </div>
                  <p className="mx-auto lg:mx-0 mb-8 max-w-xl text-base sm:text-lg md:text-xl text-zinc-400">
                    Menjadi komunitas trading dan investasi terdepan di
                    Indonesia yang memberdayakan setiap individu melalui
                    edukasi, kolaborasi, dan inovasi.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Button asChild size="lg">
                      <a
                        href="https://t.me/+s22nBUElvnw0Y2Y1"
                        className="rounded-full bg-appPrimary px-6 py-3 text-lg font-semibold text-black hover:brightness-95 transition-all"
                      >
                        Bergabung Sekarang
                      </a>
                    </Button>
                    <Link
                      href="https://www.youtube.com/@ArchiTrade99"
                      className="text-sm text-zinc-400 hover:text-white"
                    >
                      Pelajari Lebih Lanjut
                    </Link>
                  </div>
                </div>
                <div className="lg:col-span-5 flex justify-center lg:justify-end">
                  <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-xl ring-1 ring-white/6 bg-gradient-to-tr from-white/3 to-transparent backdrop-blur-sm">
                    <Image
                      src="/logo.png"
                      alt="ArchiTrade"
                      width={720}
                      height={480}
                      className="w-full h-auto object-contain p-8 bg-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            <MarqueeDemo />
          </main>
        </div>
      </div>
      <HeroVideoDialogDemo />
      <CardScroll />
      <ToolsMarquee />
      <TextRevealDemo />
      {/* <UserInteraction /> */}
      <WorldMapDemo />

      <Footer />
    </div>
  );
}
