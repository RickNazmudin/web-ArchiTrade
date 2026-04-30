import { createSupabaseServer, createSupabaseAdmin } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Prevent admin from deleting themselves
    if (userId === user.id) {
      return NextResponse.json({ error: "You cannot delete your own admin account" }, { status: 400 });
    }

    const adminClient = createSupabaseAdmin();
    if (!adminClient) {
      return NextResponse.json({ error: "Admin client not available" }, { status: 500 });
    }

    console.log(`Starting deletion for user: ${userId}`);

    // Delete in order of dependencies (child to parent)
    
    // 1. monthly_profits
    const { error: mpError } = await adminClient.from("monthly_profits").delete().eq("user_id", userId);
    if (mpError) console.warn("Delete monthly_profits warning:", mpError.message);
    
    // 2. invoices
    const { error: invError } = await adminClient.from("invoices").delete().eq("user_id", userId);
    if (invError) console.warn("Delete invoices warning:", invError.message);
    
    // 3. subscriptions
    const { error: subError } = await adminClient.from("subscriptions").delete().eq("user_id", userId);
    if (subError) console.warn("Delete subscriptions warning:", subError.message);
    
    // 4. mt5_accounts
    const { error: mt5Error } = await adminClient.from("mt5_accounts").delete().eq("user_id", userId);
    if (mt5Error) console.warn("Delete mt5_accounts warning:", mt5Error.message);
    
    // 5. notifications
    const { error: notifError } = await adminClient.from("notifications").delete().eq("user_id", userId);
    if (notifError) console.warn("Delete notifications warning:", notifError.message);

    // 6. Delete from Supabase Auth
    const { error: authDeleteError } = await adminClient.auth.admin.deleteUser(userId);
    if (authDeleteError) {
      console.warn("Auth delete warning:", authDeleteError.message);
    }

    // 7. Delete from profiles
    const { error: profileDeleteError } = await adminClient.from("profiles").delete().eq("id", userId);
    if (profileDeleteError) {
      console.error("Profile delete error:", profileDeleteError.message);
      return NextResponse.json({ error: "Failed to delete profile: " + profileDeleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Delete user error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
