import { useState, useEffect, useCallback } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase/client";
import { isUserAdmin } from "../services/auth";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
}

export function useAuth(): AuthState & {
  refresh: () => Promise<void>;
} {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAdmin: false,
  });

  const refresh = useCallback(async () => {
    const { data } = await supabase.auth.getUser();
    const user = data.user ?? null;

    if (user) {
      const admin = await isUserAdmin(user.id);
      setState({ user, isLoading: false, isAdmin: admin });
    } else {
      setState({ user: null, isLoading: false, isAdmin: false });
    }
  }, []);

  useEffect(() => {
    refresh();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      if (user) {
        isUserAdmin(user.id).then((admin) => {
          setState({ user, isLoading: false, isAdmin: admin });
        });
      } else {
        setState({ user: null, isLoading: false, isAdmin: false });
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [refresh]);

  return { ...state, refresh };
}
