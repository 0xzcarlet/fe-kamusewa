import { LoginRequest, RegisterRequest, AuthResponse } from "../types/auth"
import { ApiResponse } from "../types/common"
import { API_CONFIG } from "../config"

export class AuthService {
  async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        return {
          status: "error",
          message: result.message || "Login failed",
        }
      }

      if (result.data?.token) {
        localStorage.setItem("auth_token", result.data.token)
        localStorage.setItem("user", JSON.stringify(result.data.user))
      }

      return result
    } catch (error) {
      console.error("Login error:", error)
      return {
        status: "error",
        message: "Network error. Please try again.",
      }
    }
  }

  async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        return {
          status: "error",
          message: result.message || "Registration failed",
        }
      }

      return await this.login({ email: data.email, password: data.password })
    } catch (error) {
      console.error("Registration error:", error)
      return {
        status: "error",
        message: "Network error. Please try again.",
      }
    }
  }

  logout(): void {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user")
    window.location.href = "/login"
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem("auth_token")
  }

  getCurrentUser() {
    const userStr = localStorage.getItem("user")
    if (!userStr) return null
    try {
      return JSON.parse(userStr)
    } catch (e) {
      return null
    }
  }

  getToken(): string | null {
    return localStorage.getItem("auth_token")
  }
}

export const authService = new AuthService() 