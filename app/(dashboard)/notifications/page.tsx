"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  ArrowLeft,
  MailOpen,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

export default function UserNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .or(`user_id.eq.${currentUser.id},user_id.is.null`)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading notifications:", error);
        toast.error("Gagal memuat notifikasi");
      } else {
        setNotifications(data || []);
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Terjadi kesalahan saat memuat notifikasi");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);

    if (!error) {
      await loadNotifications();
    } else {
      toast.error("Gagal menandai notifikasi");
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id);
    if (unreadIds.length === 0) return;

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .in("id", unreadIds);

    if (!error) {
      await loadNotifications();
      toast.success("Semua notifikasi ditandai sebagai dibaca");
    } else {
      toast.error("Gagal menandai semua notifikasi");
    }
  };

  const getTypeConfig = (type: string) => {
    switch (type?.toLowerCase()) {
      case "success":
        return {
          icon: CheckCircle,
          color: "text-emerald-400",
          bg: "bg-emerald-500/10 border-emerald-500/20",
        };
      case "warning":
        return {
          icon: AlertTriangle,
          color: "text-amber-400",
          bg: "bg-amber-500/10 border-amber-500/20",
        };
      case "error":
        return {
          icon: XCircle,
          color: "text-red-400",
          bg: "bg-red-500/10 border-red-500/20",
        };
      case "info":
      default:
        return {
          icon: Info,
          color: "text-blue-400",
          bg: "bg-blue-500/10 border-blue-500/20",
        };
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Baru saja";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} menit lalu`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} jam lalu`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} hari lalu`;
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.is_read)
      : notifications;

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-2 border-appPrimary/15 animate-ping" />
            <div className="absolute inset-2 rounded-full border-2 border-t-appPrimary border-transparent animate-spin" />
            <Bell className="absolute inset-0 m-auto h-5 w-5 text-appPrimary" />
          </div>
          <p className="text-zinc-600 text-[11px] tracking-widest uppercase">
            Memuat notifikasi
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
            <div className="w-7 h-7 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <Bell className="h-3.5 w-3.5 text-violet-400" />
            </div>
            <span className="font-semibold text-sm tracking-tight">
              Notifikasi
            </span>
          </div>

          {unreadCount > 0 && (
            <div className="ml-auto flex items-center gap-1.5 text-xs px-3 py-1 bg-red-500/10 text-red-400 rounded-full">
              <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              {unreadCount} baru
            </div>
          )}
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-16">
        {/* PAGE TITLE */}
        <div className="mb-10">
          <p className="text-[11px] text-violet-400 uppercase tracking-[0.15em] font-semibold mb-2">
            PEMBARUAN
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Notifikasi & Pembaruan
          </h1>
          <p className="text-zinc-500 text-sm mt-1.5">
            Informasi penting, update sistem, dan pengumuman dari ArchiTrade
          </p>
        </div>

        {/* FILTER & ACTION BAR */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex gap-2 flex-1">
            <button
              onClick={() => setFilter("all")}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-2xl font-medium transition-all ${
                filter === "all"
                  ? "bg-appPrimary text-black font-semibold"
                  : "bg-white/5 hover:bg-white/10 text-zinc-400 border border-white/5"
              }`}
            >
              Semua ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-2xl font-medium transition-all ${
                filter === "unread"
                  ? "bg-appPrimary text-black font-semibold"
                  : "bg-white/5 hover:bg-white/10 text-zinc-400 border border-white/5"
              }`}
            >
              Belum Dibaca ({unreadCount})
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 rounded-2xl transition font-medium"
            >
              <MailOpen className="h-4 w-4" />
              Tandai Semua Dibaca
            </button>
          )}
        </div>

        {/* NOTIFICATIONS LIST */}
        <div className="space-y-5">
          {filteredNotifications.length === 0 ? (
            <div className="rounded-3xl bg-[#0d0d14] border border-white/5 p-16 flex flex-col items-center gap-5 text-center">
              <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center">
                <Bell className="h-10 w-10 text-zinc-500" />
              </div>
              <div>
                <p className="text-white font-semibold text-lg">
                  {filter === "unread"
                    ? "Tidak ada notifikasi baru"
                    : "Belum ada notifikasi"}
                </p>
                <p className="text-zinc-500 mt-2 max-w-md">
                  {filter === "unread"
                    ? "Anda telah membaca semua notifikasi."
                    : "Notifikasi akan muncul di sini ketika ada update atau pengumuman penting."}
                </p>
              </div>
            </div>
          ) : (
            filteredNotifications.map((notif, index) => {
              const config = getTypeConfig(notif.type);
              const Icon = config.icon;

              return (
                <div
                  key={notif.id}
                  onClick={() => {
                    if (!notif.is_read) markAsRead(notif.id);
                    
                    if (
                      notif.title?.toLowerCase().includes("tagihan") ||
                      notif.title?.toLowerCase().includes("invoice") ||
                      notif.title?.toLowerCase().includes("pembayaran") ||
                      notif.title?.toLowerCase().includes("bagi hasil") ||
                      notif.message?.toLowerCase().includes("tagihan") ||
                      notif.message?.toLowerCase().includes("invoice")
                    ) {
                      router.push("/invoices");
                    }
                  }}
                  className={`group rounded-2xl bg-[#0d0d14] border border-white/5 overflow-hidden hover:border-white/10 transition-all duration-300 hover:shadow-xl cursor-pointer ${
                    !notif.is_read ? "ring-1 ring-violet-500/20" : ""
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="p-6 sm:p-8">
                    <div className="flex gap-5">
                      {/* Icon */}
                      <div
                        className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${config.bg}`}
                      >
                        <Icon className={`h-6 w-6 ${config.color}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <h3
                            className={`font-semibold text-lg leading-tight ${
                              notif.is_read ? "text-zinc-400" : "text-white"
                            }`}
                          >
                            {notif.title}
                          </h3>

                          {!notif.is_read && (
                            <div className="flex items-center gap-1.5 text-xs font-medium bg-violet-500/10 text-violet-400 px-3 py-1 rounded-full">
                              <Sparkles className="h-3 w-3" />
                              BARU
                            </div>
                          )}
                        </div>

                        <p
                          className={`mt-3 text-sm leading-relaxed ${
                            notif.is_read ? "text-zinc-500" : "text-zinc-300"
                          }`}
                        >
                          {notif.message}
                        </p>

                        <div className="mt-4 flex items-center gap-3 text-xs text-zinc-500">
                          <span>{getTimeAgo(notif.created_at)}</span>
                          <span className="w-1 h-1 rounded-full bg-zinc-700" />
                          <span className="capitalize">
                            {notif.type || "info"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center text-[11px] text-zinc-500">
          Notifikasi penting akan dikirim juga melalui email dan Telegram group
        </div>
      </div>
    </div>
  );
}
