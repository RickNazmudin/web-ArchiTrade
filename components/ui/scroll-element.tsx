"use client";
import { ReactLenis } from "lenis/react";
import { useTransform, motion, useScroll, MotionValue } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { BorderBeam } from "./border-beam";

const projects = [
  {
    title: "Ebook Eksklusif: Trading Forex dari Nol Panduan Lengkap untuk Pemula",
    description: `Apakah Anda baru mengenal dunia trading? Atau mungkin Anda ingin memperkuat dasar-dasar pengetahuan Anda? Ebook eksklusif kami adalah titik awal yang sempurna! 
            Apa yang akan Anda dapatkan dari Ebook ini?
            Konsep Dasar Trading: Memahami istilah-istilah penting dan cara kerja pasar keuangan.
            Strategi Trading Sederhana: Pelajari pendekatan trading yang mudah dipahami dan dapat langsung Anda praktikkan.
            Manajemen Risiko Fundamental: Kuasai cara melindungi modal Anda dan meminimalkan kerugian.
            Psikologi Trading: Membangun mentalitas yang kuat dan disiplin dalam mengambil keputusan.
            Langkah-langkah Praktis: Panduan step-by-step untuk memulai perjalanan trading Anda dengan percaya diri.
            Ebook ini dirancang khusus untuk membantu Anda membangun fondasi yang kokoh sebelum melangkah lebih jauh di pasar.`,
    src: "#",
    link: "/ebook1.jpg",
    color: "#5196fd",
  },
  {
    title: "Pandangan Harian: Analisa Market Forex Terkini",
    description:
      `Dapatkan keunggulan kompetitif dengan analisis pasar harian kami yang mendalam dan up-to-date khusus untuk pasar Forex. Tim analis kami secara cermat memantau pergerakan pasar, mengidentifikasi peluang, dan memberikan wawasan yang dapat Anda gunakan.
      Apa yang kami sajikan?
      Analisis Teknis & Fundamental: Kombinasi pandangan dari kedua sisi untuk pemahaman pasar yang komprehensif.
      Level Kunci: Identifikasi support dan resistance penting serta area entry dan exit potensial.
      Berita & Event Ekonomi: Dampak peristiwa ekonomi global terhadap pasangan mata uang.
      Potensi Setup Trading: Ide-ide trading yang mungkin muncul berdasarkan kondisi pasar terkini.
      Dengan pandangan harian ini, Anda akan selalu selangkah lebih maju dalam memahami dinamika pasar Forex.`,
    src: "#",
    link: "/outlook.jpg",
    color: "#8f89ff",
  },
  {
    title: "Forum Diskusi Aktif: Belajar dan Berkolaborasi",
    description:
      `Komunitas adalah jantung dari ArchiTrade. Forum diskusi kami adalah tempat di mana para trader dari berbagai latar belakang berkumpul, berbagi, dan tumbuh bersama.
      Manfaat Bergabung dalam Diskusi:
      Berbagi Ide & Strategi: Diskusikan analisis Anda, dapatkan feedback, dan temukan perspektif baru dari sesama trader.
      Tanya Jawab Langsung: Ajukan pertanyaan Anda dan dapatkan jawaban dari trader berpengalaman atau tim ahli kami.
      Studi Kasus Nyata: Pelajari dari keberhasilan dan kegagalan trading anggota lain.
      Dukungan & Motivasi: Temukan lingkungan yang suportif untuk tetap termotivasi dalam perjalanan trading Anda.
      Networking: Bangun koneksi dengan individu-individu yang memiliki minat dan tujuan yang sama.
      Bergabunglah dengan diskusi kami dan rasakan kekuatan kolaborasi dalam mencapai kesuksesan trading!`,
    src: "#",
    link: "/diskusi.jpg",
    color: "#13006c",
  },
  {
    title: "Webinar & Sesi Live Trading Bulanan",
    description:
      `Tingkatkan pengetahuan Anda dengan sesi edukasi langsung dan saksikan bagaimana para ahli kami menerapkan strategi trading di pasar nyata.
      Apa yang akan Anda dapatkan?
      Webinar Edukatif: Sesi mendalam tentang topik-topik trading lanjutan, manajemen risiko, psikologi pasar, dan banyak lagi, disampaikan oleh trader dan analis berpengalaman.
      Sesi Live Trading: Ikuti sesi trading langsung di mana Anda bisa melihat proses pengambilan keputusan, eksekusi trade, dan manajemen posisi secara real-time. Ini adalah kesempatan emas untuk belajar langsung dari praktik terbaik.
      Q&A Interaktif: Dapatkan kesempatan untuk bertanya langsung kepada pembicara dan analis kami selama sesi berlangsung.
      Layanan ini dirancang untuk memberikan pengalaman belajar yang imersif dan praktis.`,
          src: "#",
    link: "/komuni.png",
    color: "#ed649e",
  },
  {
    title: "Perpustakaan Sumber Daya Trading (Video Tutorial & Artikel)",
    description:
      `Akses koleksi lengkap materi edukasi kami yang terus bertambah, kapan saja dan di mana saja. Dari video tutorial hingga artikel mendalam, semua yang Anda butuhkan untuk memperdalam pemahaman trading Anda ada di sini.
      Apa saja yang tersedia?
      Video Tutorial: Panduan visual tentang penggunaan platform trading, indikator teknis, pola chart, dan berbagai konsep trading lainnya.
      Artikel Mendalam: Tulisan komprehensif tentang teori trading, analisis pasar, studi kasus, dan tips praktis untuk meningkatkan kinerja Anda.
      Glosarium Trading: Kamus istilah trading yang lengkap untuk membantu Anda memahami jargon pasar.
      Daftar Rekomendasi Buku: Pilihan buku-buku terbaik tentang trading dan investasi yang patut Anda baca.
      Perpustakaan ini adalah sumber daya tak terbatas untuk perjalanan belajar Anda.`,
    src: "#",
    link: "/library.png",
    color: "#fd521a",
  },
];

export default function CardScroll(): JSX.Element {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <ReactLenis root>
      <main className="" ref={container}>
        <section className="text-white h-auto py-10 md:py-20 lg:py-32 w-full grid place-content-center relative px-4">
          <h1 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl px-2 md:px-8 font-semibold text-center tracking-tight leading-[120%]">
            Beberapa Layanan 
            <span className="text-appPrimary"> yang Kami Sediakan</span>
          </h1>
          <br />
          <div className="px-2 md:px-8 flex justify-center">
            <p className="text-sm md:text-lg lg:text-xl font-light max-w-4xl text-center leading-relaxed">
            Di ArchiTrade, kami berkomitmen untuk menjadi mitra terpercaya Anda dalam perjalanan trading dan investasi. 
            Kami menyediakan berbagai layanan esensial yang dirancang untuk membekali Anda dengan pengetahuan, wawasan, 
            dan dukungan komunitas yang Anda butuhkan untuk sukses di pasar keuangan.
            </p>
          </div>
        </section>

        <section className="text-white w-full">
          {projects.map((project, i) => {
            const targetScale = 1 - (projects.length - i) * 0.05;
            return (
              <Card
                key={`p_${i}`}
                i={i}
                url={project.link}
                src={project.src}
                title={project.title}
                color={project.color}
                description={project.description}
                progress={scrollYProgress}
                range={[i * 0.25, 1]}
                targetScale={targetScale}
              />
            );
          })}
        </section>
      </main>
    </ReactLenis>
  );
}

interface CardProps {
  i: number;
  title: string;
  description: string;
  src: string;
  url: string;
  color: string;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}

const Card: React.FC<CardProps> = ({
  i,
  title,
  description,
  url,
  progress,
  range,
  targetScale,
}) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "start start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={container}
      className="min-h-screen flex items-center justify-center sticky top-0 px-4 py-8 md:py-0"
    >
      <motion.div
        style={{
          scale,
          top: `calc(${i * 15}px)`, // Reduced stacking offset for mobile
        }}
        className="flex flex-col relative w-full max-w-6xl mx-auto
                   h-auto min-h-[500px] md:min-h-[450px] lg:h-[500px]
                   bg-zinc-950 border-white/5 border rounded-lg 
                   p-4 md:p-6 lg:p-10 origin-top"
      >
        {/* Title - Always at top */}
        <h2 className="text-lg md:text-2xl lg:text-3xl font-semibold text-white mb-4 md:mb-6 leading-tight">
          {title}
        </h2>
        
        {/* Content - Responsive layout */}
        <div className="flex flex-col md:flex-row h-full gap-6 md:gap-8 lg:gap-10">
          {/* Text Content */}
          <div className="w-full md:w-[45%] lg:w-[40%] flex flex-col justify-between">
            <div className="flex-1">
              <p className="text-xs md:text-sm lg:text-base text-gray-300 leading-relaxed line-clamp-[10] md:line-clamp-none">
                {description}
              </p>
            </div>
            
            {/* Call to action */}
            <div className="mt-4 md:mt-6">
              <span className="flex items-center gap-2">
                <a
                  href={url}
                  target="_blank"
                  className="text-sm md:text-base underline cursor-pointer text-white hover:text-appPrimary transition-colors"
                  rel="noopener noreferrer"
                >
                  See more
                </a>
                <svg
                  width="18"
                  height="10"
                  viewBox="0 0 22 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="md:w-[22px] md:h-[12px]"
                >
                  <path
                    d="M21.5303 6.53033C21.8232 6.23744 21.8232 5.76256 21.5303 5.46967L16.7574 0.696699C16.4645 0.403806 15.9896 0.403806 15.6967 0.696699C15.4038 0.989592 15.4038 1.46447 15.6967 1.75736L19.9393 6L15.6967 10.2426C15.4038 10.5355 15.4038 11.0104 15.6967 11.3033C15.9896 11.5962 16.4645 11.5962 16.7574 11.3033L21.5303 6.53033ZM0 6.75L21 6.75V5.25L0 5.25L0 6.75Z"
                    fill="white"
                  />
                </svg>
              </span>
            </div>
          </div>

          {/* Image Container */}
          <div className="relative w-full md:w-[55%] lg:w-[60%] 
                          h-48 md:h-full min-h-[200px] md:min-h-[300px] 
                          rounded-lg overflow-hidden">
            <motion.div
              className="w-full h-full transition-all duration-300"
              style={{ scale: imageScale }}
            >
              <Image 
                fill 
                src={url} 
                alt={title} 
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 55vw, 60vw"
                priority={i < 2} // Priority loading for first 2 images
              />
            </motion.div>
            <BorderBeam size={200} duration={12} delay={9} />
          </div>
        </div>
      </motion.div>
    </div>
  );
};