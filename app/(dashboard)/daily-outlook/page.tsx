"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  Calendar,
  User,
  ArrowLeft,
  Newspaper,
  X,
  ZoomIn,
  TrendingUp,
  Clock,
} from "lucide-react";

export default function DailyOutlookPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [outlooks, setOutlooks] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>("");

  useEffect(() => {
    loadOutlooks();
  }, []);

  const loadOutlooks = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const { data } = await supabase
      .from("daily_outlook")
      .select("*")
      .eq("is_active", true)
      .order("published_date", { ascending: false });

    if (data) setOutlooks(data);
    setLoading(false);
  };

  const openFullscreen = (imageUrl: string, title: string) => {
    setSelectedImage(imageUrl);
    setSelectedTitle(title);
    document.body.style.overflow = "hidden";
  };

  const closeFullscreen = () => {
    setSelectedImage(null);
    setSelectedTitle("");
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeFullscreen();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatDateShort = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-2 border-appPrimary/15 animate-ping" />
            <div className="absolute inset-2 rounded-full border-2 border-t-appPrimary border-transparent animate-spin" />
            <Newspaper className="absolute inset-0 m-auto h-5 w-5 text-appPrimary" />
          </div>
          <p className="text-zinc-600 text-[11px] tracking-widest uppercase">
            Memuat outlook
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* ── HEADER ───────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-zinc-500 hover:text-white transition text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <div className="w-px h-5 bg-white/10" />

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-appPrimary/10 flex items-center justify-center">
              <Newspaper className="h-3.5 w-3.5 text-appPrimary" />
            </div>
            <span className="font-semibold text-sm tracking-tight">
              Daily Market Outlook
            </span>
          </div>

          {outlooks.length > 0 && (
            <div className="ml-auto flex items-center gap-1.5 text-[11px] text-zinc-500">
              <TrendingUp className="h-3.5 w-3.5 text-appPrimary" />
              <span>{outlooks.length} update</span>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-16">
        {/* ── PAGE TITLE ───────────────────────────────── */}
        <div className="mb-10">
          <p className="text-[11px] text-appPrimary uppercase tracking-[0.15em] font-semibold mb-2">
            Analisis Pasar
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Daily Market Outlook
          </h1>
          <p className="text-zinc-500 text-sm mt-1.5">
            Update analisa pasar harian dari tim analis ArchiTrade
          </p>
        </div>

        {/* ── EMPTY STATE ──────────────────────────────── */}
        {outlooks.length === 0 ? (
          <div className="rounded-3xl bg-[#0d0d14] border border-white/5 p-8 sm:p-16 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-appPrimary/6 flex items-center justify-center">
              <Newspaper className="h-7 w-7 text-appPrimary/40" />
            </div>
            <div>
              <p className="text-white font-semibold">Belum ada update</p>
              <p className="text-zinc-500 text-sm mt-1">
                Cek kembali nanti untuk analisis pasar terbaru
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* First card — featured/large */}
            {outlooks.length > 0 && (
              <OutlookCard
                outlook={outlooks[0]}
                featured
                onImageClick={openFullscreen}
                formatDate={formatDate}
                formatDateShort={formatDateShort}
              />
            )}

            {/* Remaining cards */}
            {outlooks.length > 1 && (
              <div className="grid grid-cols-1 gap-5">
                {outlooks.slice(1).map((outlook) => (
                  <OutlookCard
                    key={outlook.id}
                    outlook={outlook}
                    onImageClick={openFullscreen}
                    formatDate={formatDate}
                    formatDateShort={formatDateShort}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── FULLSCREEN IMAGE MODAL ────────────────────── */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center"
          style={{ animation: "fadeIn .18s ease" }}
          onClick={closeFullscreen}
        >
          {/* Close button */}
          <button
            onClick={closeFullscreen}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition z-10"
          >
            <X className="h-5 w-5 text-white" />
          </button>

          {/* ESC hint */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-white/8 border border-white/10 rounded-full text-[11px] text-zinc-400">
            Tekan <kbd className="font-mono text-white">ESC</kbd> atau klik di
            luar untuk menutup
          </div>

          {/* Image */}
          <div
            className="relative max-w-6xl w-full px-4 sm:px-8"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt={selectedTitle}
              className="w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
            {selectedTitle && (
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-full">
                <p className="text-white text-sm font-medium">
                  {selectedTitle}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

/* ── Outlook Card Component ─────────────────────────────────── */
function OutlookCard({
  outlook,
  featured = false,
  onImageClick,
  formatDate,
  formatDateShort,
}: {
  outlook: any;
  featured?: boolean;
  onImageClick: (url: string, title: string) => void;
  formatDate: (d: string) => string;
  formatDateShort: (d: string) => string;
}) {
  const [expanded, setExpanded] = useState(featured);
  const isLong = outlook.content?.length > 400;

  return (
    <article className="rounded-2xl bg-[#0d0d14] border border-white/5 overflow-hidden hover:border-white/10 transition-all duration-300 group">
      {/* Image */}
      {outlook.image_url && (
        <div
          className={`relative overflow-hidden cursor-pointer ${
            featured ? "h-56 sm:h-72 md:h-96" : "h-48 sm:h-60"
          }`}
          onClick={() => onImageClick(outlook.image_url, outlook.title)}
        >
          <img
            src={outlook.image_url}
            alt={outlook.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d14] via-transparent to-transparent opacity-60" />
          
          {/* Date badge on image */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl text-[10px] text-zinc-300">
            <Calendar className="h-3 w-3 text-appPrimary" />
            {formatDateShort(outlook.published_date)}
          </div>

          {/* Zoom hint - hidden on mobile for cleaner look */}
          <div className="absolute inset-0 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-md border border-white/20 rounded-full text-sm text-white">
              <ZoomIn className="h-4 w-4" /> Lihat fullscreen
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4 sm:p-6">
        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mb-4">
          {!outlook.image_url && (
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-zinc-500">
              <Calendar className="h-3.5 w-3.5 text-appPrimary" />
              {formatDate(outlook.published_date)}
            </div>
          )}
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-zinc-500">
            <User className="h-3.5 w-3.5" />
            <span className="truncate max-w-[120px] sm:max-w-none">
              {outlook.author || "Tim Analis ArchiTrade"}
            </span>
          </div>
          {featured && (
            <span className="text-[9px] sm:text-[10px] px-2 py-0.5 bg-appPrimary/10 text-appPrimary rounded-md font-bold uppercase tracking-wider">
              Terbaru
            </span>
          )}
        </div>

        {/* Title */}
        <h2
          className={`font-bold text-white leading-tight mb-3 group-hover:text-appPrimary transition-colors ${
            featured ? "text-lg sm:text-2xl" : "text-base sm:text-lg"
          }`}
        >
          {outlook.title}
        </h2>

        {/* Content with expand */}
        <div className="relative">
          <p
            className={`text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap transition-all ${
              !expanded && isLong ? "line-clamp-3 sm:line-clamp-4" : ""
            }`}
          >
            {outlook.content}
          </p>

          {/* Fade mask when collapsed */}
          {!expanded && isLong && (
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#0d0d14] to-transparent" />
          )}
        </div>

        {/* Read more toggle */}
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-4 text-xs sm:text-sm text-appPrimary hover:text-appPrimary/80 transition font-bold flex items-center gap-1 uppercase tracking-wider"
          >
            {expanded ? "Tampilkan lebih sedikit ↑" : "Baca selengkapnya ↓"}
          </button>
        )}
      </div>
    </article>
  );
}
