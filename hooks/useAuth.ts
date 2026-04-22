/**
 * Custom Hook untuk Authentication Logic
 * Centralize login, register, logout, dan role checking
 */

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { ROUTES, MESSAGES, USER_ROLES } from "@/lib/constants";
import { UserProfile, AuthUser } from "@/types";

interface UseAuthReturn {
  user: AuthUser | null;
  profile: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    email: string,
    password: string,
    fullName: string,
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  checkAuth: () => Promise<AuthUser | null>;
}

export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ─── Check Authentication ──────────────────────────────────
  const checkAuth = useCallback(async (): Promise<AuthUser | null> => {
    try {
      const {
        data: { user: authUser },
        error,
      } = await supabase.auth.getUser();

      if (error || !authUser) {
        setUser(null);
        setProfile(null);
        return null;
      }

      setUser(authUser);

      // Fetch profile role
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (profileError) {
        console.warn("[useAuth] Profile fetch error:", profileError);
      } else if (profileData) {
        setProfile(profileData as UserProfile);
      }

      return authUser;
    } catch (err) {
      console.error("[useAuth] Check auth error:", err);
      return null;
    }
  }, [supabase]);

  // ─── Login ────────────────────────────────────────────────
  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      try {
        setIsLoading(true);

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          toast.error(MESSAGES.AUTH.LOGIN_FAILED);
          return false;
        }

        if (!data.user) {
          toast.error(MESSAGES.AUTH.LOGIN_FAILED);
          return false;
        }

        // Fetch profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (profileData) {
          setProfile(profileData as UserProfile);
          setUser(data.user);

          toast.success(MESSAGES.AUTH.LOGIN_SUCCESS);

          // Redirect based on role
          if (profileData.role === USER_ROLES.ADMIN) {
            router.push(ROUTES.ADMIN.HOME);
          } else {
            router.push(ROUTES.DASHBOARD.HOME);
          }

          return true;
        }

        toast.error(MESSAGES.ERROR.FETCH_FAILED);
        return false;
      } catch (err: any) {
        console.error("[useAuth] Login error:", err);
        toast.error(err?.message || MESSAGES.AUTH.LOGIN_FAILED);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [supabase, router],
  );

  // ─── Register ─────────────────────────────────────────────
  const register = useCallback(
    async (
      email: string,
      password: string,
      fullName: string,
    ): Promise<boolean> => {
      try {
        setIsLoading(true);

        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          toast.error(MESSAGES.AUTH.REGISTER_FAILED);
          return false;
        }

        if (!data.user) {
          toast.error(MESSAGES.AUTH.REGISTER_FAILED);
          return false;
        }

        // Create profile
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: data.user.id,
            email,
            full_name: fullName,
            role: USER_ROLES.USER,
          },
        ]);

        if (profileError) {
          console.error("[useAuth] Profile creation error:", profileError);
          toast.error(MESSAGES.ERROR.SAVE_FAILED);
          return false;
        }

        toast.success(MESSAGES.AUTH.REGISTER_SUCCESS);
        router.push(ROUTES.AUTH.LOGIN);
        return true;
      } catch (err: any) {
        console.error("[useAuth] Register error:", err);
        toast.error(err?.message || MESSAGES.AUTH.REGISTER_FAILED);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [supabase, router],
  );

  // ─── Logout ───────────────────────────────────────────────
  const logout = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);

      const { error } = await supabase.auth.signOut();

      if (error) {
        toast.error(error.message);
        return;
      }

      setUser(null);
      setProfile(null);
      toast.success(MESSAGES.AUTH.LOGOUT_SUCCESS);
      router.push(ROUTES.PUBLIC.HOME);
    } catch (err: any) {
      console.error("[useAuth] Logout error:", err);
      toast.error(err?.message || MESSAGES.ERROR.SERVER_ERROR);
    } finally {
      setIsLoading(false);
    }
  }, [supabase, router]);

  return {
    user,
    profile,
    isLoading,
    login,
    register,
    logout,
    isAdmin: profile?.role === USER_ROLES.ADMIN,
    checkAuth,
  };
}
