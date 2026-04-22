import Link from "next/link";
import {
  HeroVideoDialogWrapper,
  WorldMapWrapper,
  MarqueeWrapper,
  ToolsMarqueeWrapper,
  TextRevealWrapper,
  CardScrollWrapper,
} from "@/components/modules/landing/client-wrapper";

import Image from "next/image";
import Header from "@/components/ui/header";

// Import icons modern dari lucide-react
import {
  Bot,
  TrendingUp,
  ShieldCheck,
  Zap,
  Gift,
  ArrowRight,
  Users,
} from "lucide-react";

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
                      Archi <span className="text-appPrimary">Trade</span>
                    </h1>
                  </div>
                  <p className="mx-auto lg:mx-0 mb-8 max-w-xl text-base sm:text-lg md:text-xl text-zinc-400">
                    Menjadi komunitas trading dan investasi terdepan di
                    Indonesia yang memberdayakan setiap individu melalui
                    edukasi, kolaborasi, dan inovasi.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <a
                      href="https://t.me/+s22nBUElvnw0Y2Y1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 rounded-full bg-[#4863A0] px-8 py-6 text-lg font-bold text-black hover:brightness-95 transition-all shadow-lg shadow-[#4863A0]/20"
                    >
                      Bergabung Sekarang
                    </a>
                    <Link
                      href="https://www.youtube.com/@ArchiTrade99"
                      className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                    >
                      Pelajari Lebih Lanjut
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-5 flex justify-center lg:justify-end">
                  <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-xl ring-1 ring-white/6 bg-gradient-to-tr from-white/3 to-transparent backdrop-blur-sm">
                    <Image
                      src="/images/logo.webp"
                      alt="ArchiTrade"
                      width={720}
                      height={480}
                      priority
                      className="w-full h-auto object-contain p-8 bg-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* ✅ PROMOSI EA ROBOT - Modern Icon Version */}
              <div className="mt-16 pt-8">
                <Link href="/services" className="block group">
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-appPrimary/15 via-appPrimary/5 to-transparent border border-appPrimary/30 hover:border-appPrimary/60 transition-all duration-300 hover:scale-[1.01]">
                    {/* Badge */}
                    <div className="absolute top-3 right-3 bg-appPrimary/20 px-3 py-1 rounded-full text-xs font-medium text-appPrimary">
                      PROMO TERBATAS
                    </div>

                    <div className="p-6 md:p-8">
                      <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Icon EA Modern */}
                        <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-appPrimary/10 flex items-center justify-center border border-appPrimary/20 group-hover:scale-110 transition-transform duration-300">
                          <Bot className="w-12 h-12 md:w-14 md:h-14 text-appPrimary" />
                        </div>

                        {/* Penjelasan EA */}
                        <div className="flex-1 text-center md:text-left">
                          <h3 className="text-2xl md:text-3xl font-bold flex items-center gap-3 justify-center md:justify-start">
                            EA Robot Trading
                            <span className="text-appPrimary">ArchiTrade</span>
                          </h3>
                          <p className="text-zinc-400 text-base mt-3 max-w-2xl">
                            Expert Advisor otomatis untuk trading forex dengan
                            profit konsisten 20-40% per bulan. Cocok untuk
                            pemula hingga profesional.
                          </p>

                          {/* Fitur Singkat dengan Icon Modern */}
                          <div className="grid grid-cols-2 md:flex flex-wrap justify-center md:justify-start gap-4 mt-6 text-sm">
                            <div className="flex items-center gap-2 text-zinc-300">
                              <TrendingUp className="w-5 h-5 text-appPrimary" />
                              Profit 20-40%/bulan
                            </div>
                            <div className="flex items-center gap-2 text-zinc-300">
                              <ShieldCheck className="w-5 h-5 text-appPrimary" />
                              Minimal modal $100
                            </div>
                            <div className="flex items-center gap-2 text-zinc-300">
                              <Gift className="w-5 h-5 text-appPrimary" />
                              Free VPS + Setup
                            </div>
                            <div className="flex items-center gap-2 text-zinc-300">
                              <Zap className="w-5 h-5 text-appPrimary" />
                              Update Lifetime
                            </div>
                          </div>
                        </div>

                        {/* Harga & CTA */}
                        <div className="flex-shrink-0 text-center md:text-right">
                          <div className="flex items-baseline justify-center md:justify-end gap-2">
                            <span className="text-zinc-500 line-through text-sm">
                              Rp1.000.000
                            </span>
                            <span className="text-3xl font-bold text-appPrimary">
                              Rp500.000
                            </span>
                          </div>
                          <div className="text-xs text-zinc-500 mt-1 mb-4">
                            Free VPS + Bantuan Setup
                          </div>
                          <div className="inline-flex items-center gap-2 text-appPrimary font-semibold group-hover:gap-3 transition-all">
                            Lihat Detail
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                          </div>
                        </div>
                      </div>

                      {/* Tier Sharing Profit */}
                      <div className="mt-8 pt-6 border-t border-white/10">
                        <div className="flex items-center gap-2 mb-3 text-sm text-gray-400">
                          <Users className="w-4 h-4" />
                          <span>Sharing Profit:</span>
                        </div>
                        <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                          <div>
                            <span className="text-gray-400">Silver:</span>{" "}
                            <span className="text-appPrimary font-medium">
                              30%
                            </span>{" "}
                            ($100-4k)
                          </div>
                          <div>
                            <span className="text-yellow-400">Gold:</span>{" "}
                            <span className="text-appPrimary font-medium">
                              20%
                            </span>{" "}
                            ($5k-9k)
                          </div>
                          <div>
                            <span className="text-cyan-400">Diamond:</span>{" "}
                            <span className="text-appPrimary font-medium">
                              15%
                            </span>{" "}
                            ($10k+)
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Arrow indicator */}
                    <div className="absolute right-6 bottom-6 opacity-0 group-hover:opacity-100 transition-all text-appPrimary hidden md:block">
                      <ArrowRight className="w-7 h-7" />
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            <MarqueeWrapper />
          </main>
        </div>
      </div>

      {/* Gunakan wrapper components */}
      <HeroVideoDialogWrapper />
      <CardScrollWrapper />
      <ToolsMarqueeWrapper />
      <TextRevealWrapper />
      <WorldMapWrapper />
    </div>
  );
}
