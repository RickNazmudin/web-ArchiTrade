"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Settings,
  Save,
  RefreshCw,
  Globe,
  DollarSign,
  Bell,
  Shield,
  Database,
  Mail,
  User,
  Lock,
  Moon,
  Sun,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    site_name: "ArchiTrade",
    site_description: "Platform EA Robot Trading Otomatis",
    contact_email: "admin@architrade.com",
    support_phone: "+62 812 3456 7890",
    profit_share_percent: 25,
    min_investment: 100,
    max_investment: 10000,
    maintenance_mode: false,
    dark_mode: true,
  });
  const [plans, setPlans] = useState<any[]>([]);
  const [planForm, setPlanForm] = useState({
    name: "",
    min_deposit: "",
    max_deposit: "",
    share_profit_percent: "",
    price_monthly: "",
  });
  const [editingPlan, setEditingPlan] = useState<any>(null);
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
      await loadPlans();
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadPlans = async () => {
    const { data, error } = await supabase
      .from("subscription_plans")
      .select("*")
      .order("min_deposit", { ascending: true });

    if (!error) {
      setPlans(data || []);
    }
  };

  const saveGeneralSettings = async () => {
    setSaving(true);
    // Simpan ke localStorage atau database
    localStorage.setItem("site_settings", JSON.stringify(settings));
    alert("Pengaturan berhasil disimpan!");
    setSaving(false);
  };

  const savePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingPlan) {
        const { error } = await supabase
          .from("subscription_plans")
          .update({
            name: planForm.name,
            min_deposit: parseFloat(planForm.min_deposit),
            max_deposit: planForm.max_deposit
              ? parseFloat(planForm.max_deposit)
              : null,
            share_profit_percent: parseInt(planForm.share_profit_percent),
            price_monthly: parseFloat(planForm.price_monthly),
          })
          .eq("id", editingPlan.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("subscription_plans").insert({
          name: planForm.name,
          min_deposit: parseFloat(planForm.min_deposit),
          max_deposit: planForm.max_deposit
            ? parseFloat(planForm.max_deposit)
            : null,
          share_profit_percent: parseInt(planForm.share_profit_percent),
          price_monthly: parseFloat(planForm.price_monthly),
        });

        if (error) throw error;
      }

      setPlanForm({
        name: "",
        min_deposit: "",
        max_deposit: "",
        share_profit_percent: "",
        price_monthly: "",
      });
      setEditingPlan(null);
      await loadPlans();
      alert("Plan berhasil disimpan!");
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const deletePlan = async (id: string) => {
    if (!confirm("Hapus plan ini?")) return;

    const { error } = await supabase
      .from("subscription_plans")
      .delete()
      .eq("id", id);

    if (!error) {
      await loadPlans();
    }
  };

  const editPlan = (plan: any) => {
    setEditingPlan(plan);
    setPlanForm({
      name: plan.name,
      min_deposit: plan.min_deposit.toString(),
      max_deposit: plan.max_deposit?.toString() || "",
      share_profit_percent: plan.share_profit_percent.toString(),
      price_monthly: plan.price_monthly.toString(),
    });
  };

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Settings className="w-8 h-8 text-appPrimary" />
              Pengaturan
            </h1>
            <p className="text-gray-400 mt-1">Kelola konfigurasi website</p>
          </div>
          <Link
            href="/admin/dashboard"
            className="text-gray-400 hover:text-white"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* General Settings */}
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-appPrimary" />
              Pengaturan Umum
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-1">
                  Nama Website
                </label>
                <input
                  type="text"
                  value={settings.site_name}
                  onChange={(e) =>
                    setSettings({ ...settings, site_name: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">
                  Deskripsi
                </label>
                <textarea
                  value={settings.site_description}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      site_description: e.target.value,
                    })
                  }
                  rows={2}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white resize-none"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">
                  Email Kontak
                </label>
                <input
                  type="email"
                  value={settings.contact_email}
                  onChange={(e) =>
                    setSettings({ ...settings, contact_email: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">
                  No. Telepon
                </label>
                <input
                  type="text"
                  value={settings.support_phone}
                  onChange={(e) =>
                    setSettings({ ...settings, support_phone: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                />
              </div>
              <button
                onClick={saveGeneralSettings}
                disabled={saving}
                className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-appPrimary text-black rounded-lg font-semibold hover:bg-appPrimary/90 transition"
              >
                <Save className="w-4 h-4" />
                Simpan Pengaturan
              </button>
            </div>
          </div>

          {/* Investment Settings */}
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-appPrimary" />
              Pengaturan Investasi
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-1">
                  Profit Sharing Default (%)
                </label>
                <input
                  type="number"
                  value={settings.profit_share_percent}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      profit_share_percent: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">
                  Minimal Investasi (USD)
                </label>
                <input
                  type="number"
                  value={settings.min_investment}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      min_investment: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">
                  Maksimal Investasi (USD)
                </label>
                <input
                  type="number"
                  value={settings.max_investment}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      max_investment: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-gray-300 text-sm">
                  Mode Maintenance
                </label>
                <button
                  onClick={() =>
                    setSettings({
                      ...settings,
                      maintenance_mode: !settings.maintenance_mode,
                    })
                  }
                  className={`px-4 py-2 rounded-lg transition ${
                    settings.maintenance_mode
                      ? "bg-red-600/20 text-red-400"
                      : "bg-green-600/20 text-green-400"
                  }`}
                >
                  {settings.maintenance_mode ? "Aktif" : "Nonaktif"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Plans Management */}
        <div className="mt-8 bg-zinc-900 rounded-xl p-6 border border-zinc-800">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-appPrimary" />
            Kelola Paket Langganan
          </h2>

          {/* Form Add/Edit Plan */}
          <form
            onSubmit={savePlan}
            className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 p-4 bg-zinc-800/50 rounded-lg"
          >
            <input
              type="text"
              placeholder="Nama Paket"
              value={planForm.name}
              onChange={(e) =>
                setPlanForm({ ...planForm, name: e.target.value })
              }
              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
              required
            />
            <input
              type="number"
              placeholder="Min Deposit"
              value={planForm.min_deposit}
              onChange={(e) =>
                setPlanForm({ ...planForm, min_deposit: e.target.value })
              }
              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
              required
            />
            <input
              type="number"
              placeholder="Max Deposit"
              value={planForm.max_deposit}
              onChange={(e) =>
                setPlanForm({ ...planForm, max_deposit: e.target.value })
              }
              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
            />
            <input
              type="number"
              placeholder="Profit Sharing %"
              value={planForm.share_profit_percent}
              onChange={(e) =>
                setPlanForm({
                  ...planForm,
                  share_profit_percent: e.target.value,
                })
              }
              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
              required
            />
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Harga/Bulan"
                value={planForm.price_monthly}
                onChange={(e) =>
                  setPlanForm({ ...planForm, price_monthly: e.target.value })
                }
                className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                required
              />
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-appPrimary text-black rounded-lg font-semibold"
              >
                {editingPlan ? "Update" : "Tambah"}
              </button>
              {editingPlan && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingPlan(null);
                    setPlanForm({
                      name: "",
                      min_deposit: "",
                      max_deposit: "",
                      share_profit_percent: "",
                      price_monthly: "",
                    });
                  }}
                  className="px-4 py-2 bg-zinc-700 text-white rounded-lg"
                >
                  Batal
                </button>
              )}
            </div>
          </form>

          {/* Plans Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-800">
                <tr>
                  <th className="px-4 py-3 text-left text-sm text-gray-300">
                    Paket
                  </th>
                  <th className="px-4 py-3 text-left text-sm text-gray-300">
                    Min Deposit
                  </th>
                  <th className="px-4 py-3 text-left text-sm text-gray-300">
                    Max Deposit
                  </th>
                  <th className="px-4 py-3 text-left text-sm text-gray-300">
                    Profit Sharing
                  </th>
                  <th className="px-4 py-3 text-left text-sm text-gray-300">
                    Harga/Bulan
                  </th>
                  <th className="px-4 py-3 text-left text-sm text-gray-300">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {plans.map((plan) => (
                  <tr key={plan.id}>
                    <td className="px-4 py-3 text-white font-medium">
                      {plan.name}
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      ${plan.min_deposit}
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {plan.max_deposit ? `$${plan.max_deposit}` : "∞"}
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {plan.share_profit_percent}%
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      Rp {plan.price_monthly.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => editPlan(plan)}
                          className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-lg text-sm hover:bg-blue-600/30"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deletePlan(plan.id)}
                          className="px-3 py-1 bg-red-600/20 text-red-400 rounded-lg text-sm hover:bg-red-600/30"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
