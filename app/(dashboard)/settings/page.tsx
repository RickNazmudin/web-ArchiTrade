"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  Save,
  Loader2,
  Shield,
  Key,
  Lock,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
  });

  const [passwordData, setPasswordData] = useState({
    new_password: "",
    confirm_password: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser) {
      router.push("/login");
      return;
    }
    setUser(currentUser);

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", currentUser.id)
      .single();

    if (data) {
      setProfile(data);
      setFormData({
        full_name: data.full_name || "",
        phone: data.phone || "",
      });
    }
    setLoading(false);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: formData.full_name,
        phone: formData.phone,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      toast.error("Gagal menyimpan pengaturan", {
        description: error.message,
      });
    } else {
      toast.success("Profil berhasil diperbarui!");
      loadProfile();

      // Optional: tambah notifikasi
      await supabase.from("notifications").insert({
        user_id: user.id,
        title: "Profil Diperbarui",
        message: "Informasi profil Anda telah berhasil diperbarui.",
        type: "success",
      });
    }
    setSaving(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    setChangingPassword(true);

    if (passwordData.new_password.length < 6) {
      setPasswordError("Password baru minimal 6 karakter");
      setChangingPassword(false);
      return;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordError("Konfirmasi password tidak cocok");
      setChangingPassword(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.new_password,
      });

      if (error) {
        setPasswordError(error.message);
      } else {
        setPasswordSuccess("Password berhasil diubah!");
        setPasswordData({ new_password: "", confirm_password: "" });

        await supabase.from("notifications").insert({
          user_id: user.id,
          title: "Password Diubah",
          message: "Password akun Anda telah berhasil diubah.",
          type: "warning",
        });

        toast.success("Password berhasil diubah!");
      }
    } catch (err: any) {
      setPasswordError(err.message || "Terjadi kesalahan");
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-2 border-appPrimary/15 animate-ping" />
            <div className="absolute inset-2 rounded-full border-2 border-t-appPrimary border-transparent animate-spin" />
            <Shield className="absolute inset-0 m-auto h-5 w-5 text-appPrimary" />
          </div>
          <p className="text-zinc-600 text-[11px] tracking-widest uppercase">
            Memuat pengaturan
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-zinc-500 hover:text-white transition text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <div className="w-px h-5 bg-white/10" />

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-zinc-500/10 flex items-center justify-center">
              <Shield className="h-3.5 w-3.5 text-zinc-400" />
            </div>
            <span className="font-semibold text-sm tracking-tight">
              Pengaturan Akun
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-16">
        {/* PAGE TITLE */}
        <div className="mb-10">
          <p className="text-[11px] text-zinc-400 uppercase tracking-[0.15em] font-semibold mb-2">
            AKUN & KEAMANAN
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Pengaturan Akun
          </h1>
          <p className="text-zinc-500 text-sm mt-1.5">
            Kelola informasi profil dan keamanan akun Anda
          </p>
        </div>

        <div className="space-y-8">
          {/* PROFIL SECTION */}
          <div className="rounded-3xl bg-[#0d0d14] border border-white/5 overflow-hidden">
            <div className="px-6 sm:px-8 py-5 border-b border-white/5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-appPrimary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-appPrimary" />
              </div>
              <div>
                <h2 className="font-semibold">Informasi Profil</h2>
                <p className="text-sm text-zinc-500">Perbarui data diri Anda</p>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <form onSubmit={handleSaveProfile} className="space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-zinc-400 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-zinc-500 mt-1.5">
                    Email tidak dapat diubah
                  </p>
                </div>

                {/* Nama Lengkap */}
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) =>
                        setFormData({ ...formData, full_name: e.target.value })
                      }
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-appPrimary transition"
                      placeholder="Nama lengkap Anda"
                      required
                    />
                  </div>
                </div>

                {/* Nomor Telepon */}
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Nomor Telepon
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-appPrimary transition"
                      placeholder="+62 812-3456-7890"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto px-8 py-3 bg-appPrimary hover:bg-appPrimary/90 text-black font-semibold rounded-2xl transition flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Simpan Perubahan
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* GANTI PASSWORD SECTION */}
          <div className="rounded-3xl bg-[#0d0d14] border border-white/5 overflow-hidden">
            <div className="px-6 sm:px-8 py-5 border-b border-white/5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Key className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <h2 className="font-semibold">Keamanan Akun</h2>
                <p className="text-sm text-zinc-500">Ubah password akun Anda</p>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Password Baru
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={passwordData.new_password}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          new_password: e.target.value,
                        })
                      }
                      className="w-full pl-11 pr-12 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-appPrimary transition"
                      placeholder="Minimal 6 karakter"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Konfirmasi Password Baru
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirm_password}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirm_password: e.target.value,
                        })
                      }
                      className="w-full pl-11 pr-12 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-appPrimary transition"
                      placeholder="Ulangi password baru"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {passwordError && (
                  <div className="flex items-center gap-3 text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-4 rounded-2xl">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    {passwordError}
                  </div>
                )}

                {passwordSuccess && (
                  <div className="flex items-center gap-3 text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl">
                    <CheckCircle className="h-5 w-5 flex-shrink-0" />
                    {passwordSuccess}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={changingPassword}
                  className="w-full sm:w-auto px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold rounded-2xl transition flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {changingPassword ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Key className="h-4 w-4" />
                      Ubah Password
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* INFORMASI AKUN */}
          <div className="rounded-3xl bg-[#0d0d14] border border-white/5 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="font-semibold">Informasi Akun</h2>
                <p className="text-sm text-zinc-500">Detail akun Anda</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">ID Akun</span>
                <span className="font-mono text-white">
                  {user?.id?.slice(0, 8)}...
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Role</span>
                <span className="text-appPrimary">
                  {profile?.role || "Trader"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Email</span>
                <span className="text-white">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Terdaftar Sejak</span>
                <span className="text-white">
                  {new Date(user?.created_at).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
