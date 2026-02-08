"use client";
import { motion, useInView } from "framer-motion";
import { FormEvent, useRef, useState } from "react";

const Footer = () => {
  const container = useRef<HTMLDivElement>(null);
  // const [Send, cilentData] = useNewsLetter()
  const [openPopup, setOpenPopUp] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref);

  // no-op: removed debug logging to avoid noisy console output

  const variants = {
    visible: (i: number) => ({
      translateY: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        duration: 0.4,
        delay: i * 0.03,
      },
    }),

    hidden: { translateY: 200 },
  };
  const handleNewsLetterData = (e: FormEvent) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const formData = new FormData(target);

    // use the input name to read the email
    const clientEmail = formData.get("newsletter_email")?.toString() || "";
    // const data: ClientData = {
    //   email: clientEmail.toString(),
    // }

    // Send(data)
    setOpenPopUp(true);
    target.reset();
    setTimeout(() => {
      setOpenPopUp(false);
    }, 2000);
  };

  return (
    <>
      <div
        className="relative h-full bg-transparent text-white"
        ref={container}
      >
        <div className="sm:container  px-4 mx-auto">
          <div className="md:flex justify-between w-full">
            <div>
              <h1 className="md:text-4xl text-2xl font-semibold">
                Let&lsquo;s do great{" "}
                <span className=" text-appPrimary">work together</span>
              </h1>
              <div className="pt-2 pb-6 md:w-99  ">
                <p className="md:text-2xl text-xl  py-4">
                  Kirimkan Email kepada kami dan mari kita ngobrol tentang
                  Rencana Trading Anda
                </p>
                <div className="relative w-full max-w-xl">
                  <form
                    onSubmit={(e) => handleNewsLetterData(e)}
                    className="flex w-full rounded-lg overflow-hidden border border-white/10 bg-black/30 backdrop-blur-sm"
                  >
                    <input
                      type="email"
                      name="newsletter_email"
                      className="flex-1 bg-transparent text-white placeholder:text-white/60 px-4 py-3 focus:outline-none"
                      placeholder="Your Email *"
                      required
                    />
                    <button
                      type="submit"
                      className="bg-appPrimary px-4 py-2 text-black font-semibold hover:brightness-95 transition"
                    >
                      Kirim
                    </button>
                  </form>
                </div>
              </div>
            </div>
            <div className="flex gap-10">
              <ul>
                <li className="text-2xl pb-2 text-black font-semibold">
                  SOCIAL
                </li>
                <li className="text-xl font-medium">
                  <a
                    href="https://www.youtube.com/@ArchiTrade99"
                    target="_blank"
                    className=" hover:text-appPrimary hover:underline hover:scale-110 transition-all"
                  >
                    Youtube
                  </a>
                </li>
                <li className="text-xl font-medium">
                  <a
                    href="https://www.tiktok.com/@architrade99"
                    target="_blank"
                    className=" hover:text-appPrimary hover:underline hover:scale-110 transition-all"
                  >
                    Tiktok
                  </a>
                </li>
                <li className="text-xl font-medium">
                  <a
                    href="https://www.instagram.com/architrade99/"
                    target="_blank"
                    className=" hover:text-appPrimary hover:underline hover:scale-110 transition-all"
                  >
                    Instagram
                  </a>
                </li>
                <li className="text-xl font-medium">
                  <a
                    href="https://t.me/+s22nBUElvnw0Y2Y1"
                    target="_blank"
                    className=" hover:text-appPrimary hover:underline hover:scale-110 transition-all"
                  >
                    Telegram
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-y-2 md:py-4 border-white/90">
            <motion.svg
              width="776"
              ref={ref}
              height="137"
              viewBox="0 0 776 137"
              fill="none"
              className="sm:h-fit h-20 md:px-8 px-2 footer-logo w-full"
              xmlns="http://www.w3.org/2000/svg"
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <motion.text
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                fill="#4863A0"
                fontSize="48"
                fontFamily="Arial, sans-serif"
                variants={variants}
                className="text-appPrimary font-extrabold text-[100px]"
              >
                ArchiTrade
              </motion.text>
            </motion.svg>
          </div>

          <div className="flex md:flex-row flex-col-reverse gap-3 justify-between py-2">
            <span className="font-medium">
              &copy; 2025 ArchiTrade. All Rights Reserved.
            </span>
            {/* <a href="#" className="font-semibold">
              Privacy Policy
            </a> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
