import Marquee from "@/components/ui/marquee";
import { cn } from "@/lib/utils";
import Image from "next/image";

const reviews = [
  // Testimoni EA ArchiTrade - Fokus ke EA
  {
    name: "Budi Santoso",
    username: "Jakarta • Modal $500",
    body: "EA ArchiTrade luar biasa! 2 bulan profit konsisten 35% per bulan. Setting mudah, free VPS stabil. Sekarang bisa tidur nyenyak tanpa khawatir market.",
    img: "https://avatar.vercel.sh/budi",
    profit: "+35%",
  },
  {
    name: "Emily Chen",
    username: "Singapore • Modal $2.000",
    body: "The EA robot is incredibly accurate. 40% profit in first month with minimal drawdown. The sharing profit system is fair and transparent. Highly recommended!",
    img: "https://avatar.vercel.sh/emily",
    profit: "+40%",
  },
  {
    name: "Alex Johnson",
    username: "Sydney • Modal $5.000",
    body: "I've tried many EAs, but ArchiTrade's robot is different. Consistent 25% monthly profit, great risk management. Support team is very responsive.",
    img: "https://avatar.vercel.sh/alex",
    profit: "+25%",
  },
  // Testimoni EA tambahan
  {
    name: "Rina Marlina",
    username: "Bandung • Modal $300",
    body: "Baru 3 minggu pakai EA, udah profit 18%. Padahal modal kecil. Cocok buat pemula yang mau belajar sambil dapat cuan.",
    img: "https://avatar.vercel.sh/rina",
    profit: "+18%",
  },
  {
    name: "William Hartono",
    username: "Surabaya • Modal $1.500",
    body: "EA-nya pintar banget. Entry dan exit point-nya akurat. Saya sudah stop manual trading, sekarang full EA. Profit lebih konsisten.",
    img: "https://avatar.vercel.sh/william",
    profit: "+32%",
  },
  {
    name: "Diana Kusuma",
    username: "Medan • Modal $10.000",
    body: "Sebagai tier Diamond, sharing profit 15% sangat fair. EA berjalan smooth, support 24/7. Best decision ever!",
    img: "https://avatar.vercel.sh/diana",
    profit: "+28%",
  },
];

const firstRow = reviews.slice(0, Math.ceil(reviews.length / 2));
const secondRow = reviews.slice(Math.ceil(reviews.length / 2));

const ReviewCard = ({
  img,
  name,
  username,
  body,
  profit,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
  profit?: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-80 min-h-[180px] cursor-pointer overflow-hidden rounded-xl border p-4 flex flex-col",
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        "dark:border-appPrimary/20 dark:bg-gray-50/[.08] dark:hover:bg-gray-50/[.12]",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <Image
          className="rounded-full"
          width={36}
          height={36}
          alt=""
          src={img}
        />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
        {profit && (
          <span className="ml-auto text-sm font-bold text-appPrimary">
            {profit}
          </span>
        )}
      </div>
      <blockquote className="mt-2 text-sm flex-1">&quot;{body}&quot;</blockquote>
      <div className="mt-2 pt-2 text-right">
        <span className="text-[10px] text-appPrimary/60">🤖 EA ArchiTrade</span>
      </div>
    </figure>
  );
};

export default function Testimonial() {
  return (
    <div className="relative flex h-[550px] w-full flex-row items-center justify-center overflow-hidden rounded-lg border bg-black md:shadow-xl">
      {/* Gradient overlay atas dan bawah */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black via-black/80 to-transparent z-10"></div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black via-black/80 to-transparent z-10"></div>

      {/* Title */}
      <div className="absolute top-4 left-0 right-0 text-center z-20">
        <h3 className="text-lg font-bold text-appPrimary">
          🤖 Testimoni EA Robot Trading
        </h3>
        <p className="text-xs text-zinc-500">
          Rata-rata profit 20-40% per bulan
        </p>
      </div>

      <Marquee pauseOnHover vertical className="[--duration:30s]">
        {firstRow.map((review, idx) => (
          <ReviewCard key={idx} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover vertical className="[--duration:30s]">
        {secondRow.map((review, idx) => (
          <ReviewCard key={idx} {...review} />
        ))}
      </Marquee>
    </div>
  );
}
