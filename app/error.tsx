"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("[Global Error]:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tighter">
            Oops! Terjadi Kesalahan
          </h1>
          <p className="text-zinc-400">
            Kami mohon maaf, sepertinya terjadi masalah teknis. Tim kami sedang menanganinya.
          </p>
        </div>

        <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg text-left">
          <p className="text-xs font-mono text-appPrimary break-all">
            Error ID: {error.digest || "unknown"}
          </p>
          <p className="text-xs text-zinc-500 mt-2">
            Pesan: {error.message || "Internal Server Error"}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-2 bg-appPrimary text-black rounded-lg font-semibold hover:bg-appPrimary/90 transition"
          >
            Coba Lagi
          </button>
          <Link
            href="/"
            className="px-6 py-2 bg-zinc-800 text-white rounded-lg font-semibold hover:bg-zinc-700 transition"
          >
            Kembali ke Home
          </Link>
        </div>
      </div>
    </div>
  );
}
