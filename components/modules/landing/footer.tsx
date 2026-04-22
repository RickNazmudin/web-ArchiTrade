"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Send, Instagram, Youtube, MessageCircle } from "lucide-react";
import { toast } from "sonner";

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Sembunyikan footer di halaman login & register
  const hideFooter = pathname === "/login" || pathname === "/register";
  if (hideFooter) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message }),
      });

      if (response.ok) {
        toast.success("Pesan berhasil dikirim!", {
          description: "Kami akan segera merespons dalam 1x24 jam.",
        });
        setEmail("");
        setMessage("");
      } else {
        toast.error("Gagal mengirim pesan. Silakan coba lagi.");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat mengirim pesan.");
    } finally {
      setLoading(false);
    }
  };

  const socialLinks = [
    {
      name: "Instagram",
      url: "https://www.instagram.com/architrade99/",
      icon: Instagram,
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com/@ArchiTrade99",
      icon: Youtube,
    },
    {
      name: "TikTok",
      url: "https://www.tiktok.com/@architrade99",
      icon: MessageCircle,
    },
    {
      name: "Telegram",
      url: "https://t.me/+s22nBUElvnw0Y2Y1",
      icon: Send,
    },
  ];

  return (
    <footer className="bg-[#0a0a0f] border-t border-white/5 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid md:grid-cols-12 gap-12">
          {/* Brand Section */}
          <div className="md:col-span-5">
            <div className="mb-6">
              <span className="text-3xl font-bold tracking-tight text-white">
                Archi<span className="text-appPrimary">Trade</span>
              </span>
            </div>

            <p className="text-zinc-400 leading-relaxed text-[15px] max-w-md">
              Komunitas trading Forex profesional dengan EA Robot, daily
              outlook, dan edukasi strategi profit konsisten.
            </p>

            <div className="flex gap-4 mt-8">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:scale-105"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5 text-zinc-400" />
                </a>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-4">
            <h3 className="font-semibold text-white mb-5 flex items-center gap-2 text-lg">
              <Mail className="h-5 w-5 text-appPrimary" />
              Hubungi Kami
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Email Anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-5 py-3.5 bg-[#0d0d14] border border-white/10 rounded-2xl text-sm placeholder:text-zinc-500 focus:outline-none focus:border-appPrimary transition"
              />
              <textarea
                placeholder="Tulis pesan atau pertanyaan Anda..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                className="w-full px-5 py-3.5 bg-[#0d0d14] border border-white/10 rounded-2xl text-sm placeholder:text-zinc-500 focus:outline-none focus:border-appPrimary transition resize-y"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-appPrimary hover:bg-appPrimary/90 disabled:bg-appPrimary/70 text-black font-semibold py-3.5 rounded-2xl transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Kirim Pesan
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h3 className="font-semibold text-white mb-5 text-lg">
              Menu Cepat
            </h3>
            <div className="grid grid-cols-1 gap-y-3 text-sm text-zinc-400">
              <Link href="/dashboard" className="hover:text-white transition">
                Dashboard
              </Link>
              <Link
                href="/daily-outlook"
                className="hover:text-white transition"
              >
                Daily Outlook
              </Link>
              <Link
                href="/subscription"
                className="hover:text-white transition"
              >
                Langganan EA
              </Link>
              <Link href="/invoices" className="hover:text-white transition">
                Riwayat Tagihan
              </Link>
              <Link
                href="/notifications"
                className="hover:text-white transition"
              >
                Notifikasi
              </Link>
              <Link href="/support" className="hover:text-white transition">
                Pusat Bantuan
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} ArchiTrade. All Rights Reserved.</p>
          <p className="text-center md:text-right max-w-md">
            Trading melibatkan risiko kehilangan modal. Konten ini hanya untuk
            tujuan edukasi.
          </p>
        </div>
      </div>
    </footer>
  );
}
