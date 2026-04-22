// lib/encryption.ts
import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

// Pastikan key 32 bytes
const key = Buffer.from((ENCRYPTION_KEY || "").padEnd(32, "0").slice(0, 32), "utf-8");

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  // Gabungkan: iv + authTag + encrypted
  return Buffer.concat([iv, authTag, Buffer.from(encrypted, "hex")]).toString(
    "base64",
  );
}

export function decrypt(encryptedData: string): string {
  const buffer = Buffer.from(encryptedData, "base64");

  const iv = buffer.subarray(0, 16);
  const authTag = buffer.subarray(16, 32);
  const encrypted = buffer.subarray(32);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString("utf8");
}

// Database trigger function untuk enkripsi otomatis
export const encryptionTriggerSQL = `
-- Function untuk enkripsi password sebelum insert/update
CREATE OR REPLACE FUNCTION encrypt_mt5_password()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.mt5_password IS NOT NULL AND NEW.mt5_password NOT LIKE 'encrypted:%' THEN
    NEW.mt5_password := 'encrypted:' || encrypt(NEW.mt5_password);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger untuk tabel mt5_accounts
CREATE TRIGGER encrypt_mt5_password_trigger
BEFORE INSERT OR UPDATE ON mt5_accounts
FOR EACH ROW
EXECUTE FUNCTION encrypt_mt5_password();
`;
