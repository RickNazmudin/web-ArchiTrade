"use client";

import React, { useState } from "react";

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
      alert("Pesan berhasil dikirim!");
    } catch (error) {
      console.error("Gagal kirim pesan:", error);
      alert("Terjadi kesalahan saat mengirim pesan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-gray-900 text-white p-10">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-2">ArchiTrade</h2>
          <p className="text-gray-400">
            Platform perdagangan arsitektur modern & terpercaya.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Kontak Kami</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              placeholder="Email kamu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 rounded text-black"
            />

            <textarea
              placeholder="Pesan kamu"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="w-full p-2 rounded text-black"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              {loading ? "Mengirim..." : "Kirim"}
            </button>
          </form>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Ikuti Kami</h3>
          <p className="text-gray-400">Instagram • Facebook • LinkedIn</p>
        </div>
      </div>

      <div className="text-center text-gray-500 mt-8">
        © {new Date().getFullYear()} ArchiTrade. All rights reserved.
      </div>
    </footer>
  );
}
