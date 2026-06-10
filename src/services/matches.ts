import { supabase } from "../lib/supabase/client";
import type { Database } from "../lib/supabase/db-types";

export type Match = Database["public"]["Tables"]["matches"]["Row"];

/**
 * Fetch all matches ordered by datetime.
 */
export async function getMatches(): Promise<Match[]> {
  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .order("datetime_iso", { ascending: true });

  if (error) {
    console.error("Error fetching matches:", error);
    throw new Error(error.message);
  }

  return data ?? [];
}

/**
 * Fetch matches filtered by stage (FG, 8vos, CF, SF, F).
 */
export async function getMatchesByStage(
  stage: Match["stage"]
): Promise<Match[]> {
  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .eq("stage", stage)
    .order("datetime_iso", { ascending: true });

  if (error) {
    console.error("Error fetching matches by stage:", error);
    throw new Error(error.message);
  }

  return data ?? [];
}

/**
 * Update the official result of a match.
 * Requires admin permissions (enforced by RLS).
 */
export async function updateMatchResult(
  matchId: string,
  scoreA: number,
  scoreB: number,
  status: Match["status"] = "Finished"
): Promise<Match> {
  const { data, error } = await supabase
    .from("matches")
    .update({ score_a: scoreA, score_b: scoreB, status })
    .eq("id", matchId)
    .select()
    .single();

  if (error) {
    console.error("Error updating match result:", error);
    throw new Error(error.message);
  }

  return data;
}

/**
 * Reset all match results to initial Pending state.
 * Requires admin permissions (enforced by RLS via function).
 */
export async function resetAllMatches(): Promise<void> {
  const { error } = await supabase.rpc("reset_all_matches");
  if (error) {
    console.error("Error resetting matches:", error);
    throw new Error(error.message);
  }
}
