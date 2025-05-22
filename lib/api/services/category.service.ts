import { apiRequest } from "../utils/api-request"
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from "../types/category"
import { ApiResponse } from "../types/common"

export class CategoryService {
  async getAll(): Promise<ApiResponse<Category[]>> {
    return apiRequest<Category[]>("/categories")
  }

  async getById(id: number): Promise<ApiResponse<Category>> {
    return apiRequest<Category>(`/categories/${id}`)
  }

  async create(data: CreateCategoryRequest): Promise<ApiResponse<Category>> {
    return apiRequest<Category>("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async update(id: number, data: UpdateCategoryRequest): Promise<ApiResponse<Category>> {
    return apiRequest<Category>(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async delete(id: number): Promise<ApiResponse<{ message: string }>> {
    return apiRequest<{ message: string }>(`/categories/${id}`, {
      method: "DELETE",
    })
  }
}

export const categoryService = new CategoryService() 