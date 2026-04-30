"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Search,
  ArrowRight,
  Receipt,
  Send,
  MessageSquare,
  RefreshCw,
  AlertCircle,
  Wallet,
  Eye,
} from "lucide-react";
import { notificationService } from "@/lib/notifications";
import { toast } from "sonner";

export default function AdminProfitsPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [profitAmount, setProfitAmount] = useState("");
  const [generating, setGenerating] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(16000);
  const [fetchingRate, setFetchingRate] = useState(false);
  const [rateDate, setRateDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    checkAdminAndLoad();
    fetchExchangeRate();
  }, []);

  const fetchExchangeRate = async () => {
    setFetchingRate(true);
    try {
      // Menggunakan local API route (server-side fetch) untuk menghindari CORS/Local Network issues
      const resp = await fetch("/api/exchange-rate");
      const data = await resp.json();
      
      if (data.success && data.rate) {
        setExchangeRate(data.rate);
        
        // Format tanggal update
        const dateObj = new Date(data.date);
        const date = dateObj.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric"
        });
        setRateDate(date);
      } else {
        throw new Error("Gagal mengambil data dari API lokal");
      }
    } catch (err) {
      console.error("Error fetching rate:", err);
      // Biarkan exchangeRate di nilai terakhir (atau default 16000)
    } finally {
      setFetchingRate(false);
    }
  };

  useEffect(() => {
    // Handle deep linking ?user=user_id
    const searchParams = new URLSearchParams(window.location.search);
    const userId = searchParams.get("user");
    if (userId && users.length > 0) {
      const user = users.find(u => u.id === userId);
      if (user) setSelectedUser(user);
    }
  }, [users]);

  const checkAdminAndLoad = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

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
      await loadUsersWithSubs();
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadUsersWithSubs = async () => {
    setLoading(true);
    try {
      const { data: profiles, error: pError } = await supabase
        .from("profiles")
        .select("id, full_name, email, phone")
        .eq("role", "customer");
        
      if (pError) throw pError;

      const { data: subs, error: sError } = await supabase
        .from("subscriptions")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (sError) throw sError;

      const { data: mt5Accounts, error: mError } = await supabase
        .from("mt5_accounts")
        .select("id, mt5_id, mt5_server");
        
      if (mError) throw mError;

      const { data: plans, error: plError } = await supabase
        .from("subscription_plans")
        .select("*");
        
      if (plError) throw plError;

      const mappedItems = (subs || []).map(sub => {
        const profile = profiles?.find(p => p.id === sub.user_id);
        const mt5 = mt5Accounts?.find(m => m.id === sub.mt5_account_id);
        const plan = plans?.find(p => p.id === sub.plan_id);
        
        return {
          id: profile?.id || sub.user_id, 
          full_name: profile?.full_name || "Unknown User",
          email: profile?.email || "",
          phone: profile?.phone || "",
          mt5_id: mt5?.mt5_id || "No MT5 ID",
          mt5_server: mt5?.mt5_server || "No Server",
          subscription_id: sub.id,
          subscription: {
            ...sub,
            subscription_plans: plan || null
          }
        };
      });

      setUsers(mappedItems);
    } catch (err: any) {
      toast.error("Gagal memuat data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateInvoice = () => {
    if (!selectedUser?.subscription?.subscription_plans) return null;
    const profit = parseFloat(profitAmount) || 0;
    const sharePercent = selectedUser.subscription.subscription_plans.share_profit_percent || 0;
    const amountUsd = profit * (sharePercent / 100);
    const amountIdr = amountUsd * exchangeRate;

    return { profit, sharePercent, amountUsd, amountIdr };
  };

  const handleGenerateInvoice = async () => {
    if (!selectedUser || !profitAmount) {
      toast.error("Pilih user dan masukkan nominal profit");
      return;
    }

    const calc = calculateInvoice();
    if (!calc) return;

    setGenerating(true);
    try {
      const notifMsg = `Tagihan bagi hasil profit bulan ${selectedMonth}/${selectedYear} telah terbit sebesar $${calc.amountUsd.toFixed(2)} (Rp ${calc.amountIdr.toLocaleString("id-ID")}). Silakan cek menu tagihan.`;

      const res = await fetch("/api/admin/invoices/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: selectedUser.id,
          subscription_id: selectedUser.subscription.id,
          amount_idr: calc.amountIdr,
          amount_usd: calc.amountUsd,
          profit_usd_ref: calc.profit,
          month: selectedMonth,
          year: selectedYear,
          message: notifMsg,
          email: selectedUser.email
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal membuat tagihan");

      if (selectedUser.email) {
        await notificationService.sendEmail({
          userId: selectedUser.id,
          title: "Tagihan Profit-Share Baru",
          message: notifMsg,
          email: selectedUser.email
        });
      }

      toast.success("Invoice berhasil dibuat & Notifikasi dikirim!");
      
      // Reset state
      setSelectedUser(null);
      setProfitAmount("");
    } catch (err: any) {
      toast.error("Gagal membuat tagihan: " + err.message);
    } finally {
      setGenerating(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.mt5_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-appPrimary" />
              Profit & Billing Management
            </h1>
            <p className="text-gray-400 mt-1">Input profit trading dan terbitkan tagihan bagi hasil secara manual.</p>
          </div>
          <Link
            href="/admin/dashboard"
            className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition"
          >
            ← Back
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* USER SELECTION LIST */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Cari user berlisensi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                />
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    Belum ada user dengan lisensi aktif
                  </div>
                ) : (
                  filteredUsers.map(u => {
                    const isActive = u.subscription?.status === "active";
                    return (
                      <button
                        key={u.subscription_id}
                        disabled={!isActive}
                        onClick={() => setSelectedUser(u)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl transition border ${
                          !isActive
                            ? "bg-zinc-900/30 border-zinc-800/50 opacity-50 cursor-not-allowed"
                            : selectedUser?.subscription_id === u.subscription_id
                              ? "bg-appPrimary/10 border-appPrimary"
                              : "bg-zinc-800/50 border-zinc-700 hover:border-zinc-500"
                        }`}
                      >
                        <div className="flex items-center gap-3 text-left">
                          <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-white font-bold">
                            {u.full_name?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="text-white font-semibold">{u.full_name}</p>
                            <p className="text-xs text-gray-400 font-mono mt-0.5">ID: {u.mt5_id}</p>
                            <p className="text-[10px] text-gray-500 font-mono">Srv: {u.mt5_server}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {isActive ? (
                            <span className="text-[10px] px-2 py-0.5 bg-appPrimary/20 text-appPrimary rounded-full uppercase font-bold">
                              {u.subscription.subscription_plans?.name} ({u.subscription.subscription_plans?.share_profit_percent}%)
                            </span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full uppercase font-bold text-center block">
                              Tidak Aktif ({u.subscription?.status})
                            </span>
                          )}
                          <ArrowRight className={`w-4 h-4 mt-1 ml-auto ${selectedUser?.subscription_id === u.subscription_id ? "text-appPrimary" : "text-gray-600"}`} />
                        </div>
                      </button>
                    )
                  })
                )}
              </div>
            </div>
          </div>

          {/* BILLING FORM */}
          <div className="space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-appPrimary" />
                Buat Tagihan Profit
              </h2>

              {selectedUser ? (
                <div className="space-y-6">
                  {/* Selected User Summary */}
                  <div className="p-4 bg-zinc-800 rounded-lg border border-zinc-700">
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">User Terpilih</p>
                    <p className="text-white font-bold">{selectedUser.full_name}</p>
                    <p className="text-sm text-appPrimary">{selectedUser.subscription?.subscription_plans?.name} Tier ({selectedUser.subscription?.subscription_plans?.share_profit_percent}% Profit Share)</p>
                  </div>

                  {/* Period Selection */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Bulan</label>
                      <select 
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white"
                      >
                        {months.map((m, i) => <option key={m} value={i+1}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Tahun</label>
                      <select 
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white"
                      >
                        <option value={2025}>2025</option>
                        <option value={2026}>2026</option>
                      </select>
                    </div>
                  </div>

                  {/* Profit Input */}
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Total Profit (USD)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="number"
                        placeholder="0.00"
                        value={profitAmount}
                        onChange={(e) => setProfitAmount(e.target.value)}
                        className="w-full pl-9 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white font-bold text-lg"
                      />
                    </div>
                  </div>

                  {/* Preview Calculation */}
                  {profitAmount && parseFloat(profitAmount) > 0 && (
                    <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Profit Share (%):</span>
                        <span className="text-white font-semibold">{selectedUser.subscription?.subscription_plans?.share_profit_percent}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Fee (USD):</span>
                        <span className="text-appPrimary font-bold">${calculateInvoice()?.amountUsd.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Fee (IDR):</span>
                        <span className="text-appPrimary font-bold">Rp {calculateInvoice()?.amountIdr.toLocaleString("id-ID")}</span>
                      </div>
                      <div className="mt-2 pt-2 border-t border-white/5 space-y-2">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1">
                            <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block mb-1">Kurs USD/IDR (Bisa diedit)</label>
                            <div className="flex items-center gap-2">
                              <div className="relative flex-1">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500">Rp</span>
                                <input 
                                  type="number"
                                  value={exchangeRate}
                                  onChange={(e) => setExchangeRate(parseInt(e.target.value) || 0)}
                                  className="w-full pl-7 pr-2 py-1.5 bg-zinc-800 border border-zinc-700 rounded text-xs text-appPrimary font-bold focus:border-appPrimary/50 focus:ring-0 transition"
                                />
                              </div>
                              <button 
                                onClick={fetchExchangeRate}
                                disabled={fetchingRate}
                                className="p-1.5 hover:bg-white/5 rounded-lg transition-colors group/rate flex-shrink-0 border border-white/5"
                                title="Auto Sync"
                                type="button"
                              >
                                <RefreshCw className={`w-3.5 h-3.5 text-zinc-600 group-hover/rate:text-appPrimary ${fetchingRate ? 'animate-spin' : ''}`} />
                              </button>
                            </div>
                          </div>
                        </div>
                        {rateDate && (
                          <div className="flex items-center gap-1.5">
                            <div className="w-1 h-1 rounded-full bg-emerald-500/50" />
                            <p className="text-[9px] text-zinc-600 italic">Terakhir diupdate: {rateDate}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="space-y-3 pt-4">
                    <button
                      onClick={handleGenerateInvoice}
                      disabled={generating || !profitAmount || !selectedUser.subscription}
                      className="w-full py-4 bg-appPrimary text-black rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-appPrimary/90 disabled:opacity-50 transition shadow-lg shadow-appPrimary/10"
                    >
                      {generating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                      Generate & Notify User
                    </button>

                    <button
                      onClick={() => {
                        const calc = calculateInvoice();
                        if (!calc) return;
                        const msg = `Halo ${selectedUser.full_name}, ArchiTrade telah menerbitkan tagihan bagi hasil profit untuk bulan ${months[selectedMonth-1]} ${selectedYear}.\n\nProfit Anda: $${calc.profit}\nShare (${calc.sharePercent}%): $${calc.amountUsd.toFixed(2)}\nTotal (Rp): Rp ${calc.amountIdr.toLocaleString("id-ID")}\n\nSilakan lakukan pembayaran melalui dashboard. Terima kasih.`;
                        window.open(notificationService.getWALink(selectedUser.phone || "", msg), "_blank");
                      }}
                      className="w-full py-3 bg-zinc-800 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-zinc-700 transition"
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-400" />
                      Forward via WhatsApp
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 text-gray-500 border-2 border-dashed border-zinc-800 rounded-xl">
                  <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-20" />
                  Pilih user untuk memulai
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
