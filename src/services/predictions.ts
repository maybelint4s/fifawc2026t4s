import { supabase } from "../lib/supabase/client";
import type { Database } from "../lib/supabase/db-types";

export type Prediction = Database["public"]["Tables"]["predictions"]["Row"];

export interface PredictionInput {
  matchId: string;
  predictedScoreA: number;
  predictedScoreB: number;
}

/**
 * Fetch all predictions for the current user.
 */
export async function getMyPredictions(): Promise<Prediction[]> {
  const { data, error } = await supabase
    .from("predictions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching my predictions:", error);
    throw new Error(error.message);
  }

  return data ?? [];
}

/**
 * Fetch all predictions for a specific match.
 */
export async function getPredictionsForMatch(
  matchId: string
): Promise<Prediction[]> {
  const { data, error } = await supabase
    .from("predictions")
    .select("*")
    .eq("match_id", matchId);

  if (error) {
    console.error("Error fetching predictions for match:", error);
    throw new Error(error.message);
  }

  return data ?? [];
}

/**
 * Upsert a prediction for a match.
 * RLS ensures users can only create/update their own predictions.
 */
export async function savePrediction(
  input: PredictionInput
): Promise<Prediction> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;

  if (!userId) {
    throw new Error("Debes iniciar sesión para guardar tu pronóstico.");
  }

  const { data, error } = await supabase
    .from("predictions")
    .upsert(
      {
        match_id: input.matchId,
        user_id: userId,
        predicted_score_a: input.predictedScoreA,
        predicted_score_b: input.predictedScoreB,
      },
      { onConflict: "match_id,user_id" }
    )
    .select()
    .single();

  if (error) {
    console.error("Error saving prediction:", error);
    throw new Error(error.message);
  }

  return data;
}

/**
 * Delete a prediction for a match.
 */
export async function deletePrediction(matchId: string): Promise<void> {
  const { error } = await supabase
    .from("predictions")
    .delete()
    .eq("match_id", matchId);

  if (error) {
    console.error("Error deleting prediction:", error);
    throw new Error(error.message);
  }
}
