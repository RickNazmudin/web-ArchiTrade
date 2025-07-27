import TextReveal from "../../components/ui/text-reveal";

export function TextRevealDemo() {
  return (
    <div className="z-10 flex min-h-64 items-center text-right rounded-lg border-y border border-white/5 bg-white dark:bg-black">
      <TextReveal
        text="Tingkatkan Skill Trading Anda Bersama ArchiTrade. Mulai Sekarang!"
        className=" text-7xl font-bold w-full text-start md:text-7xl lg:text-7xl"
      />
    </div>
  );
}
