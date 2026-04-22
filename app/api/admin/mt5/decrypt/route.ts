import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { decrypt } from "@/lib/encryption";

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
    
    // 1. Cek User terautentikasi
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Cek Role Admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    // 3. Ambil Account ID
    const body = await request.json();
    const { accountId } = body;

    if (!accountId) {
      return NextResponse.json({ error: "Account ID is required" }, { status: 400 });
    }

    // 4. Ambil data password dari DB
    const { data: account, error: dbError } = await supabase
      .from("mt5_accounts")
      .select("mt5_password")
      .eq("id", accountId)
      .single();

    if (dbError || !account) {
      return NextResponse.json({ error: "MT5 account not found" }, { status: 404 });
    }

    const rawPassword = account.mt5_password;
    let decryptedPassword = rawPassword;

    // 5. Dekripsi jika berawalan 'encrypted:'
    if (rawPassword && rawPassword.startsWith("encrypted:")) {
      try {
        const encryptedData = rawPassword.replace("encrypted:", "");
        decryptedPassword = decrypt(encryptedData);
      } catch (err) {
        console.error("Decryption failed:", err);
        return NextResponse.json({ error: "Gagal mendekripsi password" }, { status: 500 });
      }
    }

    return NextResponse.json({ password: decryptedPassword });
  } catch (err: any) {
    console.error("Admin decrypt error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
