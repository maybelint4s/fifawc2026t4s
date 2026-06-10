import useSWR from "swr";
import { getProfiles, getLeaderboard, type Profile } from "../services/profiles";
import type { Database } from "../lib/supabase/db-types";

type LeaderboardRow = Database["public"]["Views"]["leaderboard"]["Row"];

export function useProfiles() {
  const { data, error, isLoading, mutate } = useSWR<Profile[]>(
    "profiles",
    getProfiles,
    {
      refreshInterval: 60000,
      revalidateOnFocus: true,
    }
  );

  return {
    profiles: data ?? [],
    isLoading,
    error,
    mutate,
  };
}

export function useLeaderboard() {
  const { data, error, isLoading, mutate } = useSWR<LeaderboardRow[]>(
    "leaderboard",
    getLeaderboard,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
    }
  );

  return {
    leaderboard: data ?? [],
    isLoading,
    error,
    mutate,
  };
}
