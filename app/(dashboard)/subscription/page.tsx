"use client";

import { useState, useEffect, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  Crown,
  ArrowLeft,
  Loader2,
  CheckCircle,
  DollarSign,
  Zap,
  Shield,
  Star,
  ChevronRight,
  Info,
  Clock,
  LayoutDashboard,
  Wallet,
} from "lucide-react";

const defaultPlans = [
  {
    id: "1",
    name: "SILVER",
    min_deposit: 100,
    max_deposit: 4000,
    share_profit_percent: 30,
    price_monthly: 500000,
    is_active: true,
  },
  {
    id: "2",
    name: "GOLD",
    min_deposit: 5000,
    max_deposit: 9000,
    share_profit_percent: 20,
    price_monthly: 1500000,
    is_active: true,
    recommended: true,
  },
  {
    id: "3",
    name: "DIAMOND",
    min_deposit: 10000,
    max_deposit: null,
    share_profit_percent: 15,
    price_monthly: 2500000,
    is_active: true,
  },
];

const planMeta: Record<
  string,
  {
    accent: string;
    glow: string;
    icon: any;
    features: string[];
    broker: string;
  }
> = {
  SILVER: {
    accent: "#94a3b8",
    glow: "rgba(148,163,184,0.15)",
    icon: Shield,
    broker: "Exness",
    features: [
      "EA Robot Basic",
      "Signal Copy Trading",
      "Support 24/7 Telegram",
      "Update EA 1x/bulan",
      "Akses Group Telegram",
    ],
  },
  GOLD: {
    accent: "#f59e0b",
    glow: "rgba(245,158,11,0.2)",
    icon: Star,
    broker: "FBS",
    features: [
      "EA Robot Pro",
      "Signal Copy Trading",
      "Support Prioritas 24/7",
      "Update EA 1x/bulan",
      "Analisis Market Harian",
      "Webinar Eksklusif",
      "Akses Group Premium",
    ],
  },
  DIAMOND: {
    accent: "#06b6d4",
    glow: "rgba(6,182,212,0.2)",
    icon: Zap,
    broker: "IC Markets",
    features: [
      "EA Robot Ultimate",
      "Signal Copy Trading",
      "Dedicated Account Manager",
      "Update EA Real-time",
      "Analisis Market Real-time",
      "Private Group VIP",
      "Withdraw Prioritas",
    ],
  },
};

function SubscriptionContent() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [deposit, setDeposit] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);
  const [mt5Account, setMt5Account] = useState<any>(null);
  const [mt5Accounts, setMt5Accounts] = useState<any[]>([]);
  const [subsMap, setSubsMap] = useState<Record<string, any>>({});
  const [plans, setPlans] = useState<any[]>([]);
  const searchParams = useSearchParams();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }
    setUser(currentUser);

    const { data: plansData } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("is_active", true);
    setPlans(plansData && plansData.length > 0 ? plansData : defaultPlans);

    const { data: mt5Data } = await supabase
      .from("mt5_accounts")
      .select("*")
      .eq("user_id", currentUser.id);
    
    if (!mt5Data || mt5Data.length === 0) {
      toast.error("Hubungkan akun MT5 terlebih dahulu");
      router.push("/dashboard");
      return;
    }
    setMt5Accounts(mt5Data);

    // Set default account from URL if available
    const accountIdFromUrl = searchParams.get("account");
    if (accountIdFromUrl) {
      const found = mt5Data.find(a => a.id === accountIdFromUrl);
      if (found) setMt5Account(found);
    } else if (mt5Data.length === 1) {
      setMt5Account(mt5Data[0]);
    }

    // Ambil SEMUA subscription aktif
    const { data: allSubs } = await supabase
      .from("subscriptions")
      .select("*, subscription_plans!plan_id(*)")
      .eq("user_id", currentUser.id)
      .in("status", ["active", "pending", "suspended"]);

    const map: Record<string, any> = {};
    if (allSubs) {
      allSubs.forEach(sub => {
        if (sub.mt5_account_id) {
          map[sub.mt5_account_id] = sub;
        }
      });
    }
    setSubsMap(map);

    setLoading(false);
  };

  const handleSubscribe = async () => {
    if (!selectedPlan) {
      setError("Pilih paket terlebih dahulu");
      return;
    }
    const depositAmount = parseFloat(deposit);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      setError("Masukkan jumlah deposit yang valid");
      return;
    }
    if (depositAmount < selectedPlan.min_deposit) {
      setError(`Minimal deposit $${selectedPlan.min_deposit.toLocaleString()}`);
      return;
    }
    if (selectedPlan.max_deposit && depositAmount > selectedPlan.max_deposit) {
      setError(
        `Maksimal deposit $${selectedPlan.max_deposit.toLocaleString()}`,
      );
      return;
    }

    // VALIDASI BROKER SERVER
    const requiredBroker = planMeta[selectedPlan.name]?.broker.toLowerCase();
    const accountServer = mt5Account.mt5_server.toLowerCase();
    
    if (!accountServer.includes(requiredBroker)) {
        setError(`Paket ${selectedPlan.name} khusus untuk broker ${planMeta[selectedPlan.name]?.broker}. Server akun MT5 Anda (${mt5Account.mt5_server}) tidak sesuai.`);
        toast.error("Broker tidak sesuai");
        return;
    }

    setSubmitting(true);
    setError("");
    try {
      const startDate = new Date();
      // Set end date to year 9999 to represent a Lifetime License
      const endDate = new Date("9999-12-31T23:59:59Z");

      const { error: subError } = await supabase.from("subscriptions").insert({
        user_id: user.id,
        plan_id: selectedPlan.id,
        mt5_account_id: mt5Account?.id,
        deposit_amount: depositAmount,
        status: "pending",
        current_period_start: startDate.toISOString(),
        current_period_end: endDate.toISOString(),
      });
      if (subError) throw subError;

      toast.success(
        `Berhasil mengajukan paket ${selectedPlan.name}! Menunggu konfirmasi admin.`,
      );
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
      toast.error("Gagal berlangganan");
    } finally {
      setSubmitting(false);
    }
  };

  const existingSubscription = mt5Account ? subsMap[mt5Account.id] : null;

  /* ── Loading ──────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-2 border-appPrimary/15 animate-ping" />
            <div className="absolute inset-2 rounded-full border-2 border-t-appPrimary border-transparent animate-spin" />
            <Crown className="absolute inset-0 m-auto h-5 w-5 text-appPrimary" />
          </div>
          <p className="text-zinc-600 text-[11px] tracking-widest uppercase">
            Memuat paket
          </p>
        </div>
      </div>
    );
  }

  /* ── Already subscribed ───────────────────────────────── */
  if (existingSubscription) {
    const meta =
      planMeta[existingSubscription.subscription_plans?.name] ||
      planMeta.SILVER;
    const isPending = existingSubscription.status === "pending";
    const isSuspended = existingSubscription.status === "suspended";

    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-white text-sm transition mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali ke Dashboard
          </Link>
          <div
            className="rounded-3xl bg-[#0d0d14] border border-white/8 p-10"
            style={{
              boxShadow: isPending
                ? "0 0 60px rgba(245,158,11,0.15)"
                : isSuspended
                  ? "0 0 60px rgba(239,68,68,0.15)"
                  : `0 0 60px ${meta.glow}`,
            }}
          >
            <div
              className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
              style={{
                background: isPending
                  ? "rgba(245,158,11,0.1)"
                  : isSuspended
                    ? "rgba(239,68,68,0.1)"
                    : `${meta.accent}18`,
                border: `1px solid ${isPending ? "rgba(245,158,11,0.3)" : isSuspended ? "rgba(239,68,68,0.3)" : meta.accent + "30"}`,
              }}
            >
              {isPending ? (
                <Clock className="h-8 w-8 text-amber-500 animate-pulse" />
              ) : isSuspended ? (
                <Shield className="h-8 w-8 text-red-500" />
              ) : (
                <CheckCircle
                  className="h-8 w-8"
                  style={{ color: meta.accent }}
                />
              )}
            </div>
            <p
              className="text-[11px] uppercase tracking-widest font-semibold mb-1"
              style={{
                color: isPending
                  ? "#f59e0b"
                  : isSuspended
                    ? "#ef4444"
                    : meta.accent,
              }}
            >
              {isPending
                ? "Menunggu Konfirmasi"
                : isSuspended
                  ? "Akun Ditangguhkan"
                  : "Lisensi Permanen Aktif"}
            </p>
            <h1 className="text-2xl font-extrabold mb-2">
              {isPending
                ? "Sedang Diproses"
                : isSuspended
                  ? "Perlu Tindakan"
                  : "Anda Sudah Berlisensi"}
            </h1>
            <p className="text-zinc-400 text-sm mb-6">
              {isPending
                ? "Pembelian paket Anda sedang dalam tahap peninjauan. Silakan lakukan transfer dan hubungi admin."
                : isSuspended
                  ? "Akses Anda ditangguhkan sementara. Harap hubungi dukungan atau periksa tagihan Anda."
                  : "Anda telah menggunakan paket: "}
              <span
                className="font-bold"
                style={{
                  color: isPending
                    ? "#f59e0b"
                    : isSuspended
                      ? "#ef4444"
                      : meta.accent,
                }}
              >
                {existingSubscription.subscription_plans?.name}
              </span>
            </p>

            {isPending && (
              <div className="mb-8 p-5 rounded-2xl bg-white/5 border border-white/10 text-left">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-3 text-center font-bold">
                  Detail Transfer Bank
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">Bank</span>
                    <span className="text-white font-bold">BCA</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">No. Rekening</span>
                    <span className="text-emerald-400 font-mono font-bold tracking-tighter">
                      2801365487
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">Atas Nama</span>
                    <span className="text-white font-bold uppercase">
                      Cecep Najmudin
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-t border-white/5 pt-3">
                    <span className="text-zinc-500">Total Bayar</span>
                    <span className="text-white font-extrabold text-sm">
                      Rp
                      {existingSubscription.subscription_plans?.price_monthly.toLocaleString()}
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-[10px] text-zinc-500 text-center italic">
                  Hubungi admin setelah transfer untuk aktivasi instan.
                </p>
              </div>
            )}
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-black text-sm transition hover:opacity-90"
              style={{
                background: isPending
                  ? "linear-gradient(135deg, #f59e0b, #d97706)"
                  : isSuspended
                    ? "linear-gradient(135deg, #ef4444, #dc2626)"
                    : `linear-gradient(135deg, ${meta.accent}, ${meta.accent}cc)`,
                color: isPending || isSuspended ? "#fff" : "#000",
              }}
            >
              Ke Dashboard <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Main page ────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-zinc-500 hover:text-white transition text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <div className="w-px h-5 bg-white/10" />
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-appPrimary/10 flex items-center justify-center">
              <Crown className="h-3.5 w-3.5 text-appPrimary" />
            </div>
            <span className="font-semibold text-sm">Pilih Paket Lisensi</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 pb-20">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-appPrimary/8 border border-appPrimary/15 rounded-full text-sm text-appPrimary font-medium mb-5">
            <Crown className="h-3.5 w-3.5" /> Lisensi EA Robot ArchiTrade
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Pilih Paket yang Tepat
            <br className="hidden sm:block" /> untuk Trading Anda
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
            Setiap akun MT5 memerlukan satu lisensi aktif.
            Pilih akun yang ingin didaftarkan di bawah ini.
          </p>
        </div>

        {/* Account Selector */}
        <div className="max-w-4xl mx-auto mb-12 bg-[#0d0d14] rounded-2xl border border-white/5 p-4 sm:p-6">
           <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black mb-4 flex items-center gap-2">
              <Wallet className="h-3 w-3" /> Step 1: Pilih Akun MT5 Anda
           </p>
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {mt5Accounts.map(acc => (
                 <div 
                   key={acc.id}
                   onClick={() => {
                     setMt5Account(acc);
                     setError("");
                   }}
                   className={`p-4 rounded-xl border cursor-pointer transition-all ${
                     mt5Account?.id === acc.id 
                       ? "bg-appPrimary/10 border-appPrimary shadow-[0_0_15px_rgba(255,204,0,0.1)]" 
                       : "bg-white/3 border-white/5 hover:bg-white/5"
                   }`}
                 >
                    <div className="flex items-center gap-3">
                       <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${mt5Account?.id === acc.id ? "bg-appPrimary/20" : "bg-white/5"}`}>
                          <CheckCircle className={`h-4 w-4 ${mt5Account?.id === acc.id ? "text-appPrimary" : "text-zinc-700"}`} />
                       </div>
                       <div>
                          <p className={`text-sm font-bold ${mt5Account?.id === acc.id ? "text-appPrimary" : "text-white"}`}>{acc.mt5_id}</p>
                          <p className="text-[10px] text-zinc-500 uppercase truncate max-w-[120px]">{acc.mt5_server}</p>
                       </div>
                    </div>
                    {subsMap[acc.id] && (
                       <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
                          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-tight">Status:</span>
                          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                             subsMap[acc.id].status === "active" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                          }`}>
                            {subsMap[acc.id].status}
                          </span>
                       </div>
                    )}
                 </div>
              ))}
              <Link
                href="/dashboard"
                className="p-4 rounded-xl border border-white/5 bg-white/1 border-dashed flex items-center justify-center gap-2 text-zinc-500 hover:text-white hover:bg-white/5 transition group"
              >
                 <Plus className="h-4 w-4 group-hover:scale-110 transition" />
                 <span className="text-xs font-bold">Tambah Akun</span>
              </Link>
           </div>
        </div>

        {mt5Account && (
            <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <p className="text-zinc-500 text-sm">
                    Mendaftarkan lisensi untuk akun <span className="text-appPrimary font-bold">{mt5Account.mt5_id}</span> ({mt5Account.mt5_server})
                </p>
                {subsMap[mt5Account.id] && (
                    <p className="text-amber-400 text-xs mt-2 font-medium">
                        ⚠️ Akun ini sudah memiliki langganan {subsMap[mt5Account.id].status}.
                    </p>
                )}
            </div>
        )}

        {/* Plan cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {plans.map((plan) => {
            const meta = planMeta[plan.name] || planMeta.SILVER;
            const PlanIcon = meta.icon;
            const isSelected = selectedPlan?.id === plan.id;
            const isRecommended = plan.recommended || plan.name === "GOLD";

            return (
              <div
                key={plan.id}
                onClick={() => {
                  if (subsMap[mt5Account?.id]) {
                      toast.error("Akun ini sudah memiliki langganan aktif");
                      return;
                  }
                  setSelectedPlan(plan);
                  setDeposit("");
                  setError("");
                }}
                className={`relative rounded-2xl bg-[#0d0d14] border cursor-pointer transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden ${!mt5Account ? "opacity-50 grayscale pointer-events-none" : ""}`}
                style={{
                  borderColor: isSelected
                    ? meta.accent
                    : "rgba(255,255,255,0.07)",
                  boxShadow: isSelected ? `0 0 30px ${meta.glow}` : "none",
                }}
              >
                {/* Top glow line for recommended */}
                {isRecommended && (
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${meta.accent}, transparent)`,
                    }}
                  />
                )}
                {isRecommended && (
                  <div className="absolute -top-px left-1/2 -translate-x-1/2">
                    <div
                      className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black rounded-b-lg"
                      style={{
                        background: `linear-gradient(135deg, ${meta.accent}, ${meta.accent}cc)`,
                      }}
                    >
                      ⭐ Recommended
                    </div>
                  </div>
                )}

                {/* Selected checkmark */}
                {isSelected && (
                  <div className="absolute top-4 right-4">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: meta.accent }}
                    >
                      <CheckCircle className="h-3.5 w-3.5 text-black" />
                    </div>
                  </div>
                )}

                <div className="p-6 flex flex-col flex-1">
                  {/* Icon + name */}
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background: `${meta.accent}18`,
                        border: `1px solid ${meta.accent}30`,
                      }}
                    >
                      <PlanIcon
                        className="h-5 w-5"
                        style={{ color: meta.accent }}
                      />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base tracking-wide">
                        {plan.name}
                      </h3>
                      <p className="text-[11px] text-zinc-500">
                        Broker: {meta.broker}
                      </p>
                    </div>
                  </div>

                  {/* Profit share */}
                  <div className="mb-4">
                    <span
                      className="text-4xl font-extrabold"
                      style={{ color: meta.accent }}
                    >
                      {plan.share_profit_percent}%
                    </span>
                    <span className="text-zinc-500 text-sm ml-2">
                      sharing profit
                    </span>
                  </div>

                  {/* Deposit range */}
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/3 border border-white/5 mb-4">
                    <DollarSign className="h-3.5 w-3.5 text-zinc-500 flex-shrink-0" />
                    <span className="text-sm text-zinc-300">
                      ${plan.min_deposit.toLocaleString()}
                      {plan.max_deposit
                        ? ` – $${plan.max_deposit.toLocaleString()}`
                        : "+"}
                    </span>
                  </div>

                  {/* Price — LISENSI bukan /bulan */}
                  <div className="mb-5 px-3 py-2.5 rounded-xl bg-white/3 border border-white/5">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">
                      Biaya Lisensi
                    </p>
                    <span className="text-xl font-bold text-white">
                      Rp{plan.price_monthly.toLocaleString()}
                    </span>
                    <span className="text-zinc-500 text-xs ml-1">
                      (sekali bayar)
                    </span>
                  </div>

                  {/* Features */}
                  <div className="flex-1 space-y-2 mb-6 border-t border-white/5 pt-4">
                    {meta.features.map((f) => (
                      <div
                        key={f}
                        className="flex items-start gap-2 text-xs text-zinc-400"
                      >
                        <CheckCircle
                          className="h-3.5 w-3.5 flex-shrink-0 mt-0.5"
                          style={{ color: meta.accent }}
                        />
                        {f}
                      </div>
                    ))}
                  </div>

                  {/* Select button */}
                  <button
                    className="w-full py-3 rounded-xl text-sm font-bold transition-all"
                    style={
                      isSelected
                        ? {
                            background: `linear-gradient(135deg, ${meta.accent}, ${meta.accent}cc)`,
                            color: "#000",
                          }
                        : {
                            background: "rgba(255,255,255,0.05)",
                            color: "#fff",
                          }
                    }
                  >
                    {isSelected ? "✓ Dipilih" : "Pilih Paket Ini"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Deposit form */}
        {selectedPlan && (
          <DepositForm
            selectedPlan={selectedPlan}
            deposit={deposit}
            setDeposit={setDeposit}
            error={error}
            setError={setError}
            submitting={submitting}
            handleSubscribe={handleSubscribe}
          />
        )}
      </div>
    </div>
  );
}

/* ── Deposit form extracted to avoid IIFE ─────────────────── */
function DepositForm({
  selectedPlan,
  deposit,
  setDeposit,
  error,
  setError,
  submitting,
  handleSubscribe,
}: {
  selectedPlan: any;
  deposit: string;
  setDeposit: (v: string) => void;
  error: string;
  setError: (v: string) => void;
  submitting: boolean;
  handleSubscribe: () => void;
}) {
  const meta = planMeta[selectedPlan.name] || planMeta.SILVER;
  const depositNum = parseFloat(deposit);
  const isValidDeposit =
    !isNaN(depositNum) &&
    depositNum >= selectedPlan.min_deposit &&
    (!selectedPlan.max_deposit || depositNum <= selectedPlan.max_deposit);

  const inputStyle: React.CSSProperties = {
    backgroundColor: "#1a1a24",
    color: "#ffffff",
    caretColor: "#ffffff",
    borderColor: error ? "#ef4444" : "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: "0.75rem",
    outline: "none",
    width: "100%",
    paddingLeft: "2rem",
    paddingRight: "1rem",
    paddingTop: "0.875rem",
    paddingBottom: "0.875rem",
    fontSize: "0.875rem",
  };

  return (
    <div
      className="max-w-md mx-auto rounded-2xl bg-[#0d0d14] border overflow-hidden"
      style={{
        borderColor: `${meta.accent}30`,
        boxShadow: `0 0 40px ${meta.glow}`,
      }}
    >
      {/* Card header */}
      <div
        className="px-6 py-4 border-b"
        style={{
          borderColor: `${meta.accent}15`,
          background: `${meta.accent}08`,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: `${meta.accent}18` }}
          >
            <Crown className="h-4 w-4" style={{ color: meta.accent }} />
          </div>
          <div>
            <p className="text-sm font-bold text-white">
              Konfirmasi Paket {selectedPlan.name}
            </p>
            <p className="text-[11px] text-zinc-500">
              Lisensi Rp{selectedPlan.price_monthly.toLocaleString()} (sekali
              bayar)
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Deposit info */}
        <div className="flex items-start gap-2 px-3 py-2.5 bg-white/3 border border-white/6 rounded-xl text-xs text-zinc-400">
          <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5 text-zinc-500" />
          <span>
            Range deposit:{" "}
            <span className="text-white font-semibold">
              ${selectedPlan.min_deposit.toLocaleString()}
              {selectedPlan.max_deposit
                ? ` – $${selectedPlan.max_deposit.toLocaleString()}`
                : "+"}
            </span>
          </span>
        </div>

        {/* Input — using inline style only, no className for colors */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-bold pointer-events-none z-10">
            $
          </div>
          <input
            type="number"
            value={deposit}
            onChange={(e) => {
              setDeposit(e.target.value);
              setError("");
            }}
            placeholder={`Min. ${selectedPlan.min_deposit.toLocaleString()}`}
            style={inputStyle}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-xs text-red-400 px-3 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Progress bar */}
        {deposit && !isNaN(depositNum) && depositNum > 0 && (
          <div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(
                    100,
                    (depositNum /
                      (selectedPlan.max_deposit ||
                        selectedPlan.min_deposit * 2)) *
                      100,
                  )}%`,
                  background: isValidDeposit ? meta.accent : "#ef4444",
                }}
              />
            </div>
            <p className="text-[11px] text-zinc-600 mt-1">
              {isValidDeposit
                ? "✓ Deposit dalam range yang valid"
                : depositNum < selectedPlan.min_deposit
                  ? `Kurang $${(
                      selectedPlan.min_deposit - depositNum
                    ).toLocaleString()}`
                  : `Melebihi maksimal $${selectedPlan.max_deposit?.toLocaleString()}`}
            </p>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubscribe}
          disabled={submitting}
          className="w-full py-4 rounded-xl font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          style={{
            background: isValidDeposit
              ? `linear-gradient(135deg, ${meta.accent}, ${meta.accent}cc)`
              : "rgba(255,255,255,0.05)",
            color: isValidDeposit ? "#000" : "#fff",
          }}
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Memproses...
            </>
          ) : (
            <>
              Beli Lisensi {selectedPlan.name}{" "}
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </button>

        <p className="text-center text-[11px] text-zinc-600">
          Dengan membeli lisensi, Anda menyetujui syarat dan ketentuan
          ArchiTrade
        </p>
      </div>
    </div>
  );
}

const Plus = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

export default function SubscriptionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-white">Loading...</div>}>
      <SubscriptionContent />
    </Suspense>
  )
}
