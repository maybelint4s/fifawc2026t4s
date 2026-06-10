import { supabase } from "../lib/supabase/client";
import type { Database } from "../lib/supabase/db-types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

/**
 * Fetch all profiles (for leaderboard, participant list, etc.).
 */
export async function getProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching profiles:", error);
    throw new Error(error.message);
  }

  return data ?? [];
}

/**
 * Fetch the current user's profile.
 */
export async function getMyProfile(): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // no rows
    console.error("Error fetching my profile:", error);
    throw new Error(error.message);
  }

  return data;
}

/**
 * Update the current user's profile.
 */
export async function updateMyProfile(
  updates: Partial<Pick<Profile, "name" | "avatar" | "role">>
): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .select()
    .single();

  if (error) {
    console.error("Error updating profile:", error);
    throw new Error(error.message);
  }

  return data;
}

/**
 * Fetch the leaderboard view.
 */
export async function getLeaderboard(): Promise<
  Database["public"]["Views"]["leaderboard"]["Row"][]
> {
  const { data, error } = await supabase
    .from("leaderboard")
    .select("*")
    .order("total_points", { ascending: false });

  if (error) {
    console.error("Error fetching leaderboard:", error);
    throw new Error(error.message);
  }

  return data ?? [];
}
