"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  Image as ImageIcon,
  Save,
  X,
  ArrowLeft,
  Newspaper,
} from "lucide-react";

export default function DailyOutlookAdmin() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [outlooks, setOutlooks] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image_url: "",
    author: "",
  });

  useEffect(() => {
    checkAdminAndLoadData();
  }, []);

  const checkAdminAndLoadData = async () => {
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser) {
      router.push("/login");
      return;
    }

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", currentUser.id)
      .single();

    if (profileData?.role !== "admin") {
      toast.error("Akses ditolak");
      router.push("/dashboard");
      return;
    }

    await loadOutlooks();
    setLoading(false);
  };

  const loadOutlooks = async () => {
    const { data } = await supabase
      .from("daily_outlook")
      .select("*")
      .order("published_date", { ascending: false });

    if (data) setOutlooks(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingId) {
        const { error } = await supabase
          .from("daily_outlook")
          .update({
            title: formData.title,
            content: formData.content,
            image_url: formData.image_url,
            author: formData.author || "Admin",
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Daily outlook berhasil diperbarui!");
      } else {
        const { error } = await supabase.from("daily_outlook").insert({
          title: formData.title,
          content: formData.content,
          image_url: formData.image_url,
          author: formData.author || "Admin",
          published_date: new Date().toISOString(),
          is_active: true,
        });

        if (error) throw error;
        toast.success("Daily outlook berhasil ditambahkan!");
      }

      resetForm();
      await loadOutlooks();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (outlook: any) => {
    setFormData({
      title: outlook.title,
      content: outlook.content,
      image_url: outlook.image_url || "",
      author: outlook.author || "",
    });
    setEditingId(outlook.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus daily outlook ini?")) return;

    const { error } = await supabase
      .from("daily_outlook")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Gagal menghapus");
    } else {
      toast.success("Berhasil dihapus");
      await loadOutlooks();
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("daily_outlook")
      .update({ is_active: !currentStatus })
      .eq("id", id);

    if (error) {
      toast.error("Gagal mengubah status");
    } else {
      toast.success(`Status berhasil diubah`);
      await loadOutlooks();
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      image_url: "",
      author: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-appPrimary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 w-fit"
          >
            <ArrowLeft className="h-4 w-4 text-zinc-400" />
            <span className="text-zinc-400">Kembali ke Dashboard</span>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Newspaper className="h-8 w-8 text-appPrimary" />
              Daily Market Outlook
            </h1>
            <p className="text-zinc-400 mt-1">
              Kelola update analisa pasar harian untuk user
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-appPrimary text-black rounded-xl font-semibold hover:bg-appPrimary/90 transition"
          >
            <Plus className="h-4 w-4" /> Tambah Outlook
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 mb-8">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold text-white">
                {editingId ? "Edit Outlook" : "Tambah Outlook Baru"}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-zinc-800 rounded-lg"
              >
                <X className="h-5 w-5 text-zinc-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Judul *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:border-appPrimary outline-none"
                  placeholder="Contoh: Market Outlook - EUR/USD"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Konten / Analisa *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  rows={5}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:border-appPrimary outline-none resize-none"
                  placeholder="Tulis analisa pasar di sini..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  URL Gambar (opsional)
                </label>
                <div className="flex gap-3">
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) =>
                      setFormData({ ...formData, image_url: e.target.value })
                    }
                    className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:border-appPrimary outline-none"
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.image_url && (
                    <div className="w-16 h-16 bg-zinc-800 rounded-lg overflow-hidden">
                      <img
                        src={formData.image_url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  Gunakan gambar dari Unsplash atau gambar chart
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Nama Author
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:border-appPrimary outline-none"
                  placeholder="Admin / Nama Analis"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-appPrimary text-black rounded-xl font-semibold hover:bg-appPrimary/90 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {editingId ? "Update" : "Simpan"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2.5 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* List Outlooks */}
        <div className="space-y-4">
          {outlooks.length === 0 ? (
            <div className="bg-zinc-900 rounded-2xl p-12 text-center border border-zinc-800">
              <Newspaper className="h-12 w-12 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-400">Belum ada daily outlook</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-3 text-appPrimary hover:underline"
              >
                + Tambah outlook pertama
              </button>
            </div>
          ) : (
            outlooks.map((outlook) => (
              <div
                key={outlook.id}
                className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5 hover:border-zinc-700 transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        {outlook.title}
                      </h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          outlook.is_active
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {outlook.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-zinc-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(outlook.published_date).toLocaleDateString(
                          "id-ID",
                        )}
                      </span>
                      <span>By: {outlook.author || "Admin"}</span>
                    </div>
                    <p className="text-zinc-400 text-sm line-clamp-2">
                      {outlook.content}
                    </p>
                    {outlook.image_url && (
                      <div className="mt-3">
                        <img
                          src={outlook.image_url}
                          alt={outlook.title}
                          className="h-20 w-auto rounded-lg object-cover"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() =>
                        handleToggleActive(outlook.id, outlook.is_active)
                      }
                      className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition"
                      title={outlook.is_active ? "Nonaktifkan" : "Aktifkan"}
                    >
                      <Eye className="h-4 w-4 text-zinc-400" />
                    </button>
                    <button
                      onClick={() => handleEdit(outlook)}
                      className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition"
                    >
                      <Edit2 className="h-4 w-4 text-appPrimary" />
                    </button>
                    <button
                      onClick={() => handleDelete(outlook.id)}
                      className="p-2 bg-zinc-800 rounded-lg hover:bg-red-500/20 transition"
                    >
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
