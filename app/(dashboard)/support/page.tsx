"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Headphones,
  Mail,
  MessageCircle,
  Clock,
  ChevronRight,
  Send,
  Loader2,
  CheckCircle,
  FileText,
  BookOpen,
  Video,
  Users,
  ExternalLink,
  HelpCircle,
  AlertCircle,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    {
      question: "Bagaimana cara menghubungkan akun MT5?",
      answer:
        "Masuk ke Dashboard, klik tombol 'Hubungkan Akun MT5', masukkan ID akun, password, dan server MT5 Anda. Pastikan data yang dimasukkan benar agar koneksi berhasil.",
    },
    {
      question: "Berapa lama proses aktivasi EA Robot?",
      answer:
        "Setelah pembayaran berhasil diverifikasi, EA Robot akan diaktifkan dalam waktu maksimal 1x24 jam oleh tim admin kami.",
    },
    {
      question: "Apakah bisa mengganti paket langganan?",
      answer:
        "Ya, Anda dapat mengganti paket pada periode langganan berikutnya. Silakan hubungi admin melalui support untuk proses perubahan paket.",
    },
    {
      question: "Bagaimana cara pembayaran tagihan?",
      answer:
        "Tagihan akan dikirim ke email Anda. Pembayaran dapat dilakukan melalui transfer bank (BCA, Mandiri, BRI), QRIS, atau e-wallet.",
    },
    {
      question: "Apa yang terjadi jika subscription expired?",
      answer:
        "EA Robot akan berhenti berjalan otomatis. Anda perlu memperpanjang langganan melalui halaman Langganan untuk mengaktifkan kembali.",
    },
    {
      question: "Apakah ada garansi profit?",
      answer:
        "Kami tidak memberikan garansi profit 100%. EA Robot memberikan sinyal berdasarkan algoritma teruji, namun trading forex tetap memiliki risiko.",
    },
  ];

  const guides = [
    {
      title: "Panduan Connect MT5",
      icon: FileText,
      link: "#",
      desc: "Langkah-langkah menghubungkan MT5",
    },
    {
      title: "Cara Berlangganan",
      icon: BookOpen,
      link: "#",
      desc: "Panduan memilih & aktifkan paket",
    },
    {
      title: "Video Tutorial",
      icon: Video,
      link: "#",
      desc: "Tutorial lengkap menggunakan EA",
    },
    {
      title: "Komunitas Telegram",
      icon: Users,
      link: "https://t.me/+s22nBUElvnw0Y2Y1",
      desc: "Gabung dengan trader lain",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulasi pengiriman
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Pesan berhasil terkirim!", {
      description: "Tim support kami akan merespons dalam 1x24 jam.",
    });

    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setSubmitting(false);

    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* HEADER */}
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
            <div className="w-7 h-7 rounded-lg bg-sky-500/10 flex items-center justify-center">
              <Headphones className="h-3.5 w-3.5 text-sky-400" />
            </div>
            <span className="font-semibold text-sm tracking-tight">
              Pusat Bantuan
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-16">
        {/* PAGE TITLE */}
        <div className="mb-10 text-center">
          <p className="text-[11px] text-sky-400 uppercase tracking-[0.15em] font-semibold mb-2">
            BANTUAN & SUPPORT
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Pusat Bantuan ArchiTrade
          </h1>
          <p className="text-zinc-500 text-sm mt-1.5 max-w-md mx-auto">
            Butuh bantuan? Tim support kami siap membantu Anda 24/7
          </p>
        </div>

        {/* KONTAK SUPPORT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          <div className="rounded-3xl bg-[#0d0d14] border border-white/5 p-8 text-center hover:border-sky-500/30 transition-all group">
            <div className="w-14 h-14 mx-auto bg-sky-500/10 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition">
              <Mail className="h-7 w-7 text-sky-400" />
            </div>
            <h3 className="font-semibold text-lg">Email Support</h3>
            <p className="text-sky-400 mt-1">support@architrade.com</p>
            <p className="text-xs text-zinc-500 mt-3">Respons dalam 1x24 jam</p>
            <button
              onClick={() =>
                (window.location.href = "mailto:support@architrade.com")
              }
              className="mt-6 inline-flex items-center gap-2 text-sm text-sky-400 hover:text-sky-300 transition"
            >
              Kirim Email <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="rounded-3xl bg-[#0d0d14] border border-white/5 p-8 text-center hover:border-sky-500/30 transition-all group">
            <div className="w-14 h-14 mx-auto bg-sky-500/10 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition">
              <MessageCircle className="h-7 w-7 text-sky-400" />
            </div>
            <h3 className="font-semibold text-lg">Live Chat</h3>
            <p className="text-zinc-400 mt-1">
              Senin – Jumat, 09:00 – 17:00 WIB
            </p>
            <p className="text-xs text-zinc-500 mt-3">
              Respons cepat di jam kerja
            </p>
            <button className="mt-6 inline-flex items-center gap-2 text-sm text-sky-400 hover:text-sky-300 transition">
              Mulai Live Chat <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* PANDUAN CEPAT */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <Sparkles className="h-5 w-5 text-appPrimary" />
            <h2 className="text-lg font-semibold">Panduan Cepat</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {guides.map((guide, i) => {
              const Icon = guide.icon;
              return (
                <a
                  key={i}
                  href={guide.link}
                  target={guide.link.startsWith("http") ? "_blank" : undefined}
                  className="group rounded-3xl bg-[#0d0d14] border border-white/5 p-6 hover:border-white/20 transition-all hover:-translate-y-1"
                >
                  <div className="w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-appPrimary/10 transition">
                    <Icon className="h-5 w-5 text-zinc-400 group-hover:text-appPrimary" />
                  </div>
                  <p className="font-medium text-white mb-1">{guide.title}</p>
                  <p className="text-xs text-zinc-500 line-clamp-2">
                    {guide.desc}
                  </p>
                </a>
              );
            })}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <HelpCircle className="h-5 w-5 text-appPrimary" />
            <h2 className="text-lg font-semibold">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="rounded-3xl bg-[#0d0d14] border border-white/5 divide-y divide-white/5 overflow-hidden">
            {faqs.map((faq, index) => (
              <details key={index} className="group">
                <summary className="flex items-center justify-between px-6 sm:px-8 py-5 cursor-pointer hover:bg-white/5 transition list-none">
                  <span className="font-medium text-sm sm:text-base pr-6">
                    {faq.question}
                  </span>
                  <ChevronRight className="h-5 w-5 text-zinc-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                </summary>
                <div className="px-6 sm:px-8 pb-6 text-zinc-400 text-sm leading-relaxed border-t border-white/5">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* FORM KIRIM PESAN */}
        <div className="rounded-3xl bg-[#0d0d14] border border-white/5 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 flex items-center justify-center">
              <Send className="h-5 w-5 text-sky-400" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Kirim Pesan ke Support</h2>
              <p className="text-sm text-zinc-500">
                Tidak menemukan jawaban? Kirim pesan langsung ke tim kami
              </p>
            </div>
          </div>

          {submitted ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <CheckCircle className="h-9 w-9 text-emerald-400" />
              </div>
              <p className="text-emerald-400 font-semibold text-lg">
                Pesan Berhasil Terkirim!
              </p>
              <p className="text-zinc-400 mt-2 max-w-xs">
                Tim support kami akan segera merespons dalam waktu 1x24 jam.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-sky-400 transition"
                    placeholder="Nama Anda"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-sky-400 transition"
                    placeholder="email@anda.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  Subjek
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-sky-400 transition"
                  placeholder="Misalnya: Masalah koneksi MT5"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  Pesan Anda
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={5}
                  className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-sky-400 transition resize-none"
                  placeholder="Jelaskan masalah atau pertanyaan Anda..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-sky-500 hover:bg-sky-600 text-black font-semibold rounded-2xl transition flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Mengirim Pesan...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Kirim Pesan ke Support
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* INFO RESPONS */}
        <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5" />
            Waktu respons: 1x24 jam kerja
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-3.5 w-3.5" />
            Senin – Jumat, 09:00 – 17:00 WIB
          </div>
        </div>
      </div>
    </div>
  );
}
