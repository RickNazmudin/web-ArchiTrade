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
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#3b82f633,transparent_50%)]" />
        <div className="container relative mx-auto px-4 text-center">
          <ScrollAnimation direction="up" delay={0.1}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/50 border border-zinc-800 text-sm text-zinc-400 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-appPrimary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-appPrimary"></span>
              </span>
              Trading Community v2.0 is Live
            </div>
          </ScrollAnimation>

          <ScrollAnimation direction="up" delay={0.2}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-8">
              Trading Lebih <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-appPrimary to-blue-400">
                Cerdas & Terarah
              </span>
            </h1>
          </ScrollAnimation>

          <ScrollAnimation direction="up" delay={0.3}>
            <p className="max-w-2xl mx-auto text-lg text-zinc-400 mb-10 leading-relaxed">
              Bergabunglah dengan komunitas trader profesional. Dapatkan akses ke alat analisis canggih, 
              edukasi premium, dan sinyal trading akurat.
            </p>
          </ScrollAnimation>

          <ScrollAnimation direction="up" delay={0.4}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "w-full sm:w-auto h-14 px-8 text-lg font-semibold bg-appPrimary hover:bg-appPrimary/90 text-black rounded-full"
                )}
              >
                Mulai Sekarang
                <ChevronRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/about"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full sm:w-auto h-14 px-8 text-lg font-semibold border-zinc-800 hover:bg-zinc-900 text-white rounded-full"
                )}
              >
                Pelajari Lebih Lanjut
              </Link>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Video Preview */}
      <section className="py-20">
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
