import useSWR from "swr";
import { getMatches, getMatchesByStage, type Match } from "../services/matches";

const matchesFetcher = () => getMatches();

export function useMatches() {
  const { data, error, isLoading, mutate } = useSWR<Match[]>(
    "matches",
    matchesFetcher,
    {
      refreshInterval: 30000, // refresh every 30 seconds
      revalidateOnFocus: true,
    }
  );

  return {
    matches: data ?? [],
    isLoading,
    error,
    mutate,
  };
}

export function useMatchesByStage(stage: Match["stage"]) {
  const { data, error, isLoading, mutate } = useSWR<Match[]>(
    ["matches", stage],
    () => getMatchesByStage(stage),
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
    }
  );

  return {
    matches: data ?? [],
    isLoading,
    error,
    mutate,
  };
}
