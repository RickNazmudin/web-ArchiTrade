// app/blog/[slug]/page.tsx
import Link from "next/link";
import Header from "@/components/ui/header";
import Footer from "../../_components/footer"; // sesuaikan path kalau beda
import { notFound } from "next/navigation";

// Placeholder data artikel (sudah ditambah 2 artikel baru: psikologi & supply demand)
const blogPosts = [
  {
    slug: "price-action-timeframe-rendah",
    title: "Cara Membaca Price Action di Timeframe Rendah Tanpa Overtrade",
    date: "8 Februari 2025",
    category: "Price Action",
    readTime: "7 menit",
    content: `
      <p>Banyak trader pemula sering terjebak false breakout ketika trading di timeframe rendah (M1–M15). Padahal, timeframe kecil sebenarnya sangat powerful untuk scalping dan day trading — asal kita punya filter yang ketat.</p>
      
      <h2>Mengapa Timeframe Rendah Berbahaya?</h2>
      <ul>
        <li>Noise sangat tinggi → banyak sinyal palsu</li>
        <li>Emosi mudah terpancing → overtrade & revenge trading</li>
        <li>Spread & komisi makan profit kecil</li>
      </ul>

      <h2>3 Filter Utama yang Harus Ada</h2>
      <ol>
        <li><strong>Higher Timeframe Confirmation</strong><br>
          Selalu cek struktur di H1 atau H4 sebelum entry di M5/M15.</li>
        <li><strong>Order Block / FVG</strong><br>
          Entry hanya di area imbalance yang jelas + rejection candle.</li>
        <li><strong>Volume Spike + Liquidity Grab</strong><br>
          Hindari entry saat market sideways tanpa volume.</li>
      </ol>

      <h2>Contoh Setup Nyata</h2>
      <p>[Di sini nanti bisa embed gambar chart atau screenshot setup]</p>
      
      <p>Dengan disiplin menggunakan ketiga filter ini, win rate di timeframe rendah bisa naik signifikan tanpa menambah jumlah trade per hari.</p>
    `,
  },
  {
    slug: "risk-management-1-vs-2-persen",
    title:
      "Manajemen Risiko 1% vs 2% — Mana yang Lebih Cocok untuk Trader Indonesia?",
    date: "2 Februari 2025",
    category: "Manajemen Risiko",
    readTime: "9 menit",
    content: `
      <p>Salah satu perdebatan abadi di komunitas trading: berapa persen risiko per trade yang ideal?</p>
      
      <h2>1% Risk Rule</h2>
      <p>Keunggulan:</p>
      <ul>
        <li>Akun lebih tahan drawdown panjang</li>
        <li>Psikologi lebih stabil</li>
        <li>Cocok untuk pemula & pasar volatile (crypto, forex minor)</li>
      </ul>

      <h2>2% Risk Rule</h2>
      <p>Keunggulan:</p>
      <ul>
        <li>Compounding lebih cepat jika win rate tinggi</li>
        <li>Cocok untuk trader berpengalaman dengan edge jelas</li>
      </ul>

      <p><strong>Kesimpulan dari data 1000+ trade ArchiTrade:</strong> Untuk kondisi pasar Indonesia (volatilitas tinggi + news lokal), 1% risk cenderung lebih sustainable dalam jangka panjang.</p>
    `,
  },
  {
    slug: "mengatasi-revenge-trading",
    title: "Psikologi Trading: Cara Mengatasi Revenge Trading dalam 3 Langkah",
    date: "15 Januari 2025",
    category: "Psikologi Trading",
    readTime: "6 menit",
    content: `
      <p>Revenge trading adalah salah satu pembunuh akun trading paling umum — trader loss lalu langsung entry lagi dengan lot lebih besar demi "balas dendam" ke market. Hasilnya? Loss beruntun dan modal habis cepat.</p>

      <h2>Apa Itu Revenge Trading?</h2>
      <p>Revenge trading terjadi karena emosi negatif setelah loss: marah, frustrasi, ingin cepat balik modal. Tanda-tandanya:</p>
      <ul>
        <li>Entry ulang tanpa analisis ulang</li>
        <li>Memperbesar lot size secara impulsif</li>
        <li>Mengabaikan trading plan & risk management</li>
      </ul>

      <h2>3 Langkah Praktis Mengatasinya</h2>
      <ol>
        <li><strong>Stop & Reset (Tarik Napas)</strong><br>
          Setelah loss, tutup platform minimal 30 menit–1 jam. Tarik napas dalam, jalan-jalan, atau catat jurnal emosi: "Kenapa loss? Apa yang bisa diperbaiki?" Ini memutus siklus emosi.</li>
        <li><strong>Patuhi Batas Harian</strong><br>
          Tentukan max loss harian (misal 1–2% dari modal). Kalau sudah kena, stop trading hari itu. Gunakan alert atau auto-logout di platform untuk disiplin.</li>
        <li><strong>Review & Journaling</strong><br>
          Tiap akhir sesi, review trade yang loss. Tanyakan: "Apakah ini karena strategi atau emosi?" Buat checklist sebelum entry: "Sudah sesuai plan? Emosi stabil?" Lama-kelamaan revenge trading akan berkurang drastis.</li>
      </ol>

      <p>Ingat: Market selalu ada besok. Yang hilang karena revenge trading jauh lebih mahal daripada loss kecil yang terkontrol. Disiplin psikologi = kunci konsistensi profit jangka panjang.</p>
    `,
  },
  {
    slug: "supply-demand-scalping-ihsg-forex",
    title: "Setup Supply Demand Terbaik untuk Scalping IHSG & Forex",
    date: "10 Januari 2025",
    category: "Supply Demand",
    readTime: "8 menit",
    content: `
      <p>Supply & Demand (S&D) adalah konsep dasar yang powerful untuk scalping karena fokus pada zona di mana big player (institusi) masuk/keluar pasar. Di IHSG & Forex, zona ini sering jadi titik reversal atau continuation yang tajam.</p>

      <h2>Cara Identifikasi Zona Supply & Demand</h2>
      <ul>
        <li><strong>Demand Zone</strong>: Area di mana harga pernah naik tajam setelah konsolidasi/base (banyak buyer masuk).</li>
        <li><strong>Supply Zone</strong>: Area di mana harga pernah turun tajam setelah base (banyak seller masuk).</li>
      </ul>

      <h2>Setup Scalping Terbaik (3 Konfirmasi)</h2>
      <ol>
        <li><strong>Temukan Zona Kuat</strong><br>
          Cari base candle (range sideways) diikuti rally/drop tajam (minimal 3–5 candle kuat). Zona fresh (belum diuji ulang berkali-kali) biasanya lebih reliable.</li>
        <li><strong>Konfirmasi Price Action</strong><br>
          Tunggu rejection candle (pinbar, engulfing) atau FVG (fair value gap) di zona tersebut. Hindari entry kalau candle body besar menembus zona tanpa rejection.</li>
        <li><strong>Multiple Timeframe Alignment</strong><br>
          Cek higher timeframe (H1/H4) untuk trend utama. Entry scalping di M5/M15 hanya kalau searah trend HTF. Contoh: Demand zone di M5 + uptrend di H1 = high probability buy.</li>
      </ol>

      <h2>Contoh Setup Nyata (Forex EUR/USD atau IHSG)</h2>
      <p>Misal di EUR/USD M5: Harga turun ke demand zone (area base sebelum rally), muncul pinbar bullish + volume naik. Entry buy di close pinbar, stop loss di bawah zona, target RR 1:2 atau next supply zone.</p>

      <p>Pro tip: Gabungkan dengan news filter — hindari scalping saat high impact news (NFP, BI rate) karena zona bisa ditembus mudah. Dengan disiplin, setup S&D ini bisa kasih 70%+ win rate di scalping kalau risk management ketat.</p>
    `,
  },
  // tambahkan artikel lain di sini jika perlu
];

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  readTime: string;
  content: string;
}

function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export default function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound(); // menampilkan 404 page Next.js
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="relative pt-20 pb-24">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-black to-zinc-950 opacity-80 pointer-events-none" />

        <article className="relative mx-auto max-w-4xl px-6 lg:px-8">
          {/* Back button & meta */}
          <div className="mb-10">
            <Link
              href="/blog"
              className="inline-flex items-center text-appPrimary hover:text-appPrimary-400 transition-colors mb-6"
            >
              ← Kembali ke Blog
            </Link>

            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
              <time dateTime={post.date}>{post.date}</time>
              <span>•</span>
              <span className="px-3 py-1 bg-zinc-800/70 rounded-full text-appPrimary text-xs font-medium">
                {post.category}
              </span>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>
          </div>

          {/* Judul artikel */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-8 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-200">
            {post.title}
          </h1>

          {/* Konten artikel */}
          <div
            className="prose prose-invert prose-zinc max-w-none prose-headings:text-white prose-a:text-appPrimary prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-appPrimary prose-blockquote:text-zinc-300 prose-strong:text-white prose-code:text-appPrimary prose-pre:bg-zinc-900/70 prose-pre:border prose-pre:border-zinc-800"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Share / CTA section */}
          <div className="mt-16 pt-10 border-t border-zinc-800 text-center">
            <p className="text-zinc-400 mb-6">
              Bermanfaat? Bagikan ke teman trader Anda
            </p>
            <div className="flex justify-center gap-6">
              <button className="text-zinc-400 hover:text-appPrimary transition">
                Share ke Telegram
              </button>
              <button className="text-zinc-400 hover:text-appPrimary transition">
                Share ke WhatsApp
              </button>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}

// Optional: generate metadata dinamis
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: "Artikel Tidak Ditemukan" };

  return {
    title: `${post.title} | ArchiTrade Blog`,
    description: post.content.substring(0, 160) + "...",
  };
}
