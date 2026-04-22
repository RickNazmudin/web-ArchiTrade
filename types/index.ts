import React from "react";

/**
 * Central Type Definitions untuk ArchiTrade Web
 */

// ─── User & Auth ──────────────────────────────────────────────
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: "admin" | "customer"; // Standardized roles
  avatar_url?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalAdmin: number;
  totalCustomers: number;
  totalSubscriptions: number;
  totalMt5Accounts: number;
  pendingSubsCount: number;
  pendingInvoicesCount: number;
}

export interface AuthUser {
  id: string;
  email?: string; // Optional karena Supabase User type memiliki email optional
  user_metadata?: Record<string, any>;
}

export interface AuthResponse {
  user: AuthUser | null;
  error: Error | null;
  isLoading: boolean;
}

// ─── Daily Outlook ───────────────────────────────────────────
export interface DailyOutlook {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  published_date: string;
  author?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Invoices ────────────────────────────────────────────────
export interface Invoice {
  id: string;
  user_id: string;
  invoice_number: string;
  amount: number;
  status: "paid" | "pending" | "cancelled";
  issued_date: string;
  due_date: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// ─── Subscriptions ───────────────────────────────────────────
export interface Subscription {
  id: string;
  user_id: string;
  plan_name: string;
  price: number;
  status: "active" | "cancelled" | "expired";
  start_date: string;
  end_date: string;
  features: string[];
  created_at: string;
  updated_at: string;
}

// ─── Notifications ───────────────────────────────────────────
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  is_read: boolean;
  created_at: string;
}

// ─── API Response ────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
}

// ─── Database Response ──────────────────────────────────────
export interface SupabaseResponse<T> {
  data: T | null;
  error: any;
}

// ─── Stat Card Props ────────────────────────────────────────
export interface StatCardProps {
  value: number | string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
}

// ─── Pagination ────────────────────────────────────────────
export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: "asc" | "desc";
}

// ─── Form State ────────────────────────────────────────────
export interface FormState {
  email: string;
  password: string;
  fullName?: string;
  rememberMe?: boolean;
}

export interface FormError {
  field: keyof FormState;
  message: string;
}
