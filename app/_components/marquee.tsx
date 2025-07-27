import { cn } from "@/lib/utils";
import Marquee from "../../components/ui/marquee";

const reviews = [
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
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-[300px] min-h-[150px] cursor-pointer overflow-hidden rounded-xl border p-4 flex flex-col", // Set fixed width and minimum height
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm flex-1 overflow-y-auto">
        {body}
      </blockquote>
    </figure>
  );
};

export function MarqueeDemo() {
  return (
    <div className="relative flex h-[400px] bg-transparent border-none w-full flex-col items-center justify-center overflow-hidden rounded-lg border md:shadow-xl">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
    </div>
  );
}
