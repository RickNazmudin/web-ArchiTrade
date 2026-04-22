"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Bell,
  Send,
  Users,
  Eye,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Mail,
  Megaphone,
  X,
  UserCheck,
} from "lucide-react";

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "system",
    admin_only: false,
    user_id: "",
  });
  const [sending, setSending] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    checkAdminAndLoad();
  }, []);

  const checkAdminAndLoad = async () => {
    try {
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
      await loadNotifications();
      await loadUsers();
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadNotifications = async () => {
    // Mencoba join otomatis
    const { data, error } = await supabase
      .from("notifications")
      .select(`
        *,
        profiles!user_id (
          full_name,
          email
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Notification join failed, using manual mapper fallback:", error.message);
      
      // Fallback: Ambil data mentah
      const { data: rawNotifs } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (rawNotifs) {
        // Ambil profiles secara manual
        const userIds = Array.from(new Set(rawNotifs.map(n => n.user_id).filter(id => id)));
        const { data: profData } = await supabase
          .from("profiles")
          .select("id, full_name, email")
          .in("id", userIds);
          
        const mappedData = rawNotifs.map(n => ({
          ...n,
          profiles: profData?.find(p => p.id === n.user_id) || null
        }));
        setNotifications(mappedData);
      } else {
        setNotifications([]);
      }
    } else {
      setNotifications(data || []);
    }
  };

  const loadUsers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, role")
      .order("created_at", { ascending: false });

    if (!error) {
      setUsers(data || []);
    }
  };

  const sendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const notificationData: any = {
        title: formData.title,
        message: formData.message,
        type: formData.type,
        admin_only: formData.admin_only,
        created_at: new Date().toISOString(),
      };

      if (formData.user_id && !formData.admin_only) {
        notificationData.user_id = formData.user_id;
      }

      const { error } = await supabase
        .from("notifications")
        .insert(notificationData);

      if (error) throw error;

      alert("Notifikasi berhasil dikirim!");
      setFormData({
        title: "",
        message: "",
        type: "system",
        admin_only: false,
        user_id: "",
      });
      setShowForm(false);
      await loadNotifications();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSending(false);
    }
  };

  const deleteNotification = async (id: string) => {
    if (!confirm("Hapus notifikasi ini?")) return;

    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", id);

    if (!error) {
      await loadNotifications();
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Bell className="w-4 h-4 text-blue-400" />;
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (selectedFilter === "all") return true;
    return notif.type === selectedFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-appPrimary animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Bell className="w-8 h-8 text-appPrimary" />
              Notifications
            </h1>
            <p className="text-gray-400 mt-1">
              Kelola dan kirim notifikasi ke user
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2 bg-appPrimary text-black rounded-lg font-semibold hover:bg-appPrimary/90 transition"
            >
              <Megaphone className="w-4 h-4" />
              Kirim Notifikasi
            </button>
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition"
            >
              ← Back
            </Link>
          </div>
        </div>

        {/* Form Kirim Notifikasi */}
        {showForm && (
          <div className="bg-zinc-900 rounded-xl p-6 mb-8 border border-zinc-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-appPrimary" />
                Kirim Notifikasi Baru
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={sendNotification} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-1">
                  Judul
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">
                  Pesan
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white resize-none"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-1">
                    Tipe Notifikasi
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                  >
                    <option value="system">System</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1">
                    Target
                  </label>
                  <select
                    value={
                      formData.admin_only ? "admin" : formData.user_id || "all"
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "all") {
                        setFormData({
                          ...formData,
                          admin_only: false,
                          user_id: "",
                        });
                      } else if (val === "admin") {
                        setFormData({
                          ...formData,
                          admin_only: true,
                          user_id: "",
                        });
                      } else {
                        setFormData({
                          ...formData,
                          admin_only: false,
                          user_id: val,
                        });
                      }
                    }}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                  >
                    <option value="all">Semua User</option>
                    <option value="admin">Admin Saja</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.full_name || user.email} ({user.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                disabled={sending}
                className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-2 bg-appPrimary text-black rounded-lg font-semibold hover:bg-appPrimary/90 transition disabled:opacity-50"
              >
                {sending ? "Mengirim..." : "Kirim Notifikasi"}
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setSelectedFilter("all")}
            className={`px-4 py-2 rounded-lg transition ${
              selectedFilter === "all"
                ? "bg-appPrimary text-black"
                : "bg-zinc-800 text-gray-400 hover:bg-zinc-700"
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setSelectedFilter("system")}
            className={`px-4 py-2 rounded-lg transition ${
              selectedFilter === "system"
                ? "bg-appPrimary text-black"
                : "bg-zinc-800 text-gray-400 hover:bg-zinc-700"
            }`}
          >
            System
          </button>
          <button
            onClick={() => setSelectedFilter("success")}
            className={`px-4 py-2 rounded-lg transition ${
              selectedFilter === "success"
                ? "bg-appPrimary text-black"
                : "bg-zinc-800 text-gray-400 hover:bg-zinc-700"
            }`}
          >
            Success
          </button>
          <button
            onClick={() => setSelectedFilter("warning")}
            className={`px-4 py-2 rounded-lg transition ${
              selectedFilter === "warning"
                ? "bg-appPrimary text-black"
                : "bg-zinc-800 text-gray-400 hover:bg-zinc-700"
            }`}
          >
            Warning
          </button>
        </div>

        {/* Daftar Notifikasi */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="bg-zinc-900 rounded-xl p-12 text-center">
              <Bell className="w-12 h-12 mx-auto mb-3 text-gray-600" />
              <p className="text-gray-400">Belum ada notifikasi</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className="bg-zinc-900 rounded-xl p-5 border border-zinc-800 hover:bg-zinc-800/50 transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">{getTypeIcon(notif.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-white font-semibold">
                          {notif.title}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {new Date(notif.created_at).toLocaleString()}
                        </span>
                        {notif.admin_only && (
                          <span className="text-xs px-2 py-0.5 bg-purple-600/20 text-purple-400 rounded-full">
                            Admin Only
                          </span>
                        )}
                        {notif.user_id && notif.profiles && (
                          <span className="text-xs px-2 py-0.5 bg-blue-600/20 text-blue-400 rounded-full">
                            To:{" "}
                            {notif.profiles.full_name || notif.profiles.email}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 mt-1">{notif.message}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteNotification(notif.id)}
                    className="p-2 text-gray-500 hover:text-red-400 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
