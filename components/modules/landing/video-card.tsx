"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

// Import icons modern dari lucide-react
import {
  Zap,
  ShieldCheck,
  TrendingDown,
  Award,
  ArrowUp,
  Gift,
  Rocket,
  Droplet,
  Settings,
  Globe,
  RefreshCw,
  Wrench,
} from "lucide-react";

export function HeroVideoDialogDemo() {
  // State untuk broker forex
  const [activeBroker, setActiveBroker] = useState<
    "exness" | "fbs" | "icmarket"
  >("exness");

  // State untuk exchange crypto
  const [activeExchange, setActiveExchange] = useState<
    "tokocrypto" | "binance"
  >("tokocrypto");

  // Data broker forex (icon diganti)
  const brokers = {
    exness: {
      name: "Exness",
      description:
        "Kami dengan bangga bermitra dengan Exness, broker teregulasi global yang menawarkan spread ultra rendah, penarikan instan, dan kondisi trading terbaik. Bergabunglah dengan ribuan trader yang telah mempercayakan trading mereka pada Exness.",
      image: "/images/Exness.webp",
      link: "https://one.exnesstrack.org/a/akqqhpvg0c",
      features: [
        {
          icon: <Zap className="w-6 h-6" />,
          title: "Penarikan Instan",
          desc: "Dana cair seketika dengan sistem penarikan tercepat di industri",
        },
        {
          icon: <ShieldCheck className="w-6 h-6" />,
          title: "Broker Teregulasi",
          desc: "Lisensi dari berbagai otoritas finansial terkemuka dunia",
        },
        {
          icon: <TrendingDown className="w-6 h-6" />,
          title: "Spread Terketat",
          desc: "Nikmati spread paling kompetitif di industri",
        },
      ],
      benefits: [
        "Akun demo gratis untuk latihan trading",
        "Bonus selamat datang untuk member baru",
        "Dukungan customer service 24/7",
      ],
    },
    fbs: {
      name: "FBS",
      description:
        "FBS adalah broker forex terkemuka yang telah memenangkan banyak penghargaan internasional. Nikmati leverage tinggi, spread kompetitif, dan berbagai bonus menarik untuk trader semua level.",
      image: "/images/FBS.webp",
      link: "https://fbs.partners?ibl=986748&ibp=17916316",
      features: [
        {
          icon: <Award className="w-6 h-6" />,
          title: "Multi Award Winner",
          desc: "Broker pemenang berbagai penghargaan internasional",
        },
        {
          icon: <ArrowUp className="w-6 h-6" />,
          title: "Leverage Tinggi",
          desc: "Leverage hingga 1:3000 untuk akun tertentu",
        },
        {
          icon: <Gift className="w-6 h-6" />,
          title: "Bonus Berlimpah",
          desc: "Berbagai program bonus untuk trader baru dan existing",
        },
      ],
      benefits: [
        "100% bonus deposit untuk member baru",
        "Program cashback harian",
        "Edukasi trading lengkap dan gratis",
      ],
    },
    icmarket: {
      name: "IC Markets",
      description:
        "IC Markets adalah broker ECN/STP terkemuka yang menawarkan eksekusi ultra-cepat dengan spread terketat. Platform ini cocok untuk trader profesional yang mengutamakan eksekusi cepat, likuiditas dalam, dan kondisi trading transparan.",
      image: "/images/ICMarket.webp",
      link: "https://icmarkets.com/?camp=87533",
      features: [
        {
          icon: <Rocket className="w-6 h-6" />,
          title: "Eksekusi Ultra-Cepat",
          desc: "Eksekusi order dalam milidetik dengan teknologi terdepan",
        },
        {
          icon: <Droplet className="w-6 h-6" />,
          title: "Likuiditas Dalam",
          desc: "Akses ke likuiditas dari bank dan institusi finansial terkemuka",
        },
        {
          icon: <Settings className="w-6 h-6" />,
          title: "Platform Profesional",
          desc: "Dukungan lengkap untuk MT4, MT5, dan cTrader",
        },
      ],
      benefits: [
        "Spread mulai dari 0.0 pips",
        "Trading tanpa penolakan permintaan",
        "Dukungan VPS untuk trading otomatis",
      ],
    },
  };

  // Data exchange crypto (icon diganti)
  const exchanges = {
    tokocrypto: {
      name: "Tokocrypto",
      description:
        "Tokocrypto adalah exchange crypto terbesar dan teregulasi di Indonesia yang merupakan bagian dari Binance Group. Platform ini menawarkan trading crypto dengan fee rendah dan keamanan terbaik.",
      image: "/images/Tokocrypto.webp",
      link: "https://www.tokocrypto.com/account/signup?ref=Q7125TLJ",
      features: [
        {
          icon: <ShieldCheck className="w-6 h-6" />,
          title: "Teregulasi BAPPEBTI",
          desc: "Exchange crypto legal dan teregulasi di Indonesia",
        },
        {
          icon: <TrendingDown className="w-6 h-6" />,
          title: "Fee Rendah",
          desc: "Biaya trading kompetitif dibanding exchange lain",
        },
        {
          icon: <Globe className="w-6 h-6" />,
          title: "Binance Ecosystem",
          desc: "Bagian dari ekosistem Binance terbesar di dunia",
        },
      ],
      benefits: [
        "Deposit/withdraw mudah via bank lokal",
        "Antarmuka dalam Bahasa Indonesia",
        "Dukungan customer service lokal",
      ],
    },
    binance: {
      name: "Binance",
      description:
        "Binance adalah exchange crypto terbesar di dunia dengan volume trading tertinggi. Nikmati berbagai fitur trading canggih termasuk futures, options, dan staking crypto.",
      image: "/images/Binance.webp",
      link: "https://accounts.bmwweb.biz/register?ref=ARCHITRADE",
      features: [
        {
          icon: <Globe className="w-6 h-6" />,
          title: "Global Leader",
          desc: "Exchange crypto nomor 1 di dunia berdasarkan volume",
        },
        {
          icon: <RefreshCw className="w-6 h-6" />,
          title: "Likuiditas Tinggi",
          desc: "Likuiditas terbaik untuk semua pasangan crypto",
        },
        {
          icon: <Wrench className="w-6 h-6" />,
          title: "Fitur Lengkap",
          desc: "Spot, futures, staking, lending, dan banyak lagi",
        },
      ],
      benefits: [
        "Ratusan pasangan trading crypto",
        "Program staking dengan imbal hasil menarik",
        "Keamanan tingkat institusi",
      ],
    },
  };

  const currentBroker = brokers[activeBroker];
  const currentExchange = exchanges[activeExchange];

  // Fungsi warna tetap sama
  const getBrokerColor = (broker: string) => {
    switch (broker) {
      case "exness":
        return "bg-[#ffc933] hover:bg-[#e6b52e]";
      case "fbs":
        return "bg-[#00a651] hover:bg-[#008f46]";
      case "icmarket":
        return "bg-[#00c853] hover:bg-[#00b34a] text-white";
      default:
        return "bg-[#ffc933] hover:bg-[#e6b52e]";
    }
  };

  const getBrokerTextColor = (broker: string) => {
    return "text-white";
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto mt-10 md:mt-20 px-4">
      {/* Bagian Broker Forex */}
      <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold py-5 text-center mb-10 md:mb-20">
        <span className="text-appPrimary">Partner Resmi </span> Broker Forex
        Kami
      </h1>

      <div className="flex flex-col items-center justify-center gap-8 p-4 md:p-8 bg-zinc-950 border border-white/5 rounded-2xl shadow-lg mb-16 md:mb-20">
        {/* Broker Selector */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveBroker("exness")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeBroker === "exness"
                ? "bg-[#ffc933] text-white"
                : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            Exness
          </button>
          <button
            onClick={() => setActiveBroker("fbs")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeBroker === "fbs"
                ? "bg-[#00a651] text-white"
                : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            FBS
          </button>
          <button
            onClick={() => setActiveBroker("icmarket")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeBroker === "icmarket"
                ? "bg-[#00c853] text-white border-2 border-white"
                : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            IC Markets
          </button>
        </div>

        <div className="text-center max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">
            {currentBroker.name} - Broker Rekomendasi Kami
          </h2>
          <p className="text-lg mb-6">{currentBroker.description}</p>

          <Link
            href={currentBroker.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-block px-6 py-3 ${getBrokerColor(
              activeBroker,
            )} ${getBrokerTextColor(
              activeBroker,
            )} font-medium rounded-lg transition-colors`}
          >
            Mulai Trading dengan {currentBroker.name}
          </Link>
        </div>

        <div className="w-full max-w-2xl mx-auto">
          <Image
            src={currentBroker.image}
            alt={`Platform Trading ${currentBroker.name}`}
            width={600}
            height={360}
            className="w-[60%] mx-auto rounded-lg shadow-md"
            sizes="(max-width: 768px) 80vw, 40vw"
            loading="lazy"
          />
          <p className="text-center mt-2 text-sm text-gray-500">
            {activeBroker === "exness" &&
              "Platform trading Exness - Spread ketat dan eksekusi cepat"}
            {activeBroker === "fbs" &&
              "Platform trading FBS - Leverage tinggi dan bonus menarik"}
            {activeBroker === "icmarket" &&
              "Platform trading IC Markets - Eksekusi ultra-cepat untuk trader profesional"}
          </p>
        </div>

        {/* Features dengan Icon Modern */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          {currentBroker.features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-100 dark:bg-gray-700 p-6 rounded-xl flex flex-col items-center md:items-start text-center md:text-left hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="text-appPrimary mb-4">{feature.icon}</div>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center text-gray-600 dark:text-gray-300">
          <p>Daftar sekarang dan dapatkan akses ke:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            {currentBroker.benefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bagian Exchange Crypto */}
      <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold py-5 text-center mb-10 md:mb-20">
        <span className="text-appPrimary">Partner Resmi </span> Exchange Crypto
        Kami
      </h1>

      <div className="flex flex-col items-center justify-center gap-8 p-4 md:p-8 bg-zinc-950 border border-white/5 rounded-2xl shadow-lg">
        {/* Exchange Selector */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveExchange("tokocrypto")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeExchange === "tokocrypto"
                ? "bg-[#4CAF50] text-white"
                : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            Tokocrypto
          </button>
          <button
            onClick={() => setActiveExchange("binance")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeExchange === "binance"
                ? "bg-[#F0B90B] text-gray-900"
                : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            Binance
          </button>
        </div>

        <div className="text-center max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">
            {currentExchange.name} - Exchange Rekomendasi Kami
          </h2>
          <p className="text-lg mb-6">{currentExchange.description}</p>

          <Link
            href={currentExchange.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-block px-6 py-3 ${
              activeExchange === "tokocrypto"
                ? "bg-[#4CAF50] hover:bg-[#45a049]"
                : "bg-[#F0B90B] hover:bg-[#d8a70a] text-gray-900"
            } font-medium rounded-lg transition-colors`}
          >
            Mulai Trading di {currentExchange.name}
          </Link>
        </div>

        <div className="w-full max-w-2xl mx-auto">
          <Image
            src={currentExchange.image}
            alt={`Platform ${currentExchange.name}`}
            width={600}
            height={360}
            className="w-[60%] mx-auto rounded-lg shadow-md"
            sizes="(max-width: 768px) 80vw, 40vw"
            loading="lazy"
          />
          <p className="text-center mt-2 text-sm text-gray-500">
            Platform {currentExchange.name} -{" "}
            {activeExchange === "tokocrypto"
              ? "Exchange crypto teregulasi di Indonesia"
              : "Exchange crypto terbesar di dunia"}
          </p>
        </div>

        {/* Features dengan Icon Modern */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          {currentExchange.features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-100 dark:bg-gray-700 p-6 rounded-xl flex flex-col items-center md:items-start text-center md:text-left hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="text-appPrimary mb-4">{feature.icon}</div>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center text-gray-600 dark:text-gray-300">
          <p>Daftar sekarang dan dapatkan akses ke:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            {currentExchange.benefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
