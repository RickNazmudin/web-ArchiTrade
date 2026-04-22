/**
 * Central Constants untuk ArchiTrade Web
 * - Routes
 * - Database table names
 * - Magic strings
 */

// ─── Routes ───────────────────────────────────────────────────
export const ROUTES = {
  PUBLIC: {
    HOME: "/",
    ABOUT: "/about",
    BLOG: "/blog",
    CONTACT: "/contact",
    SERVICES: "/services",
  },
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
  },
  DASHBOARD: {
    HOME: "/dashboard",
    DAILY_OUTLOOK: "/daily-outlook",
    INVOICES: "/invoices",
    NOTIFICATIONS: "/notifications",
    SETTINGS: "/settings",
    SUBSCRIPTION: "/subscription",
    SUPPORT: "/support",
  },
  ADMIN: {
    HOME: "/admin/dashboard",
    USERS: "/admin/users",
    DAILY_OUTLOOK: "/admin/daily-outlook",
    INVOICES: "/admin/invoices",
    MT5: "/admin/mt5",
    NOTIFICATIONS: "/admin/notifications",
    SETTINGS: "/admin/settings",
    SUBSCRIPTIONS: "/admin/subscriptions",
  },
} as const;

// ─── Database Tables ──────────────────────────────────────────
export const TABLES = {
  PROFILES: "profiles",
  DAILY_OUTLOOK: "daily_outlook",
  SUBSCRIPTIONS: "subscriptions",
  INVOICES: "invoices",
  NOTIFICATIONS: "notifications",
  USERS: "users", // if separate from profiles
} as const;

// ─── User Roles ───────────────────────────────────────────────
export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
} as const;

// ─── UI Constants ─────────────────────────────────────────────
export const UI = {
  TOAST_DURATION: 4000,
  LOADER_DELAY: 300, // ms
  ANIMATION_DURATION: 300,
} as const;

// ─── API Response Messages ────────────────────────────────────
export const MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: "Login berhasil! Mengalihkan...",
    LOGIN_FAILED: "Email atau password salah",
    LOGOUT_SUCCESS: "Anda berhasil logout",
    REGISTER_SUCCESS: "Akun berhasil dibuat! Silakan login.",
    REGISTER_FAILED: "Email sudah terdaftar",
    SESSION_EXPIRED: "Sesi Anda telah berakhir. Silakan login kembali.",
  },
  ERROR: {
    FETCH_FAILED: "Gagal mengambil data",
    SAVE_FAILED: "Gagal menyimpan data",
    DELETE_FAILED: "Gagal menghapus data",
    UNAUTHORIZED: "Anda tidak memiliki akses ke halaman ini",
    SERVER_ERROR: "Terjadi kesalahan server. Silakan coba lagi.",
  },
  SUCCESS: {
    SAVED: "Data berhasil disimpan",
    DELETED: "Data berhasil dihapus",
    UPDATED: "Data berhasil diperbarui",
  },
} as const;

// ─── Validation Rules ─────────────────────────────────────────
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
} as const;

// ─── Date Formats ────────────────────────────────────────────
export const DATE_FORMATS = {
  LOCALE: "id-ID",
  FULL: {
    weekday: "long" as const,
    year: "numeric" as const,
    month: "long" as const,
    day: "numeric" as const,
  },
  SHORT: {
    day: "numeric" as const,
    month: "short" as const,
    year: "numeric" as const,
  },
} as const;

// ─── Pagination ──────────────────────────────────────────────
export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  DEFAULT_OFFSET: 0,
} as const;
