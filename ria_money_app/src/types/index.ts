export type ApiErrorCode = "NETWORK" | "TIMEOUT" | "HTTP" | "PARSE" | "UNKNOWN";

export interface ApiError {
  code: ApiErrorCode;
  status?: number;
  message: string;
  details?: string;
}

export interface ApiResponse<ResponseData> {
  data: ResponseData;
  error?: ApiError;
  status: number;
}

export type CurrenciesMap = Record<string, string>;

export interface Currency {
  code: string;
  name: string;
}

export function currenciesMapToArray(currencies: CurrenciesMap): Currency[] {
  return Object.entries(currencies).map(([code, name]) => ({
    code,
    name,
  }));
}

export interface ExchangeRate {
  base: string;
  date: string;
  rates: Record<string, number>;
}

export interface LatestRatesResponse {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

export interface TimeSeriesResponse {
  amount: number;
  base: string;
  start_date: string;
  end_date: string;
  rates: Record<string, Record<string, number>>;
}

export interface SingleDateResponse {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

export interface ApiClientConfig {
  baseURL?: string;
  headers?: Record<string, string>;
  timeout?: number;
}

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: unknown;
}

