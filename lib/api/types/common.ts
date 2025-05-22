export interface ApiResponse<T> {
  status: "success" | "error"
  data?: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  per_page: number
} 