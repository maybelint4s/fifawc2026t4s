import useSWR, { mutate as globalMutate } from "swr";
import {
  getAllowedDomains,
  addAllowedDomain,
  removeAllowedDomain,
  type AllowedDomain,
} from "../services/admin";

export function useAllowedDomains() {
  const { data, error, isLoading, mutate } = useSWR<AllowedDomain[]>(
    "allowed-domains",
    getAllowedDomains,
    {
      refreshInterval: 60000,
      revalidateOnFocus: true,
    }
  );

  return {
    domains: data ?? [],
    isLoading,
    error,
    mutate,
  };
}

export function useAddAllowedDomain() {
  return async (domain: string) => {
    const result = await addAllowedDomain(domain);
    await globalMutate("allowed-domains");
    return result;
  };
}

export function useRemoveAllowedDomain() {
  return async (domain: string) => {
    await removeAllowedDomain(domain);
    await globalMutate("allowed-domains");
  };
}
