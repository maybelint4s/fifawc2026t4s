import useSWR, { mutate as globalMutate } from "swr";
import {
  getMyPredictions,
  getPredictionsForMatch,
  savePrediction,
  deletePrediction,
  type Prediction,
  type PredictionInput,
} from "../services/predictions";

export function useMyPredictions() {
  const { data, error, isLoading, mutate } = useSWR<Prediction[]>(
    "my-predictions",
    getMyPredictions,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
    }
  );

  return {
    predictions: data ?? [],
    isLoading,
    error,
    mutate,
  };
}

export function useMatchPredictions(matchId: string) {
  const { data, error, isLoading, mutate } = useSWR<Prediction[]>(
    ["predictions", matchId],
    () => getPredictionsForMatch(matchId),
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
    }
  );

  return {
    predictions: data ?? [],
    isLoading,
    error,
    mutate,
  };
}

export function useSavePrediction() {
  return async (input: PredictionInput) => {
    const result = await savePrediction(input);
    // Revalidate related caches
    await globalMutate("my-predictions");
    await globalMutate(["predictions", input.matchId]);
    await globalMutate("leaderboard");
    return result;
  };
}

export function useDeletePrediction() {
  return async (matchId: string) => {
    await deletePrediction(matchId);
    await globalMutate("my-predictions");
    await globalMutate(["predictions", matchId]);
    await globalMutate("leaderboard");
  };
}
