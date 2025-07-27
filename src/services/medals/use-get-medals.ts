import { useQuery, UseQueryResult } from "react-query";
import api from "@/config/api";
import { MedalsApiResponse } from "@/types/medal";

// API function to fetch medals data
const fetchMedals = async (): Promise<MedalsApiResponse> => {
  try {
    // Replace with your actual API endpoint
    const response = await api.get<MedalsApiResponse>(
      "/6885aba2f7e7a370d1ee8f75"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching medals:", error);
    throw error;
  }
};

// Query key for medals
export const MEDALS_QUERY_KEY = ["medals"] as const;

// Hook options interface
interface UseGetMedalsOptions {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
  cacheTime?: number;
}

// Custom hook for fetching medals
export const useGetMedals = (
  options: UseGetMedalsOptions = {}
): UseQueryResult<MedalsApiResponse, Error> => {
  const {
    enabled = true,
    refetchOnWindowFocus = false,
    staleTime = 5 * 60 * 1000, // 5 minutes
    cacheTime = 10 * 60 * 1000, // 10 minutes
  } = options;

  return useQuery({
    queryKey: MEDALS_QUERY_KEY,
    queryFn: fetchMedals,
    enabled,
    refetchOnWindowFocus,
    staleTime,
    cacheTime,
    // Retry failed requests up to 3 times
    retry: 3,
    // Retry delay that increases exponentially
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Export the fetch function for potential standalone use
export { fetchMedals };

// Type exports for convenience
export type { UseGetMedalsOptions };
