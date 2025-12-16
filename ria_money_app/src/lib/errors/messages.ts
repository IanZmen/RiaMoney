import type { ApiError } from "@/types";

export function getUserErrorMessage(error: ApiError): string {
  return error.message;
}

export function logError(error: ApiError, context?: string): void {
  if (process.env.NODE_ENV !== "production") {
    const logContext = context ? `[${context}]` : "";
    console.error(`${logContext} API Error:`, {
      code: error.code,
      status: error.status,
      message: error.message,
      details: error.details,
    });
  }
}

