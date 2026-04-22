import { cn } from "@/lib/utils";
import Marquee from "@/components/ui/marquee";
import Image from "next/image";

const reviews = [
  // Testimoni EA ArchiTrade - Tambahan baru
  {
    name: "Rudi Hartono",
    username: "Jakarta",
    body: "EA Robot ArchiTrade benar-benar mengubah hidup saya! Profit 30% per bulan konsisten tanpa perlu monitor 24 jam. Free VPS-nya juga stabil. Best investment ever!",
    img: "https://avatar.vercel.sh/rudi",
    product: "EA Robot Trading",
  },
  {
    name: "Sandra Dewi",
    username: "Bandung",
    body: "Modal cuma $200, sekarang udah jadi $450 dalam 2 bulan. EA-nya pintar membaca market, entry point akurat. Rekomendasi buat yang mau passive income dari forex!",
    img: "https://avatar.vercel.sh/sandra",
    product: "EA Robot Trading",
  },
  {
    name: "Michael Wijaya",
    username: "Surabaya",
    body: "Saya sudah pakai EA ini 3 bulan. Profit rata-rata 25% per bulan. Sharing profit-nya fair dan transparan. Tim ArchiTrade juga fast response kalau ada kendala.",
    img: "https://avatar.vercel.sh/michael",
    product: "EA Robot Trading",
  },
  {
    name: "Putri Amelia",
    username: "Medan",
    body: "Awalnya ragu, tapi setelah lihat hasilnya... Wow! EA ini bekerja dengan baik. Drawdown kecil, profit konsisten. Sekarang saya fokus kerja sambil EA yang trading.",
    img: "https://avatar.vercel.sh/putri",
    product: "EA Robot Trading",
  },
  {
    name: "Budi Santoso",
    username: "Jakarta",
    body: "Dulu saya sering nyangkut di saham, tapi setelah gabung ArchiTrade, pandangan saya tentang trading jadi jauh lebih jelas. Analisisnya tajam, diskusinya seru, dan yang paling penting, ada mentor yang siap bantu. Nggak cuma cuan, tapi ilmunya juga nambah!",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "Siti Nurjanah",
    username: "Surabaya",
    body: "ArchiTrade ini komunitas yang beda. Bukan cuma sinyal, tapi mereka benar-benar edukasi kita cara berpikir seperti trader profesional. Sekarang saya jadi lebih disiplin dan strategi trading saya makin matang. Terima kasih ArchiTrade!",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    name: "Asep Maulana",
    username: "Bandung",
    body: "Sebagai pemula, awalnya saya bingung mau mulai dari mana. Untungnya ketemu ArchiTrade. Materi edukasinya mudah dicerna, dan teman-teman di komunitas sangat suportif. Saya jadi lebih percaya diri buat trading.",
    img: "https://avatar.vercel.sh/john",
  },
  {
    name: "Linda Wijaya",
    username: "Medan",
    body: "Salut buat ArchiTrade! Riset pasarnya mendalam banget, seringkali prediksi mereka akurat. Ini sangat membantu saya dalam mengambil keputusan investasi, terutama di pasar yang volatil. Komunitasnya juga aktif dan solid.",
    img: "https://avatar.vercel.sh/jane",
  },
  {
    name: "Rio Pratama",
    username: "Yogyakarta",
    body: "Saya sudah di beberapa grup trading, tapi ArchiTrade paling komprehensif. Mulai dari fundamental, teknikal, sampai psikologi trading, semuanya dibahas tuntas. Sangat direkomendasikan untuk siapa pun yang serius di dunia trading.",
    img: "https://avatar.vercel.sh/jenny",
  },
  {
    name: "Nia Ramadhani",
    username: "Makassar",
    body: "Berkat ArchiTrade, saya jadi ngerti pentingnya manajemen risiko. Dulu sering all-in, sekarang lebih hati-hati dan hasilnya pun lebih konsisten. Benar-benar mengubah kebiasaan buruk saya.",
    img: "https://avatar.vercel.sh/james",
  },
  {
    name: "Kevin Chandra",
    username: "Semarang",
    body: "Tim di balik ArchiTrade sangat responsif dan informatif. Setiap pertanyaan saya selalu dijawab dengan sabar dan detail. Ini menunjukkan mereka peduli sama anggota-anggotanya. Jempol!",
    img: "https://avatar.vercel.sh/james",
  },
  {
    name: "Clara Devi",
    username: "Denpasar",
    body: "Dunia crypto itu cepat banget perubahannya, tapi ArchiTrade selalu sigap memberikan update dan analisis yang relevan. Sangat membantu saya untuk tetap up-to-date dan membuat keputusan yang tepat.",
    img: "https://avatar.vercel.sh/james",
  },
  {
    name: "Alex Johnson",
    username: "Sydney, Australia",
    body: "I've joined several trading communities, but ArchiTrade stands out. The market insights are incredibly valuable, and the discussions are always insightful. It’s a great place to learn and grow, regardless of your experience level. Highly recommended!",
    img: "https://avatar.vercel.sh/james",
  },
  {
    name: "Emily Chen",
    username: "Singapore",
    body: "ArchiTrade offers a unique blend of global market perspectives and local insights, especially beneficial for anyone looking at Asian markets. Their educational content is top-notch, simplifying complex concepts. A truly collaborative environment.",
    img: "https://avatar.vercel.sh/james",
  },
  {
    name: "David Lee",
    username: "Kuala Lumpur, Malaysia",
    body: "The community support in ArchiTrade is exceptional. I appreciate the diverse range of strategies shared and the constructive feedback from fellow traders. It has definitely sharpened my analytical skills.",
    img: "https://avatar.vercel.sh/james",
  },
  // Testimoni EA tambahan
  {
    name: "Fajar Nugroho",
    username: "Semarang",
    body: "EA ArchiTrade mantap! Saya pakai modal $500, profit bersih setelah sharing profit 20-30% per bulan. Setting-nya mudah, tinggal jalanin. Free VPS-nya juga bantu banget.",
    img: "https://avatar.vercel.sh/fajar",
    product: "EA Robot Trading",
  },
  {
    name: "Jessica Tan",
    username: "Medan",
    body: "Setelah coba berbagai EA, ini yang paling konsisten. Backtesting-nya bagus, live trading juga sesuai ekspektasi. Tim support selalu siap bantu 24/7. Highly recommended!",
    img: "https://avatar.vercel.sh/jessica",
    product: "EA Robot Trading",
  },
];

const firstRow = reviews.slice(0, Math.ceil(reviews.length / 2));
const secondRow = reviews.slice(Math.ceil(reviews.length / 2));

const ReviewCard = ({
  img,
  name,
  username,
  body,
  product,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
  product?: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-[320px] min-h-[160px] cursor-pointer overflow-hidden rounded-xl border p-4 flex flex-col",
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
        product === "EA Robot Trading" &&
          "dark:border-appPrimary/30 dark:bg-appPrimary/5",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <Image
          className="rounded-full"
          width={32}
          height={32}
          alt=""
          src={img}
        />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
        {product === "EA Robot Trading" && (
          <span className="ml-auto text-[10px] bg-appPrimary/20 text-appPrimary px-2 py-0.5 rounded-full">
            🤖 EA
          </span>
        )}
      </div>
      <blockquote className="mt-2 text-sm flex-1 overflow-y-auto">
        {body}
      </blockquote>
    </figure>
  );
};

export function MarqueeDemo() {
  return (
    <div className="relative flex h-[450px] bg-transparent border-none w-full flex-col items-center justify-center overflow-hidden rounded-lg border md:shadow-xl">
      <Marquee pauseOnHover className="[--duration:25s]">
        {firstRow.map((review, idx) => (
          <ReviewCard key={idx} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:25s]">
        {secondRow.map((review, idx) => (
          <ReviewCard key={idx} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black via-black/50 to-transparent"></div>
    </div>
  );
}
