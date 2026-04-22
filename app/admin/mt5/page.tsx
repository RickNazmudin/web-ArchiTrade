"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Import icons modern dari lucide-react
import {
  TrendingUp,
  ArrowLeft,
  Users,
  Server,
  Calendar,
  CheckCircle,
  XCircle,
  Loader2,
  Search,
  RefreshCw,
  Eye,
  EyeOff,
  Trash2,
  AlertCircle,
  User,
  Mail,
  Key,
} from "lucide-react";

export default function AdminMt5Page() {
  const [mt5Accounts, setMt5Accounts] = useState<any[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [refreshing, setRefreshing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [decryptedPasswords, setDecryptedPasswords] = useState<{
    [key: string]: string;
  }>({});
  const [loadingPasswords, setLoadingPasswords] = useState<{
    [key: string]: boolean;
  }>({});

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    checkAdminAndLoad();
  }, []);

  // Filter effect
  useEffect(() => {
    let filtered = [...mt5Accounts];

    if (searchTerm) {
      filtered = filtered.filter(
        (account) =>
          account.mt5_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          account.profiles?.full_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          account.profiles?.email
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (account) => account.is_active === (statusFilter === "active"),
      );
    }

    setFilteredAccounts(filtered);
  }, [searchTerm, statusFilter, mt5Accounts]);

  const checkAdminAndLoad = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    // Cek role admin
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error checking profile:", profileError);
      router.push("/dashboard");
      return;
    }

    if (profile?.role !== "admin") {
      router.push("/dashboard");
      return;
    }

    setIsAdmin(true);
    await loadMt5Accounts();
  };

  const loadMt5Accounts = async () => {
    setLoading(true);
    setError(null);

    // Mencoba join otomatis (cara paling efisien)
    const { data, error } = await supabase
      .from("mt5_accounts")
      .select(`
        *,
        profiles!user_id (
          id,
          full_name,
          email,
          role,
          phone,
          created_at
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("MT5 Join failed, using manual mapper fallback:", error.message);
      
      // FALLBACK: Ambil data secara terpisah
      const [
        { data: mt5Data, error: mt5Error },
        { data: profData }
      ] = await Promise.all([
        supabase.from("mt5_accounts").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("*")
      ]);
      
      if (mt5Error) {
        setError(mt5Error.message);
        setMt5Accounts([]);
      } else if (mt5Data) {
        // Sambungkan data user secara manual
        const mappedData = mt5Data.map(account => ({
          ...account,
          profiles: profData?.find(p => p.id === account.user_id)
        }));
        setMt5Accounts(mappedData);
      }
    } else {
      setMt5Accounts(data || []);
    }
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMt5Accounts();
    setRefreshing(false);
  };

  const handleDelete = async (accountId: string) => {
    setDeleting(true);
    const { error } = await supabase
      .from("mt5_accounts")
      .delete()
      .eq("id", accountId);

    if (error) {
      console.error("Error deleting MT5 account:", error);
      alert("Gagal menghapus akun MT5: " + error.message);
    } else {
      await loadMt5Accounts();
      alert("Akun MT5 berhasil dihapus");
    }
    setDeleting(false);
    setShowDeleteConfirm(null);
  };

  const handleToggleStatus = async (
    accountId: string,
    currentStatus: boolean,
  ) => {
    const { error } = await supabase
      .from("mt5_accounts")
      .update({ is_active: !currentStatus })
      .eq("id", accountId);

    if (error) {
      console.error("Error updating status:", error);
      alert("Gagal mengupdate status: " + error.message);
    } else {
      await loadMt5Accounts();
    }
  };
  
  const handleViewPassword = async (accountId: string) => {
    // Jika sudah ada, toggle saja (opsional, tapi di sini kita hapus jika diklik lagi)
    if (decryptedPasswords[accountId]) {
      const newDecrypted = { ...decryptedPasswords };
      delete newDecrypted[accountId];
      setDecryptedPasswords(newDecrypted);
      return;
    }

    setLoadingPasswords((prev) => ({ ...prev, [accountId]: true }));
    try {
      const response = await fetch("/api/admin/mt5/decrypt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accountId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setDecryptedPasswords((prev) => ({
        ...prev,
        [accountId]: data.password,
      }));
    } catch (err: any) {
      alert("Gagal memuat password: " + err.message);
    } finally {
      setLoadingPasswords((prev) => ({ ...prev, [accountId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-appPrimary" />
          <p className="text-gray-400">Memuat data MT5 Accounts...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-sky-500/10 rounded-2xl flex items-center justify-center">
              <Server className="w-7 h-7 text-sky-500" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Manajemen MT5 Accounts
              </h1>
              <p className="text-gray-400 text-sm">
                Kelola semua akun MetaTrader 5 user
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition"
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
              <span className="text-sm">Refresh</span>
            </button>
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-400">Error: {error}</p>
            <button
              onClick={loadMt5Accounts}
              className="ml-auto text-sm text-appPrimary hover:underline"
            >
              Coba lagi
            </button>
          </div>
        )}

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama user, email, atau MT5 ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-appPrimary transition"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-4 py-2 rounded-xl transition ${
                statusFilter === "all"
                  ? "bg-appPrimary text-black"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setStatusFilter("active")}
              className={`px-4 py-2 rounded-xl transition flex items-center gap-1 ${
                statusFilter === "active"
                  ? "bg-green-500 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Active
            </button>
            <button
              onClick={() => setStatusFilter("inactive")}
              className={`px-4 py-2 rounded-xl transition flex items-center gap-1 ${
                statusFilter === "inactive"
                  ? "bg-red-500 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              Inactive
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
            <p className="text-zinc-400 text-sm">Total Accounts</p>
            <p className="text-2xl font-bold text-white">
              {mt5Accounts.length}
            </p>
          </div>
          <div className="bg-zinc-900/50 rounded-xl p-4 border border-green-500/20">
            <p className="text-zinc-400 text-sm">Active</p>
            <p className="text-2xl font-bold text-green-500">
              {mt5Accounts.filter((a) => a.is_active).length}
            </p>
          </div>
          <div className="bg-zinc-900/50 rounded-xl p-4 border border-red-500/20">
            <p className="text-zinc-400 text-sm">Inactive</p>
            <p className="text-2xl font-bold text-red-500">
              {mt5Accounts.filter((a) => !a.is_active).length}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Nama User
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4" />
                      MT5 ID
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                    <div className="flex items-center gap-2">
                       <Key className="w-4 h-4 opacity-50" />
                       Password
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                    <div className="flex items-center gap-2">
                      <Server className="w-4 h-4" />
                      Server
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Created At
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filteredAccounts.map((account) => (
                  <tr
                    key={account.id}
                    className="hover:bg-zinc-800/50 transition-colors"
                  >
                    <td className="px-6 py-5 text-sm text-white font-medium">
                      {account.profiles?.full_name ||
                        account.profiles?.email?.split("@")[0] ||
                        "-"}
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-400">
                      {account.profiles?.email || "-"}
                    </td>
                    <td className="px-6 py-5 text-sm font-mono text-white">
                      {account.mt5_id}
                    </td>
                    <td className="px-6 py-5 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-white">
                          {decryptedPasswords[account.id] 
                            ? decryptedPasswords[account.id] 
                            : "••••••••"}
                        </span>
                        <button 
                          onClick={() => handleViewPassword(account.id)}
                          disabled={loadingPasswords[account.id]}
                          className="p-1 hover:bg-zinc-700 rounded transition text-zinc-500"
                        >
                          {loadingPasswords[account.id] ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : decryptedPasswords[account.id] ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-400">
                      {account.mt5_server}
                    </td>
                    <td className="px-6 py-5 text-sm">
                      <button
                        onClick={() =>
                          handleToggleStatus(account.id, account.is_active)
                        }
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition ${
                          account.is_active
                            ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                            : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                        }`}
                      >
                        {account.is_active ? (
                          <CheckCircle className="w-3.5 h-3.5" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5" />
                        )}
                        {account.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-400">
                      {new Date(account.created_at).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </td>
                    <td className="px-6 py-5 text-sm">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/users/${account.user_id}`}
                          className="p-1.5 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition"
                          title="Lihat user"
                        >
                          <Eye className="w-4 h-4 text-blue-400" />
                        </Link>
                        <button
                          onClick={() => setShowDeleteConfirm(account.id)}
                          className="p-1.5 bg-zinc-800 rounded-lg hover:bg-red-500/20 transition"
                          title="Hapus akun"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAccounts.length === 0 && (
            <div className="text-center py-20 text-gray-400 flex flex-col items-center">
              <Server className="w-16 h-16 mb-4 text-zinc-600" />
              <p>Belum ada data MT5 accounts</p>
              {searchTerm && (
                <p className="text-sm text-zinc-500 mt-2">
                  Tidak ada hasil untuk "{searchTerm}"
                </p>
              )}
            </div>
          )}
        </div>

        {/* Info footer */}
        {mt5Accounts.length > 0 && (
          <div className="mt-4 text-right">
            <p className="text-xs text-zinc-500">
              Menampilkan {filteredAccounts.length} dari {mt5Accounts.length}{" "}
              data
            </p>
          </div>
        )}
      </div>

      {/* Modal Konfirmasi Hapus */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/10 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-white">
                Hapus Akun MT5?
              </h3>
            </div>
            <p className="text-zinc-400 text-sm mb-6">
              Apakah Anda yakin ingin menghapus akun MT5 ini? Tindakan ini tidak
              dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                disabled={deleting}
                className="flex-1 bg-red-600 hover:bg-red-700 py-2.5 rounded-xl font-medium transition disabled:opacity-50"
              >
                {deleting ? "Menghapus..." : "Ya, Hapus"}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 py-2.5 rounded-xl font-medium transition"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
