import { useAuth } from "./useAuth";

export function useAdminCheck() {
  const { user, isAdmin, isLoading } = useAuth();

  return {
    isAdmin,
    isLoading,
    isAuthenticated: !!user,
  };
}
