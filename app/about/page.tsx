// app/about/page.tsx
import Link from "next/link";
import Header from "@/components/ui/header";
import Footer from "@/components/modules/landing/footer";

// Enable ISR - Revalidate every 1 hour
export const revalidate = 3600;

// Import icons modern dari lucide-react
import {
  GraduationCap,
  Users,
  BarChart3,
  UserCheck,
  Calendar,
  Brain,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="relative pt-20 pb-24 overflow-hidden">
        {/* Background subtle gradient + grain overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-black to-zinc-950 opacity-80 pointer-events-none" />

        <div className="relative mx-auto max-w-6xl px-6 lg:px-12">
          {/* Hero Section */}
          <section className="text-center mb-20">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-white">
              Tentang ArchiTrade
            </h1>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Komunitas trader yang membangun masa depan trading melalui
              edukasi, kolaborasi, dan inovasi.
            </p>
          </section>

          {/* Mission & Vision */}
          <section className="grid md:grid-cols-2 gap-12 mb-20">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-appPrimary mb-4">
                Misi Kami
              </h2>
              <p className="text-zinc-300 leading-relaxed">
                Memberdayakan setiap individu dari pemula hingga profesional
                untuk menjadi trader yang disiplin, cerdas, dan bertanggung
                jawab melalui pengetahuan berkualitas, komunitas suportif, dan
                pendekatan berbasis data.
              </p>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-appPrimary mb-4">
                Visi Kami
              </h2>
              <p className="text-zinc-300 leading-relaxed">
                Menjadi komunitas trading terdepan di Indonesia yang dikenal
                karena transparansi, profesionalisme, dan kontribusi nyata dalam
                meningkatkan literasi finansial serta kualitas trader lokal.
              </p>
            </div>
          </section>

          {/* What We Offer */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">
              Apa yang Kami Tawarkan
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-8 hover:border-appPrimary/50 transition-all duration-300 group hover:scale-[1.02]"
                >
                  <div className="w-14 h-14 flex items-center justify-center bg-appPrimary/10 rounded-2xl mb-6 text-appPrimary group-hover:bg-appPrimary/20 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4 group-hover:text-appPrimary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center">
            <h2 className="text-3xl font-bold mb-6">
              Bergabunglah dengan Kami
            </h2>
            <p className="text-zinc-400 mb-8 max-w-2xl mx-auto">
              Mulai perjalanan trading Anda bersama ribuan trader lain yang
              sama-sama belajar dan berkembang.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="https://t.me/+s22nBUElvnw0Y2Y1"
                className="inline-flex items-center justify-center rounded-xl bg-appPrimary px-8 py-4 text-lg font-medium text-black hover:brightness-95 transition-all shadow-lg shadow-appPrimary/30"
              >
                Daftar Sekarang
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-700 px-8 py-4 text-lg font-medium text-zinc-300 hover:border-appPrimary hover:text-appPrimary transition-all"
              >
                Hubungi Kami
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

const features = [
  {
    icon: <GraduationCap className="w-8 h-8" />,
    title: "Edukasi Berkualitas",
    description:
      "Webinar mingguan, artikel mendalam, dan kursus terstruktur dari trader berpengalaman.",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Komunitas Aktif",
    description:
      "Diskusi harian, sharing setup, review trade, dan support 24/7 di grup eksklusif.",
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: "Tools & Resources",
    description:
      "Template trading journal, screener saham/forex/crypto, dan analisis pasar terkini.",
  },
  {
    icon: <UserCheck className="w-8 h-8" />,
    title: "Mentorship",
    description:
      "Program 1-on-1 dan group mentoring untuk mempercepat perkembangan skill Anda.",
  },
  {
    icon: <Calendar className="w-8 h-8" />,
    title: "Event Eksklusif",
    description:
      "Live trading session, challenge bulanan, dan gathering offline untuk member aktif.",
  },
  {
    icon: <Brain className="w-8 h-8" />,
    title: "Psikologi Trading",
    description:
      "Fokus khusus pada manajemen emosi, disiplin, dan pengembangan mindset trader pemenang.",
  },
];
