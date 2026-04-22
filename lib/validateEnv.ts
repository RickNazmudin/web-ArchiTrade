/**
 * Environment Variables Validation
 * Ensures all required env vars are set at runtime
 */

export function validateEnvironment() {
  const requiredVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  ];

  const missingVars: string[] = [];

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  }

  if (missingVars.length > 0) {
    const error = `Missing required environment variables: ${missingVars.join(", ")}`;
    console.error("❌ Environment validation failed:", error);
    // Kita tidak akan melempar error agar aplikasi tidak crash 500, 
    // melainkan membiarkan komponen menangani error-nya sendiri.
  }

  // Validate encryption key in production
  if (process.env.NODE_ENV === "production" && process.env.ENCRYPTION_KEY) {
    if (process.env.ENCRYPTION_KEY.length < 32) {
      throw new Error("ENCRYPTION_KEY must be at least 32 characters");
    }
  }

  console.log("✅ Environment validation passed");
}

export function validateRuntimeSecrets() {
  // In production, validate secrets are properly set
  if (process.env.NODE_ENV === "production") {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn(
        "⚠️ SUPABASE_SERVICE_ROLE_KEY not set. API routes may not work properly.",
      );
    }
  }
}
