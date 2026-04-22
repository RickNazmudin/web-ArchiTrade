"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ROUTES, VALIDATION } from "@/lib/constants";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  TrendingUp,
  ChevronRight,
  Loader2,
  ShieldCheck,
} from "lucide-react";

interface RegisterFormState {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phone: string;
  error: string;
}

/* ── password strength indicator ─────────────────────────── */
function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "Min. 8 karakter", pass: password.length >= 8 },
    { label: "Huruf besar (A–Z)", pass: /[A-Z]/.test(password) },
    { label: "Huruf kecil (a–z)", pass: /[a-z]/.test(password) },
    { label: "Angka (0–9)", pass: /[0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.pass).length;
  const barColor =
    score <= 1
      ? "#ef4444"
      : score === 2
        ? "#f59e0b"
        : score === 3
          ? "#3b82f6"
          : "#22c55e";
  const label =
    score <= 1
      ? "Lemah"
      : score === 2
        ? "Cukup"
        : score === 3
          ? "Kuat"
          : "Sangat Kuat";

  if (!password) return null;

  return (
    <div className="mt-2.5 space-y-2">
      {/* bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${(score / 4) * 100}%`, background: barColor }}
          />
        </div>
        <span className="text-[10px] font-semibold" style={{ color: barColor }}>
          {label}
        </span>
      </div>
      {/* checks */}
      <div className="grid grid-cols-2 gap-1">
        {checks.map(({ label, pass }) => (
          <div
            key={label}
            className="flex items-center gap-1.5 text-[10px]"
            style={{ color: pass ? "#22c55e" : "#52525b" }}
          >
            {pass ? (
              <CheckCircle
                className="h-3 w-3 flex-shrink-0"
                style={{ color: "#22c55e" }}
              />
            ) : (
              <XCircle
                className="h-3 w-3 flex-shrink-0"
                style={{ color: "#3f3f46" }}
              />
            )}
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── field wrapper ────────────────────────────────────────── */
function Field({
  label,
  icon: Icon,
  hint,
  children,
}: {
  label: string;
  icon: any;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
        <Icon className="h-3.5 w-3.5 text-zinc-600" />
        {label}
      </label>
      {children}
      {hint && <p className="text-[10px] text-zinc-600">{hint}</p>}
    </div>
  );
}

/* ── main ─────────────────────────────────────────────────── */
export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [step, setStep] = useState<"form" | "success">("form");
  const [form, setForm] = useState<RegisterFormState>({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
    error: "",
  });

  const set =
    (key: keyof RegisterFormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((p) => ({ ...p, [key]: e.target.value, error: "" }));

  const validateForm = (): boolean => {
    if (
      !form.email ||
      !form.password ||
      !form.confirmPassword ||
      !form.fullName
    ) {
      setForm((p) => ({
        ...p,
        error: "Email, password, dan nama harus diisi",
      }));
      return false;
    }
    if (!VALIDATION.EMAIL_REGEX.test(form.email)) {
      setForm((p) => ({ ...p, error: "Format email tidak valid" }));
      return false;
    }
    if (form.password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
      setForm((p) => ({
        ...p,
        error: `Password minimal ${VALIDATION.PASSWORD_MIN_LENGTH} karakter`,
      }));
      return false;
    }
    if (!VALIDATION.PASSWORD_REGEX.test(form.password)) {
      setForm((p) => ({
        ...p,
        error: "Password harus mengandung huruf besar, huruf kecil, dan angka",
      }));
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setForm((p) => ({ ...p, error: "Password tidak cocok" }));
      return false;
    }
    if (form.fullName.trim().length < 3) {
      setForm((p) => ({ ...p, error: "Nama minimal 3 karakter" }));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          confirmPassword: form.confirmPassword,
          fullName: form.fullName,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setForm((p) => ({ ...p, error: data.error || "Registrasi gagal" }));
        toast.error(data.error || "Registrasi gagal");
        return;
      }
      toast.success("Registrasi berhasil!");
      setStep("success");
    } catch (error: any) {
      const msg = error.message || "Terjadi kesalahan";
      setForm((p) => ({ ...p, error: msg }));
      toast.error(msg);
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
    paddingTop: "0.8125rem",
    paddingBottom: "0.8125rem",
    paddingRight: "1rem",
    fontSize: "0.875rem",
    transition: "border-color 0.15s",
  };

  const focusBorder = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.target.style.borderColor =
      "rgba(var(--color-appPrimary-rgb,34,197,94),0.5)");
  const blurBorder = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.target.style.borderColor = "rgba(255,255,255,0.08)");

  /* ── success state ──────────────────────────────────────── */
  if (step === "success") {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4 py-12"
        style={{ backgroundColor: "#0a0a0f" }}
      >
        {/* bg blobs */}
        <div
          className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-40"
          style={{
            background:
              "radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)",
          }}
        />

        <div className="w-full max-w-sm text-center">
          <div
            className="rounded-2xl p-8 mx-auto"
            style={{
              background: "rgba(13,13,20,0.9)",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 0 60px rgba(34,197,94,0.1)",
            }}
          >
            <div
              className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-5"
              style={{ border: "1px solid rgba(34,197,94,0.2)" }}
            >
              <ShieldCheck className="h-8 w-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-extrabold text-white mb-2">
              Akun Dibuat!
            </h2>
            <p className="text-zinc-400 text-sm mb-6">
              Registrasi berhasil. Silakan masuk ke akun Anda.
            </p>
            <Link
              href={ROUTES.AUTH.LOGIN}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-appPrimary hover:bg-appPrimary/90 text-black font-bold text-sm transition"
            >
              Masuk Sekarang <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── form ───────────────────────────────────────────────── */
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden"
      style={{ backgroundColor: "#0a0a0f" }}
    >
      {/* bg blobs */}
      <div
        className="fixed -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none opacity-60"
        style={{
          background:
            "radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 70%)",
        }}
      />
      <div
        className="fixed -bottom-40 -right-40 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none opacity-60"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)",
        }}
      />

      {/* grid texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.018]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative w-full max-w-md">
        {/* logo */}
        <div className="text-center mb-7">
          <Link href="/" className="inline-flex items-center gap-2 select-none">
            <span className="text-xl font-bold text-white tracking-tight">
              Archi<span className="text-appPrimary">Trade</span>
            </span>
          </Link>
        </div>

        {/* card */}
        <div
          className="rounded-2xl p-7 sm:p-8"
          style={{
            background: "rgba(13,13,20,0.88)",
            border: "1px solid rgba(255,255,255,0.07)",
            backdropFilter: "blur(20px)",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.03), 0 32px 64px rgba(0,0,0,0.5)",
          }}
        >
          {/* heading */}
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Buat Akun Baru
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Bergabung dengan komunitas trader ArchiTrade
            </p>
          </div>

          {/* error */}
          {form.error && (
            <div
              className="flex items-start gap-2.5 p-3.5 rounded-xl text-sm text-red-400 mb-5"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.15)",
              }}
            >
              <XCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              {form.error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full name */}
            <Field label="Nama Lengkap" icon={User}>
              <input
                type="text"
                value={form.fullName}
                onChange={set("fullName")}
                placeholder="Nama lengkap Anda"
                required
                style={{ ...inputStyle, paddingLeft: "1rem" }}
                onFocus={focusBorder}
                onBlur={blurBorder}
              />
            </Field>

            {/* Email */}
            <Field label="Email" icon={Mail}>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 pointer-events-none" />
                <input
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="email@example.com"
                  required
                  style={{ ...inputStyle, paddingLeft: "2.5rem" }}
                  onFocus={focusBorder}
                  onBlur={blurBorder}
                />
              </div>
            </Field>

            {/* Phone */}
            <Field
              label="No. WhatsApp"
              icon={Phone}
              hint="Opsional — format: 62xxxxxxxxxx"
            >
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 pointer-events-none" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={set("phone")}
                  placeholder="62xxxxxxxxxx"
                  style={{ ...inputStyle, paddingLeft: "2.5rem" }}
                  onFocus={focusBorder}
                  onBlur={blurBorder}
                />
              </div>
            </Field>

            {/* Password */}
            <Field label="Password" icon={Lock}>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 pointer-events-none" />
                <input
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={set("password")}
                  placeholder="Min. 8 karakter"
                  required
                  style={{
                    ...inputStyle,
                    paddingLeft: "2.5rem",
                    paddingRight: "2.75rem",
                  }}
                  onFocus={focusBorder}
                  onBlur={blurBorder}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition"
                >
                  {showPw ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <PasswordStrength password={form.password} />
            </Field>

            {/* Confirm password */}
            <Field label="Konfirmasi Password" icon={Lock}>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 pointer-events-none" />
                <input
                  type={showCpw ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={set("confirmPassword")}
                  placeholder="Ulangi password"
                  required
                  style={{
                    ...inputStyle,
                    paddingLeft: "2.5rem",
                    paddingRight: "2.75rem",
                    borderColor: form.confirmPassword
                      ? form.confirmPassword === form.password
                        ? "rgba(34,197,94,0.4)"
                        : "rgba(239,68,68,0.4)"
                      : "rgba(255,255,255,0.08)",
                  }}
                  onFocus={focusBorder}
                  onBlur={blurBorder}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowCpw((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition"
                >
                  {showCpw ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
                {/* match indicator */}
                {form.confirmPassword && (
                  <div className="absolute right-10 top-1/2 -translate-y-1/2">
                    {form.confirmPassword === form.password ? (
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-400" />
                    )}
                  </div>
                )}
              </div>
            </Field>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full mt-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50 active:scale-[0.98] ${
                isLoading
                  ? "bg-white/5 text-white"
                  : "bg-appPrimary hover:bg-appPrimary/90 text-black"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Memproses...
                </>
              ) : (
                <>
                  Daftar Sekarang <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* divider */}
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

          <p className="text-center text-zinc-500 text-sm">
            Sudah punya akun?{" "}
            <Link
              href={ROUTES.AUTH.LOGIN}
              className="text-appPrimary hover:text-appPrimary/80 font-semibold transition"
            >
              Login
            </Link>
          </p>
        </div>

        <p className="text-center text-[11px] text-zinc-700 mt-5">
          © 2026 ArchiTrade. Semua hak dilindungi.
        </p>
      </div>
    </div>
  );
}
