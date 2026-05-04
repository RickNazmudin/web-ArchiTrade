"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ROUTES, VALIDATION } from "@/lib/constants";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";

interface LoginFormState {
  email: string;
  password: string;
  showPassword: boolean;
  error: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<LoginFormState>({
    email: "",
    password: "",
    showPassword: false,
    error: "",
  });

  // ─── Handle Email Change ──────────────────────────────────
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      email: e.target.value,
      error: "",
    }));
  };

  // ─── Handle Password Change ───────────────────────────────
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      password: e.target.value,
      error: "",
    }));
  };

  // ─── Validate Form ────────────────────────────────────────
  const validateForm = (): boolean => {
    if (!form.email || !form.password) {
      setForm((prev) => ({
        ...prev,
        error: "Email dan password harus diisi",
      }));
      return false;
    }

    if (!VALIDATION.EMAIL_REGEX.test(form.email)) {
      setForm((prev) => ({
        ...prev,
        error: "Format email tidak valid",
      }));
      return false;
    }

    return true;
  };

  // ─── Handle Login Submit ──────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // ✅ Call server-side API route
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();



      if (!response.ok) {
        const errorMsg = data.error || "Login gagal";
        setForm((prev) => ({
          ...prev,
          error: errorMsg,
        }));
        toast.error(errorMsg);
        return;
      }

      // ✅ Verify profile data exists
      if (!data.profile) {
        setForm((prev) => ({
          ...prev,
          error: "Data profil tidak ditemukan",
        }));
        toast.error("Data profil tidak ditemukan");
        return;
      }

      // ✅ Redirect berdasarkan role
      toast.success("Login berhasil!");
      const targetRoute =
        data.profile.role === "admin"
          ? ROUTES.ADMIN.HOME
          : ROUTES.DASHBOARD.HOME;

      // Add small delay to ensure session is set
      setTimeout(() => {
        router.push(targetRoute);
      }, 100);
    } catch (error: any) {
      const errorMsg = error.message || "Terjadi kesalahan saat login";
      setForm((prev) => ({
        ...prev,
        error: errorMsg,
      }));
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    backgroundColor: "#13131a",
    color: "#ffffff",
    caretColor: "#ffffff",
    borderColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: "0.875rem",
    outline: "none",
    width: "100%",
    paddingTop: "0.875rem",
    paddingBottom: "0.875rem",
    paddingRight: "1rem",
    fontSize: "0.875rem",
    transition: "border-color 0.15s",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ backgroundColor: "#0a0a0f" }}
    >
      {/* Background glow blobs - Hidden on mobile for performance */}
      <div
        className="hidden md:block absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(var(--color-appPrimary-rgb, 34,197,94),0.06) 0%, transparent 70%)",
        }}
      />
      <div
        className="hidden md:block absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)",
        }}
      />

      {/* Grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link
            href={ROUTES.PUBLIC.HOME}
            className="inline-flex items-center gap-2 select-none"
          >
            <span className="text-xl font-bold text-white tracking-tight">
              Archi<span className="text-appPrimary">Trade</span>
            </span>
          </Link>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-7 sm:p-8 backdrop-blur-[12px] md:backdrop-blur-[20px]"
          style={{
            background: "rgba(13,13,20,0.85)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.03), 0 32px 64px rgba(0,0,0,0.5)",
          }}
        >
          {/* Heading */}
          <div className="mb-7">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Masuk ke Akun
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Selamat datang kembali, trader
            </p>
          </div>

          {/* Error Message */}
          {form.error && (
            <div
              className="flex items-start gap-2.5 p-3.5 rounded-xl text-sm text-red-400 mb-5"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.15)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0 mt-1" />
              {form.error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 pointer-events-none" />
                <input
                  type="email"
                  value={form.email}
                  onChange={handleEmailChange}
                  placeholder="email@example.com"
                  required
                  style={{ ...inputStyle, paddingLeft: "2.5rem" }}
                  onFocus={(e) =>
                    (e.target.style.borderColor =
                      "rgba(var(--color-appPrimary-rgb,34,197,94),0.5)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,0.08)")
                  }
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] text-zinc-500 hover:text-appPrimary transition"
                >
                  Lupa password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 pointer-events-none" />
                <input
                  type={form.showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  required
                  style={{
                    ...inputStyle,
                    paddingLeft: "2.5rem",
                    paddingRight: "2.75rem",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor =
                      "rgba(var(--color-appPrimary-rgb,34,197,94),0.5)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,0.08)")
                  }
                />
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      showPassword: !prev.showPassword,
                    }))
                  }
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition"
                  tabIndex={-1}
                >
                  {form.showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full mt-2 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50 active:scale-[0.98] ${
                isLoading
                  ? "bg-white/5 text-white"
                  : "bg-appPrimary hover:bg-appPrimary/90 text-black"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Masuk"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div
              className="flex-1 h-px"
              style={{ background: "rgba(255,255,255,0.05)" }}
            />
            <span className="text-[11px] text-zinc-600">atau</span>
            <div
              className="flex-1 h-px"
              style={{ background: "rgba(255,255,255,0.05)" }}
            />
          </div>

          {/* Register Link */}
          <p className="text-center text-zinc-500 text-sm">
            Belum punya akun?{" "}
            <Link
              href={ROUTES.AUTH.REGISTER}
              className="text-appPrimary hover:text-appPrimary/80 font-semibold transition"
            >
              Daftar sekarang
            </Link>
          </p>
        </div>

        {/* Bottom note */}
        <p className="text-center text-[11px] text-zinc-700 mt-5">
          © 2026 ArchiTrade. Semua hak dilindungi.
        </p>
      </div>
    </div>
  );
}
