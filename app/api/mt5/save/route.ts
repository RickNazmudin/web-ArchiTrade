import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { encrypt } from "@/lib/encryption";
import { z } from "zod";

// Skema validasi untuk input MT5
const mt5Schema = z.object({
  id: z.string().uuid().optional(),
  mt5_id: z.string().min(3, "ID MT5 terlalu pendek").max(50),
  mt5_password: z.string().min(1, "Password diperlukan").optional().or(z.literal("")),
  mt5_server: z.string().min(3, "Nama server tidak valid"),
});

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
    
    // Cek auth user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    // Validasi dengan Zod
    const validation = mt5Schema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ 
        error: "Validation failed", 
        details: validation.error.format() 
      }, { status: 400 });
    }

    const { id, mt5_id, mt5_password, mt5_server } = validation.data;

    if (id) {
      // MODE EDIT: Update akun spesifik berdasarkan ID
      const { data: existingAccount, error: fetchError } = await supabase
        .from("mt5_accounts")
        .select("id, mt5_password")
        .eq("id", id)
        .eq("user_id", user.id) // Security: pastikan milik user tersebut
        .maybeSingle();

      if (fetchError || !existingAccount) {
        return NextResponse.json({ error: "Account not found or access denied" }, { status: 404 });
      }

      let encryptedPassword = existingAccount.mt5_password;
      if (mt5_password && mt5_password.trim() !== "") {
        encryptedPassword = `encrypted:${encrypt(mt5_password)}`;
      }

      const { error: updateError } = await supabase
        .from("mt5_accounts")
        .update({
          mt5_id,
          mt5_password: encryptedPassword,
          mt5_server,
        })
        .eq("id", id)
        .eq("user_id", user.id); // Double check: pastikan tetap milik user yang sama

      if (updateError) throw updateError;
    } else {
      // MODE BARU: Insert akun baru
      
      // 1. Cek limit (max 5)
      const { count, error: countError } = await supabase
        .from("mt5_accounts")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);
      
      if (countError) throw countError;
      if (count && count >= 5) {
        return NextResponse.json({ error: "Maximum 5 MT5 accounts allowed" }, { status: 400 });
      }

      // 2. Untuk akun baru, password WAJIB ada
      if (!mt5_password || mt5_password.trim() === "") {
        return NextResponse.json({ error: "Password MT5 diperlukan untuk akun baru" }, { status: 400 });
      }
      
      const { error: insertError } = await supabase
        .from("mt5_accounts")
        .insert({
          user_id: user.id,
          mt5_id,
          mt5_password: `encrypted:${encrypt(mt5_password)}`,
          mt5_server,
        });

      if (insertError) throw insertError;
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Save MT5 error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
