import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options),
              );
            } catch {
              // Handle server component call
            }
          },
        },
      },
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { 
      user_id, 
      subscription_id, 
      amount_idr, 
      amount_usd, 
      profit_usd_ref, 
      month, 
      year,
      message,
      email
    } = body;

    if (!user_id || !subscription_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const adminClient = createSupabaseAdmin();
    if (!adminClient) {
      return NextResponse.json({ error: "Admin client unavailable" }, { status: 500 });
    }

    // 1. Create Invoice
    const { data: invoice, error: invError } = await adminClient
      .from("invoices")
      .insert({
        user_id,
        subscription_id,
        amount: amount_idr, // Legacy support
        amount_idr,
        amount_usd,
        profit_usd_ref,
        status: "pending",
        due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (invError) throw invError;

    // 2. Add Monthly Profit Record
    const { error: mpError } = await adminClient
      .from("monthly_profits")
      .insert({
        user_id,
        amount_usd: profit_usd_ref,
        month,
        year,
        invoice_id: invoice.id
      });

    if (mpError) throw mpError;

    // 3. Send Notification
    const { error: notifError } = await adminClient
      .from("notifications")
      .insert({
        user_id,
        title: "Tagihan Profit-Share Baru",
        message,
        type: "info",
        created_at: new Date().toISOString(),
        is_read: false,
      });

    if (notifError) console.error("Error creating notification:", notifError);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Create invoice error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
