// /hooks/useAdminAccess.ts
import { useState, useEffect } from "react";
import { ClientAdminAccessControl } from "@/lib/admin-access-client";
import { createClient } from "@/lib/supabase";
import { AdminContext } from "../types/admin";

export const useAdminAccess = () => {
  const [adminContext, setAdminContext] = useState<AdminContext | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const initializeAdmin = async (): Promise<void> => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const accessControl = new ClientAdminAccessControl();
        const context = await accessControl.getAdminContext(user.id);
        setAdminContext(context);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to initialize admin access"
        );
      } finally {
        setLoading(false);
      }
    };

    initializeAdmin();
  }, [supabase]);

  const refreshContext = async (): Promise<void> => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const accessControl = new ClientAdminAccessControl();
        const context = await accessControl.getAdminContext(user.id);
        setAdminContext(context);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to refresh admin context"
      );
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (
    permission: keyof AdminContext["scope"]["permissions"]
  ): boolean => adminContext?.scope.permissions[permission] || false;

  return {
    adminContext,
    loading,
    error,
    refreshContext,
    hasPermission,
  };
};
