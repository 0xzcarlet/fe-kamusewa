"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { authService } from "./api-service"

interface User {
  id: number
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = () => {
      const currentUser = authService.getCurrentUser()
      setUser(currentUser)
      setIsLoading(false)

      // Redirect logic
      const isAuthPage = pathname === "/login" || pathname === "/register"
      const isHomePage = pathname === "/"

      if (currentUser) {
        // If user is logged in and on auth page, redirect to dashboard
        if (isAuthPage) {
          router.push("/dashboard")
        }
      } else {
        // If user is not logged in and not on auth page or home page, redirect to login
        if (!isAuthPage && !isHomePage) {
          router.push("/login")
        }
      }
    }

    checkAuth()
  }, [pathname, router])

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password })

      if (response.status === "success" && response.data) {
        setUser(response.data.user)
        return { success: true }
      }

      return {
        success: false,
        message: response.message || "Login failed. Please check your credentials.",
      }
    } catch (error) {
      console.error("Login error:", error)
      return {
        success: false,
        message: "An unexpected error occurred. Please try again.",
      }
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await authService.register({ name, email, password })

      if (response.status === "success" && response.data) {
        setUser(response.data.user)
        return { success: true }
      }

      return {
        success: false,
        message: response.message || "Registration failed. Please try again.",
      }
    } catch (error) {
      console.error("Registration error:", error)
      return {
        success: false,
        message: "An unexpected error occurred. Please try again.",
      }
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
