import { frankfurterClient } from "./apiClient";
import type { ApiResponse, LatestRatesResponse } from "@/types";

export interface GetLatestRatesParams {
  from?: string;
  to?: string[];
}

export async function getLatestRates(
  params?: GetLatestRatesParams
): Promise<ApiResponse<LatestRatesResponse>> {
  const { from, to } = params || {};
  let endpoint = "/v1/latest";

  const queryParams: string[] = [];
  if (from) {
    queryParams.push(`from=${from}`);
  }
  if (to && to.length > 0) {
    queryParams.push(`to=${to.join(",")}`);
  }

  if (queryParams.length > 0) {
    endpoint += `?${queryParams.join("&")}`;
  }

  return frankfurterClient.get<LatestRatesResponse>(endpoint);
}

