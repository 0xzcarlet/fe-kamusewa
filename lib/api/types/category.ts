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