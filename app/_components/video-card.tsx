'use client';

import Link from "next/link";
import { useState } from "react";

export function HeroVideoDialogDemo() {
  // State untuk broker forex
  const [activeBroker, setActiveBroker] = useState<"exness" | "fbs">("exness");
  
  // State untuk exchange crypto
  const [activeExchange, setActiveExchange] = useState<"tokocrypto" | "binance">("tokocrypto");

  // Data broker forex
  const brokers = {
    exness: {
      name: "Exness",
      description: "Kami dengan bangga bermitra dengan Exness, broker teregulasi global yang menawarkan spread ultra rendah, penarikan instan, dan kondisi trading terbaik. Bergabunglah dengan ribuan trader yang telah mempercayakan trading mereka pada Exness.",
      image: "/Exness.png",
      link: "https://one.exnesstrack.org/a/akqqhpvg0c",
      features: [
        { icon: "⚡", title: "Penarikan Instan", desc: "Dana cair seketika dengan sistem penarikan tercepat di industri" },
        { icon: "🔒", title: "Broker Teregulasi", desc: "Lisensi dari berbagai otoritas finansial terkemuka dunia" },
        { icon: "💱", title: "Spread Terketat", desc: "Nikmati spread paling kompetitif di industri" }
      ],
      benefits: [
        "Akun demo gratis untuk latihan trading",
        "Bonus selamat datang untuk member baru",
        "Dukungan customer service 24/7"
      ]
    },
    fbs: {
      name: "FBS",
      description: "FBS adalah broker forex terkemuka yang telah memenangkan banyak penghargaan internasional. Nikmati leverage tinggi, spread kompetitif, dan berbagai bonus menarik untuk trader semua level.",
      image: "/FBS.png",
      link: "https://fbs.partners?ibl=986748&ibp=17916316",
      features: [
        { icon: "🏆", title: "Multi Award Winner", desc: "Broker pemenang berbagai penghargaan internasional" },
        { icon: "📈", title: "Leverage Tinggi", desc: "Leverage hingga 1:3000 untuk akun tertentu" },
        { icon: "🎁", title: "Bonus Berlimpah", desc: "Berbagai program bonus untuk trader baru dan existing" }
      ],
      benefits: [
        "100% bonus deposit untuk member baru",
        "Program cashback harian",
        "Edukasi trading lengkap dan gratis"
      ]
    }
  };

  // Data exchange crypto
  const exchanges = {
    tokocrypto: {
      name: "Tokocrypto",
      description: "Tokocrypto adalah exchange crypto terbesar dan teregulasi di Indonesia yang merupakan bagian dari Binance Group. Platform ini menawarkan trading crypto dengan fee rendah dan keamanan terbaik.",
      image: "/Tokocrypto.png", // Pastikan file ini ada di public folder
      link: "https://www.tokocrypto.com/account/signup?ref=Q7125TLJ",
      features: [
        { icon: "🛡️", title: "Teregulasi BAPPEBTI", desc: "Exchange crypto legal dan teregulasi di Indonesia" },
        { icon: "💲", title: "Fee Rendah", desc: "Biaya trading kompetitif dibanding exchange lain" },
        { icon: "🔗", title: "Binance Ecosystem", desc: "Bagian dari ekosistem Binance terbesar di dunia" }
      ],
      benefits: [
        "Deposit/withdraw mudah via bank lokal",
        "Antarmuka dalam Bahasa Indonesia",
        "Dukungan customer service lokal"
      ]
    },
    binance: {
      name: "Binance",
      description: "Binance adalah exchange crypto terbesar di dunia dengan volume trading tertinggi. Nikmati berbagai fitur trading canggih termasuk futures, options, dan staking crypto.",
      image: "/Binance.png", // Pastikan file ini ada di public folder
      link: "https://accounts.bmwweb.biz/register?ref=ARCHITRADE",
      features: [
        { icon: "🌎", title: "Global Leader", desc: "Exchange crypto nomor 1 di dunia berdasarkan volume" },
        { icon: "🔄", title: "Likuiditas Tinggi", desc: "Likuiditas terbaik untuk semua pasangan crypto" },
        { icon: "🛠️", title: "Fitur Lengkap", desc: "Spot, futures, staking, lending, dan banyak lagi" }
      ],
      benefits: [
        "Ratusan pasangan trading crypto",
        "Program staking dengan imbal hasil menarik",
        "Keamanan tingkat institusi"
      ]
    }
  };

  const currentBroker = brokers[activeBroker];
  const currentExchange = exchanges[activeExchange];

  return (
    <div className="relative w-[80vw] mx-auto mt-20">
      {/* Bagian Broker Forex */}
      <h1 className="text-5xl font-bold py-5 text-center mb-20">
        <span className="text-appPrimary">Partner Resmi </span> Broker Forex Kami
      </h1>
      
      <div className="flex flex-col items-center justify-center gap-8 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-20">
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
        </div>
        
        <div className="text-center max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">{currentBroker.name} - Broker Rekomendasi Kami</h2>
          <p className="text-lg mb-6">{currentBroker.description}</p>
          
          <Link 
            href={currentBroker.link} 
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-block px-6 py-3 ${
              activeBroker === "exness" ? "bg-[#ffc933] hover:bg-[#4863a0]" : "bg-[#00a651] hover:bg-[#007e3a]"
            } text-white font-medium rounded-lg transition-colors`}
          >
            Mulai Trading dengan {currentBroker.name}
          </Link>
        </div>
        
        <div className="w-full max-w-2xl mx-auto">
          <img 
            src={currentBroker.image} 
            alt={`Platform Trading ${currentBroker.name}`}
            className="w-[60%] mx-auto rounded-lg shadow-md"
          />
          <p className="text-center mt-2 text-sm text-gray-500">
            Platform trading {currentBroker.name} - {activeBroker === "exness" ? "Spread ketat dan eksekusi cepat" : "Leverage tinggi dan bonus menarik"}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          {currentBroker.features.map((feature, index) => (
            <div key={index} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">{feature.icon} {feature.title}</h3>
              <p>{feature.desc}</p>
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
      <h1 className="text-5xl font-bold py-5 text-center mb-20">
        <span className="text-appPrimary">Partner Resmi </span> Exchange Crypto Kami
      </h1>
      
      <div className="flex flex-col items-center justify-center gap-8 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
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
          <h2 className="text-3xl font-bold mb-4">{currentExchange.name} - Exchange Rekomendasi Kami</h2>
          <p className="text-lg mb-6">{currentExchange.description}</p>
          
          <Link 
            href={currentExchange.link} 
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-block px-6 py-3 ${
              activeExchange === "tokocrypto" ? "bg-[#4CAF50] hover:bg-[#007bff]" : "bg-[#F0B90B] hover:bg-[#D4A10E] text-gray-900"
            } font-medium rounded-lg transition-colors`}
          >
            Mulai Trading di {currentExchange.name}
          </Link>
        </div>
        
        <div className="w-full max-w-2xl mx-auto">
          <img 
            src={currentExchange.image} 
            alt={`Platform ${currentExchange.name}`}
            className="w-[60%] mx-auto rounded-lg shadow-md"
          />
          <p className="text-center mt-2 text-sm text-gray-500">
            Platform {currentExchange.name} - {activeExchange === "tokocrypto" ? "Exchange crypto teregulasi di Indonesia" : "Exchange crypto terbesar di dunia"}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          {currentExchange.features.map((feature, index) => (
            <div key={index} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">{feature.icon} {feature.title}</h3>
              <p>{feature.desc}</p>
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