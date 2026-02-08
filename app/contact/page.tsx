"use client";

import Header from "@/components/ui/header";
import Footer from "../_components/footer";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Pesan Anda telah dikirim! Kami akan segera menghubungi Anda.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="relative pt-20 pb-24">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-black to-zinc-950 opacity-80 pointer-events-none" />

        <div className="relative mx-auto max-w-6xl px-6 lg:px-12">
          <section className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-white">
              Hubungi Kami
            </h1>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Punya pertanyaan tentang trading, ingin bergabung komunitas, atau
              ada proposal kerjasama? Kami siap membantu 24/7.
            </p>
          </section>

          <section className="grid md:grid-cols-3 gap-8 mb-20">
            {contactOptions.map((option, index) => (
              <div
                key={index}
                className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 text-center backdrop-blur-sm hover:border-appPrimary/50 transition-all duration-300 group"
              >
                <div className="text-4xl mb-6 text-appPrimary">
                  {option.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-appPrimary transition-colors">
                  {option.title}
                </h3>
                <p className="text-zinc-400 mb-4">{option.description}</p>
                <a
                  href={option.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-appPrimary hover:text-appPrimary-400 font-medium transition-colors"
                >
                  {option.action}
                </a>
              </div>
            ))}
          </section>

          <section className="max-w-3xl mx-auto">
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 lg:p-12 backdrop-blur-sm">
              <h2 className="text-3xl font-bold mb-8 text-center">
                Kirim Pesan Langsung
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-zinc-300 mb-2"
                  >
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-appPrimary focus:ring-1 focus:ring-appPrimary transition"
                    placeholder="Masukkan nama Anda"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-zinc-300 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-appPrimary focus:ring-1 focus:ring-appPrimary transition"
                    placeholder="contoh@email.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-zinc-300 mb-2"
                  >
                    Pesan Anda
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-appPrimary focus:ring-1 focus:ring-appPrimary transition"
                    placeholder="Ceritakan pertanyaan atau kebutuhan Anda..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-appPrimary hover:bg-appPrimary/90 text-black font-bold py-4 px-8 rounded-xl transition shadow-lg shadow-appPrimary/20 text-lg"
                >
                  Kirim Pesan
                </button>
              </form>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

const contactOptions = [
  {
    icon: "📧",
    title: "Email",
    description: "Untuk pertanyaan formal atau proposal",
    action: "tradearchi@gmail.com",
    link: "mailto:tradearchi@gmail.com?subject=Pertanyaan%20dari%20Website",
  },
  {
    icon: "💬",
    title: "Telegram",
    description: "Respon cepat untuk diskusi trading",
    action: "@ArchiTrade99",
    link: "https://t.me/ArchiTrade99",
  },
  {
    icon: "📱",
    title: "WhatsApp",
    description: "Chat langsung 24/7 (preferensi utama)",
    action: "Chat via WA",
    link: "https://wa.me/6289617257030?text=Halo%20Admin%20ArchiTrade,%20saya%20ingin%20bertanya%20tentang...", // ganti nomor asli
  },
];
