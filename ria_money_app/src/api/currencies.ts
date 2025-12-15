import { frankfurterClient } from "./apiClient";
import type { ApiResponse, CurrenciesMap } from "@/types";

export async function getCurrencies(): Promise<ApiResponse<CurrenciesMap>> {
  return frankfurterClient.get<CurrenciesMap>("/v1/currencies");
}

