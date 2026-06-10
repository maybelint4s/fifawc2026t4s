import { createClient } from "@supabase/supabase-js";
import type { Database } from "./db-types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Service/client with no session persistence.
 * Useful for one-off server-side or script operations where you don't want
 * to store cookies/session state.
 */
export const createServiceClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. " +
      "Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set."
    );
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
