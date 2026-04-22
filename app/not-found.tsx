import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="relative inline-block">
             <h1 className="text-9xl font-extrabold text-appPrimary opacity-20">404</h1>
             <div className="absolute inset-0 flex items-center justify-center">
                <h2 className="text-2xl font-bold text-white tracking-tight">Halaman Tidak Ditemukan</h2>
             </div>
          </div>
          <p className="text-zinc-400">
            Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
          </p>
        </div>

        <div className="flex justify-center">
          <Link
            href="/"
            className="px-8 py-3 bg-appPrimary text-black rounded-lg font-bold hover:shadow-[0_0_20px_rgba(255,204,0,0.4)] transition-all duration-300"
          >
            Kembali ke Beranda
          </Link>
        </div>
        
        <div className="pt-8 border-t border-zinc-900">
           <p className="text-xs text-zinc-600">
              Butuh bantuan? <Link href="/support" className="text-appPrimary hover:underline">Hubungi Support</Link>
           </p>
        </div>
      </div>
    </div>
  );
}
