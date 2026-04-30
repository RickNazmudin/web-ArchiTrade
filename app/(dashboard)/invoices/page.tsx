"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Receipt,
  Calendar,
  Clock3,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  CreditCard,
  Download,
  Loader2,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }
    setUser(user);

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileData) {
      setProfile(profileData);
    }

    // Mencoba join otomatis (Manual Linker logic fallback)
    const { data, error } = await supabase
      .from("invoices")
      .select(
        `
        *,
        subscriptions!subscription_id (
          subscription_plans!plan_id ( name )
        )
      `,
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn(
        "User Invoice Join failed, using manual mapper fallback:",
        error.message,
      );

      const { data: invData } = await supabase
        .from("invoices")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (invData) {
        // Fetch pendukung secara manual
        const [{ data: subData }, { data: planData }] = await Promise.all([
          supabase
            .from("subscriptions")
            .select("id, plan_id")
            .eq("user_id", user.id),
          supabase.from("subscription_plans").select("id, name"),
        ]);

        const mappedData = invData.map((inv) => {
          const sub = subData?.find((s) => s.id === inv.subscription_id);
          const plan = planData?.find((p) => p.id === sub?.plan_id);
          return {
            ...inv,
            subscriptions: sub ? { ...sub, subscription_plans: plan } : null,
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

  const getStatusConfig = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return {
          icon: CheckCircle,
          color: "text-emerald-400",
          bg: "bg-emerald-500/10 border-emerald-500/20",
          label: "Lunas",
          dot: "bg-emerald-400",
        };
      case "pending":
        return {
          icon: Clock3,
          color: "text-amber-400",
          bg: "bg-amber-500/10 border-amber-500/20",
          label: "Menunggu Pembayaran",
          dot: "bg-amber-400",
        };
      case "pending_confirmation":
        return {
          icon: RefreshCw,
          color: "text-sky-400",
          bg: "bg-sky-500/10 border-sky-500/20",
          label: "Menunggu Konfirmasi",
          dot: "bg-sky-400",
        };
      case "overdue":
        return {
          icon: AlertTriangle,
          color: "text-red-400",
          bg: "bg-red-500/10 border-red-500/20",
          label: "Terlambat",
          dot: "bg-red-400",
        };
      default:
        return {
          icon: Receipt,
          color: "text-zinc-400",
          bg: "bg-zinc-500/10 border-zinc-500/20",
          label: status || "Unknown",
          dot: "bg-zinc-400",
        };
    }
  };

  const handleDownloadInvoice = async (invoice: any) => {
    setDownloadingId(invoice.id);

    // Create a printable template
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const amountIdr = Number(
      invoice.amount_idr || invoice.amount || 0,
    ).toLocaleString("id-ID");
    const amountUsd = invoice.amount_usd
      ? `($${invoice.amount_usd.toFixed(2)})`
      : "";
    const isProfitShare = !!invoice.profit_usd_ref;
    const invoiceType = isProfitShare ? "Bagi Hasil (Profit Share)" : "Pembelian Lisensi";
    const date = new Date(invoice.created_at).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const dueDate = new Date(invoice.due_date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice #${invoice.id.slice(-8).toUpperCase()}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #eee; padding-bottom: 20px; }
            .logo { font-size: 24px; font-weight: bold; color: #000; }
            .invoice-info { text-align: right; }
            .details { margin-top: 40px; width: 100%; border-collapse: collapse; }
            .details th { background: #f9f9f9; text-align: left; padding: 12px; border-bottom: 1px solid #eee; }
            .details td { padding: 12px; border-bottom: 1px solid #eee; }
            .total { margin-top: 30px; text-align: right; font-size: 20px; font-weight: bold; }
            .footer { margin-top: 60px; font-size: 12px; color: #777; border-top: 1px solid #eee; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">Archi<span style="color: #3b82f6">Trade</span></div>
            <div class="invoice-info">
              <h1 style="margin:0">INVOICE</h1>
              <p>#${invoice.id.slice(-8).toUpperCase()}</p>
            </div>
          </div>
          <div style="margin-top:20px">
            <p><strong>Tipe Tagihan:</strong> ${invoiceType}</p>
            <p><strong>Tanggal:</strong> ${date}</p>
            <p><strong>Jatuh Tempo:</strong> ${dueDate}</p>
          </div>
          <table class="details">
            <thead>
              <tr>
                <th>Deskripsi Tagihan</th>
                <th style="text-align:right">Total Tagihan</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${invoiceType} - Paket ${invoice.subscriptions?.subscription_plans?.name || "EA Robot"}</td>
                <td style="text-align:right">Rp ${amountIdr} ${amountUsd}</td>
              </tr>
            </tbody>
          </table>
          <div class="total">Total: Rp ${amountIdr}</div>
          <div class="footer">
            <p>Pembayaran via Payment Link</p>
            <p>Terima kasih telah menggunakan layanan ArchiTrade.</p>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
    setDownloadingId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-2 border-appPrimary/15 animate-ping" />
            <div className="absolute inset-2 rounded-full border-2 border-t-appPrimary border-transparent animate-spin" />
            <Receipt className="absolute inset-0 m-auto h-5 w-5 text-appPrimary" />
          </div>
          <p className="text-zinc-600 text-[11px] tracking-widest uppercase">
            Memuat riwayat tagihan
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
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Receipt className="h-3.5 w-3.5 text-amber-400" />
            </div>
            <span className="font-semibold text-sm tracking-tight">
              Riwayat Tagihan
            </span>
          </div>

          {invoices.length > 0 && (
            <div className="ml-auto text-[11px] text-zinc-500">
              {invoices.length} tagihan
            </div>
          )}
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-16">
        {/* PAGE TITLE */}
        <div className="mb-10">
          <p className="text-[11px] text-amber-400 uppercase tracking-[0.15em] font-semibold mb-2">
            KEUANGAN
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Riwayat Tagihan & Pembayaran
          </h1>
          <p className="text-zinc-500 text-sm mt-1.5">
            Kelola dan pantau semua tagihan langganan EA Robot Anda
          </p>
        </div>

        {/* EMPTY STATE */}
        {invoices.length === 0 ? (
          <div className="rounded-3xl bg-[#0d0d14] border border-white/5 p-16 flex flex-col items-center gap-5 text-center">
            <div className="w-20 h-20 rounded-2xl bg-amber-500/10 flex items-center justify-center">
              <Receipt className="h-10 w-10 text-amber-400/40" />
            </div>
            <div>
              <p className="text-white font-semibold text-lg">
                Belum Ada Tagihan
              </p>
              <p className="text-zinc-500 mt-2 max-w-md">
                Anda belum memiliki riwayat pembayaran. Silakan berlangganan
                paket EA Robot untuk melihat tagihan di sini.
              </p>
            </div>
            <Link
              href="/subscription"
              className="mt-4 inline-flex items-center gap-2 bg-appPrimary hover:bg-appPrimary/90 text-black font-semibold px-6 py-3 rounded-2xl transition"
            >
              Pilih Paket Langganan
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {invoices.map((invoice, index) => {
              const statusConfig = getStatusConfig(invoice.status);
              const StatusIcon = statusConfig.icon;

              return (
                <article
                  key={invoice.id}
                  className="group rounded-2xl bg-[#0d0d14] border border-white/5 overflow-hidden hover:border-white/10 transition-all duration-300 hover:shadow-xl"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                      {/* Status Icon */}
                      <div
                        className={`w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center ${statusConfig.bg}`}
                      >
                        <StatusIcon
                          className={`h-7 w-7 ${statusConfig.color}`}
                        />
                      </div>

                      {/* Main Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <div className="text-sm text-zinc-400">
                            {new Date(invoice.created_at).toLocaleDateString(
                              "id-ID",
                              {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              },
                            )}
                          </div>
                          {invoice.status === "paid" && invoice.paid_at && (
                            <div className="text-emerald-400 text-xs flex items-center gap-1">
                              <CheckCircle className="h-3.5 w-3.5" />
                              Dibayar
                            </div>
                          )}
                        </div>

                        <h2 className="font-semibold text-lg sm:text-xl leading-tight mb-1">
                          Paket{" "}
                          {invoice.subscriptions?.subscription_plans?.name ||
                            "EA Robot"}
                        </h2>

                        <p className="text-zinc-400 text-sm">
                          Invoice #{invoice.id.slice(-8).toUpperCase()}
                        </p>
                        {invoice.profit_usd_ref && (
                          <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                            <TrendingUp className="h-3 w-3" />
                            Profit Reference: ${invoice.profit_usd_ref}
                          </div>
                        )}
                      </div>

                      {/* Amount & Status */}
                      <div className="text-right sm:text-right flex-shrink-0">
                        <p className="text-2xl sm:text-3xl font-bold text-appPrimary tracking-tighter">
                          Rp{" "}
                          {Number(
                            invoice.amount_idr || invoice.amount || 0,
                          ).toLocaleString("id-ID")}
                        </p>
                        {invoice.amount_usd && (
                          <p className="text-sm font-medium text-zinc-400">
                            (${Number(invoice.amount_usd).toFixed(2)})
                          </p>
                        )}
                        <div
                          className={`inline-flex items-center gap-2 mt-2 px-4 py-1.5 rounded-full text-sm font-medium border ${statusConfig.bg} ${statusConfig.color}`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${statusConfig.dot} animate-pulse`}
                          />
                          {statusConfig.label}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Bar */}
                  <div className="border-t border-white/5 bg-black/30 px-6 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-6 text-sm text-zinc-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Jatuh tempo:{" "}
                        {new Date(invoice.due_date).toLocaleDateString("id-ID")}
                      </div>
                    </div>

                    <div className="flex gap-3 w-full sm:w-auto">
                      {invoice.status === "pending" && (
                        <button
                          onClick={() => {
                            const isProfitShare = !!invoice.profit_usd_ref;
                            const invoiceType = isProfitShare ? "Bagi Hasil" : "Pembelian Lisensi";
                            const packageName = invoice.subscriptions?.subscription_plans?.name || "EA Robot";
                            const amount = Number(invoice.amount_idr || invoice.amount || 0).toLocaleString("id-ID");

                            const msg = `Halo Admin ArchiTrade, saya ingin melakukan pembayaran tagihan.

Berikut data saya:
- Nama: ${profile?.full_name || "-"}
- Email: ${user?.email || "-"}
- No. Telp: ${profile?.phone || "-"}

Detail Tagihan:
- Tipe: ${invoiceType}
- Paket: Paket ${packageName}
- Total Bayar: Rp ${amount}

Mohon kirimkan Payment Link untuk melanjutkan pembayaran. Terima kasih!`;

                            const waUrl = `https://wa.me/6289617257030?text=${encodeURIComponent(msg)}`;
                            window.open(waUrl, "_blank");
                          }}
                          className="flex-1 sm:flex-none bg-appPrimary hover:bg-appPrimary/90 text-black font-semibold px-6 py-3 rounded-2xl transition flex items-center justify-center gap-2"
                        >
                          <CreditCard className="h-4 w-4" />
                          Bayar Sekarang
                        </button>
                      )}

                      <button
                        onClick={() => handleDownloadInvoice(invoice)}
                        disabled={downloadingId === invoice.id}
                        className="flex-1 sm:flex-none border border-white/10 hover:border-white/20 hover:bg-white/5 px-6 py-3 rounded-2xl transition flex items-center justify-center gap-2 disabled:opacity-60"
                      >
                        {downloadingId === invoice.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                        Unduh Invoice
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12 text-center text-[11px] text-zinc-500">
          Semua pembayaran diproses secara otomatis. Hubungi support jika ada
          kendala.
        </div>
      </div>

    </div>
  );
}
