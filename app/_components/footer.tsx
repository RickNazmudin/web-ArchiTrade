"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("message", message);

      await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });

      setEmail("");
      setMessage("");
      alert("Pesan berhasil dikirim ke tim kami 🚀");
    } catch (error) {
      console.error("Gagal kirim pesan:", error);
      alert("Terjadi kesalahan saat mengirim pesan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-gradient-to-t from-gray-950 via-gray-900 to-gray-800 text-white pt-16">
      <div className="max-w-7xl mx-auto px-6 grid gap-12 md:grid-cols-3">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold tracking-wide">
            ArchiTrade Academy
          </h2>
          <p className="text-gray-400 mt-3 leading-relaxed">
            Komunitas & platform edukasi trading Forex, Crypto, dan Saham.
            Belajar strategi, manajemen risiko, dan mindset bersama mentor &
            trader profesional.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-4 text-lg">Hubungi Kami</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              placeholder="Email kamu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl bg-gray-800 border border-gray-700 px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />

            <textarea
              placeholder="Tulis pertanyaan / pesan kamu"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={3}
              className="w-full rounded-xl bg-gray-800 border border-gray-700 px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 transition px-4 py-2 font-medium"
            >
              {loading ? "Mengirim..." : "Kirim Pesan"}
            </button>
          </form>
        </div>

        {/* Social */}
        <div>
          <h3 className="font-semibold mb-4 text-lg">Komunitas & Sosial</h3>
          <ul className="space-y-2 text-gray-400">
            <li>
              <Link
                href="https://www.instagram.com/architrade99/"
                className="hover:text-white transition"
              >
                Instagram
              </Link>
            </li>
            <li>
              <Link
                href="https://www.tiktok.com/@architrade99"
                className="hover:text-white transition"
              >
                Tiktok
              </Link>
            </li>
            <li>
              <Link
                href="https://www.youtube.com/@ArchiTrade99"
                className="hover:text-white transition"
              >
                YouTube
              </Link>
            </li>
            <li>
              <Link
                href="https://t.me/+s22nBUElvnw0Y2Y1"
                className="hover:text-white transition"
              >
                Telegram Community
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-14 py-6 text-center text-gray-500 text-sm">
        ⚠️ Disclaimer: Trading memiliki risiko tinggi. Edukasi ini bukan
        merupakan ajakan membeli/menjual aset. <br />©{" "}
        {new Date().getFullYear()} ArchiTrade Academy. All rights reserved.
      </div>
    </footer>
  );
}
