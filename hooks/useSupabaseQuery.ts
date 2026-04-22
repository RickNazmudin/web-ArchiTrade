/**
 * Custom Hook untuk standardized Supabase queries dengan error handling
 */

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { MESSAGES, UI } from "@/lib/constants";

interface UseSupabaseQueryOptions {
  showToast?: boolean;
  onError?: (error: any) => void;
  onSuccess?: (data: any) => void;
}

interface UseSupabaseQueryReturn<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

export function useSupabaseQuery<T>(
  queryFn: () => Promise<any>,
  options: UseSupabaseQueryOptions = {},
): UseSupabaseQueryReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { showToast = true, onError, onSuccess } = options;

  const execute = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await queryFn();

      if (result.error) {
        throw result.error;
      }

      setData(result.data);
      if (onSuccess) onSuccess(result.data);
    } catch (err: any) {
      const errorMessage = err?.message || MESSAGES.ERROR.FETCH_FAILED;
      setError(errorMessage);

      if (showToast) {
        toast.error(errorMessage);
      }

      if (onError) onError(err);
      console.error("[useSupabaseQuery] Error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [queryFn, showToast, onError, onSuccess]);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, error, isLoading, refetch: execute };
}

/**
 * Hook untuk mutation (POST, PUT, DELETE)
 */
interface UseSupabaseMutationOptions extends UseSupabaseQueryOptions {
  successMessage?: string;
}

interface UseSupabaseMutationReturn<T> {
  mutate: (params?: any) => Promise<T | null>;
  data: T | null;
  error: string | null;
  isLoading: boolean;
}

export function useSupabaseMutation<T>(
  mutationFn: (params?: any) => Promise<any>,
  options: UseSupabaseMutationOptions = {},
): UseSupabaseMutationReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { showToast = true, successMessage, onError, onSuccess } = options;

  const mutate = useCallback(
    async (params?: any): Promise<T | null> => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await mutationFn(params);

        if (result.error) {
          throw result.error;
        }

        setData(result.data);

        if (showToast) {
          toast.success(successMessage || MESSAGES.SUCCESS.SAVED);
        }

        if (onSuccess) onSuccess(result.data);
        return result.data;
      } catch (err: any) {
        const errorMessage = err?.message || MESSAGES.ERROR.SAVE_FAILED;
        setError(errorMessage);

        if (showToast) {
          toast.error(errorMessage);
        }

        if (onError) onError(err);
        console.error("[useSupabaseMutation] Error:", err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [mutationFn, showToast, successMessage, onError, onSuccess],
  );

  return { mutate, data, error, isLoading };
}
