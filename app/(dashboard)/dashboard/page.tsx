"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";
import { Instagram, Music2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  LogOut,
  Loader2,
  TrendingUp,
  Wallet,
  Crown,
  Receipt,
  Bell,
  Settings,
  HelpCircle,
  Edit2,
  Plus,
  CheckCircle,
  User,
  BookOpen,
  Users,
  Video,
  MessageCircle,
  Gift,
  Star,
  Zap,
  Shield,
  Award,
  Download,
  ExternalLink,
  Clock,
  BarChart3,
  Target,
  Sparkles,
  Calendar,
  Brain,
  Building2,
  LineChart,
  Newspaper,
  Menu,
  X,
  LayoutDashboard,
  ChevronRight,
  Activity,
  AlertCircle,
  Server,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const queryClient = useQueryClient();

  const { data: userData } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return null;
      }
      return user;
    }
  });

  const { data: profileData } = useQuery({
    queryKey: ["profile", userData?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userData!.id)
        .single();
      return data;
    },
    enabled: !!userData?.id
  });

  const { data: mt5Data } = useQuery({
    queryKey: ["mt5Accounts"],
    queryFn: async () => {
      const mt5Res = await fetch("/api/mt5/list");
      const data = await mt5Res.json();
      return Array.isArray(data) ? data : [];
    }
  });

  const { data: subsMapData } = useQuery({
    queryKey: ["subscriptions", userData?.id],
    queryFn: async () => {
      const { data: subsData, error: subError } = await supabase
        .from("subscriptions")
        .select("*, subscription_plans!fk_subscriptions_plans(*)")
        .eq("user_id", userData!.id)
        .in("status", ["active", "suspended", "pending"]);

      const subsMap: Record<string, any> = {};
      
      if (subError) {
        const { data: fallbackSubs } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", userData!.id)
          .in("status", ["active", "suspended", "pending"]);

        if (fallbackSubs && fallbackSubs.length > 0) {
          for (const sub of fallbackSubs) {
            const { data: planData } = await supabase
              .from("subscription_plans")
              .select("*")
              .eq("id", sub.plan_id)
              .single();
            
            if (sub.mt5_account_id) {
              subsMap[sub.mt5_account_id] = { ...sub, subscription_plans: planData };
            }
          }
        }
      } else if (subsData) {
        subsData.forEach(sub => {
          if (sub.mt5_account_id) {
            subsMap[sub.mt5_account_id] = sub;
          }
        });
      }
      return subsMap;
    },
    enabled: !!userData?.id
  });

  const { data: notifData } = useQuery({
    queryKey: ["unreadNotifs", userData?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userData!.id)
        .eq("is_read", false)
        .order("created_at", { ascending: false })
        .limit(5);
      return data || [];
    },
    enabled: !!userData?.id
  });

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [mt5Accounts, setMt5Accounts] = useState<any[]>([]);
  const [activeSubscriptions, setActiveSubscriptions] = useState<Record<string, any>>({});
  const [showMt5Form, setShowMt5Form] = useState(false);
  const [editingMt5Id, setEditingMt5Id] = useState<string | null>(null);
  const [mt5FormData, setMt5FormData] = useState({
    mt5_id: "",
    mt5_password: "",
    mt5_server: "",
  });
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isDeletingMt5, setIsDeletingMt5] = useState(false);
  const [cancellingSubscription, setCancellingSubscription] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [unreadNotifs, setUnreadNotifs] = useState<any[]>([]);

  const eaTiers = [
    {
      name: "SILVER",
      minDeposit: "$100 – $4,000",
      minDepositNumeric: 100,
      maxDepositNumeric: 4000,
      profitShare: "30%",
      price: "Rp500.000",
      priceNumeric: 500000,
      recommendedBroker: "Exness",
      features: [
        "EA Robot Basic",
        "Signal Copy Trading",
        "Support 24/7 via Telegram",
        "Update EA 1x/bulan",
        "Akses Group Telegram",
      ],
      gradient: "from-slate-400 via-slate-500 to-slate-600",
      accent: "#94a3b8",
      glow: "shadow-slate-500/20",
    },
    {
      name: "GOLD",
      minDeposit: "$5,000 – $9,000",
      minDepositNumeric: 5000,
      maxDepositNumeric: 9000,
      profitShare: "20%",
      price: "Rp1.500.000",
      priceNumeric: 1500000,
      recommendedBroker: "FBS",
      features: [
        "EA Robot Pro",
        "Signal Copy Trading",
        "Support Prioritas 24/7",
        "Update EA 1x/bulan",
        "Analisis Market Harian",
        "Webinar Eksklusif",
        "Akses Group Premium",
      ],
      gradient: "from-amber-400 via-yellow-500 to-orange-400",
      accent: "#f59e0b",
      glow: "shadow-amber-500/30",
      recommended: true,
    },
    {
      name: "DIAMOND",
      minDeposit: "$10,000+",
      minDepositNumeric: 10000,
      maxDepositNumeric: null,
      profitShare: "15%",
      price: "Rp2.500.000",
      priceNumeric: 2500000,
      recommendedBroker: "IC Markets",
      features: [
        "EA Robot Ultimate",
        "Signal Copy Trading",
        "Dedicated Account Manager",
        "Update EA Real-time",
        "Analisis Market Real-time",
        "Access ke Private Group VIP",
        "Withdraw Prioritas",
      ],
      gradient: "from-cyan-400 via-sky-500 to-blue-600",
      accent: "#06b6d4",
      glow: "shadow-cyan-500/30",
    },
  ];

  const brokers = [
    {
      name: "Exness",
      minDeposit: "$100 – $4,000",
      description:
        "Regulasi internasional, spread rendah, deposit kecil, penarikan instan",
      image: "/images/Exness.webp",
      link: "https://one.exnesstrack.org/a/akqqhpvg0c",
      btnBg: "bg-[#ffc933]",
      btnText: "text-black",
      badge: "⭐ REKOMENDASI PEMULA",
      features: ["Penarikan Instan", "Spread Terketat", "Broker Teregulasi"],
    },
    {
      name: "FBS",
      minDeposit: "$5,000 – $9,000",
      description:
        "Bonus deposit hingga 100%, leverage 1:3000, multi award winner",
      image: "/images/FBS.webp",
      link: "https://fbs.partners?ibl=986748&ibp=17916316",
      btnBg: "bg-[#00a651]",
      btnText: "text-white",
      features: ["Leverage Tinggi", "Bonus Berlimpah", "Multi Award Winner"],
    },
    {
      name: "IC Markets",
      minDeposit: "$10,000+",
      description:
        "ECN broker, spread terendah, eksekusi cepat untuk trader profesional",
      image: "/images/ICMarket.webp",
      link: "https://icmarkets.com/?camp=87533",
      btnBg: "bg-[#00c853]",
      btnText: "text-white",
      features: [
        "Eksekusi Ultra-cepat",
        "Likuiditas Dalam",
        "Platform Profesional",
      ],
    },
  ];

  const ebooks = [
    {
      title: "Panduan Trading Forex Pemula",
      description: "Belajar dasar-dasar trading forex dari nol",
      icon: BookOpen,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      title: "Strategi Scalping Profit Konsisten",
      description: "Teknik scalping dengan risk management",
      icon: Target,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Psikologi Trading Profesional",
      description: "Kontrol emosi dan mindset trader sukses",
      icon: Brain,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
    {
      title: "Manajemen Risiko & Money Management",
      description: "Atur risiko dan modal trading Anda",
      icon: Shield,
      color: "text-rose-400",
      bg: "bg-rose-500/10",
    },
  ];
    const videoTutorials = [
    {
      title: "Daftar Broker Legal",
      duration: "2 menit",
      icon: Video,
      link: "https://www.youtube.com/shorts/iCzNrL263mw",
    },
    {
      title: "Cara Menikmati Layanan CopyTrade",
      duration: "2 menit",
      icon: BarChart3,
      link: "https://www.youtube.com/shorts/gtNY0YB6Goc",
    },
    {
      title: "Optimasi Parameter EA",
      duration: "25 menit",
      icon: Settings,
      link: "https://www.youtube.com/@ArchiTrade99",
    },
  ];

  const communityLinks = [
    {
      name: "Telegram Group",
      icon: MessageCircle,
      link: "https://t.me/+s22nBUElvnw0Y2Y1",
      bg: "bg-sky-500/10",
      color: "text-sky-400",
    },
    {
      name: "YouTube Channel",
      icon: Video,
      link: "https://www.youtube.com/@ArchiTrade99",
      bg: "bg-red-500/10",
      color: "text-red-400",
    },
    {
      name: "Instagram",
      icon: Instagram,
      link: "https://www.instagram.com/architrade99/",
      bg: "bg-pink-500/10",
      color: "text-pink-400",
    },
    {
      name: "TikTok",
      icon: Music2,
      link: "https://www.tiktok.com/@architrade99",
      bg: "bg-zinc-700/50",
      color: "text-white",
    },
  ];

  const upcomingWebinars = [
    {
      title: "Strategi Profit di Market Volatil",
      date: "Sabtu, 25 Februari 2026",
      time: "19:00 – 21:00 WIB",
      speaker: "Master Trader Ardi",
      topic: "Teknik trading saat market high volatility",
      tag: "Strategi",
    },
    {
      title: "Live Trading dengan EA Robot",
      date: "Minggu, 28 Maret 2026",
      time: "20:00 – 22:00 WIB",
      speaker: "Tim EA ArchiTrade",
      topic: "Praktik langsung menggunakan EA Robot di akun real",
      tag: "Live",
    },
    {
      title: "Psikologi Trading & Manajemen Risiko",
      date: "Sabtu, 2 April 2026",
      time: "10:00 – 12:00 WIB",
      speaker: "Psikolog Trader",
      topic: "Mengelola emosi dan risiko dalam trading",
      tag: "Mindset",
    },
  ];

  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      id: "dashboard",
    },
    {
      name: "Daily Outlook",
      href: "/daily-outlook",
      icon: Newspaper,
      id: "outlook",
    },
    {
      name: "Langganan",
      href: "/subscription",
      icon: Crown,
      id: "subscription",
    },
    { name: "Tagihan", href: "/invoices", icon: Receipt, id: "invoices" },
    {
      name: "Notifikasi",
      href: "/notifications",
      icon: Bell,
      id: "notifications",
    },
    { name: "Pengaturan", href: "/settings", icon: Settings, id: "settings" },
    { name: "Bantuan", href: "/support", icon: HelpCircle, id: "support" },
  ];

  useEffect(() => {
    if (userData) setUser(userData);
    if (profileData) setProfile(profileData);
    if (mt5Data) setMt5Accounts(mt5Data);
    if (subsMapData) setActiveSubscriptions(subsMapData);
    if (notifData) setUnreadNotifs(notifData);
    
    if (userData && profileData && mt5Data && subsMapData && notifData) {
      setLoading(false);
    }
  }, [userData, profileData, mt5Data, subsMapData, notifData]);

  const loadData = async () => {
    queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    queryClient.invalidateQueries({ queryKey: ["profile"] });
    queryClient.invalidateQueries({ queryKey: ["mt5Accounts"] });
    queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    queryClient.invalidateQueries({ queryKey: ["unreadNotifs"] });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    toast.success("Berhasil keluar");
  };

  const saveMt5 = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch("/api/mt5/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingMt5Id,
          mt5_id: mt5FormData.mt5_id,
          mt5_password: mt5FormData.mt5_password,
          mt5_server: mt5FormData.mt5_server,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal menyimpan akun MT5");
      }

      toast.success(
        editingMt5Id
          ? "Akun MT5 berhasil diperbarui!"
          : "Akun MT5 berhasil terhubung!",
      );

      await loadData();
      setShowMt5Form(false);
      setEditingMt5Id(null);
      setMt5FormData({ mt5_id: "", mt5_password: "", mt5_server: "" });
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan akun MT5");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMt5 = async () => {
    if (!showDeleteConfirm) return;
    setIsDeletingMt5(true);
    const { error } = await supabase
      .from("mt5_accounts")
      .delete()
      .eq("id", showDeleteConfirm)
      .eq("user_id", user.id);
    if (!error) {
      toast.success("Akun MT5 berhasil dihapus");
      await loadData();
    } else {
      toast.error("Gagal menghapus akun MT5");
    }
    setIsDeletingMt5(false);
    setShowDeleteConfirm(null);
  };

  const handleCancelSubscription = async (subId: string) => {
    if (!confirm("Yakin ingin membatalkan langganan?")) return;
    setCancellingSubscription(true);
    const { error } = await supabase
      .from("subscriptions")
      .update({ status: "cancelled" })
      .eq("id", subId);
    if (!error) {
      toast.success("Langganan berhasil dibatalkan");
      await loadData();
    } else {
      toast.error("Gagal membatalkan langganan");
    }
    setCancellingSubscription(false);
  };

  const displayName =
    profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "Trader";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-2 border-appPrimary/20 animate-ping" />
            <div className="absolute inset-2 rounded-full border-2 border-t-appPrimary border-appPrimary/10 animate-spin" />
            <TrendingUp className="absolute inset-0 m-auto h-6 w-6 text-appPrimary" />
          </div>
          <p className="text-zinc-500 text-sm tracking-widest uppercase">
            Memuat dashboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition text-zinc-400"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
            <Link href="/" className="flex items-center gap-2 select-none">
              <div className="w-8 h-8 rounded-lg bg-appPrimary/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-appPrimary" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                Archi<span className="text-appPrimary">Trade</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/8">
              <div className="w-6 h-6 rounded-full bg-appPrimary/20 flex items-center justify-center">
                <User className="h-3.5 w-3.5 text-appPrimary" />
              </div>
              <span className="text-sm text-zinc-300">{displayName}</span>
              {Object.keys(activeSubscriptions).length > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 bg-appPrimary/15 text-appPrimary rounded-full font-semibold uppercase tracking-wide">
                  {Object.keys(activeSubscriptions).length} Paket Aktif
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition"
            >
              <LogOut className="h-4 w-4" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-64px)]">
        {/* SIDEBAR */}
        <aside
          className={`fixed lg:sticky top-16 h-[calc(100vh-64px)] w-64 flex-shrink-0 bg-[#0d0d14] border-r border-white/5 z-40 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            } overflow-y-auto`}
        >
          <div className="p-4 flex flex-col h-full">
            <div className="mb-5 p-3.5 rounded-2xl bg-white/3 border border-white/6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-appPrimary/30 to-appPrimary/5 flex items-center justify-center ring-1 ring-appPrimary/20">
                  <User className="h-5 w-5 text-appPrimary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">
                    {displayName}
                  </p>
                  <p className="text-xs text-zinc-500 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            <nav className="flex-1 space-y-0.5">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    setSidebarOpen(false);
                    setActiveSection(item.id);
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition group ${activeSection === item.id
                    ? "bg-appPrimary/10 text-appPrimary"
                    : "text-zinc-500 hover:text-zinc-200 hover:bg-white/4"
                    }`}
                >
                  <item.icon
                    className={`h-4 w-4 flex-shrink-0 ${activeSection === item.id ? "text-appPrimary" : "text-zinc-600 group-hover:text-zinc-400"}`}
                  />
                  <span>{item.name}</span>
                  {activeSection === item.id && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-appPrimary" />
                  )}
                </Link>
              ))}
            </nav>

            {Object.values(activeSubscriptions).length > 0 && (
              <div className="mt-4 p-3 rounded-2xl bg-gradient-to-br from-appPrimary/10 to-appPrimary/3 border border-appPrimary/15">
                <div className="flex items-center gap-2 mb-1.5">
                  <Crown className="h-3.5 w-3.5 text-appPrimary" />
                  <span className="text-[11px] text-appPrimary font-semibold uppercase tracking-wider">
                    Langganan Aktif
                  </span>
                </div>
                <p className="text-white font-bold text-sm">
                  {Object.values(activeSubscriptions).length} Akun Berlisensi
                </p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-[11px] text-zinc-500">
                    Lisensi Permanen
                  </p>
                  <div className="h-1 w-16 bg-emerald-500/10 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500/40 rounded-full w-full" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* MAIN CONTENT */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-8 pb-16">
          <div className="max-w-6xl mx-auto space-y-5">
            {/* Alert Notifikasi Baru */}
            {unreadNotifs.length > 0 && (
              <div className="bg-violet-500/10 border border-violet-500/20 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-[0_0_20px_rgba(139,92,246,0.1)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center text-white shrink-0 animate-pulse shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                    <Bell className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-violet-400 font-bold text-sm flex items-center gap-2">
                      Pesan Baru ({unreadNotifs.length})
                      <Sparkles className="h-3 w-3" />
                    </h3>
                    <p className="text-violet-400/70 text-[11px] leading-tight truncate max-w-[180px] sm:max-w-md">
                      {unreadNotifs[0].title}: {unreadNotifs[0].message}
                    </p>
                  </div>
                </div>
                <Link
                  href="/notifications"
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-[10px] font-bold rounded-lg transition whitespace-nowrap uppercase tracking-wider"
                >
                  Buka Pesan
                </Link>
              </div>
            )}

            {/* Banner Suspended */}
            {Object.values(activeSubscriptions).some(s => s.status === "suspended") && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center justify-between gap-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white shrink-0">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-red-400 font-bold text-sm">Akun Ditangguhkan</h3>
                    <p className="text-red-400/70 text-[11px] leading-tight">Anda memiliki tagihan profit sharing yang belum dibayar. Aktivitas EA Robot sedang non-aktif sementara.</p>
                  </div>
                </div>
                <Link
                  href="/invoices"
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition whitespace-nowrap"
                >
                  Bayar & Aktifkan
                </Link>
              </div>
            )}

            {/* Banner Pending */}
            {Object.values(activeSubscriptions).some(s => s.status === "pending") && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-black shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-amber-400 font-bold text-sm">Menunggu Konfirmasi</h3>
                    <p className="text-amber-400/70 text-[11px] leading-tight">Langganan Anda sedang menunggu konfirmasi pembayaran oleh admin. Paket akan aktif otomatis setelah disetujui.</p>
                  </div>
                </div>
                <div className="hidden sm:block px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                  Processing
                </div>
              </div>
            )}

            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-appPrimary/8 via-white/2 to-transparent border border-white/6 p-6 sm:p-8">
              <div className="absolute top-0 right-0 w-72 h-72 bg-appPrimary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <p className="text-xs text-appPrimary uppercase tracking-widest font-semibold mb-1">
                  Dashboard Trader
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold">
                  Halo,{" "}
                  <span className="text-appPrimary">{displayName}</span>{" "}
                </h1>
                <p className="text-zinc-400 mt-1 text-sm">
                  Kelola akun trading dan nikmati layanan komunitas ArchiTrade
                </p>
              </div>
              <div className="relative mt-5 flex flex-wrap gap-3">
                {[
                  {
                    icon: Activity,
                    label: "EA Robot Terhubung",
                    val: `${mt5Accounts.length} / 5 Akun`,
                  },
                  {
                    icon: Crown,
                    label: "Paket Aktif",
                    val: `${Object.keys(activeSubscriptions).length} Paket`,
                  },
                  {
                    icon: Clock,
                    label: "Durasi",
                    val: "Lifetime",
                  },
                ].map(({ icon: Icon, label, val }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2.5 px-4 py-2.5 bg-white/4 border border-white/6 rounded-xl text-sm"
                  >
                    <Icon className="h-4 w-4 text-appPrimary" />
                    <span className="text-zinc-400">{label}:</span>
                    <span className="text-white font-medium">
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* MT5 + Subscription Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* MT5 Card */}
              <div className="rounded-2xl bg-[#0d0d14] border border-white/6 overflow-hidden">
                 <div className="px-6 py-5 flex items-center justify-between border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <Wallet
                        className="h-4.5 w-4.5 text-blue-400"
                        style={{ height: 18, width: 18 }}
                      />
                    </div>
                    <div>
                      <h2 className="font-semibold text-sm">Akun MT5 ({mt5Accounts.length}/5)</h2>
                      <p className="text-[11px] text-zinc-500">MetaTrader 5 Accounts</p>
                    </div>
                  </div>
                  {!showMt5Form && mt5Accounts.length < 5 && (
                    <button
                      onClick={() => {
                        setEditingMt5Id(null);
                        setMt5FormData({ mt5_id: "", mt5_password: "", mt5_server: "" });
                        setShowMt5Form(true);
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-appPrimary text-black text-[10px] font-bold hover:brightness-110 transition"
                    >
                      <Plus className="h-3 w-3" /> Tambah
                    </button>
                  )}
                </div>

                <div className="p-6">
                  {!showMt5Form ? (
                    mt5Accounts.length > 0 ? (
                      <div className="space-y-4">
                        {mt5Accounts.map((acc) => {
                          const sub = activeSubscriptions[acc.id];
                          return (
                            <div key={acc.id} className="p-4 bg-white/3 border border-white/6 rounded-2xl group hover:border-white/10 transition">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                    <Server className="h-4 w-4 text-blue-400" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-white">{acc.mt5_id}</p>
                                    <p className="text-[10px] text-zinc-500">{acc.mt5_server}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => {
                                      setEditingMt5Id(acc.id);
                                      setMt5FormData({
                                        mt5_id: acc.mt5_id,
                                        mt5_password: "",
                                        mt5_server: acc.mt5_server,
                                      });
                                      setShowMt5Form(true);
                                    }}
                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition"
                                  >
                                    <Edit2 className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setShowDeleteConfirm(acc.id)}
                                    className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>

                              {sub ? (
                                <div className={`px-3 py-2 rounded-xl text-[10px] font-bold border flex items-center justify-between ${
                                  sub.status === "active" ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-400" :
                                  sub.status === "suspended" ? "bg-red-500/5 border-red-500/10 text-red-400" :
                                  "bg-amber-500/5 border-amber-500/10 text-amber-400"
                                }`}>
                                  <div className="flex items-center gap-1.5">
                                    <Crown className="h-3 w-3" />
                                    <span>{sub.subscription_plans?.name}</span>
                                  </div>
                                  <span className="uppercase tracking-widest">{sub.status}</span>
                                </div>
                              ) : (
                                <Link
                                  href={`/subscription?account=${acc.id}`}
                                  className="block text-center py-2 rounded-xl bg-appPrimary/10 hover:bg-appPrimary/20 text-appPrimary text-[10px] font-bold transition uppercase tracking-wider"
                                >
                                  Beli Lisensi
                                </Link>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-blue-500/8 flex items-center justify-center">
                          <Wallet className="h-6 w-6 text-blue-400/50" />
                        </div>
                        <p className="text-zinc-500 text-sm text-center">
                          Belum ada akun MT5 terhubung
                        </p>
                        <button
                          onClick={() => {
                            setEditingMt5Id(null);
                            setMt5FormData({ mt5_id: "", mt5_password: "", mt5_server: "" });
                            setShowMt5Form(true);
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-appPrimary/10 text-appPrimary text-sm rounded-xl hover:bg-appPrimary/15 transition"
                        >
                          <Plus className="h-4 w-4" /> Hubungkan Akun MT5
                        </button>
                      </div>
                    )
                  ) : (
                    <form onSubmit={saveMt5} className="space-y-3">
                      <div className="flex items-center justify-between mb-1">
                         <p className="text-[10px] font-bold text-appPrimary uppercase tracking-widest">
                           {editingMt5Id ? "Update Account" : "Add New MT5"}
                         </p>
                      </div>
                      <input
                        type="text"
                        placeholder="MT5 ID"
                        value={mt5FormData.mt5_id}
                        onChange={(e) =>
                          setMt5FormData({
                            ...mt5FormData,
                            mt5_id: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-appPrimary transition"
                        required
                      />
                      <input
                        type="password"
                        placeholder={editingMt5Id ? "Password (kosongkan jika tetap)" : "Password MT5"}
                        value={mt5FormData.mt5_password}
                        onChange={(e) =>
                          setMt5FormData({
                            ...mt5FormData,
                            mt5_password: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-appPrimary transition"
                        required={!editingMt5Id}
                      />
                      <input
                        type="text"
                        placeholder="Server MT5"
                        value={mt5FormData.mt5_server}
                        onChange={(e) =>
                          setMt5FormData({
                            ...mt5FormData,
                            mt5_server: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-appPrimary transition"
                        required
                      />
                      <div className="flex gap-3 pt-1">
                        <button
                          type="submit"
                          disabled={saving}
                          className="flex-1 bg-appPrimary text-black font-semibold py-3 rounded-xl hover:bg-appPrimary/90 transition text-sm disabled:opacity-60"
                        >
                          {saving ? "Menyimpan..." : editingMt5Id ? "Update" : "Hubungkan"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowMt5Form(false);
                            setEditingMt5Id(null);
                          }}
                          className="px-5 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm transition"
                        >
                          Batal
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>

              {/* Subscription List - Right Side Summary */}
              <div className="rounded-2xl bg-[#0d0d14] border border-white/6 overflow-hidden">
                <div className="px-6 py-5 flex items-center gap-3 border-b border-white/5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Crown className="h-[18px] w-[18px] text-amber-400" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-sm">
                      Daftar Langganan Aktif
                    </h2>
                    <p className="text-[11px] text-zinc-500">
                      Total {Object.values(activeSubscriptions).length} Paket
                    </p>
                  </div>
                </div>

                <div className="p-6">
                  {Object.values(activeSubscriptions).length > 0 ? (
                    <div className="space-y-4">
                      {Object.values(activeSubscriptions).map((sub: any) => (
                        <div key={sub.id} className={`p-4 rounded-2xl border ${sub.status === 'active'
                          ? 'bg-emerald-500/5 border-emerald-500/10'
                          : sub.status === 'suspended'
                            ? 'bg-red-500/5 border-red-500/10'
                            : 'bg-amber-500/5 border-amber-500/10'
                          }`}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full animate-pulse ${sub.status === 'active'
                                ? 'bg-emerald-400'
                                : sub.status === 'suspended'
                                  ? 'bg-red-400'
                                  : 'bg-amber-400'
                                }`} />
                              <span className={`text-[11px] font-bold uppercase tracking-widest ${sub.status === 'active'
                                ? 'text-emerald-400'
                                : sub.status === 'suspended'
                                  ? 'text-red-400'
                                  : 'text-amber-400'
                                }`}>
                                {sub.status}
                              </span>
                            </div>
                            <span className="text-[10px] text-zinc-500 font-mono">
                              {mt5Accounts.find(a => a.id === sub.mt5_account_id)?.mt5_id || "Unknown"}
                            </span>
                          </div>
                          <div className="flex justify-between items-end">
                            <div>
                              <p className="font-bold text-white tracking-tight">{sub.subscription_plans?.name}</p>
                              <p className="text-[10px] text-zinc-500 mt-0.5">Masa Aktif: Lifetime</p>
                            </div>
                            <Link
                              href="/subscription"
                              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-bold text-white transition"
                            >
                              Detail
                            </Link>
                          </div>
                        </div>
                      ))}
                      <Link
                        href="/subscription"
                        className="block w-full text-center py-3 text-sm border border-white/10 hover:bg-white/5 rounded-xl transition font-medium"
                      >
                        Beli Paket Baru
                      </Link>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                        <Crown className="h-6 w-6 text-zinc-700" />
                      </div>
                      <p className="text-sm text-zinc-500 mb-6">Belum ada paket aktif</p>
                      <Link
                        href="/subscription"
                        className="inline-flex px-6 py-2.5 bg-appPrimary text-black font-bold rounded-xl text-sm transition hover:scale-[1.02]"
                      >
                        Eksplor Paket
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* REKOMENDASI BROKER */}
            <section>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-xl bg-appPrimary/10 flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-appPrimary" />
                </div>
                <h2 className="text-lg font-bold">Rekomendasi Broker Forex</h2>
              </div>
              <p className="text-zinc-500 text-sm mb-5">
                Pilih broker sesuai deposit Anda. Untuk deposit $100–$4,000,
                kami merekomendasikan{" "}
                <span className="text-appPrimary font-semibold">Exness</span>.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {brokers.map((broker) => (
                  <div
                    key={broker.name}
                    className={`relative rounded-2xl bg-[#0d0d14] border p-5 flex flex-col transition-all hover:-translate-y-1 hover:shadow-2xl ${broker.name === "Exness"
                      ? "border-appPrimary/30 shadow-appPrimary/10 shadow-lg"
                      : "border-white/6"
                      }`}
                  >
                    {broker.badge && (
                      <div className="absolute -top-3 left-4 bg-appPrimary text-black text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                        {broker.badge}
                      </div>
                    )}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                        <Image
                          src={broker.image}
                          alt={broker.name}
                          width={48}
                          height={48}
                          className="object-contain"
                          style={{ height: "auto" }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-base">{broker.name}</h3>
                        <p className="text-xs text-appPrimary font-semibold">
                          {broker.minDeposit}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-400 mb-4 flex-1">
                      {broker.description}
                    </p>
                    <div className="space-y-1.5 mb-4">
                      {broker.features.map((f) => (
                        <div
                          key={f}
                          className="flex items-center gap-2 text-xs text-zinc-300"
                        >
                          <CheckCircle className="h-3 w-3 text-appPrimary flex-shrink-0" />
                          {f}
                        </div>
                      ))}
                    </div>
                    <a
                      href={broker.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block w-full text-center py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition ${broker.btnBg} ${broker.btnText}`}
                    >
                      Buka Akun {broker.name} →
                    </a>
                  </div>
                ))}
              </div>
            </section>

            {/* EA ROBOT TIERS */}
            <section>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-xl bg-appPrimary/10 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-appPrimary" />
                </div>
                <h2 className="text-lg font-bold">EA Robot Tiers</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {eaTiers.map((tier) => (
                  <div
                    key={tier.name}
                    className={`relative rounded-2xl bg-[#0d0d14] border p-5 flex flex-col transition-all hover:-translate-y-1 hover:shadow-2xl ${tier.glow} ${Object.values(activeSubscriptions).some(s => s.subscription_plans?.name === tier.name)
                      ? "border-appPrimary/40 ring-1 ring-appPrimary/20"
                      : "border-white/6"
                      }`}
                  >
                    {tier.recommended && (
                      <div
                        className={`absolute -top-3 left-4 bg-gradient-to-r ${tier.gradient} text-black text-[10px] font-bold px-3 py-1 rounded-full`}
                      >
                        ⭐ RECOMMENDED
                      </div>
                    )}
                    <div className="mb-4">
                      <div
                        className={`inline-block text-xs font-bold px-2.5 py-1 rounded-lg bg-gradient-to-r ${tier.gradient} text-black mb-3`}
                      >
                        {tier.name}
                      </div>
                      <div
                        className="text-3xl font-extrabold"
                        style={{ color: tier.accent }}
                      >
                        {tier.profitShare}
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">
                        Sharing Profit
                      </div>
                      <div className="mt-2 text-sm text-zinc-300 font-medium">
                        {tier.price}
                      </div>
                      <div className="mt-1 text-[11px] text-zinc-500">
                        Broker:{" "}
                        <span className="text-appPrimary">
                          {tier.recommendedBroker}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 border-t border-white/5 pt-4 space-y-2">
                      {tier.features.map((f) => (
                        <div
                          key={f}
                          className="flex items-start gap-2 text-xs text-zinc-300"
                        >
                          <CheckCircle
                            className="h-3.5 w-3.5 flex-shrink-0 mt-0.5"
                            style={{ color: tier.accent }}
                          />
                          {f}
                        </div>
                      ))}
                    </div>
                    {!Object.values(activeSubscriptions).some(s => s.subscription_plans?.name === tier.name) && (
                        <Link
                          href="/subscription"
                          className="block w-full text-center mt-5 bg-white/5 hover:bg-white/8 text-white py-2.5 rounded-xl text-sm transition font-medium"
                        >
                          Pilih Paket
                        </Link>
                      )}
                  </div>
                ))}
              </div>
            </section>

            {/* WEBINAR */}
            <section>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-xl bg-appPrimary/10 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-appPrimary" />
                </div>
                <h2 className="text-lg font-bold">Webinar & Event Mendatang</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {upcomingWebinars.map((w) => (
                  <div
                    key={w.title}
                    className="rounded-2xl bg-[#0d0d14] border border-white/6 p-5 hover:border-white/10 transition"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold px-2.5 py-1 bg-appPrimary/10 text-appPrimary rounded-full uppercase tracking-wider">
                        {w.tag}
                      </span>
                    </div>
                    <h3 className="font-semibold text-base mb-2 leading-snug">
                      {w.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mb-3">🎤 {w.speaker}</p>
                    <div className="space-y-1 mb-4">
                      <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                        <Calendar className="h-3 w-3" /> {w.date}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                        <Clock className="h-3 w-3" /> {w.time}
                      </div>
                    </div>
                    <p className="text-[11px] text-zinc-500 mb-4">{w.topic}</p>
                    <button className="w-full py-2.5 bg-appPrimary/8 text-appPrimary text-sm rounded-xl hover:bg-appPrimary/15 transition font-medium">
                      Daftar Sekarang →
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* E-BOOKS + VIDEO TUTORIALS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="rounded-2xl bg-[#0d0d14] border border-white/6 overflow-hidden">
                <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-appPrimary" />
                  <h3 className="font-semibold text-sm">E-Book & Panduan</h3>
                </div>
                <div className="p-4 space-y-2">
                  {ebooks.map((e) => (
                    <div
                      key={e.title}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/3 transition group"
                    >
                      <div
                        className={`w-8 h-8 rounded-lg ${e.bg} flex items-center justify-center flex-shrink-0`}
                      >
                        <e.icon className={`h-4 w-4 ${e.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {e.title}
                        </p>
                        <p className="text-[11px] text-zinc-500">
                          {e.description}
                        </p>
                      </div>
                      <Download className="h-4 w-4 text-zinc-600 group-hover:text-appPrimary transition cursor-pointer flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-[#0d0d14] border border-white/6 overflow-hidden">
                <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
                  <Video className="h-4 w-4 text-appPrimary" />
                  <h3 className="font-semibold text-sm">Video Tutorial</h3>
                </div>
                <div className="p-4 space-y-2">
                  {videoTutorials.map((v) => (
                    <div
                      key={v.title}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/3 transition group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                        <v.icon className="h-4 w-4 text-red-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {v.title}
                        </p>
                        <p className="text-[11px] text-zinc-500">
                          {v.duration}
                        </p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-zinc-600 group-hover:text-appPrimary transition cursor-pointer flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* KOMUNITAS */}
            <section>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-xl bg-appPrimary/10 flex items-center justify-center">
                  <Users className="h-4 w-4 text-appPrimary" />
                </div>
                <h2 className="text-lg font-bold">Komunitas Trader</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {communityLinks.map((c) => (
                  <a
                    key={c.name}
                    href={c.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 px-4 py-2.5 bg-[#0d0d14] border border-white/6 rounded-xl hover:border-white/12 hover:bg-white/3 transition group"
                  >
                    <div
                      className={`w-7 h-7 rounded-lg ${c.bg} flex items-center justify-center`}
                    >
                      <c.icon className={`h-3.5 w-3.5 ${c.color}`} />
                    </div>
                    <span className="text-sm text-zinc-300 font-medium">
                      {c.name}
                    </span>
                    <ExternalLink className="h-3 w-3 text-zinc-600 group-hover:text-appPrimary transition" />
                  </a>
                ))}
              </div>
            </section>

            {/* BENEFITS */}
            <div className="rounded-2xl bg-gradient-to-br from-appPrimary/6 via-white/1 to-transparent border border-appPrimary/12 p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="h-5 w-5 text-appPrimary" />
                <h3 className="font-bold text-base">
                  Keuntungan Menjadi Member
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {[
                  { icon: Award, label: "EA Robot Teruji" },
                  { icon: Users, label: "Komunitas Aktif" },
                  { icon: BookOpen, label: "Ebook Gratis" },
                  { icon: HeadphonesIcon, label: "Support 24/7" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-2 text-center"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-appPrimary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-appPrimary" />
                    </div>
                    <p className="text-xs text-zinc-300 font-medium">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal Konfirmasi Hapus MT5 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-[#0d0d14] rounded-2xl border border-white/10 max-w-sm w-full p-6 shadow-2xl">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Hapus Akun MT5?</h3>
                <p className="text-sm text-zinc-500 mt-1">
                  Semua data langganan yang sudah dibayar mungkin akan terdampak. Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
              <div className="flex gap-3 w-full mt-2">
                <button
                  onClick={handleDeleteMt5}
                  disabled={isDeletingMt5}
                  className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition disabled:opacity-50"
                >
                  {isDeletingMt5 ? "Menghapus..." : "Ya, Hapus"}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HeadphonesIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  );
}
