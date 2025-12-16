import type { ApiResponse, ApiClientConfig, RequestOptions, ApiError } from "@/types";
import { toApiError } from "@/lib/errors/normalize";
import { logError } from "@/lib/errors/messages";

export class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;

  constructor(config: ApiClientConfig = {}) {
    this.baseURL = config.baseURL || "";
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...config.headers,
    };
    this.timeout = config.timeout || 30000;
  }

  private async request<ResponseData>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<ResponseData>> {
    const url = `${this.baseURL}${endpoint}`;
    const method = options.method || "GET";

    const headers = {
      ...this.defaultHeaders,
      ...options.headers,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const config: RequestInit = {
      method,
      headers,
      signal: controller.signal,
    };

    if (options.body && method !== "GET") {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      if (!response.ok) {
        const apiError = toApiError(
          new Error(`HTTP ${response.status}: ${response.statusText}`),
          response.status
        );
        logError(apiError, `API ${method} ${endpoint}`);
        return {
          data: {} as ResponseData,
          error: apiError,
          status: response.status,
        };
      }

      try {
        const data = await response.json();
        return {
          data: data as ResponseData,
          status: response.status,
        };
      } catch (parseError) {
        const apiError = toApiError(parseError, response.status);
        logError(apiError, `API ${method} ${endpoint}`);
        return {
          data: {} as ResponseData,
          error: apiError,
          status: response.status,
        };
      }
    } catch (error) {
      clearTimeout(timeoutId);
      const apiError = toApiError(error);
      logError(apiError, `API ${method} ${endpoint}`);
      return {
        data: {} as ResponseData,
        error: apiError,
        status: 0,
      };
    }
  }

  async get<ResponseData>(endpoint: string, options?: Omit<RequestOptions, "method" | "body">): Promise<ApiResponse<ResponseData>> {
    return this.request<ResponseData>(endpoint, { ...options, method: "GET" });
  }

  async post<ResponseData>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, "method">): Promise<ApiResponse<ResponseData>> {
    return this.request<ResponseData>(endpoint, { ...options, method: "POST", body });
  }

  async put<ResponseData>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, "method">): Promise<ApiResponse<ResponseData>> {
    return this.request<ResponseData>(endpoint, { ...options, method: "PUT", body });
  }

  async delete<ResponseData>(endpoint: string, options?: Omit<RequestOptions, "method" | "body">): Promise<ApiResponse<ResponseData>> {
    return this.request<ResponseData>(endpoint, { ...options, method: "DELETE" });
  }
}

export const frankfurterClient = new ApiClient({
  baseURL: "https://api.frankfurter.dev",
  timeout: 10000,
});

