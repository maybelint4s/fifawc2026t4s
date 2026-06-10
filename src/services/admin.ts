import { supabase } from "../lib/supabase/client";
import type { Database } from "../lib/supabase/db-types";

export type AllowedDomain = Database["public"]["Tables"]["allowed_domains"]["Row"];

/**
 * Fetch all allowed email domains.
 */
export async function getAllowedDomains(): Promise<AllowedDomain[]> {
  const { data, error } = await supabase
    .from("allowed_domains")
    .select("*")
    .order("domain", { ascending: true });

  if (error) {
    console.error("Error fetching allowed domains:", error);
    throw new Error(error.message);
  }

  return data ?? [];
}

/**
 * Add a new allowed domain.
 * Requires admin permissions (enforced by RLS).
 */
export async function addAllowedDomain(domain: string): Promise<AllowedDomain> {
  const normalized = domain.trim().toLowerCase().startsWith("@")
    ? domain.trim().toLowerCase()
    : "@" + domain.trim().toLowerCase();

  const { data, error } = await supabase
    .from("allowed_domains")
    .insert({ domain: normalized })
    .select()
    .single();

  if (error) {
    console.error("Error adding allowed domain:", error);
    throw new Error(error.message);
  }

  return data;
}

/**
 * Remove an allowed domain.
 * Requires admin permissions (enforced by RLS).
 */
export async function removeAllowedDomain(domain: string): Promise<void> {
  const { error } = await supabase
    .from("allowed_domains")
    .delete()
    .eq("domain", domain);

  if (error) {
    console.error("Error removing allowed domain:", error);
    throw new Error(error.message);
  }
}
