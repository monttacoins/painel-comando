import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type AppRole = "user" | "admin" | "super-admin";

export function useUserRole() {
  const { user } = useAuth();

  const { data: role, isLoading } = useQuery({
    queryKey: ["user_role", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_user_role", {
        _user_id: user!.id,
      });
      if (error) throw error;
      return (data as AppRole) || "user";
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
  });

  return {
    role: role || "user",
    isAdmin: role === "admin" || role === "super-admin",
    isSuperAdmin: role === "super-admin",
    isLoading,
  };
}
