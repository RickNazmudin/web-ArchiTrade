"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  FileText,
  Search,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  RefreshCw,
  CreditCard,
  User,
  Mail,
  TrendingUp,
  ArrowLeft,
  ChevronDown,
  Banknote,
  Receipt,
  Filter,
  X,
  PauseCircle,
} from "lucide-react";

/* ── animated counter ─────────────────────────────────────── */
function AnimatedNumber({
  value,
  prefix = "",
  className = "",
}: {
  value: number;
  prefix?: string;
  className?: string;
}) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let current = 0;
    const step = Math.max(1, Math.ceil(value / 40));
    const id = setInterval(() => {
      current = Math.min(current + step, value);
      setDisplay(current);
      if (current >= value) clearInterval(id);
    }, 20);
    return () => clearInterval(id);
  }, [value]);
  return (
    <span className={className}>
      {prefix}
      {display.toLocaleString("id-ID")}
    </span>
  );
}

/* ── status badge ─────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  const map: Record<
    string,
    { label: string; dot: string; bg: string; text: string; pulse?: boolean }
  > = {
    paid: {
      label: "Paid",
      dot: "bg-emerald-400",
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
    },
    pending: {
      label: "Pending",
      dot: "bg-amber-400",
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      pulse: true,
    },
    pending_confirmation: {
      label: "Waiting Confirm",
      dot: "bg-sky-400",
      bg: "bg-sky-500/10",
      text: "text-sky-400",
      pulse: true,
    },
    overdue: {
      label: "Overdue",
      dot: "bg-red-400",
      bg: "bg-red-500/10",
      text: "text-red-400",
    },
  };
  const s = map[status] ?? {
    label: status,
    dot: "bg-zinc-500",
    bg: "bg-zinc-500/10",
    text: "text-zinc-400",
  };
  return (
    <span
      className={
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold " +
        s.bg +
        " " +
        s.text
      }
    >
      <span
        className={
          "w-1.5 h-1.5 rounded-full " +
          s.dot +
          (s.pulse ? " animate-pulse" : "")
        }
      />
      {s.label}
    </span>
  );
}

/* ── stat card ────────────────────────────────────────────── */
function StatCard({
  label,
  value,
  prefix = "",
  icon: Icon,
  color,
  bg,
}: {
  label: string;
  value: number;
  prefix?: string;
  icon: any;
  color: string;
  bg: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#0d0d14] border border-white/5 p-5 hover:border-white/10 transition-all duration-300 group">
      <div
        className={
          "absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-15 group-hover:opacity-25 transition " +
          bg
        }
      />
      <div
        className={
          "w-10 h-10 rounded-xl flex items-center justify-center mb-3 " +
          bg +
          " bg-opacity-10"
        }
      >
        <Icon className={"h-5 w-5 " + color} />
      </div>
      <AnimatedNumber
        value={value}
        prefix={prefix}
        className="text-2xl font-extrabold text-white tracking-tight block"
      />
      <p className="text-[11px] text-zinc-500 mt-0.5 font-medium uppercase tracking-wider">
        {label}
      </p>
    </div>
  );
}

/* ── main ─────────────────────────────────────────────────── */
export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    checkAdminAndLoad();
  }, []);
  useEffect(() => {
    if (!loading) setTimeout(() => setMounted(true), 50);
  }, [loading]);

  const checkAdminAndLoad = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
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
    await loadInvoices();
  };

  const loadInvoices = async () => {
    setLoading(true);
    // Mencoba join otomatis (cara paling efisien)
    const { data, error } = await supabase
      .from("invoices")
      .select(`
        *,
        profiles!user_id (id, full_name, email, phone),
        subscriptions!subscription_id (
          id,
          subscription_plans!fk_subscriptions_plans (name, share_profit_percent)
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Invoice Join failed, using manual mapper fallback:", error.message);
      
      // FALLBACK: Ambil data secara terpisah (Manual Linker logic)
      const [
        { data: invData },
        { data: profData },
        { data: subData }
      ] = await Promise.all([
        supabase.from("invoices").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("id, full_name, email, phone"),
        supabase.from("subscriptions").select("id, plan_id")
      ]);

      if (invData) {
        // Ambil data plans untuk disambungkan ke sub
        const { data: planData } = await supabase.from("subscription_plans").select("id, name, share_profit_percent");

        const mappedData = invData.map(inv => {
          const sub = subData?.find(s => s.id === inv.subscription_id);
          const plan = planData?.find(p => p.id === sub?.plan_id);
          
          return {
            ...inv,
            profiles: profData?.find(p => p.id === inv.user_id),
            subscriptions: sub ? { ...sub, subscription_plans: plan } : null
          };
        });
        setInvoices(mappedData);
      } else {
        setInvoices([]);
      }
    } else {
      setInvoices(data || []);
    }
    setLoading(false);
  };

  const updateInvoiceStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    
    // 1. Ambil data invoice untuk mendapatkan subscription_id
    const { data: inv } = await supabase
      .from("invoices")
      .select("subscription_id")
      .eq("id", id)
      .single();

    // 2. Update status invoice
    const { error } = await supabase
      .from("invoices")
      .update({
        status: newStatus,
        paid_at: newStatus === "paid" ? new Date().toISOString() : null,
      })
      .eq("id", id);

    if (!error) {
      // 3. Jika dibayar, aktifkan kembali subscription terkait
      if (newStatus === "paid" && inv?.subscription_id) {
        await supabase
          .from("subscriptions")
          .update({ status: "active" })
          .eq("id", inv.subscription_id);
      }
      await loadInvoices();
    }
    setUpdatingId(null);
  };

  const suspendSubscription = async (invoice: any) => {
    if (!invoice.subscription_id) {
      toast.error("Invoice tidak memiliki data langganan");
      return;
    }

    if (!confirm(`Tangguhkan langganan untuk ${invoice.profiles?.full_name}?`)) return;

    setUpdatingId(invoice.id);
    try {
      // 1. Set subscription ke suspended
      const { error: subError } = await supabase
        .from("subscriptions")
        .update({ status: "suspended" })
        .eq("id", invoice.subscription_id);

      if (subError) throw subError;

      // 2. Set invoice ke overdue (menunggak)
      const { error: invError } = await supabase
        .from("invoices")
        .update({ status: "overdue" })
        .eq("id", invoice.id);

      if (invError) throw invError;

      toast.success("Langganan berhasil ditangguhkan");
      await loadInvoices();
    } catch (err: any) {
      toast.error("Gagal menangguhkan: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = invoices.filter((inv) => {
    const q = searchTerm.toLowerCase();
    return (
      (inv.profiles?.full_name?.toLowerCase().includes(q) ||
        inv.profiles?.email?.toLowerCase().includes(q)) &&
      (statusFilter === "all" || inv.status === statusFilter)
    );
  });

  const totalRevenue = filtered
    .filter((i) => i.status === "paid")
    .reduce((s, i) => s + (i.amount || 0), 0);
  const pendingAmount = filtered
    .filter((i) => i.status === "pending")
    .reduce((s, i) => s + (i.amount || 0), 0);
  const paidCount = invoices.filter((i) => i.status === "paid").length;

  const selectStyle: React.CSSProperties = {
    backgroundColor: "#1a1a24",
    color: "#fff",
    borderColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderStyle: "solid",
  };
  const inputStyle: React.CSSProperties = {
    backgroundColor: "#0d0d14",
    color: "#fff",
    caretColor: "#fff",
    borderColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderStyle: "solid",
  };

  /* loading */
  if (loading)
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-2 border-appPrimary/15 animate-ping" />
            <div className="absolute inset-2 rounded-full border-2 border-t-appPrimary border-transparent animate-spin" />
            <Receipt className="absolute inset-0 m-auto h-5 w-5 text-appPrimary" />
          </div>
          <p className="text-zinc-600 text-[11px] tracking-widest uppercase">
            Memuat invoice
          </p>
        </div>
      </div>
    );

  if (!isAdmin) return null;

  const fadeClass = mounted
    ? "opacity-100 translate-y-0"
    : "opacity-0 translate-y-4";
  const transition = "transition-all duration-500";

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <style>{`
        @keyframes rowIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .row-in { animation: rowIn 0.3s ease both; }
      `}</style>

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-1.5 text-zinc-500 hover:text-white transition text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <div className="w-px h-5 bg-white/10" />
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-appPrimary/10 flex items-center justify-center">
              <Receipt className="h-3.5 w-3.5 text-appPrimary" />
            </div>
            <span className="font-semibold text-sm">Manage Invoices</span>
          </div>
          <div className="ml-auto">
            <button
              onClick={loadInvoices}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl transition"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-16 space-y-8">
        {/* TITLE */}
        <div
          className={`${fadeClass} ${transition}`}
          style={{ transitionDelay: "0ms" }}
        >
          <p className="text-[11px] text-appPrimary uppercase tracking-[0.15em] font-semibold mb-1">
            Billing
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Invoice Management
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Kelola semua tagihan dan pembayaran user
          </p>
        </div>

        {/* STATS */}
        <div
          className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${fadeClass} ${transition}`}
          style={{ transitionDelay: "80ms" }}
        >
          <StatCard
            label="Total Invoice"
            value={invoices.length}
            icon={FileText}
            color="text-blue-400"
            bg="bg-blue-500"
          />
          <StatCard
            label="Total Revenue"
            value={totalRevenue}
            prefix="Rp "
            icon={TrendingUp}
            color="text-emerald-400"
            bg="bg-emerald-500"
          />
          <StatCard
            label="Pending Amount"
            value={pendingAmount}
            prefix="Rp "
            icon={Clock}
            color="text-amber-400"
            bg="bg-amber-500"
          />
          <StatCard
            label="Lunas"
            value={paidCount}
            icon={CreditCard}
            color="text-violet-400"
            bg="bg-violet-500"
          />
        </div>

        {/* FILTERS */}
        <div
          className={`flex flex-col sm:flex-row gap-3 ${fadeClass} ${transition}`}
          style={{ transitionDelay: "160ms" }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari nama atau email user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                ...inputStyle,
                borderRadius: "0.75rem",
                outline: "none",
                width: "100%",
                paddingLeft: "2.5rem",
                paddingRight: "2.5rem",
                paddingTop: "0.75rem",
                paddingBottom: "0.75rem",
                fontSize: "0.875rem",
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <div className="relative">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 pointer-events-none z-10" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                ...selectStyle,
                borderRadius: "0.75rem",
                outline: "none",
                paddingLeft: "2.5rem",
                paddingRight: "2.5rem",
                paddingTop: "0.75rem",
                paddingBottom: "0.75rem",
                fontSize: "0.875rem",
                appearance: "none",
                minWidth: "160px",
                cursor: "pointer",
              }}
            >
              <option value="all">Semua Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="pending_confirmation">Waiting Confirm</option>
              <option value="overdue">Overdue</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 pointer-events-none" />
          </div>
          <div className="flex items-center px-4 py-3 bg-white/3 border border-white/6 rounded-xl text-sm text-zinc-400 whitespace-nowrap">
            <span className="text-white font-semibold mr-1">
              {filtered.length}
            </span>{" "}
            hasil
          </div>
        </div>

        {/* TABLE — desktop */}
        <div
          className={`${fadeClass} ${transition}`}
          style={{ transitionDelay: "220ms" }}
        >
          <div className="hidden md:block rounded-2xl bg-[#0d0d14] border border-white/5 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 bg-white/2">
                  {[
                    "User",
                    "Paket",
                    "Amount",
                    "Status",
                    "Due Date",
                    "Aksi",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3.5 text-left text-[11px] font-semibold text-zinc-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="flex flex-col items-center gap-3 py-16">
                        <div className="w-14 h-14 rounded-2xl bg-white/3 flex items-center justify-center">
                          <FileText className="h-6 w-6 text-zinc-600" />
                        </div>
                        <p className="text-zinc-500 text-sm">
                          Tidak ada invoice ditemukan
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((inv, idx) => (
                    <tr
                      key={inv.id}
                      className="border-b border-white/3 hover:bg-white/2 transition-colors last:border-0 row-in"
                      style={{ animationDelay: idx * 25 + "ms" }}
                    >
                      {/* User */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-appPrimary/10 flex items-center justify-center flex-shrink-0 text-[11px] font-bold text-appPrimary uppercase">
                            {
                              (inv.profiles?.full_name ||
                                inv.profiles?.email ||
                                "?")[0]
                            }
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm text-white font-medium truncate">
                              {inv.profiles?.full_name || "—"}
                            </p>
                            <p className="text-[11px] text-zinc-500 flex items-center gap-1 truncate">
                              <Mail className="h-3 w-3 flex-shrink-0" />
                              {inv.profiles?.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      {/* Plan */}
                      <td className="px-5 py-4 text-sm text-zinc-300 font-medium">
                        {inv.subscriptions?.subscription_plans?.name || "—"}
                      </td>
                      {/* Amount */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-appPrimary/10 border border-appPrimary/20 rounded-lg w-fit">
                            <Banknote className="h-3.5 w-3.5 text-appPrimary flex-shrink-0" />
                            <span className="text-sm text-white font-bold">
                              Rp {(inv.amount_idr || inv.amount || 0).toLocaleString("id-ID")}
                            </span>
                          </div>
                          {inv.amount_usd && (
                            <div className="text-[10px] text-zinc-500 font-medium pl-1">
                              ${inv.amount_usd.toFixed(2)} USD
                            </div>
                          )}
                          {inv.profit_usd_ref && (
                            <div className="flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-md w-fit">
                              <TrendingUp className="h-2.5 w-2.5 text-amber-400" />
                              <span className="text-[10px] text-amber-200 font-bold uppercase tracking-wider">
                                Profit: ${inv.profit_usd_ref}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      {/* Status */}
                      <td className="px-5 py-4">
                        <StatusBadge status={inv.status} />
                      </td>
                      {/* Due date */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-zinc-400">
                          <Calendar className="h-3.5 w-3.5 text-zinc-600 flex-shrink-0" />
                          {inv.due_date
                            ? new Date(inv.due_date).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            : "—"}
                        </div>
                      </td>
                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <select
                              value={inv.status}
                              onChange={(e) =>
                                updateInvoiceStatus(inv.id, e.target.value)
                              }
                              disabled={updatingId === inv.id}
                              style={{
                                ...selectStyle,
                                borderRadius: "0.5rem",
                                outline: "none",
                                paddingLeft: "0.625rem",
                                paddingRight: "1.75rem",
                                paddingTop: "0.375rem",
                                paddingBottom: "0.375rem",
                                fontSize: "0.75rem",
                                appearance: "none",
                                cursor: "pointer",
                                opacity: updatingId === inv.id ? 0.5 : 1,
                              }}
                            >
                               <option value="pending">Pending</option>
                               <option value="pending_confirmation">Waiting Confirm</option>
                               <option value="paid">Paid</option>
                               <option value="overdue">Overdue</option>
                            </select>
                            {updatingId === inv.id ? (
                              <RefreshCw className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-500 animate-spin pointer-events-none" />
                            ) : (
                              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-600 pointer-events-none" />
                            )}
                          </div>
                           <button
                             className="w-7 h-7 flex items-center justify-center bg-white/4 hover:bg-appPrimary/10 hover:text-appPrimary text-zinc-500 rounded-lg transition"
                             title="Lihat detail"
                           >
                             <Eye className="h-3.5 w-3.5" />
                           </button>
                           {inv.status === "pending_confirmation" && (
                             <button
                               onClick={() => updateInvoiceStatus(inv.id, "paid")}
                               disabled={updatingId === inv.id}
                               className="w-7 h-7 flex items-center justify-center bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white rounded-lg transition"
                               title="Confirm Payment"
                             >
                               <CheckCircle className="h-3.5 w-3.5" />
                             </button>
                           )}
                          {(inv.status === "pending" || inv.status === "overdue") && (
                            <button
                              onClick={() => suspendSubscription(inv)}
                              className="w-7 h-7 flex items-center justify-center bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition"
                              title="Tangguhkan Langganan"
                            >
                              <PauseCircle className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* CARDS — mobile */}
          <div className="md:hidden space-y-3">
            {filtered.length === 0 ? (
              <div className="rounded-2xl bg-[#0d0d14] border border-white/5 p-10 flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 rounded-2xl bg-white/3 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-zinc-600" />
                </div>
                <p className="text-zinc-500 text-sm">
                  Tidak ada invoice ditemukan
                </p>
              </div>
            ) : (
              filtered.map((inv, idx) => (
                <div
                  key={inv.id}
                  className="rounded-2xl bg-[#0d0d14] border border-white/5 p-4 space-y-3 row-in"
                  style={{ animationDelay: idx * 40 + "ms" }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-appPrimary/10 flex items-center justify-center text-[11px] font-bold text-appPrimary uppercase flex-shrink-0">
                        {
                          (inv.profiles?.full_name ||
                            inv.profiles?.email ||
                            "?")[0]
                        }
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-white font-medium truncate">
                          {inv.profiles?.full_name ||
                            inv.profiles?.email ||
                            "—"}
                        </p>
                        <p className="text-[11px] text-zinc-500 truncate">
                          {inv.profiles?.email}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={inv.status} />
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/4">
                    <div>
                      <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-0.5">
                        Paket
                      </p>
                      <p className="text-xs text-white font-medium">
                        {inv.subscriptions?.subscription_plans?.name || "—"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-0.5">
                        Amount
                      </p>
                      <p className="text-xs text-white font-semibold flex items-center gap-1 justify-end">
                        <Banknote className="h-3 w-3 text-appPrimary" />
                        Rp {(inv.amount || 0).toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-0.5">
                        Due
                      </p>
                      <p className="text-xs text-zinc-400">
                        {inv.due_date
                          ? new Date(inv.due_date).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                            })
                          : "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <div className="relative flex-1">
                      <select
                        value={inv.status}
                        onChange={(e) =>
                          updateInvoiceStatus(inv.id, e.target.value)
                        }
                        disabled={updatingId === inv.id}
                        style={{
                          ...selectStyle,
                          borderRadius: "0.75rem",
                          outline: "none",
                          width: "100%",
                          paddingLeft: "0.75rem",
                          paddingRight: "1.75rem",
                          paddingTop: "0.5rem",
                          paddingBottom: "0.5rem",
                          fontSize: "0.75rem",
                          appearance: "none",
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                      </select>
                      {updatingId === inv.id ? (
                        <RefreshCw className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-500 animate-spin pointer-events-none" />
                      ) : (
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-600 pointer-events-none" />
                      )}
                    </div>
                    <button className="w-9 h-9 flex items-center justify-center bg-white/4 hover:bg-appPrimary/10 hover:text-appPrimary text-zinc-500 rounded-xl transition flex-shrink-0">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SUMMARY FOOTER */}
        {filtered.length > 0 && (
          <div
            className={`grid grid-cols-2 sm:grid-cols-3 gap-3 ${fadeClass} ${transition}`}
            style={{ transitionDelay: "300ms" }}
          >
            {[
              {
                label: "Paid",
                count: filtered.filter((i) => i.status === "paid").length,
                cls: "text-emerald-400",
                dot: "bg-emerald-400",
              },
              {
                label: "Pending",
                count: filtered.filter((i) => i.status === "pending").length,
                cls: "text-amber-400",
                dot: "bg-amber-400 animate-pulse",
              },
              {
                label: "Overdue",
                count: filtered.filter((i) => i.status === "overdue").length,
                cls: "text-red-400",
                dot: "bg-red-400",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0d0d14] border border-white/5"
              >
                <span
                  className={"w-2 h-2 rounded-full flex-shrink-0 " + s.dot}
                />
                <span className="text-xs text-zinc-500">{s.label}</span>
                <span className={"ml-auto text-sm font-bold " + s.cls}>
                  {s.count}
                </span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
