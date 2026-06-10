import { createClient } from "@supabase/supabase-js";
import type { Database } from "./db-types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    "[supabaseAdmin] Missing required environment variables. " +
    "Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file."
  );
}

/**
 * Admin Supabase client using the Service Role Key.
 * ⚠️ NEVER expose this key to the browser. Use only in:
 *    - Vite SSR/SSG setups
 *    - Local scripts
 *    - Edge functions
 *    - Server-side contexts
 *
 * In a pure Vite SPA (Single Page Application), this should only be used
 * in local dev tools or in scripts, NOT in components rendered in the browser.
 */
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/**
 * Create a user directly in auth.users (admin only).
 */
export async function createAuthUser(
  email: string,
  password: string,
  metadata?: Record<string, unknown>
) {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: metadata,
  });

  if (error) {
    throw new Error(`Error creating auth user: ${error.message}`);
  }

  return data.user;
}

/**
 * Update an auth user by ID (admin only).
 */
export async function updateAuthUser(
  userId: string,
  updates: {
    email?: string;
    password?: string;
    user_metadata?: Record<string, unknown>;
  }
) {
  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
    userId,
    updates
  );

  if (error) {
    throw new Error(`Error updating auth user: ${error.message}`);
  }

  return data.user;
}

/**
 * Delete an auth user by ID (admin only).
 */
export async function deleteAuthUser(userId: string) {
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (error) {
    throw new Error(`Error deleting auth user: ${error.message}`);
  }

  return true;
}

/**
 * Get an auth user by ID (admin only).
 */
export async function getAuthUser(userId: string) {
  const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);

  if (error) {
    return null;
  }

  return data.user;
}

/**
 * Find an auth user by email (admin only).
 */
export async function getAuthUserByEmail(email: string) {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers();

  if (error) {
    throw new Error(`Error listing users: ${error.message}`);
  }

  const users = (data.users ?? []) as { email?: string }[];
  return users.find(
    (user) => user.email?.toLowerCase() === email.toLowerCase()
  );
}

/**
 * Invite a user by email (admin only).
 */
export async function inviteUserByEmail(
  email: string,
  metadata?: Record<string, unknown>
) {
  const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(
    email,
    {
      data: metadata,
    }
  );

  if (error) {
    throw new Error(`Error inviting user: ${error.message}`);
  }

  return data.user;
}

/**
 * Generate a secure temporary password.
 */
export function generateTempPassword(length: number = 12): string {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
  let password = "";

  password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
  password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
  password += "0123456789"[Math.floor(Math.random() * 10)];
  password += "!@#$%"[Math.floor(Math.random() * 5)];

  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }

  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}
