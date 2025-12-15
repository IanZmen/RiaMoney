export interface ApiResponse<T> {
  data: T;
  error?: string;
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

