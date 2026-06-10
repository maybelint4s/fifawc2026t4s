import { createClient } from "@supabase/supabase-js";
import type { Database } from "./db-types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder-anon-key";

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn(
    "Warning: Missing Supabase environment variables. " +
    "Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file."
  );
}

/**
 * Browser/client-side Supabase client.
 * Use this throughout your React components and hooks.
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
