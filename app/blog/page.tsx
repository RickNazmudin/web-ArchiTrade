// app/blog/page.tsx
import Link from "next/link";
import Header from "@/components/ui/header";
import Footer from "@/components/modules/landing/footer";

// Enable ISR - Revalidate every 1 hour
export const revalidate = 3600;

// Placeholder data artikel (ganti dengan fetch dari API/CMS nanti)
const blogPosts = [
  {
    id: 1,
    title: "Cara Membaca Price Action di Timeframe Rendah Tanpa Overtrade",
    excerpt:
      "Banyak trader pemula kejebak false breakout karena terlalu agresif di timeframe M5–M15. Ini strategi sederhana tapi powerful untuk filter sinyal berkualitas tinggi.",
    date: "8 Februari 2025",
    category: "Price Action",
    readTime: "7 menit",
    slug: "price-action-timeframe-rendah",
  },
  {
    id: 2,
    title:
      "Manajemen Risiko 1% vs 2% — Mana yang Lebih Cocok untuk Trader Indonesia?",
    excerpt:
      "Analisis real case 1000+ trade: kenapa 1% risk sering lebih aman di pasar volatile seperti forex dan crypto lokal.",
    date: "2 Februari 2025",
    category: "Manajemen Risiko",
    readTime: "9 menit",
    slug: "risk-management-1-vs-2-persen",
  },
  {
    id: 3,
    title: "Psikologi Trading: Cara Mengatasi Revenge Trading dalam 3 Langkah",
    excerpt:
      "Revenge trading adalah pembunuh akun nomor satu. Pelajari trigger emosi dan teknik reset mindset yang digunakan trader pro.",
    date: "28 Januari 2025",
    category: "Psikologi Trading",
    readTime: "6 menit",
    slug: "mengatasi-revenge-trading",
  },
  {
    id: 4,
    title: "Setup Supply Demand Terbaik untuk Scalping IHSG & Forex",
    excerpt:
      "Cara menemukan zona supply demand berkualitas tinggi + konfirmasi entry menggunakan volume dan candlestick pattern.",
    date: "20 Januari 2025",
    category: "Supply Demand",
    readTime: "8 menit",
    slug: "supply-demand-scalping-ihsg-forex",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="relative pt-20 pb-24">
        {/* Gradient background subtle */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-black to-zinc-950 opacity-80 pointer-events-none" />

        <div className="relative mx-auto max-w-6xl px-6 lg:px-12">
          {/* Hero / Header Blog */}
          <section className="text-center mb-16 lg:mb-20">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-5 bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-white">
              Blog ArchiTrade
            </h1>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Insight, strategi, dan update trading langsung dari komunitas.
              Dari price action hingga psikologi — semuanya dibahas secara
              mendalam.
            </p>
          </section>

          {/* Blog Grid */}
          <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="group bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-sm hover:border-appPrimary/50 transition-all duration-300 flex flex-col h-full"
              >
                {/* Placeholder gambar (bisa diganti dengan <Image /> nanti) */}
                <div className="h-48 bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center text-zinc-600 text-4xl font-bold">
                  {post.category.split(" ")[0]}
                </div>

                <div className="p-6 lg:p-7 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 text-sm text-zinc-500 mb-3">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h2 className="text-xl lg:text-2xl font-bold mb-4 group-hover:text-appPrimary transition-colors line-clamp-2">
                    {post.title}
                  </h2>

                  <p className="text-zinc-400 mb-6 line-clamp-3 flex-grow">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-sm font-medium px-3 py-1 bg-zinc-800/70 rounded-full text-appPrimary">
                      {post.category}
                    </span>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-appPrimary hover:text-appPrimary-400 font-medium transition-colors flex items-center gap-2"
                    >
                      Baca Selengkapnya →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </section>

          {/* Pagination sederhana (placeholder) */}
          <div className="flex justify-center items-center gap-6 mt-16 text-zinc-400">
            <button
              className="px-5 py-2 border border-zinc-700 rounded-lg hover:border-appPrimary hover:text-appPrimary transition disabled:opacity-50"
              disabled
            >
              ← Sebelumnya
            </button>
            <span className="text-lg font-medium">Halaman 1 dari 12</span>
            <button className="px-5 py-2 border border-zinc-700 rounded-lg hover:border-appPrimary hover:text-appPrimary transition">
              Selanjutnya →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
