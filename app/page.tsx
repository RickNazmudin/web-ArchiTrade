"use client";

import { useState, useEffect } from "react";
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
import Image from "next/image";
import { ChevronRight, Shield, Zap, Globe, Users } from "lucide-react";

// Simple card component for mobile to replace heavy scroll
const SimpleCardList = () => {
  const projects = [
    { title: "Ebook Eksklusif", description: "Trading Forex dari Nol Panduan Lengkap untuk Pemula.", link: "/images/ebook1.webp" },
    { title: "Pandangan Harian", description: "Analisa Market Forex dan Crypto Terkini.", link: "/images/outlook.webp" },
    { title: "Forum Diskusi", description: "Komunitas trader aktif untuk belajar dan berkolaborasi.", link: "/images/diskusi.webp" },
  ];

  return (
    <div className="flex flex-col gap-6 px-4">
      {projects.map((p, i) => (
        <div key={i} className="bg-zinc-900 border border-white/5 p-6 rounded-2xl">
          <div className="relative h-40 w-full mb-4 rounded-xl overflow-hidden">
            <Image src={p.link} alt={p.title} fill className="object-cover" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{p.title}</h3>
          <p className="text-zinc-400 text-sm mb-4">{p.description}</p>
          <button className="text-appPrimary text-sm font-medium underline">Selengkapnya</button>
        </div>
      ))}
    </div>
  );
};

export default function Page() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Return a simplified version for server-side or initial mount to avoid hydration mismatch
  if (!mounted) return <div className="bg-black min-h-screen" />;

  return (
    <div className="relative w-full bg-black">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-20 md:pt-32 pb-20 md:pb-40 overflow-hidden min-h-[80vh] md:min-h-screen flex items-center">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black z-10 opacity-70 md:opacity-60" />
          {!isMobile ? (
            <Image 
              src="/trading_dashboard_hero.png" 
              alt="Background" 
              fill
              priority
              className="object-cover object-center md:object-right opacity-40 scale-110"
            />
          ) : (
            <Image 
              src="/trading_dashboard_hero.png" 
              alt="Background" 
              fill
              priority
              className="object-cover object-center opacity-30"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-20" />
          {!isMobile && <div className="absolute inset-0 bg-grid-white opacity-10 z-30" />}
        </div>

        <div className="container relative mx-auto px-4 z-40">
          <div className="max-w-5xl mx-auto text-center">
            <ScrollAnimation direction="up" delay={0.1}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card text-[10px] md:text-sm text-zinc-300 mb-6 md:mb-10 border border-white/10">
                {!isMobile && (
                  <span className="relative flex h-1.5 w-1.5 md:h-2 md:w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-appPrimary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-appPrimary"></span>
                  </span>
                )}
                <span className="font-medium tracking-widest uppercase">Elite Trading Ecosystem</span>
              </div>
            </ScrollAnimation>

            <ScrollAnimation direction="up" delay={0.2}>
              <h1 className="text-3xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tight text-white mb-6 md:mb-8 leading-tight md:leading-[0.9]">
                REVOLUSI <br className="hidden sm:block" />
                <span className="text-gradient-gold">TRADING ANDA</span>
              </h1>
            </ScrollAnimation>

            <ScrollAnimation direction="up" delay={0.3}>
              <p className="max-w-3xl mx-auto text-sm md:text-xl lg:text-2xl text-zinc-400 md:text-zinc-300 mb-8 md:mb-16 leading-relaxed font-light px-4">
                Maksimalkan profit dengan <span className="text-appPrimary font-medium">EA Copytrade</span> otomatis dan bimbingan komunitas profesional.
              </p>
            </ScrollAnimation>

            <ScrollAnimation direction="up" delay={0.4}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mb-12 md:mb-24">
                <Link
                  href="/register"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "w-full sm:w-auto h-14 md:h-16 px-8 md:px-10 text-lg font-bold bg-appPrimary hover:bg-appPrimary/90 text-black rounded-full transition-all"
                  )}
                >
                  Mulai Sekarang
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  href="/services"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "w-full sm:w-auto h-14 md:h-16 px-8 md:px-10 text-lg font-bold border-white/20 hover:bg-white/10 text-white rounded-full backdrop-blur-md"
                  )}
                >
                  Explore Layanan
                </Link>
              </div>
            </ScrollAnimation>

            {/* Service Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto px-2">
              <ScrollAnimation direction="up" delay={0.5}>
                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                  <Zap className="w-8 h-8 text-appPrimary mb-3" />
                  <h3 className="text-white font-bold text-lg mb-1">EA Copytrade</h3>
                  <p className="text-zinc-500 text-xs md:text-sm">Copy transaksi trader ahli secara otomatis 24/5.</p>
                </div>
              </ScrollAnimation>
              
              <ScrollAnimation direction="up" delay={0.6}>
                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                  <Globe className="w-8 h-8 text-appPrimary mb-3" />
                  <h3 className="text-white font-bold text-lg mb-1">Daily Outlook</h3>
                  <p className="text-zinc-500 text-xs md:text-sm">Analisis pasar harian mendalam untuk setiap entry Anda.</p>
                </div>
              </ScrollAnimation>

              <ScrollAnimation direction="up" delay={0.7}>
                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                  <Users className="w-8 h-8 text-appPrimary mb-3" />
                  <h3 className="text-white font-bold text-lg mb-1">Komunitas Pro</h3>
                  <p className="text-zinc-500 text-xs md:text-sm">Networking bersama ratusan trader profesional.</p>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </div>
      </section>

      {/* Video Preview - Skip on Mobile if needed, or keep simple */}
      {/* Video Preview (Partner Section) - Restore for mobile but keep light */}
      <section className="py-12 md:py-24 relative bg-black">
        <div className="container mx-auto px-4">
          <HeroVideoDialogWrapper />
        </div>
      </section>

      {/* Stats/Marquee */}
      <section className="py-8 md:py-12 border-y border-zinc-900 bg-zinc-950/50">
        <MarqueeWrapper />
      </section>

      {/* World Map Section - SKIP ON MOBILE */}
      {!isMobile && (
        <section className="py-24 bg-black overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">Koneksi Global</h2>
              <p className="text-zinc-500">Menghubungkan trader dari seluruh penjuru dunia.</p>
            </div>
            <WorldMapWrapper />
          </div>
        </section>
      )}

      {/* Features Grid */}
      <section className="py-16 md:py-24 bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="p-6 md:p-8 rounded-3xl bg-black border border-zinc-900">
              <Shield className="w-6 h-6 text-appPrimary mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Aman & Terpercaya</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">Sistem enkripsi tingkat tinggi untuk menjaga data Anda.</p>
            </div>
            <div className="p-6 md:p-8 rounded-3xl bg-black border border-zinc-900">
              <Zap className="w-6 h-6 text-blue-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Eksekusi Cepat</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">Infrastruktur trading dengan latensi rendah.</p>
            </div>
            <div className="p-6 md:p-8 rounded-3xl bg-black border border-zinc-900">
              <Users className="w-6 h-6 text-purple-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Support Komunitas</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">Diskusi aktif 24/7 dengan sesama trader.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Text Reveal / Vision - SKIP ON MOBILE */}
      {!isMobile && (
        <section className="py-32">
          <TextRevealWrapper />
        </section>
      )}

      {/* Card Scroll Section - REPLACE ON MOBILE */}
      <section className="py-16 md:py-24 bg-black">
        <div className="container mx-auto">
          {!isMobile ? (
            <CardScrollWrapper />
          ) : (
            <div className="flex flex-col gap-8">
              <div className="text-center px-4 mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Layanan Kami</h2>
                <p className="text-zinc-500 text-sm">Berbagai fasilitas untuk mendukung trading Anda.</p>
              </div>
              <SimpleCardList />
            </div>
          )}
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-16 md:py-24 border-t border-zinc-900">
        <div className="container mx-auto px-4 mb-10 md:mb-16 text-center">
          <h2 className="text-2xl md:text-5xl font-bold text-white mb-2 tracking-tight">Tools & Partner</h2>
          <p className="text-zinc-500 text-sm">Teknologi terbaik untuk sukses Anda.</p>
        </div>
        <ToolsMarqueeWrapper />
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-zinc-950/50">
        <Testimonial />
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24">
        <Faq />
      </section>
    </div>
  );
}
