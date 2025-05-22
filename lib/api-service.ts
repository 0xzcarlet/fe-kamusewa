// Base API configuration
const API_BASE_URL = "https://api.ks.kodekosan.com/api"

// Types based on the API documentation
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export interface ApiResponse<T> {
  status: "success" | "error"
  data?: T
  message?: string
}

export interface AuthResponse {
  token: string
  user: {
    id: number
    name: string
    email: string
  }
}

// Category types
export interface Category {
  id: number
  user_id: number
  category_name: string
  description: string
  created_at: string
  updated_at: string
}

export interface CreateCategoryRequest {
  category_name: string
  description?: string
}

export interface UpdateCategoryRequest {
  category_name?: string
  description?: string
}

// Item types
export interface Item {
  id: number
  user_id: number
  item_name: string
  description: string
  total_stock: number
  available_stock: number
  rental_price: number
  created_at: string
  updated_at: string
  categories: Category[]
}

export interface CreateItemRequest {
  item_name: string
  description?: string
  total_stock: number
  available_stock: number
  rental_price: number
  category_ids?: number[]
}

export interface UpdateItemRequest {
  item_name?: string
  description?: string
  total_stock?: number
  available_stock?: number
  rental_price?: number
  category_ids?: number[]
}

// Customer types
export interface Customer {
  id: number
  user_id: number
  customer_name: string
  email: string
  phone_number: string
  identity_number: string
  created_at: string
  updated_at: string
}

export interface CreateCustomerRequest {
  customer_name: string
  email?: string
  phone_number?: string
  identity_number?: string
}

export interface UpdateCustomerRequest {
  customer_name?: string
  email?: string
  phone_number?: string
  identity_number?: string
}

// Rental types
export interface RentalItem {
  item_id: number
  quantity: number
  subtotal: number
  item_name: string
  rental_price: number
}

export interface Rental {
  id: number
  user_id: number
  customer_id: number
  customer_name: string
  rental_number: string
  title: string
  start_date: string
  end_date: string
  total_cost: number
  status: number // 1: Active, 2: Completed, 3: Overdue
  created_at: string
  updated_at: string
  rental_items: RentalItem[]
}

export interface CreateRentalRequest {
  customer_id: number
  start_date: string
  end_date: string
  title: string
  items: {
    item_id: number
    quantity: number
  }[]
}

export interface UpdateRentalRequest {
  end_date?: string
  items?: {
    item_id: number
    quantity: number
  }[]
}

export interface UpdateRentalStatusRequest {
  status: number // 1: Active, 2: Completed, 3: Overdue
}

// Helper function to make authenticated API requests
const apiRequest = async <T,>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
  try {
    const token = localStorage.getItem("auth_token")

    if (!token && !endpoint.includes("/auth/")) {
      return {
        status: "error",
        message: "Not authenticated",
      }
    }

    const headers = {
      "Content-Type": "application/json",
      ...(token && !endpoint.includes("/auth/") ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    const result = await response.json()

    if (!response.ok) {
      // If unauthorized (401), clear auth data and redirect to login
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

// Authentication service
export const authService = {
  // Login user
  async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
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

      // Store token in localStorage
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
  },

  // Register user
  async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
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

      // After successful registration, automatically log in
      return await this.login({ email: data.email, password: data.password })
    } catch (error) {
      console.error("Registration error:", error)
      return {
        status: "error",
        message: "Network error. Please try again.",
      }
    }
  },

  // Logout user
  logout(): void {
    // Remove auth data from localStorage
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user")
    window.location.href = "/login"
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem("auth_token")
  },

  // Get current user
  getCurrentUser() {
    const userStr = localStorage.getItem("user")
    if (!userStr) return null
    try {
      return JSON.parse(userStr)
    } catch (e) {
      return null
    }
  },

  // Get auth token
  getToken(): string | null {
    return localStorage.getItem("auth_token")
  },
}

// Categories service
export const categoryService = {
  // Get all categories
  async getAll(): Promise<ApiResponse<Category[]>> {
    return apiRequest<Category[]>("/categories")
  },

  // Get category by ID
  async getById(id: number): Promise<ApiResponse<Category>> {
    return apiRequest<Category>(`/categories/${id}`)
  },

  // Create new category
  async create(data: CreateCategoryRequest): Promise<ApiResponse<Category>> {
    return apiRequest<Category>("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  // Update category
  async update(id: number, data: UpdateCategoryRequest): Promise<ApiResponse<Category>> {
    return apiRequest<Category>(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  // Delete category
  async delete(id: number): Promise<ApiResponse<{ message: string }>> {
    return apiRequest<{ message: string }>(`/categories/${id}`, {
      method: "DELETE",
    })
  },
}

// Items service
export const itemService = {
  // Get all items
  async getAll(): Promise<ApiResponse<Item[]>> {
    return apiRequest<Item[]>("/items")
  },

  // Get item by ID
  async getById(id: number): Promise<ApiResponse<Item>> {
    return apiRequest<Item>(`/items/${id}`)
  },

  // Create new item
  async create(data: CreateItemRequest): Promise<ApiResponse<Item>> {
    return apiRequest<Item>("/items", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  // Update item
  async update(id: number, data: UpdateItemRequest): Promise<ApiResponse<Item>> {
    return apiRequest<Item>(`/items/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  // Delete item
  async delete(id: number): Promise<ApiResponse<{ message: string }>> {
    return apiRequest<{ message: string }>(`/items/${id}`, {
      method: "DELETE",
    })
  },
}

// Customers service
export const customerService = {
  // Get all customers
  async getAll(): Promise<ApiResponse<Customer[]>> {
    return apiRequest<Customer[]>("/customers")
  },

  // Get customer by ID
  async getById(id: number): Promise<ApiResponse<Customer>> {
    return apiRequest<Customer>(`/customers/${id}`)
  },

  // Create new customer
  async create(data: CreateCustomerRequest): Promise<ApiResponse<Customer>> {
    return apiRequest<Customer>("/customers", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  // Update customer
  async update(id: number, data: UpdateCustomerRequest): Promise<ApiResponse<Customer>> {
    return apiRequest<Customer>(`/customers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  // Delete customer
  async delete(id: number): Promise<ApiResponse<{ message: string }>> {
    return apiRequest<{ message: string }>(`/customers/${id}`, {
      method: "DELETE",
    })
  },
}

// Rentals service
export const rentalService = {
  // Get all rentals
  async getAll(): Promise<ApiResponse<Rental[]>> {
    return apiRequest<Rental[]>("/rentals")
  },

  // Get rental by ID
  async getById(id: number): Promise<ApiResponse<Rental>> {
    return apiRequest<Rental>(`/rentals/${id}`)
  },

  // Create new rental
  async create(data: CreateRentalRequest): Promise<ApiResponse<Rental>> {
    return apiRequest<Rental>("/rentals", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  // Update rental
  async update(id: number, data: UpdateRentalRequest): Promise<ApiResponse<Rental>> {
    return apiRequest<Rental>(`/rentals/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  // Update rental status
  async updateStatus(id: number, data: UpdateRentalStatusRequest): Promise<ApiResponse<Rental>> {
    return apiRequest<Rental>(`/rentals/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  },

  // Delete rental
  async delete(id: number): Promise<ApiResponse<{ message: string }>> {
    return apiRequest<{ message: string }>(`/rentals/${id}`, {
      method: "DELETE",
    })
  },
}
