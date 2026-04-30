"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CreditCard,
  ArrowLeft,
  Users,
  Calendar,
  DollarSign,
  Server,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Loader2,
  Receipt,
  RefreshCw,
  Crown,
  ChevronRight,
  TrendingUp,
  Mail,
  ArrowUpRight,
} from "lucide-react";

/* ── animated counter (Simplified for UI consistency) ───────────────────────── */
function AnimatedNumber({ value, prefix = "" }: { value: number; prefix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let current = 0;
    const step = Math.max(1, Math.ceil(value / 30));
    const timer = setInterval(() => {
      current = Math.min(current + step, value);
      setDisplay(current);
      if (current >= value) clearInterval(timer);
    }, 20);
    return () => clearInterval(timer);
  }, [value]);

  return <span>{prefix}{display.toLocaleString("id-ID")}</span>;
}

/* ── stat card ─────────────────────────────────────────────── */
function StatCard({ label, value, icon: Icon, color, bg, prefix = "" }: any) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#0d0d14] border border-white/5 p-5 hover:border-white/10 transition-all duration-300 group">
      <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-15 group-hover:opacity-25 transition ${bg}`} />
      <div className={`w-10 h-10 rounded-xl ${bg} bg-opacity-10 flex items-center justify-center mb-3`}>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <div className="text-2xl font-extrabold text-white tracking-tight">
        <AnimatedNumber value={value} prefix={prefix} />
      </div>
      <p className="text-[11px] text-zinc-500 mt-0.5 font-medium uppercase tracking-wider">{label}</p>
    </div>
  );
}

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    checkAdminAndLoad();
    setTimeout(() => setMounted(true), 100);
  }, []);

  const checkAdminAndLoad = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      router.push("/dashboard");
      return;
    }

    setIsAdmin(true);
    await loadData();
  };

  const loadData = async () => {
    setLoading(true);
    // Mencoba join otomatis (cara paling efisien)
    const { data, error } = await supabase
      .from("subscriptions")
      .select(`
        *,
        profiles!user_id (id, full_name, email),
        subscription_plans!fk_subscriptions_plans (name, price_monthly),
        mt5_accounts!mt5_account_id (mt5_id, mt5_server)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Join failed, using manual mapper fallback:", error.message);
      
      // FALLBACK: Ambil data tabel utama dan tabel pendukung secara terpisah
      const [
        { data: subData },
        { data: profData },
        { data: planData },
        { data: mt5Data }
      ] = await Promise.all([
        supabase.from("subscriptions").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("id, full_name, email"),
        supabase.from("subscription_plans").select("id, name, price_monthly"),
        supabase.from("mt5_accounts").select("id, mt5_id, mt5_server")
      ]);

      if (subData) {
        // Sambungkan data secara manual (Logic Manual Linker)
        const mappedData = subData.map(sub => ({
          ...sub,
          profiles: profData?.find(p => p.id === sub.user_id),
          subscription_plans: planData?.find(p => p.id === sub.plan_id),
          mt5_accounts: mt5Data?.find(m => m.id === sub.mt5_account_id)
        }));
        setSubscriptions(mappedData);
      } else {
        setSubscriptions([]);
      }
    } else {
      setSubscriptions(data || []);
    }
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/subscriptions/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        await loadData();
      } else {
        const data = await res.json();
        console.error("Gagal mengupdate status:", data.error);
      }
    } catch (err: any) {
      console.error("Error updating status:", err.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "pending": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "expired": return "bg-red-500/10 text-red-400 border-red-500/20";
      default: return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    }
  };

  if (loading && !mounted) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-appPrimary" />
      </div>
    );
  }

  if (!isAdmin) return null;

  const totalActive = subscriptions.filter(s => s.status === 'active').length;
  const totalPending = subscriptions.filter(s => s.status === 'pending').length;
  const totalDeposit = subscriptions.reduce((acc, curr) => acc + (Number(curr.deposit_amount) || 0), 0);

  const fadeClass = mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4";

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <style>{`
        @keyframes rowIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .row-in { animation: rowIn 0.3s ease both; }
      `}</style>

      {/* ── HEADER ──────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="flex items-center gap-1.5 text-zinc-500 hover:text-white transition text-sm font-medium">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <div className="w-px h-5 bg-white/10" />
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Crown className="h-3.5 w-3.5 text-emerald-500" />
              </div>
              <span className="font-semibold text-sm">Subscriptions</span>
            </div>
          </div>

          <button onClick={handleRefresh} disabled={refreshing} className="flex items-center gap-1.5 px-3 py-2 text-sm text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl transition">
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </header>

      {/* ── MAIN ────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-16 space-y-10">
        
        {/* Title Area */}
        <div className={`transition-all duration-500 ${fadeClass}`}>
          <p className="text-[11px] text-emerald-500 uppercase tracking-[0.15em] font-semibold mb-1">Membership</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Subscription Management</h1>
          <p className="text-zinc-500 text-sm mt-1">Kelola lisensi aktif dan rencana berlangganan user</p>
        </div>

        {/* Stats */}
        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 transition-all duration-700 delay-100 ${fadeClass}`}>
          <StatCard label="Active Subscriptions" value={totalActive} icon={Crown} color="text-emerald-400" bg="bg-emerald-500" />
          <StatCard label="Pending Approval" value={totalPending} icon={Clock} color="text-amber-400" bg="bg-amber-500" />
          <StatCard label="Total Trust Fund" value={totalDeposit} prefix="$" icon={TrendingUp} color="text-appPrimary" bg="bg-appPrimary" />
        </div>

        {/* Table Area */}
        <div className={`transition-all duration-700 delay-200 ${fadeClass}`}>
          <div className="rounded-2xl bg-[#0d0d14] border border-white/5 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5 bg-white/2">
                    {["User", "Plan & MT5", "Deposit", "Status", "Period", "Billing"].map((h) => (
                      <th key={h} className="px-6 py-4 text-left text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {subscriptions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-14 h-14 rounded-2xl bg-white/3 flex items-center justify-center">
                            <CreditCard className="h-6 w-6 text-zinc-600" />
                          </div>
                          <p className="text-zinc-500 text-sm">Belum ada data subscription</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    subscriptions.map((sub, idx) => (
                      <tr key={sub.id} className="group hover:bg-white/[0.02] transition-colors row-in" style={{ animationDelay: idx * 30 + 'ms' }}>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center text-[11px] font-bold text-emerald-500 uppercase flex-shrink-0">
                              {(sub.profiles?.full_name || sub.profiles?.email || "?")[0]}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm text-white font-medium truncate">{sub.profiles?.full_name || "—"}</p>
                              <p className="text-[11px] text-zinc-500 flex items-center gap-1 truncate">
                                <Mail className="h-2.5 w-2.5 flex-shrink-0" />
                                {sub.profiles?.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-sm text-zinc-200 font-medium">{sub.subscription_plans?.name || "—"}</p>
                          <p className="text-[11px] text-zinc-600 font-mono mt-0.5 flex items-center gap-1">
                            <Server className="h-2.5 w-2.5" />
                            {sub.mt5_accounts?.mt5_id || "No MT5"}
                          </p>
                        </td>
                        <td className="px-6 py-5">
                          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                            <DollarSign className="h-3 w-3 text-emerald-400" />
                            <span className="text-sm text-emerald-400 font-bold">{(sub.deposit_amount || 0).toLocaleString()}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="relative inline-block w-32">
                            <select
                              value={sub.status}
                              onChange={(e) => updateStatus(sub.id, e.target.value)}
                              className={`w-full bg-zinc-950 border text-[11px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500/50 appearance-none cursor-pointer transition ${getStatusColor(sub.status)}`}
                            >
                              <option value="active">Active</option>
                              <option value="suspended">Suspended</option>
                              <option value="pending">Pending</option>
                              <option value="expired">Expired</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-current rotate-90 pointer-events-none" />
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-[11px] text-zinc-400 space-y-0.5">
                            <p className="flex justify-between gap-2 italic">
                              <span className="text-zinc-600">Start:</span>
                              {sub.current_period_start ? new Date(sub.current_period_start).toLocaleDateString("id-ID", { day: "numeric", month: "short" }) : "-"}
                            </p>
                            <p className="flex justify-between gap-2 font-medium">
                              <span className="text-zinc-600">End:</span>
                              <span className="text-zinc-300">{sub.current_period_end ? new Date(sub.current_period_end).toLocaleDateString("id-ID", { day: "numeric", month: "short" }) : "-"}</span>
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <Link href={`/admin/invoices?user=${sub.user_id}`} className="group/btn inline-flex items-center gap-1 text-[11px] font-bold text-zinc-500 hover:text-emerald-400 transition">
                            <Receipt className="h-3.5 w-3.5" />
                            <span>Invoices</span>
                            <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover/btn:opacity-100 transition" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {subscriptions.length > 0 && (
            <div className="mt-4 text-right">
              <p className="text-[10px] text-zinc-600 uppercase tracking-widest">
                Displaying {subscriptions.length} active licenses
              </p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
