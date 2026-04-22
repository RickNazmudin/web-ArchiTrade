"use client";

import React, { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Users,
  Search,
  Edit,
  Trash2,
  User,
  Mail,
  Phone,
  Calendar,
  XCircle,
  TrendingUp,
  ShieldCheck,
  Shield,
  UserCheck,
  Eye,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { UserProfile } from "@/types";
import { MotionWrapper, MotionTableBody, MotionTableRow, motionItem } from "@/components/ui/motion-wrapper";
import { toast } from "sonner";

interface UsersClientProps {
  initialUsers: UserProfile[];
}

export function UsersClient({ initialUsers }: UsersClientProps) {
  const [users, setUsers] = useState<UserProfile[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: "",
    phone: "",
    role: "",
  });
  const [updating, setUpdating] = useState(false);
  const supabase = createClient();

  const handleEditUser = (user: UserProfile) => {
    setSelectedUser(user);
    setEditForm({
      full_name: user.full_name || "",
      phone: user.phone || "",
      role: user.role || "customer",
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setUpdating(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: editForm.full_name,
          phone: editForm.phone,
          role: editForm.role,
        })
        .eq("id", selectedUser.id);

      if (error) throw error;

      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...editForm } as UserProfile : u));
      setShowEditModal(false);
      toast.success("User successfully updated");
    } catch (err: any) {
      toast.error("Error: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`Are you sure you want to delete user ${userEmail}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (error) throw error;

      setUsers(users.filter(u => u.id !== userId));
      toast.success("User successfully deleted");
    } catch (err: any) {
      toast.error("Error: " + err.message);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getRoleBadge = (role: string) => {
    if (role === "admin") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 text-purple-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-purple-500/20">
          <ShieldCheck className="w-3 h-3" />
          Admin
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 text-zinc-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/10">
        <User className="w-3 h-3" />
        Customer
      </span>
    );
  };

  return (
    <>
      <MotionWrapper className="flex justify-between items-center mb-10 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-[1px] bg-appPrimary/40" />
            <p className="text-[10px] text-appPrimary uppercase tracking-[0.3em] font-black">
              User Directory
            </p>
          </div>
          <h1 className="text-4xl font-black text-white flex items-center gap-3 tracking-tighter">
            Manage <span className="text-appPrimary">Users</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-1 font-medium italic">
            Monitoring and authorizing platform access entities.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/dashboard"
            className="group flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-xl border border-white/10 transition-all font-bold text-sm"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
            Return
          </Link>
        </div>
      </MotionWrapper>

      {/* Search Bar */}
      <MotionWrapper delay={0.1} className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-zinc-600" />
        </div>
        <input
          type="text"
          placeholder="Search by identity or electronic mail..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl text-white placeholder-zinc-700 focus:outline-none focus:border-appPrimary/50 focus:bg-white/[0.08] transition-all font-medium text-sm shadow-2xl"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-white/5 rounded text-[10px] font-black text-zinc-600 uppercase tracking-widest border border-white/5">
          {filteredUsers.length} Results
        </div>
      </MotionWrapper>

      {/* Stats Cards */}
      <MotionWrapper delay={0.2} className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {[
          { label: "Aggregate Entities", val: users.length, icon: Users, color: "text-zinc-400", sub: "Total base" },
          { label: "Privileged Access", val: users.filter((u) => u.role === "admin").length, icon: Shield, color: "text-purple-400", sub: "Administrators" },
          { label: "Standard Entities", val: users.filter((u) => u.role !== "admin").length, icon: UserCheck, color: "text-blue-400", sub: "Customers" },
        ].map((s, i) => (
          <div key={i} className="group relative overflow-hidden bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all">
             <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                <s.icon className="w-16 h-16" />
             </div>
             <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mb-1">{s.label}</p>
             <p className={`text-3xl font-black ${s.color} tracking-tighter`}>{s.val}</p>
             <p className="text-[10px] text-zinc-600 font-medium mt-2">{s.sub}</p>
          </div>
        ))}
      </MotionWrapper>

      {/* Users Table */}
      <MotionWrapper delay={0.3} className="bg-white/5 backdrop-blur-md rounded-[1.5rem] border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                {["Identity", "Reference", "Network", "Privilege", "Timestamp", "Ops"].map(h => (
                   <th key={h} className="px-6 py-5 text-left text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <MotionTableBody className="divide-y divide-white/5">
              {filteredUsers.length === 0 ? (
                <tr className="bg-transparent">
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-20">
                      <Users className="w-16 h-16 text-zinc-500" />
                      <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">No entities detected</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <MotionTableRow
                    key={user.id}
                    className="group hover:bg-white/[0.03] transition-all duration-300 pointer-events-auto"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-appPrimary/20 to-transparent border border-white/10 flex items-center justify-center font-black text-appPrimary shadow-inner">
                          {(user.full_name || user.email || "?")[0].toUpperCase()}
                        </div>
                        <span className="text-white font-bold text-sm tracking-tight group-hover:text-appPrimary transition-colors">
                          {user.full_name || "Anonymous User"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium">
                        <Mail className="w-3.5 h-3.5 text-zinc-600" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium">
                        <Phone className="w-3.5 h-3.5 text-zinc-600" />
                        {user.phone || "No Connection"}
                      </div>
                    </td>
                    <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-zinc-500 text-[11px] font-bold">
                        <Calendar className="w-3.5 h-3.5" />
                        {user.created_at
                          ? new Date(user.created_at).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })
                          : "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 opacity-100 sm:opacity-40 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2.5 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white rounded-xl border border-blue-500/20 transition-all shadow-lg"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id, user.email)}
                          className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl border border-red-500/20 transition-all shadow-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <Link
                          href={`/admin/profits?user=${user.id}`}
                          className="p-2.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white rounded-xl border border-emerald-500/20 transition-all shadow-lg"
                        >
                          <TrendingUp className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </MotionTableRow>
                ))
              )}
            </MotionTableBody>
          </table>
        </div>
      </MotionWrapper>

      {/* Edit Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <MotionWrapper className="bg-[#0a0a0f] rounded-[2rem] max-w-md w-full p-8 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-center mb-8">
              <div>
                <p className="text-[10px] text-appPrimary uppercase tracking-[0.3em] font-black mb-1">Authorization Update</p>
                <h2 className="text-2xl font-black text-white tracking-tighter">
                  Update <span className="text-appPrimary">Entity</span>
                </h2>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-white/5 rounded-xl transition text-zinc-500 hover:text-white"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateUser} className="space-y-6">
              <div className="space-y-4">
                <div className="group">
                  <label className="block text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-2 px-1">
                    Electronic Mail (Fixed)
                  </label>
                  <div className="px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-zinc-600 font-medium text-sm">
                    {selectedUser.email}
                  </div>
                </div>
                
                <div>
                  <label className="block text-[10px] text-zinc-400 font-black uppercase tracking-widest mb-2 px-1">
                    Full Identity Name
                  </label>
                  <input
                    type="text"
                    value={editForm.full_name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, full_name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-700 focus:outline-none focus:border-appPrimary/50 transition-all font-medium text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-400 font-black uppercase tracking-widest mb-2 px-1">
                    Communication Network
                  </label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-700 focus:outline-none focus:border-appPrimary/50 transition-all font-medium text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-400 font-black uppercase tracking-widest mb-2 px-1">
                    Privilege Rank
                  </label>
                  <select
                    value={editForm.role}
                    onChange={(e) =>
                      setEditForm({ ...editForm, role: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white appearance-none focus:outline-none focus:border-appPrimary/50 transition-all font-bold text-sm"
                  >
                    <option value="customer" className="bg-[#0a0a0f]">Standard Customer</option>
                    <option value="admin" className="bg-[#0a0a0f]">Authorized Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 bg-appPrimary text-black py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 shadow-[0_0_30px_rgba(255,204,0,0.2)]"
                >
                  {updating ? "Processing..." : "Commit Changes"}
                </button>
              </div>
            </form>
          </MotionWrapper>
        </div>
      )}
    </>
  );
}
