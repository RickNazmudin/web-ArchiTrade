import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { UsersClient } from "./UsersClient";
import { UserProfile } from "@/types";

export default async function AdminUsersPage() {
  const supabase = await createSupabaseServer();

  // 1. Auth & Admin Check
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  // 2. Fetch Users Data
  const { data: profilesData } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  const initialUsers = (profilesData as UserProfile[]) || [];

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <UsersClient initialUsers={initialUsers} />
        
        {/* Debug Info */}
        <details className="mt-4 p-4 bg-zinc-900/30 rounded-lg">
          <summary className="text-xs text-gray-500 cursor-pointer">
            Debug Info (Klik untuk lihat data mentah)
          </summary>
          <pre className="mt-2 text-xs text-gray-400 overflow-auto max-h-60">
            {JSON.stringify(initialUsers, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}
