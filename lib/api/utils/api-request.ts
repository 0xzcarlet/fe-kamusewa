import { API_CONFIG } from "../config"
import { ApiResponse } from "../types/common"

export const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
  try {
    const token = localStorage.getItem("auth_token")

    if (!token && !endpoint.includes("/auth/")) {
      return {
        status: "error",
        message: "Not authenticated",
      }
    }

    const headers = {
      ...API_CONFIG.headers,
      ...(token && !endpoint.includes("/auth/") ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    }

    const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, {
      ...options,
      headers,
    })

    const result = await response.json()

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("auth_token")
        localStorage.removeItem("user")
        window.location.href = "/login"
        return {
          status: "error",
          message: "Session expired. Please login again.",
        }
      }
      return {
        status: "error",
        message: result.message || `Request failed with status ${response.status}`,
      }
    }

    return result
  } catch (error) {
    console.error("API request error:", error)
    return {
      status: "error",
      message: "Network error. Please try again.",
    }
  }
} 