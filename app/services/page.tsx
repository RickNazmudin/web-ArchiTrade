"use client";

import Link from "next/link";
import Header from "@/components/ui/header";
import Footer from "@/components/modules/landing/footer";
import Image from "next/image";
import { useState, useCallback, useEffect } from "react";

// Import icons modern dari lucide-react
import {
  Bot,
  TrendingUp,
  Zap,
  ShieldCheck,
  BarChart3,
  Gift,
  Award,
  ArrowRight,
  MessageCircle,
  BookOpen,
} from "lucide-react";

// Data untuk EA Robot Trading (icon diganti)
const eaFeatures = [
  {
    icon: <Bot className="w-8 h-8 text-appPrimary" />,
    title: "Fully Automated",
    desc: "Trading 24/5 tanpa intervensi manual",
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-appPrimary" />,
    title: "Profit 20-40%/bulan",
    desc: "Hasil konsisten dengan risiko terukur",
  },
  {
    icon: <Zap className="w-8 h-8 text-appPrimary" />,
    title: "Eksekusi Cepat",
    desc: "Latency rendah, entry akurat",
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-appPrimary" />,
    title: "Risk Management",
    desc: "Take Profit & trailing stop otomatis",
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-appPrimary" />,
    title: "Pair Support",
    desc: "major pairs: EUR/USD",
  },
  {
    icon: <Gift className="w-8 h-8 text-appPrimary" />,
    title: "Free VPS + Setup",
    desc: "Termasuk VPS 24/7 & bantuan instalasi",
  },
];

const profitTiers = [
  {
    name: "SILVER",
    modal: "$100 - $4,000",
    shareProfit: "30%",
    color: "from-gray-400 to-gray-300",
    borderColor: "border-gray-500",
    bgHover: "hover:border-gray-400",
    recommended: false,
    minModal: 100,
    maxModal: 4000,
  },
  {
    name: "GOLD",
    modal: "$5,000 - $9,000",
    shareProfit: "20%",
    color: "from-yellow-500 to-amber-500",
    borderColor: "border-yellow-500",
    bgHover: "hover:border-yellow-400",
    recommended: true,
    minModal: 5000,
    maxModal: 9000,
  },
  {
    name: "DIAMOND",
    modal: "$10,000+",
    shareProfit: "15%",
    color: "from-cyan-400 to-blue-500",
    borderColor: "border-cyan-400",
    bgHover: "hover:border-cyan-300",
    recommended: false,
    minModal: 10000,
    maxModal: null,
  },
];

export default function ServicesPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTab, setActiveTab] = useState<"ebook" | "ea">("ebook");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handlePrev = useCallback(() => {
    setActiveSlide((prev) =>
      prev === 0 ? ebookShowcaseImages.length - 1 : prev - 1,
    );
  }, []);

  const handleNext = useCallback(() => {
    setActiveSlide((prev) =>
      prev === ebookShowcaseImages.length - 1 ? 0 : prev + 1,
    );
  }, []);

  const jumpToSlide = (idx: number) => {
    setActiveSlide(idx);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Header />

      <main className="relative pt-20 pb-20 md:pt-24 md:pb-28">
        <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950 via-black to-zinc-900 opacity-70 pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-16">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-8 md:mb-12 gap-2 sm:gap-4 px-2">
            <button
              onClick={() => setActiveTab("ebook")}
              className={`flex-1 sm:flex-none px-4 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold text-sm sm:text-base md:text-lg transition-all flex items-center justify-center gap-2 ${
                activeTab === "ebook"
                  ? "bg-appPrimary text-black shadow-lg shadow-appPrimary/30"
                  : "bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/50 border border-zinc-700"
              }`}
            >
              <div className="w-7 h-7 flex items-center justify-center bg-white/20 rounded-lg p-1">
                <BookOpen className="w-5 h-5" />
              </div>
              Ebook Premium
            </button>
            <button
              onClick={() => setActiveTab("ea")}
              className={`flex-1 sm:flex-none px-4 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold text-sm sm:text-base md:text-lg transition-all flex items-center justify-center gap-2 ${
                activeTab === "ea"
                  ? "bg-appPrimary text-black shadow-lg shadow-appPrimary/30"
                  : "bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/50 border border-zinc-700"
              }`}
            >
              <Bot className="w-5 h-5" /> EA Robot
            </button>
          </div>

          {/* Ebook Section */}
          {activeTab === "ebook" && (
            <div className="flex flex-col lg:flex-row items-center gap-6 md:gap-10 lg:gap-16">
              <div className="lg:w-1/2 space-y-5 md:space-y-7 lg:space-y-9 px-2 sm:px-0">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-center lg:text-left">
                  <span className="bg-gradient-to-r from-appPrimary via-sky-400 to-appPrimary bg-clip-text text-transparent">
                    Ebook Premium ArchiTrade
                  </span>
                </h1>

                <p className="text-base sm:text-lg md:text-xl text-zinc-300 leading-relaxed text-center lg:text-left">
                  Panduan lengkap trading dari nol hingga konsisten profit.
                  Strategi price action, manajemen risiko, psikologi trading,
                  dan setup yang sudah teruji.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-5 my-4 md:my-6">
                  <div className="flex items-baseline gap-2 sm:gap-3">
                    <span className="text-zinc-600 line-through text-xl sm:text-2xl md:text-3xl">
                      Rp.499.000
                    </span>
                    <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-appPrimary">
                      Rp.99.000
                    </span>
                  </div>
                  <span className="px-3 py-1.5 bg-zinc-800/60 rounded-full text-xs sm:text-sm font-medium text-zinc-300 text-center">
                    Diskon 66% – 100 pembeli pertama
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 pt-2 md:pt-4">
                  <a
                    href="https://wa.me/6289617257030?text=Halo%20Admin,%20saya%20tertarik%20beli%20Ebook%20Premium%20ArchiTrade%20dengan%20harga%20Rp99.000%20Bisa%20langsung%20proses%20ya!"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex justify-center items-center bg-appPrimary hover:bg-appPrimary/90 text-black font-bold text-base sm:text-lg md:text-xl py-3 sm:py-4 px-6 sm:px-9 rounded-xl transition shadow-xl shadow-appPrimary/25"
                  >
                    Beli Ebook Sekarang
                  </a>

                  <Link
                    href="https://t.me/+s22nBUElvnw0Y2Y1"
                    className="inline-flex justify-center items-center border-2 border-zinc-700 hover:border-appPrimary hover:text-appPrimary text-zinc-200 font-semibold text-base sm:text-lg md:text-xl py-3 sm:py-4 px-6 sm:px-9 rounded-xl transition"
                  >
                    Tanya Via Telegram
                  </Link>
                </div>

                <p className="text-xs sm:text-sm text-zinc-500 pt-2 md:pt-3 text-center lg:text-left">
                  Termasuk: Update lifetime, grup diskusi VIP, bonus template
                  journal & checklist
                </p>
              </div>

              {/* Carousel Ebook tetap sama */}
              <div className="lg:w-1/2 w-full px-2 sm:px-0">
                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-zinc-800/70 shadow-2xl shadow-black/60">
                  <div
                    className="flex transition-transform duration-700 ease-out"
                    style={{ transform: `translateX(-${activeSlide * 100}%)` }}
                  >
                    {ebookShowcaseImages.map((src, i) => (
                      <div
                        key={i}
                        className="flex-shrink-0 w-full relative aspect-[4/3] sm:aspect-[5/4]"
                      >
                        <Image
                          src={src}
                          alt={`Preview Ebook ArchiTrade ${i + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 50vw"
                          priority={i === 0}
                          quality={85}
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handlePrev}
                    className="absolute left-2 sm:left-3 md:left-5 top-1/2 -translate-y-1/2 bg-black/65 backdrop-blur-md p-2 sm:p-3 md:p-4 rounded-full text-white hover:bg-black/80 transition z-10 shadow-lg"
                    aria-label="Slide sebelumnya"
                  >
                    ←
                  </button>

                  <button
                    onClick={handleNext}
                    className="absolute right-2 sm:right-3 md:right-5 top-1/2 -translate-y-1/2 bg-black/65 backdrop-blur-md p-2 sm:p-3 md:p-4 rounded-full text-white hover:bg-black/80 transition z-10 shadow-lg"
                    aria-label="Slide berikutnya"
                  >
                    →
                  </button>

                  <div className="absolute bottom-2 sm:bottom-3 md:bottom-5 left-0 right-0 flex justify-center gap-2 sm:gap-3">
                    {ebookShowcaseImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => jumpToSlide(i)}
                        className={`h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 rounded-full transition-all ${
                          activeSlide === i
                            ? "bg-appPrimary scale-125 shadow-md shadow-appPrimary/40"
                            : "bg-zinc-600 hover:bg-zinc-400"
                        }`}
                        aria-label={`Ke slide ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* EA Robot Trading Section */}
          {activeTab === "ea" && (
            <div className="space-y-6 md:space-y-8 lg:space-y-12 px-2 sm:px-0">
              {/* Hero Section EA */}
              <div className="text-center space-y-3 md:space-y-4 lg:space-y-6">
                <div className="inline-flex items-center gap-2 bg-zinc-800/50 px-3 py-1.5 md:px-4 md:py-2 rounded-full">
                  <Bot className="w-6 h-6 text-appPrimary" />
                  <span className="text-xs sm:text-sm font-medium text-appPrimary">
                    Premium Trading Bot
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight px-2">
                  <span className="bg-gradient-to-r from-appPrimary via-yellow-400 to-appPrimary bg-clip-text text-transparent">
                    EA Robot Trading
                  </span>
                </h1>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-zinc-300 max-w-3xl mx-auto px-4">
                  Profit konsisten 20-40% per bulan • Minimal modal $100 • Free
                  VPS + Setup
                </p>
              </div>

              {/* Price Card */}
              <div className="max-w-md mx-auto bg-gradient-to-br from-zinc-900 to-black rounded-2xl md:rounded-3xl border border-appPrimary/30 p-5 md:p-8 text-center shadow-2xl">
                <p className="text-zinc-400 text-sm md:text-base mb-2">
                  Harga Lisensi
                </p>
                <div className="flex items-baseline justify-center gap-2 md:gap-3 mb-3 md:mb-4">
                  <span className="text-zinc-600 line-through text-xl md:text-2xl">
                    Rp.1.000.000
                  </span>
                  <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-appPrimary">
                    Rp.500.000
                  </span>
                </div>
                <p className="text-zinc-400 text-xs md:text-sm mb-5 md:mb-6">
                  Termasuk Free VPS + Bantuan Setup + Update Lifetime
                </p>
                <a
                  href="https://wa.me/6289617257030?text=Halo%20Admin,%20saya%20tertarik%20beli%20EA%20Robot%20Trading%20ArchiTrade%20harga%20Rp500.000%20dengan%20free%20VPS%20dan%20setup.%20Mohon%20informasi%20lebih%20lanjut!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex justify-center items-center bg-appPrimary hover:bg-appPrimary/90 text-black font-bold text-base sm:text-lg md:text-xl py-3 md:py-4 px-6 md:px-12 rounded-xl transition shadow-xl shadow-appPrimary/25 w-full"
                >
                  Beli EA Sekarang
                </a>
              </div>

              {/* Features Grid dengan Icon Modern */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {eaFeatures.map((feature, idx) => (
                  <div
                    key={idx}
                    className="bg-zinc-900/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 border border-zinc-800 hover:border-appPrimary/50 transition-all hover:scale-[1.02] group"
                  >
                    <div className="mb-4 md:mb-5 flex justify-center md:justify-start">
                      {feature.icon}
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 group-hover:text-appPrimary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base text-zinc-400">
                      {feature.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Profit Sharing Tiers */}
              <div className="space-y-4 md:space-y-6">
                <div className="text-center px-4">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 md:mb-3">
                    Sistem Sharing Profit
                  </h2>
                  <p className="text-sm md:text-base text-zinc-400">
                    Pilih tier yang sesuai dengan modal Anda
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  {profitTiers.map((tier, idx) => (
                    <div
                      key={idx}
                      className={`relative bg-gradient-to-br from-zinc-900 to-black rounded-xl md:rounded-2xl border-2 ${tier.borderColor} ${tier.bgHover} transition-all hover:scale-[1.02] hover:shadow-xl overflow-hidden`}
                    >
                      {tier.recommended && (
                        <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] sm:text-xs font-bold px-3 py-1 rounded-bl-lg sm:rounded-bl-xl flex items-center gap-1">
                          <Award className="w-3.5 h-3.5" /> RECOMMENDED
                        </div>
                      )}
                      <div className="p-4 md:p-6 text-center">
                        <div
                          className={`text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r ${tier.color} bg-clip-text text-transparent mb-2 md:mb-4`}
                        >
                          {tier.name}
                        </div>
                        <div className="text-base sm:text-lg md:text-xl font-bold text-white mb-1 md:mb-2">
                          {tier.modal}
                        </div>
                        <div className="mb-2 md:mb-4">
                          <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-appPrimary">
                            {tier.shareProfit}
                          </span>
                          <span className="text-xs md:text-sm text-zinc-400">
                            {" "}
                            sharing profit
                          </span>
                        </div>
                        <div className="text-xs md:text-sm text-zinc-500 mb-3 md:mb-4">
                          Profit bersih dibagi per bulan
                        </div>
                        <a
                          href={`https://wa.me/6289617257030?text=Halo%20Admin,%20saya%20tertarik%20dengan%20tier%20${tier.name}%20EA%20Robot%20Trading%20ArchiTrade.%20Modal%20saya%20${tier.modal}.%20Mohon%20info%20lebih%20lanjut!`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex justify-center items-center w-full bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-sm sm:text-base py-2.5 md:py-3 px-3 md:px-4 rounded-lg md:rounded-xl transition"
                        >
                          Konsultasi via WA
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cara Kerja */}
                <div className="bg-zinc-900/50 rounded-xl md:rounded-2xl p-6 border border-zinc-800">
                  <h3 className="text-lg md:text-xl font-bold mb-4 text-center flex items-center justify-center gap-2">
                    <MessageCircle className="w-5 h-5 text-appPrimary" />
                    Cara Kerja Sharing Profit
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-sm text-zinc-300">
                    <div className="bg-zinc-800/30 p-4 rounded-xl">
                      <span className="text-appPrimary font-bold block mb-2 text-lg">
                        1.
                      </span>
                      Beli EA + Deposit modal sesuai tier
                    </div>
                    <div className="bg-zinc-800/30 p-4 rounded-xl">
                      <span className="text-appPrimary font-bold block mb-2 text-lg">
                        2.
                      </span>
                      EA berjalan otomatis hasilkan profit
                    </div>
                    <div className="bg-zinc-800/30 p-4 rounded-xl">
                      <span className="text-appPrimary font-bold block mb-2 text-lg">
                        3.
                      </span>
                      Profit bersih dibagi per bulan sesuai tier
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Bottom */}
              <div className="text-center pt-6 pb-8">
                <a
                  href="https://wa.me/6289617257030?text=Halo%20Admin,%20saya%20tertarik%20dengan%20EA%20Robot%20Trading%20ArchiTrade.%20Mohon%20info%20demo%20dan%20detail%20lebih%20lanjut!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-appPrimary to-appPrimary/80 hover:from-appPrimary/90 hover:to-appPrimary text-black font-bold text-base md:text-lg py-4 px-8 rounded-2xl transition shadow-xl"
                >
                  Tanya Lebih Lanjut via WhatsApp
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>

              {/* Bonus Info */}
              <div className="bg-gradient-to-r from-appPrimary/10 to-transparent rounded-2xl p-6 border border-appPrimary/20 text-center">
                <p className="text-sm text-zinc-300">
                  <Gift className="inline w-5 h-5 mr-2 text-appPrimary" />
                  <span className="font-bold text-appPrimary">
                    Bonus Eksklusif:
                  </span>{" "}
                  Free konsultasi 1 bulan + Update EA Lifetime + Grup Trader VIP
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Data gambar ebook (tetap sama)
const ebookShowcaseImages = [
  "/images/ebook1.webp",
  "/images/ebook2.webp",
  "/images/ebook3.webp",
  "/images/ebook4.webp",
];
