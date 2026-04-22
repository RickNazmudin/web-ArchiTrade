"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

export function LogoutButton() {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    toast.success("Berhasil keluar");
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-1.5 px-3 py-2 text-sm text-zinc-500 hover:text-red-400 hover:bg-red-500/6 rounded-xl transition"
    >
      <LogOut className="h-4 w-4" />
      <span className="hidden sm:inline">Keluar</span>
    </button>
  );
}
