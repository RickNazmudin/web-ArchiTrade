import Header from "@/components/ui/header";
import {
  HeroVideoDialogWrapper,
  WorldMapWrapper,
  MarqueeWrapper,
  ToolsMarqueeWrapper,
  TextRevealWrapper,
  CardScrollWrapper,
} from "@/components/modules/landing/client-wrapper";
import ScrollAnimation from "@/components/ui/scroll-animation";
import Testimonial from "@/components/modules/landing/Testimonial";
import Faq from "@/components/modules/landing/Faq";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ChevronRight, Shield, Zap, Globe, Users } from "lucide-react";

export default function Page() {
  return (
    <div className="relative w-full bg-black">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-24 md:pb-40 overflow-hidden min-h-screen flex items-center">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black z-10 opacity-70 md:opacity-60" />
          <img 
            src="/trading_dashboard_hero.png" 
            alt="Background" 
            className="w-full h-full object-cover object-center md:object-right opacity-40 scale-110 animate-pulse-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-20" />
          <div className="absolute inset-0 bg-grid-white opacity-5 md:opacity-10 z-30" />
        </div>

        <div className="container relative mx-auto px-4 z-40">
          <div className="max-w-5xl mx-auto text-center">
            <ScrollAnimation direction="up" delay={0.1}>
              <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full glass-card text-[10px] md:text-sm text-zinc-300 mb-6 md:mb-10 border border-white/10">
                <span className="relative flex h-1.5 w-1.5 md:h-2 md:w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-appPrimary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-appPrimary"></span>
                </span>
                <span className="font-medium tracking-widest uppercase">Elite Trading Ecosystem</span>
              </div>
            </ScrollAnimation>

            <ScrollAnimation direction="up" delay={0.2}>
              <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tight text-white mb-6 md:mb-8 leading-[1.1] md:leading-[0.9]">
                REVOLUSI <br className="hidden sm:block" />
                <span className="text-gradient-gold">TRADING ANDA</span>
              </h1>
            </ScrollAnimation>

            <ScrollAnimation direction="up" delay={0.3}>
              <p className="max-w-3xl mx-auto text-base md:text-xl lg:text-2xl text-zinc-300 mb-10 md:mb-16 leading-relaxed font-light drop-shadow-2xl px-2">
                Maksimalkan profit dengan <span className="text-appPrimary font-medium">EA Copytrade</span> otomatis, 
                analisis <span className="text-appPrimary font-medium">Daily Outlook</span> akurat, 
                dan bimbingan dalam <span className="text-appPrimary font-medium">Komunitas Profesional</span>.
              </p>
            </ScrollAnimation>

            <ScrollAnimation direction="up" delay={0.4}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mb-16 md:mb-24">
                <Link
                  href="/register"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "w-full sm:w-auto h-14 md:h-16 px-8 md:px-10 text-lg md:text-xl font-bold bg-appPrimary hover:bg-appPrimary/90 text-black rounded-full shadow-[0_0_30px_rgba(255,204,0,0.4)] transition-all duration-300 hover:scale-105 active:scale-95"
                  )}
                >
                  Mulai Sekarang
                  <ChevronRight className="ml-2 w-5 h-5 md:w-6 md:h-6" />
                </Link>
                <Link
                  href="/services"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "w-full sm:w-auto h-14 md:h-16 px-8 md:px-10 text-lg md:text-xl font-bold border-white/20 hover:bg-white/10 text-white rounded-full backdrop-blur-md transition-all duration-300"
                  )}
                >
                  Explore Layanan
                </Link>
              </div>
            </ScrollAnimation>

            {/* Service Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <ScrollAnimation direction="up" delay={0.5}>
                <div className="glass-card p-6 rounded-2xl border border-white/5 hover:border-appPrimary/30 transition-colors group">
                  <Zap className="w-10 h-10 text-appPrimary mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-white font-bold text-lg mb-2">EA Copytrade</h3>
                  <p className="text-zinc-500 text-sm">Copy transaksi trader ahli secara otomatis 24/5 tanpa ribet.</p>
                </div>
              </ScrollAnimation>
              
              <ScrollAnimation direction="up" delay={0.6}>
                <div className="glass-card p-6 rounded-2xl border border-white/5 hover:border-appPrimary/30 transition-colors group">
                  <Globe className="w-10 h-10 text-appPrimary mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-white font-bold text-lg mb-2">Daily Outlook</h3>
                  <p className="text-zinc-500 text-sm">Analisis pasar harian mendalam untuk memandu setiap entry Anda.</p>
                </div>
              </ScrollAnimation>

              <ScrollAnimation direction="up" delay={0.7}>
                <div className="glass-card p-6 rounded-2xl border border-white/5 hover:border-appPrimary/30 transition-colors group">
                  <Users className="w-10 h-10 text-appPrimary mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-white font-bold text-lg mb-2">Komunitas Pro</h3>
                  <p className="text-zinc-500 text-sm">Diskusi dan networking bersama ratusan trader profesional lainnya.</p>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </div>
      </section>

      {/* Video Preview */}
      <section className="py-24 relative bg-black">
        <div className="container mx-auto px-4">
          <ScrollAnimation direction="up">
            <HeroVideoDialogWrapper />
          </ScrollAnimation>
        </div>
      </section>

      {/* Stats/Marquee */}
      <section className="py-12 border-y border-zinc-900 bg-zinc-950/50">
        <MarqueeWrapper />
      </section>

      {/* World Map Section */}
      <section className="py-24 bg-black overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">Koneksi Global</h2>
            <p className="text-zinc-500">Menghubungkan trader dari seluruh penjuru dunia dalam satu ekosistem.</p>
          </div>
          <WorldMapWrapper />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-black border border-zinc-900 hover:border-appPrimary/50 transition-all duration-500 group">
              <div className="w-12 h-12 rounded-2xl bg-appPrimary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-appPrimary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Aman & Terpercaya</h3>
              <p className="text-zinc-500 leading-relaxed">Sistem enkripsi tingkat tinggi untuk menjaga data dan privasi akun trading Anda tetap aman.</p>
            </div>
            <div className="p-8 rounded-3xl bg-black border border-zinc-900 hover:border-appPrimary/50 transition-all duration-500 group">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Eksekusi Cepat</h3>
              <p className="text-zinc-500 leading-relaxed">Akses ke infrastruktur trading dengan latensi rendah untuk memastikan eksekusi tepat waktu.</p>
            </div>
            <div className="p-8 rounded-3xl bg-black border border-zinc-900 hover:border-appPrimary/50 transition-all duration-500 group">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Support Komunitas</h3>
              <p className="text-zinc-500 leading-relaxed">Diskusi aktif 24/7 dengan sesama trader untuk berbagi pengalaman dan analisis pasar.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Text Reveal / Vision */}
      <section className="py-32">
        <TextRevealWrapper />
      </section>

      {/* Card Scroll Section */}
      <section className="py-24 bg-black">
        <CardScrollWrapper />
      </section>

      {/* Tools Section */}
      <section className="py-24 border-t border-zinc-900">
        <div className="container mx-auto px-4 mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">Tools & Partner</h2>
          <p className="text-zinc-500">Teknologi terbaik untuk mendukung kesuksesan trading Anda.</p>
        </div>
        <ToolsMarqueeWrapper />
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-zinc-950/50">
        <Testimonial />
      </section>

      {/* FAQ Section */}
      <section className="py-24">
        <Faq />
      </section>
    </div>
  );
}
