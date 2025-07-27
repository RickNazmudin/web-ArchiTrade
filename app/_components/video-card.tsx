import Link from "next/link";

export function HeroVideoDialogDemo() {
  return (
    <div className="relative w-[80vw] mx-auto mt-20">
      <h1 className="text-5xl font-bold py-5 text-center mb-20">
        <span className="text-appPrimary">Partner Resmi </span> Broker Kami
      </h1>
      
      <div className="flex flex-col items-center justify-center gap-8 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="text-center max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">Exness - Broker Rekomendasi Kami</h2>
          <p className="text-lg mb-6">
            Kami dengan bangga bermitra dengan Exness, broker teregulasi global yang menawarkan 
            spread ultra rendah, penarikan instan, dan kondisi trading terbaik. 
            Bergabunglah dengan ribuan trader yang telah mempercayakan trading mereka pada Exness.
          </p>
          
          <Link 
            href="https://one.exnesstrack.org/a/akqqhpvg0c" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-[#ffc933] hover:bg-[#4863a0] text-white font-medium rounded-lg transition-colors"
          >
            Mulai Trading dengan Exness
          </Link>
        </div>
        
        <div className="w-full max-w-2xl mx-auto">
          <img 
            src="/Exness.png" 
            alt="Platform Trading Exness"
            className="w-[60%] mx-auto rounded-lg shadow-md"
          />
          <p className="text-center mt-2 text-sm text-gray-500">
            Platform trading Exness - Spread ketat dan eksekusi cepat
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2">⚡ Penarikan Instan</h3>
            <p>Dana cair seketika dengan sistem penarikan tercepat di industri</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2">🔒 Broker Teregulasi</h3>
            <p>Lisensi dari berbagai otoritas finansial terkemuka dunia</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2">💱 Spread Terketat</h3>
            <p>Nikmati spread paling kompetitif di industri</p>
          </div>
        </div>

        <div className="mt-4 text-center text-gray-600 dark:text-gray-300">
          <p>Daftar sekarang dan dapatkan akses ke:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Akun demo gratis untuk latihan trading</li>
            <li>Bonus selamat datang untuk member baru</li>
            <li>Dukungan customer service 24/7</li>
          </ul>
        </div>
      </div>
    </div>
  );
}