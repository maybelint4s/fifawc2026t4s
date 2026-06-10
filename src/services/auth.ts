import { supabase } from "../lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export interface AuthError {
  message: string;
}

/**
 * Validate that the email domain is in the allowed list.
 * If no domains are configured, allows all (open mode).
 */
export async function validateEmailDomain(email: string): Promise<boolean> {
  const domain = "@" + email.split("@")[1]?.toLowerCase();
  if (!domain || domain === "@") return false;

  const { data: domains, error } = await supabase
    .from("allowed_domains")
    .select("domain");

  if (error) {
    console.error("Error fetching allowed domains:", error);
    // Fail open if we can't read domains (don't block users on DB errors)
    return true;
  }

  // If no domains configured, allow all
  if (!domains || domains.length === 0) return true;

  return domains.some((d) => d.domain.toLowerCase() === domain);
}

/**
 * Sign up a new user.
 * Checks allowed domain before calling Supabase Auth.
 */
export async function signUp(
  email: string,
  password: string,
  name: string,
  avatar = "👤"
): Promise<{ user: User | null; error: AuthError | null }> {
  const isAllowed = await validateEmailDomain(email);
  if (!isAllowed) {
    return {
      user: null,
      error: { message: "El dominio de correo no está autorizado para registrarse." },
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, avatar },
    },
  });

  if (error) {
    return { user: null, error: { message: error.message } };
  }

  // Auto-create profile if user was created
  if (data.user) {
    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      name,
      avatar,
      role: "Employee",
    });

    if (profileError) {
      console.error("Error creating profile:", profileError);
    }
  }

  return { user: data.user ?? null, error: null };
}

/**
 * Sign in with email and password.
 */
export async function signIn(
  email: string,
  password: string
): Promise<{ user: User | null; error: AuthError | null }> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { user: null, error: { message: error.message } };
  }

  return { user: data.user ?? null, error: null };
}

/**
 * Sign out the current user.
 */
export async function signOut(): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    return { error: { message: error.message } };
  }
  return { error: null };
}

/**
 * Get the currently signed-in user.
 */
export async function getCurrentUser(): Promise<User | null> {
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

/**
 * Listen to auth state changes.
 */
export function onAuthStateChange(
  callback: (event: string, user: User | null) => void
) {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session?.user ?? null);
  });
  return data.subscription;
}

/**
 * Check if a user has admin role.
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (error || !data) return false;
  return data.role === "Admin";
}

/**
 * Admin-specific sign in helper.
 * Validates both email and password against Supabase Auth,
 * then verifies the user has Admin role.
 */
export async function adminSignIn(
  email: string,
  password: string
): Promise<{ user: User | null; error: AuthError | null }> {
  const { user, error } = await signIn(email, password);
  if (error || !user) {
    return { user: null, error: error ?? { message: "Credenciales inválidas" } };
  }

  const admin = await isUserAdmin(user.id);
  if (!admin) {
    await signOut();
    return {
      user: null,
      error: { message: "Este usuario no tiene permisos de administrador." },
    };
  }

  return { user, error: null };
}
