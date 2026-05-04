import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // During build time, we might not have these variables.
    // We log a warning but provide placeholders to prevent @supabase/ssr from crashing.
    console.warn("Supabase environment variables are missing! Using placeholders for build time.");
    return createBrowserClient(
      supabaseUrl || "https://placeholder.supabase.co",
      supabaseAnonKey || "placeholder",
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};
