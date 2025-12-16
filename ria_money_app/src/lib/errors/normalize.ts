import type { ApiError, ApiErrorCode } from "@/types";

export function toApiError(error: unknown, status?: number): ApiError {
  if (error instanceof Error) {
    if (error.name === "AbortError") {
      return {
        code: "TIMEOUT",
        message: "The request took too long. Please try again.",
        details: error.message,
      };
    }

    if (error.message.includes("fetch") || error.message.includes("network")) {
      return {
        code: "NETWORK",
        message: "Could not connect. Check your internet and try again.",
        details: error.message,
      };
    }

    if (error.message.includes("JSON") || error.message.includes("parse")) {
      return {
        code: "PARSE",
        message: "Unexpected server response.",
        details: error.message,
      };
    }
  }

  if (status !== undefined && status >= 400) {
    return {
      code: "HTTP",
      status,
      message: "The server responded with an error. Please try again later.",
      details: error instanceof Error ? error.message : String(error),
    };
  }

  return {
    code: "UNKNOWN",
    message: "An unexpected error occurred.",
    details: error instanceof Error ? error.message : String(error),
  };
}

