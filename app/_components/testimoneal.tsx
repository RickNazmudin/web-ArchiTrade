import Marquee from "@/components/ui/marquee";
import { cn } from "@/lib/utils";
// import Marquee from "@/components/magicui/marquee";

const reviews = [
  {
    name: "Budi Santoso",
    username: "Jakarta",
    body: "Dulu saya sering nyangkut di saham, tapi setelah gabung ArchiTrade, pandangan saya tentang trading jadi jauh lebih jelas. Analisisnya tajam, diskusinya seru, dan yang paling penting, ada mentor yang siap bantu. Nggak cuma cuan, tapi ilmunya juga nambah!",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "Emily Chen",
    username: " Singapore",
    body: "ArchiTrade offers a unique blend of global market perspectives and local insights, especially beneficial for anyone looking at Asian markets. Their educational content is top-notch, simplifying complex concepts. A truly collaborative environment.",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    name: "Alex Johnson",
    username: "Sydney, Australia",
    body: "I've joined several trading communities, but ArchiTrade stands out. The market insights are incredibly valuable, and the discussions are always insightful. It’s a great place to learn and grow, regardless of your experience level. Highly recommended!",
    img: "https://avatar.vercel.sh/john",
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
        "relative h-40 w-36 cursor-pointer overflow-hidden rounded-xl border p-4",
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
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

export function Testimonial() {
  return (
    <div className="relative flex h-[500px] w-full flex-row items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
      <Marquee pauseOnHover vertical className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover vertical className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white dark:from-background"></div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white dark:from-background"></div>
    </div>
  );
}
