import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Users,
  TrendingUp,
  FileText,
  Bell,
  Settings,
  UserCheck,
  Calendar,
  AlertCircle,
  Crown,
  Wallet,
  Shield,
  Activity,
  Newspaper,
  ChevronRight,
  BarChart3,
  Circle,
  Receipt,
  ArrowUpRight,
} from "lucide-react";
import { LogoutButton } from "@/components/modules/admin/LogoutButton";
import { StatCard } from "@/components/ui/stat-card";
import { AdminDashboardStats, UserProfile } from "@/types";
import { MotionWrapper } from "@/components/ui/motion-wrapper";

/* ─── quick card ─────────────────────────────────────────────── */
function QuickCard({
  href,
  label,
  sub,
  icon: Icon,
  color,
  bg,
}: {
  href: string;
  label: string;
  sub: string;
  icon: any;
  color: string;
  bg: string;
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl bg-white/4 backdrop-blur-md border border-white/5 p-5 hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
    >
      <div
        className={`absolute -bottom-4 -right-4 w-20 h-20 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition ${bg}`}
      />
      <div
        className={`w-10 h-10 rounded-xl ${bg} bg-opacity-10 flex items-center justify-center mb-4 border border-white/5`}
      >
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <p className="font-semibold text-white text-sm">{label}</p>
      <p className="text-[11px] text-zinc-500 mt-0.5">{sub}</p>
      <ArrowUpRight className="absolute top-4 right-4 h-3.5 w-3.5 text-zinc-700 group-hover:text-zinc-400 transition" />
    </Link>
  );
}

/* ─── section label ─────────────────────────────────────────── */
function SectionLabel({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon className="h-4 w-4 text-appPrimary" />
      <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-[0.2em]">
        {label}
      </span>
    </div>
  );
}

export default async function AdminDashboard() {
  const supabase = await createSupabaseServer();

  // 1. Auth & Profile Check
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  // 2. Fetch Stats Data
  const [
    { data: profilesData },
    { data: activeSubsData },
    { data: mt5Data },
    { data: pendingSubsData },
    { data: pendingInvData },
  ] = await Promise.all([
    supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    supabase.from("subscriptions").select("id").eq("status", "active"),
    supabase.from("mt5_accounts").select("id"),
    supabase.from("subscriptions").select("id").eq("status", "pending"),
    supabase.from("invoices").select("id").eq("status", "pending_confirmation"),
  ]);

  // 3. Process Stats
  const usersList = (profilesData as UserProfile[]) || [];
  const stats: AdminDashboardStats = {
    totalUsers: usersList.length,
    totalAdmin: usersList.filter((u) => u.role === "admin").length,
    totalCustomers: usersList.filter((u) => u.role === "customer" || !u.role).length,
    totalSubscriptions: activeSubsData?.length || 0,
    totalMt5Accounts: mt5Data?.length || 0,
    pendingSubsCount: pendingSubsData?.length || 0,
    pendingInvoicesCount: pendingInvData?.length || 0,
  };

  const subRate = stats.totalCustomers > 0 ? Math.round((stats.totalSubscriptions / stats.totalCustomers) * 100) : 0;
  const mt5Rate = stats.totalCustomers > 0 ? Math.round((stats.totalMt5Accounts / stats.totalCustomers) * 100) : 0;

  const adminName = profile?.full_name?.split(" ")[0] || "Admin";
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Selamat pagi" : hour < 17 ? "Selamat siang" : "Selamat malam";

  const statCards = [
    { value: stats.totalUsers, label: "Total Users", icon: Users, color: "text-blue-400", bg: "bg-blue-500" },
    { value: stats.totalAdmin, label: "Admin", icon: UserCheck, color: "text-emerald-400", bg: "bg-emerald-500" },
    { value: stats.totalCustomers, label: "Customers", icon: TrendingUp, color: "text-amber-400", bg: "bg-amber-500" },
    { value: stats.totalSubscriptions, label: "Active Subs", icon: Crown, color: "text-violet-400", bg: "bg-violet-500" },
    { value: stats.totalMt5Accounts, label: "MT5 Connected", icon: Wallet, color: "text-cyan-400", bg: "bg-cyan-500" },
  ];

  const quickLinks = [
    { href: "/admin/users", label: "Manage Users", sub: "Lihat & kelola akun", icon: Users, color: "text-violet-400", bg: "bg-violet-500" },
    { href: "/admin/mt5", label: "MT5 Accounts", sub: "Akun MetaTrader", icon: Wallet, color: "text-sky-400", bg: "bg-sky-500" },
    { href: "/admin/subscriptions", label: "Subscriptions", sub: "Paket aktif", icon: Crown, color: "text-emerald-400", bg: "bg-emerald-500" },
    { href: "/admin/profits", label: "Profit & Billing", sub: "Input bagi hasil", icon: TrendingUp, color: "text-green-400", bg: "bg-green-500" },
    { href: "/admin/invoices", label: "Invoices", sub: "Tagihan & bayar", icon: FileText, color: "text-amber-400", bg: "bg-amber-500" },
    { href: "/admin/notifications", label: "Notifications", sub: "Kirim notifikasi", icon: Bell, color: "text-rose-400", bg: "bg-rose-500" },
    { href: "/admin/daily-outlook", label: "Daily Outlook", sub: "Analisis harian", icon: Newspaper, color: "text-teal-400", bg: "bg-teal-500" },
    { href: "/admin/settings", label: "Settings", sub: "Konfigurasi sistem", icon: Settings, color: "text-zinc-400", bg: "bg-zinc-500" },
  ];

  return (
    <div className="min-h-screen">
      {/* ── HEADER ──────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-black/60 backdrop-blur-2xl border-b border-white/5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-appPrimary/10 flex items-center justify-center border border-appPrimary/20">
              <Shield className="h-5 w-5 text-appPrimary shadow-[0_0_15px_rgba(255,204,0,0.2)]" />
            </div>
            <div className="leading-none">
              <span className="text-xl font-black tracking-tight">
                Archi<span className="text-appPrimary">Admin</span>
              </span>
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-medium mt-0.5">
                Superior Control
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/5 border border-white/10 text-sm">
              <div className="w-5 h-5 rounded-full bg-appPrimary/20 flex items-center justify-center">
                <Shield className="h-3 w-3 text-appPrimary" />
              </div>
              <span className="text-zinc-300 font-semibold">{adminName}</span>
              <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-lg font-black uppercase border border-emerald-500/20">
                Authorized
              </span>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* ── MAIN ────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-20 space-y-12">
        {/* Action Alerts */}
        {(stats.pendingSubsCount > 0 || stats.pendingInvoicesCount > 0) && (
          <MotionWrapper className="space-y-4">
            <SectionLabel icon={AlertCircle} label="Priority Actions" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.pendingSubsCount > 0 && (
                <div className="group bg-amber-500/5 backdrop-blur-md border border-amber-500/20 rounded-2xl p-5 flex items-center justify-between gap-4 hover:border-amber-500/40 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0 group-hover:scale-110 transition-transform">
                      <Crown className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-amber-100 font-bold text-base">{stats.pendingSubsCount} Subscription Request</h3>
                      <p className="text-amber-500/60 text-xs font-medium">Awaiting manual approval</p>
                    </div>
                  </div>
                  <Link
                    href="/admin/subscriptions"
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-black rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] active:scale-95"
                  >
                    PROSES
                  </Link>
                </div>
              )}
              {stats.pendingInvoicesCount > 0 && (
                <div className="group bg-cyan-500/5 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-5 flex items-center justify-between gap-4 hover:border-cyan-500/40 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-110 transition-transform">
                      <Receipt className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-cyan-100 font-bold text-base">{stats.pendingInvoicesCount} Payment Confirmation</h3>
                      <p className="text-cyan-400/60 text-xs font-medium">Awaiting proof verification</p>
                    </div>
                  </div>
                  <Link
                    href="/admin/invoices"
                    className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-black rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] active:scale-95"
                  >
                    VERIFIKASI
                  </Link>
                </div>
              )}
            </div>
          </MotionWrapper>
        )}

        {/* Welcome banner */}
        <MotionWrapper delay={0.1} className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-white/10 via-transparent to-transparent border border-white/10 p-8 sm:p-10">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-appPrimary/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-[1px] bg-appPrimary/40" />
              <p className="text-xs text-appPrimary uppercase tracking-[0.3em] font-black">
                {greeting}
              </p>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Hi, <span className="text-appPrimary">{adminName}</span>
            </h1>
            <p className="text-zinc-500 text-sm mt-2 font-medium">
              {now.toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="relative mt-8 flex flex-wrap gap-3">
            {[
              { label: "Subscription Rate", val: `${subRate}%`, ok: subRate >= 50 },
              { label: "MT5 Active Rate", val: `${mt5Rate}%`, ok: mt5Rate >= 50 },
              { label: "Total Platform Users", val: String(stats.totalUsers), ok: true },
            ].map(({ label, val, ok }) => (
              <div
                key={label}
                className="flex items-center gap-3 px-4 py-2.5 bg-white/4 backdrop-blur-md border border-white/10 rounded-2xl text-xs font-bold"
              >
                <div className={`w-2 h-2 rounded-full ${ok ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" : "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]"}`} />
                <span className="text-zinc-400 uppercase tracking-wider">{label}:</span>
                <span className="text-white">{val}</span>
              </div>
            ))}
          </div>
        </MotionWrapper>

        {/* ── STATS ───────────────────────────────────────── */}
        <section>
          <MotionWrapper delay={0.2}>
            <SectionLabel icon={BarChart3} label="Analytical Overview" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
              {statCards.map((s) => (
                <StatCard 
                  key={s.label} 
                  value={s.value}
                  label={s.label}
                  icon={s.icon}
                  color={s.color}
                  bg={s.bg}
                />
              ))}
            </div>
          </MotionWrapper>
        </section>

        {/* ── QUICK ACCESS ────────────────────────────────── */}
        <section>
          <MotionWrapper delay={0.3}>
            <SectionLabel icon={Activity} label="System Control" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {quickLinks.map((item) => (
                <QuickCard key={item.href} {...item} />
              ))}
            </div>
          </MotionWrapper>
        </section>

        {/* ── RECENT USERS ────────────────────────────────── */}
        <section>
          <MotionWrapper delay={0.4}>
            <div className="flex items-center justify-between mb-4">
              <SectionLabel icon={Calendar} label="Recent Registrations" />
              <Link
                href="/admin/users"
                className="group flex items-center gap-1.5 text-xs text-appPrimary hover:text-white transition-all font-black uppercase tracking-widest"
              >
                Full Access <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition" />
              </Link>
            </div>

            <div className="hidden sm:block rounded-[1.5rem] bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden shadow-2xl">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    {["User Entity", "Account Name", "Access Level", "Timestamp"].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-4 text-left text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {usersList.slice(0, 8).map((u) => (
                    <tr
                      key={u.id}
                      className="group hover:bg-white/5 transition-all duration-300"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-white/10 to-transparent border border-white/10 flex items-center justify-center flex-shrink-0 text-xs font-black text-white group-hover:scale-110 transition-transform">
                            {(u.full_name || u.email || "?")[0]}
                          </div>
                          <span className="text-sm font-semibold text-zinc-200 truncate max-w-[200px]">
                            {u.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-zinc-400">
                        {u.full_name || <span className="text-zinc-700 italic">Unnamed Entity</span>}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase border tracking-widest transition-colors ${u.role === "admin"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-white/5 text-zinc-500 border-white/10"
                            }`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${u.role === "admin" ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" : "bg-zinc-600"}`} />
                          {u.role || "customer"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-zinc-600">
                        {u.created_at
                          ? new Date(u.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="sm:hidden space-y-3">
              {usersList.slice(0, 6).map((u) => (
                <div
                  key={u.id}
                  className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-4 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-[11px] font-black text-white uppercase">
                    {(u.full_name || u.email || "?")[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-bold truncate">
                      {u.full_name || u.email}
                    </p>
                    <p className="text-[10px] text-zinc-500 font-medium truncate uppercase tracking-wider">
                      {u.email}
                    </p>
                  </div>
                  <span
                    className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${u.role === "admin"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                      : "bg-white/10 text-zinc-500"
                      }`}
                  >
                    {u.role || "CUST"}
                  </span>
                </div>
              ))}
            </div>
          </MotionWrapper>
        </section>
      </main>
    </div>
  );
}

