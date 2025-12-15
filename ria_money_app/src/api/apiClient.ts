import type { ApiResponse, ApiClientConfig, RequestOptions } from "@/types";

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

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
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
      const data = await response.json();

      if (!response.ok) {
        return {
          data: data as T,
          error: data.message || `HTTP Error: ${response.status}`,
          status: response.status,
        };
      }

      return {
        data: data as T,
        status: response.status,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      const errorMessage =
        error instanceof Error
          ? error.name === "AbortError"
            ? "Request timeout"
            : error.message
          : "Unknown error occurred";

      return {
        data: {} as T,
        error: errorMessage,
        status: 0,
      };
    }
  }

  async get<T>(endpoint: string, options?: Omit<RequestOptions, "method" | "body">): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, "method">): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "POST", body });
  }

  async put<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, "method">): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "PUT", body });
  }

  async delete<T>(endpoint: string, options?: Omit<RequestOptions, "method" | "body">): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const frankfurterClient = new ApiClient({
  baseURL: "https://api.frankfurter.dev",
  timeout: 10000,
});

