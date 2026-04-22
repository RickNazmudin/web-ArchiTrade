"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "Apa itu ArchiTrade?",
    answer: "ArchiTrade adalah komunitas trading eksklusif yang menyediakan edukasi, alat analisis, dan sinyal trading berkualitas tinggi untuk membantu trader mencapai kesuksesan finansial.",
  },
  {
    question: "Apakah pemula bisa bergabung?",
    answer: "Sangat bisa! Kami menyediakan kurikulum dari dasar hingga tingkat lanjut yang dirancang khusus untuk membantu pemula memahami pasar dengan cepat dan aman.",
  },
  {
    question: "Apa saja tools yang didapatkan?",
    answer: "Anggota akan mendapatkan akses ke Dashboard eksklusif, bot notifikasi real-time, analisis pasar harian, serta akses ke grup diskusi komunitas.",
  },
  {
    question: "Bagaimana sistem pembayarannya?",
    answer: "Kami menyediakan sistem berlangganan yang transparan dengan metode pembayaran transfer bank yang mudah dan aman melalui sistem invoice otomatis kami.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Pertanyaan Umum
            </h2>
            <p className="text-zinc-500">
              Temukan jawaban untuk pertanyaan yang paling sering diajukan.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-zinc-900 rounded-2xl overflow-hidden bg-zinc-950/50"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between group transition-colors hover:bg-zinc-900"
                >
                  <span className="text-lg font-medium text-zinc-200 group-hover:text-white transition-colors">
                    {faq.question}
                  </span>
                  <div className="flex-shrink-0 ml-4">
                    {openIndex === index ? (
                      <Minus className="w-5 h-5 text-appPrimary" />
                    ) : (
                      <Plus className="w-5 h-5 text-zinc-500 group-hover:text-white" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-5 text-zinc-400 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
