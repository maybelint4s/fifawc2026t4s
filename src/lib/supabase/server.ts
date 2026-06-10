// ============================================================
// NOTE: This file is intentionally minimal for Vite SPAs.
// ============================================================
// In a Next.js app you would use @supabase/ssr with cookies().
// In a Vite SPA there is no built-in server context, so this
// file re-exports the admin client for any server-side/script usage.
//
// For browser operations use: import { supabase } from "./client"
// For admin operations use:  import { supabaseAdmin } from "./admin"
// ============================================================

export { supabaseAdmin } from "./admin";
