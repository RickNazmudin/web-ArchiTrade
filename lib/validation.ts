/**
 * lib/validation.ts
 * Centralized validation utilities untuk form input dan data validation
 */

import { VALIDATION } from "@/lib/constants";

/**
 * Validasi format email
 * @param email - Email address to validate
 * @returns true jika email valid
 */
export const validateEmail = (email: string): boolean => {
  return VALIDATION.EMAIL_REGEX.test(email);
};

/**
 * Validasi password strength
 * Requirements: minimal 8 karakter, 1 huruf besar, 1 huruf kecil, 1 angka
 * @param password - Password to validate
 * @returns Object dengan validation result dan error message jika ada
 */
export const validatePassword = (
  password: string,
): { isValid: boolean; error?: string } => {
  if (!password) {
    return { isValid: false, error: "Password tidak boleh kosong" };
  }

  if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
    return {
      isValid: false,
      error: `Password minimal ${VALIDATION.PASSWORD_MIN_LENGTH} karakter`,
    };
  }

  if (!VALIDATION.PASSWORD_REGEX.test(password)) {
    return {
      isValid: false,
      error: "Password harus mengandung huruf besar, huruf kecil, dan angka",
    };
  }

  return { isValid: true };
};

/**
 * Validasi password strength dengan customizable requirements
 * @param password - Password to validate
 * @param options - Validation options (minLength, requireUppercase, requireLowercase, requireNumbers, requireSpecial)
 * @returns Object dengan validation result
 */
export const validatePasswordStrength = (
  password: string,
  options?: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecial?: boolean;
  },
): {
  isValid: boolean;
  strength: "weak" | "medium" | "strong";
  errors: string[];
} => {
  const {
    minLength = VALIDATION.PASSWORD_MIN_LENGTH,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecial = false,
  } = options || {};

  const errors: string[] = [];
  let strength: "weak" | "medium" | "strong" = "weak";
  let strengthScore = 0;

  // Check length
  if (password.length < minLength) {
    errors.push(`Minimal ${minLength} karakter`);
  } else {
    strengthScore++;
  }

  // Check uppercase
  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push("Minimal 1 huruf besar (A-Z)");
  } else if (/[A-Z]/.test(password)) {
    strengthScore++;
  }

  // Check lowercase
  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push("Minimal 1 huruf kecil (a-z)");
  } else if (/[a-z]/.test(password)) {
    strengthScore++;
  }

  // Check numbers
  if (requireNumbers && !/\d/.test(password)) {
    errors.push("Minimal 1 angka (0-9)");
  } else if (/\d/.test(password)) {
    strengthScore++;
  }

  // Check special characters
  if (
    requireSpecial &&
    !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  ) {
    errors.push("Minimal 1 karakter spesial (!@#$%^&*)");
  } else if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    strengthScore++;
  }

  // Determine strength
  if (strengthScore <= 1) {
    strength = "weak";
  } else if (strengthScore <= 3) {
    strength = "medium";
  } else {
    strength = "strong";
  }

  return {
    isValid: errors.length === 0,
    strength,
    errors,
  };
};

/**
 * Validasi bahwa dua password cocok
 * @param password - Password
 * @param confirmPassword - Confirm password
 * @returns true jika cocok
 */
export const validatePasswordMatch = (
  password: string,
  confirmPassword: string,
): boolean => {
  return password === confirmPassword && password.length > 0;
};

/**
 * Validasi nama (minimal 3 karakter, tidak ada karakter special)
 * @param name - Full name to validate
 * @returns Object dengan validation result
 */
export const validateName = (
  name: string,
): { isValid: boolean; error?: string } => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: "Nama tidak boleh kosong" };
  }

  if (name.trim().length < 3) {
    return { isValid: false, error: "Nama minimal 3 karakter" };
  }

  if (name.trim().length > 100) {
    return { isValid: false, error: "Nama maksimal 100 karakter" };
  }

  // Allow letters, spaces, hyphens, and apostrophes only
  if (!/^[a-zA-Z\s\-']+$/.test(name)) {
    return {
      isValid: false,
      error: "Nama hanya boleh mengandung huruf, spasi, dan tanda hubung",
    };
  }

  return { isValid: true };
};

/**
 * Validasi nomor telepon (format Indonesia: 62xxxxxxxxxx atau 08xxxxxxxxxx)
 * @param phone - Phone number to validate
 * @returns Object dengan validation result
 */
export const validatePhoneNumber = (
  phone: string,
): { isValid: boolean; error?: string } => {
  if (!phone) {
    return { isValid: true }; // Phone adalah optional
  }

  // Format: 62xxxxxxxxxx atau 08xxxxxxxxxx (10-13 digits)
  const phoneRegex = /^(62|08)\d{8,11}$/;

  if (!phoneRegex.test(phone.replace(/\D/g, ""))) {
    return {
      isValid: false,
      error:
        "Format nomor telepon tidak valid (gunakan 62xxxxxxxxxx atau 08xxxxxxxxxx)",
    };
  }

  return { isValid: true };
};

/**
 * Validasi username (3-20 karakter, alphanumeric + underscore/hyphen)
 * @param username - Username to validate
 * @returns Object dengan validation result
 */
export const validateUsername = (
  username: string,
): { isValid: boolean; error?: string } => {
  if (!username || username.trim().length === 0) {
    return { isValid: false, error: "Username tidak boleh kosong" };
  }

  if (username.length < 3) {
    return { isValid: false, error: "Username minimal 3 karakter" };
  }

  if (username.length > 20) {
    return { isValid: false, error: "Username maksimal 20 karakter" };
  }

  // Alphanumeric + underscore + hyphen
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return {
      isValid: false,
      error:
        "Username hanya boleh mengandung huruf, angka, underscore (_), dan hyphen (-)",
    };
  }

  return { isValid: true };
};

/**
 * Validasi URL format
 * @param url - URL to validate
 * @returns true jika URL valid
 */
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Sanitasi input text (remove dangerous characters)
 * @param input - Input text to sanitize
 * @returns Sanitized text
 */
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove angle brackets
    .replace(/["']/g, "") // Remove quotes
    .substring(0, 255); // Limit length
};

/**
 * Validasi semua field form dengan schema
 * @param formData - Object dengan data form
 * @param schema - Object dengan validation rules
 * @returns Object dengan validation result dan errors per field
 */
export const validateForm = (
  formData: Record<string, any>,
  schema: Record<string, (value: any) => { isValid: boolean; error?: string }>,
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  for (const [field, validator] of Object.entries(schema)) {
    const result = validator(formData[field]);
    if (!result.isValid) {
      errors[field] = result.error || "Validation failed";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validasi email domain (optional - untuk security: blocklist tertentu)
 * @param email - Email address
 * @returns true jika domain email diizinkan
 */
export const validateEmailDomain = (
  email: string,
  allowedDomains?: string[],
  blockedDomains?: string[],
): boolean => {
  const domain = email.split("@")[1]?.toLowerCase();

  if (!domain) return false;

  // Check blocklist
  if (blockedDomains?.includes(domain)) {
    return false;
  }

  // Check allowlist (jika ada)
  if (allowedDomains && !allowedDomains.includes(domain)) {
    return false;
  }

  return true;
};

/**
 * Rate limit check (client-side, untuk UX improvement)
 * Gunakan server-side rate limiting untuk security
 * @param key - Rate limit key (misal: user email)
 * @param maxAttempts - Maximum attempts allowed
 * @param windowMs - Time window dalam milliseconds
 * @returns Object dengan attempt count dan isAllowed
 */
export const clientSideRateLimit = (() => {
  const attempts: Record<string, number[]> = {};

  return (key: string, maxAttempts: number = 5, windowMs: number = 60000) => {
    const now = Date.now();
    const window = now - windowMs;

    if (!attempts[key]) {
      attempts[key] = [];
    }

    // Remove old attempts outside window
    attempts[key] = attempts[key].filter((time) => time > window);

    const currentAttempts = attempts[key].length;
    const isAllowed = currentAttempts < maxAttempts;

    if (isAllowed) {
      attempts[key].push(now);
    }

    return {
      attempt: currentAttempts + 1,
      maxAttempts,
      isAllowed,
      resetAt: attempts[key][0] ? new Date(attempts[key][0] + windowMs) : null,
    };
  };
})();
