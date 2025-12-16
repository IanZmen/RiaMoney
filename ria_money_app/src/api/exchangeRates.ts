import { frankfurterClient } from "./apiClient";
import type {
  ApiResponse,
  LatestRatesResponse,
  TimeSeriesResponse,
  SingleDateResponse,
} from "@/types";

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

export interface GetTimeSeriesParams {
  start: string;
  end: string;
  from?: string;
}

export async function getTimeSeries(
  params: GetTimeSeriesParams
): Promise<ApiResponse<TimeSeriesResponse>> {
  const { start, end, from } = params;
  let endpoint = `/v1/${start}..${end}`;
  
  if (from) {
    endpoint += `?from=${from}`;
  }
  
  return frankfurterClient.get<TimeSeriesResponse>(endpoint);
}

export interface GetRatesByDateParams {
  date: string;
  from?: string;
}

export async function getRatesByDate(
  params: GetRatesByDateParams
): Promise<ApiResponse<SingleDateResponse>> {
  const { date, from } = params;
  let endpoint = `/v1/${date}`;
  
  if (from) {
    endpoint += `?from=${from}`;
  }
  
  return frankfurterClient.get<SingleDateResponse>(endpoint);
}

