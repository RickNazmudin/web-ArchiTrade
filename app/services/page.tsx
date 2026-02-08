// app/services/page.tsx
"use client";

import Link from "next/link";
import Header from "@/components/ui/header";
import Footer from "../_components/footer";
import Image from "next/image";
import { useState, useCallback } from "react";

// Ganti path gambar ini sesuai file yang benar-benar ada di folder public/
const ebookShowcaseImages = [
  "/ebook1.jpg",
  "/ebook2.jpg",
  "/ebook3.jpg",
  "/ebook4.jpg",
  // tambahkan atau kurangi sesuai kebutuhan
];

export default function ServicesPage() {
  const [activeSlide, setActiveSlide] = useState(0);

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
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="relative pt-24 pb-28">
        {/* Latar belakang subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950 via-black to-zinc-900 opacity-70 pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-16">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            {/* Bagian teks kiri */}
            <div className="lg:w-1/2 space-y-7 lg:space-y-9">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-appPrimary via-sky-400 to-appPrimary bg-clip-text text-transparent">
                  Ebook Premium ArchiTrade
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-zinc-300 leading-relaxed">
                Panduan lengkap trading dari nol hingga konsisten profit.
                Strategi price action, manajemen risiko tingkat lanjut,
                psikologi trading anti-sabotase, dan setup yang sudah teruji
                ribuan kali.
              </p>

              <div className="flex flex-wrap items-baseline gap-5 my-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-zinc-600 line-through text-2xl sm:text-3xl">
                    Rp.1.499.000
                  </span>
                  <span className="text-4xl sm:text-5xl font-extrabold text-appPrimary">
                    Rp.499.000
                  </span>
                </div>
                <span className="px-4 py-1.5 bg-zinc-800/60 rounded-full text-sm font-medium text-zinc-300">
                  Diskon 66% – Hanya untuk 100 pembeli pertama
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-4">
                <a
                  href="https://wa.me/6289617257030?text=Halo%20Admin,%20saya%20tertarik%20beli%20Ebook%20Premium%20ArchiTrade%20dengan%20harga%20Rp499.000%20Bisa%20langsung%20proses%20ya!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex justify-center items-center bg-appPrimary hover:bg-appPrimary/90 text-black font-bold text-lg sm:text-xl py-4 px-9 rounded-xl transition shadow-xl shadow-appPrimary/25"
                >
                  Beli Ebook Sekarang
                </a>

                <Link
                  href="https://t.me/+s22nBUElvnw0Y2Y1"
                  className="inline-flex justify-center items-center border-2 border-zinc-700 hover:border-appPrimary hover:text-appPrimary text-zinc-200 font-semibold text-lg py-4 px-9 rounded-xl transition"
                >
                  Tanya Via Telegram
                </Link>
              </div>

              <p className="text-sm text-zinc-500 pt-3">
                Termasuk: Update lifetime, grup diskusi VIP, bonus template
                journal & checklist trading.
              </p>
            </div>

            {/* Bagian carousel gambar kanan */}
            <div className="lg:w-1/2 w-full">
              <div className="relative rounded-3xl overflow-hidden border border-zinc-800/70 shadow-2xl shadow-black/60">
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
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority={i === 0}
                        quality={85}
                      />
                    </div>
                  ))}
                </div>

                {/* Tombol navigasi */}
                <button
                  onClick={handlePrev}
                  className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 bg-black/65 backdrop-blur-md p-3 sm:p-4 rounded-full text-white hover:bg-black/80 transition z-10 shadow-lg"
                  aria-label="Slide sebelumnya"
                >
                  ←
                </button>

                <button
                  onClick={handleNext}
                  className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 bg-black/65 backdrop-blur-md p-3 sm:p-4 rounded-full text-white hover:bg-black/80 transition z-10 shadow-lg"
                  aria-label="Slide berikutnya"
                >
                  →
                </button>

                {/* Indikator dots */}
                <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-3">
                  {ebookShowcaseImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => jumpToSlide(i)}
                      className={`w-3 h-3 rounded-full transition-all ${
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
